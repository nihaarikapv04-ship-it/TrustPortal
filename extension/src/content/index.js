/**
 * TrustPortal TSIF Content Script.
 * Scans live DOM, detects accessibility defects, interacts with Service Worker / Backend,
 * applies auto-patches via HardenedPatchEngine, and renders Closed Shadow DOM UI for human verification.
 */
import { HardenedPatchEngine } from "../../patch_system/src/patcher";
import { ClosedVerificationUI } from "../ui/verification_ui";
class TSIFContentScanner {
    patchEngine;
    verificationUI;
    observer = null;
    processedElements = new Set();
    constructor() {
        this.patchEngine = new HardenedPatchEngine();
        this.verificationUI = new ClosedVerificationUI();
    }
    init() {
        console.log("🛡️ TrustPortal TSIF Content Script Initialized.");
        this.scanAndRemediate();
        this.setupMutationObserver();
    }
    scanAndRemediate() {
        const rawElements = this.collectCandidateElements();
        for (const elem of rawElements) {
            if (this.processedElements.has(elem))
                continue;
            this.processedElements.add(elem);
            const payload = this.extractElementPayload(elem);
            if (!payload)
                continue;
            // Send to background service worker for processing through TSIF Pipeline
            chrome.runtime.sendMessage({ type: "PROCESS_DEFECT", payload, urlPath: window.location.pathname }, (response) => {
                if (!response || !response.success)
                    return;
                const patch = response.patch;
                if (patch.decision === "auto") {
                    console.log(`[TSIF Auto-Apply] Patching ${patch.targetSelector} with label '${patch.proposedValue}'`);
                    this.patchEngine.applyPatch(elem, patch);
                }
                else if (patch.decision === "confirm") {
                    console.log(`[TSIF Confirmation Required] Rendering UI for ${patch.targetSelector}`);
                    this.verificationUI.render({
                        defectId: patch.patchId,
                        issueType: patch.issueType,
                        targetSelector: patch.targetSelector,
                        proposedLabel: patch.proposedValue,
                        confidence: patch.trustScore,
                        thresholdUsed: patch.crcThresholdUsed,
                        evidence: patch.evidence,
                        onAccept: (customLabel) => {
                            if (customLabel)
                                patch.proposedValue = customLabel;
                            this.patchEngine.applyPatch(elem, patch);
                        },
                        onReject: (reason) => {
                            console.log(`[TSIF User Reject] ${reason}`);
                        },
                        onReport: (feedback) => {
                            chrome.runtime.sendMessage({ type: "SUBMIT_FEEDBACK", patchId: patch.patchId, feedback });
                        }
                    });
                }
            });
        }
    }
    collectCandidateElements() {
        const selector = "img:not([alt]), button, a, input, select, textarea, svg, table, [role='button'], [role='link']";
        return Array.from(document.querySelectorAll(selector)).filter((el) => {
            // Ignore host element or elements already patched by TSIF
            if (el.hasAttribute("data-tsif-patched") || el.closest("tsif-verification-host")) {
                return false;
            }
            return true;
        });
    }
    extractElementPayload(elem) {
        const tag = elem.tagName.toLowerCase();
        const role = elem.getAttribute("role");
        const id = elem.id || "";
        const attrs = {};
        for (let i = 0; i < elem.attributes.length; i++) {
            const a = elem.attributes[i];
            attrs[a.name] = a.value;
        }
        // Extract surrounding context (headings, parent text, sibling text, hidden text)
        const nearestHeading = this.findNearestHeading(elem);
        const parentText = elem.parentElement ? (elem.parentElement.textContent || "").trim().slice(0, 200) : "";
        const siblingText = this.findSiblingText(elem);
        const hiddenText = this.findHiddenText(elem);
        return {
            tag,
            role,
            id,
            attributes: attrs,
            selector: id ? `${tag}#${id}` : tag,
            surrounding_context: {
                nearest_heading: nearestHeading,
                parent_text: parentText,
                sibling_text: siblingText,
                hidden_text: hiddenText,
                page_title: document.title,
                url_path: window.location.pathname
            }
        };
    }
    findNearestHeading(elem) {
        let curr = elem;
        while (curr) {
            const heading = curr.querySelector("h1, h2, h3, h4, h5, h6");
            if (heading && heading.textContent)
                return heading.textContent.trim();
            curr = curr.parentElement;
        }
        return "";
    }
    findSiblingText(elem) {
        let text = "";
        if (elem.previousElementSibling && elem.previousElementSibling.textContent) {
            text += elem.previousElementSibling.textContent.trim() + " ";
        }
        if (elem.nextElementSibling && elem.nextElementSibling.textContent) {
            text += elem.nextElementSibling.textContent.trim();
        }
        return text.trim().slice(0, 150);
    }
    findHiddenText(elem) {
        // Widen context to catch display:none hidden text prompt injection payloads
        const hiddenElems = elem.parentElement ? Array.from(elem.parentElement.querySelectorAll("[style*='display:none'], [hidden], .hidden, .sr-only")) : [];
        return hiddenElems.map(el => el.textContent || "").join(" ").trim().slice(0, 300);
    }
    setupMutationObserver() {
        let debounceTimer = null;
        this.observer = new MutationObserver((mutations) => {
            // Loop prevention check: Ignore mutations generated by TSIF patching
            const isTsifMutation = mutations.every((m) => {
                const target = m.target;
                return (target.hasAttribute?.("data-tsif-patched") ||
                    target.closest?.("tsif-verification-host") !== null);
            });
            if (isTsifMutation)
                return;
            if (debounceTimer)
                clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.scanAndRemediate();
            }, 500);
        });
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["alt", "aria-label", "role"]
        });
    }
}
// Auto-run scanner when script loads
const scanner = new TSIFContentScanner();
scanner.init();
