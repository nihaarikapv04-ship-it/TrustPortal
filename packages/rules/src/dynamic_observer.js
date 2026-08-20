/**
 * Dynamic DOM Observer for Scanning Dynamically Inserted Candidates.
 * Includes debouncing and MutationObserver loop prevention.
 */
import { DeterministicDetector } from "./detector.js";
export class DynamicDOMObserver {
    detector;
    observer = null;
    onCandidatesDetected;
    debounceTimer = null;
    constructor(onCandidatesDetected) {
        this.detector = new DeterministicDetector();
        this.onCandidatesDetected = onCandidatesDetected;
    }
    /**
     * Starts observing dynamic DOM mutations.
     */
    start(root = document.body) {
        if (typeof MutationObserver === "undefined")
            return;
        this.observer = new MutationObserver((mutations) => {
            // MutationObserver Loop Prevention: Ignore mutations caused by TSIF itself!
            const isSelfMutation = mutations.every((m) => {
                const target = m.target;
                return (target.hasAttribute?.("data-tsif-patched") ||
                    target.closest?.("trustportal-shadow-host") !== null);
            });
            if (isSelfMutation)
                return;
            if (this.debounceTimer)
                clearTimeout(this.debounceTimer);
            // Debounce batch processing using requestIdleCallback if available
            if (typeof requestIdleCallback !== "undefined") {
                this.debounceTimer = requestIdleCallback(() => {
                    this.scanDOM(root);
                }, { timeout: 100 });
            }
            else {
                this.debounceTimer = setTimeout(() => {
                    this.scanDOM(root);
                }, 100);
            }
        });
        this.observer.observe(root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["alt", "aria-label", "role", "disabled", "hidden"]
        });
    }
    stop() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
    scanDOM(root) {
        const selector = "img, button, a, input, select, textarea, svg, [role='button'], [role='link']";
        const rawElements = Array.from(root.querySelectorAll(selector));
        const representations = rawElements.map((el) => {
            const attrs = {};
            for (let i = 0; i < el.attributes.length; i++) {
                const a = el.attributes[i];
                attrs[a.name] = a.value;
            }
            return {
                tag: el.tagName.toLowerCase(),
                id: el.id || null,
                role: el.getAttribute("role"),
                attributes: attrs,
                textContent: el.textContent,
                title: el.getAttribute("title")
            };
        });
        const candidates = this.detector.scan(representations);
        if (candidates.length > 0) {
            this.onCandidatesDetected(candidates);
        }
    }
}
