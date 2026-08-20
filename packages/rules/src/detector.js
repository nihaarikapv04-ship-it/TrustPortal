import { AccessibleNameComputer } from "./acc_name.js";
import { RULES_REGISTRY } from "./rules_registry.js";
const SUSPICIOUS_FILENAME_REGEX = /^(img|image|photo|pic|banner|button|icon|logo|dsc|dc|screen|captura|file)[\d_\-.]*\.(png|jpg|jpeg|gif|webp|svg)$/i;
export class DeterministicDetector {
    computer;
    constructor(computer) {
        this.computer = computer || new AccessibleNameComputer();
    }
    /**
     * Scans a list of ElementRepresentations for accessibility defects.
     */
    scan(elements) {
        const candidates = [];
        for (const elem of elements) {
            // Exclusions Gate: Do NOT flag hidden, disabled, or sensitive payment/auth fields!
            if (this.shouldExclude(elem)) {
                continue;
            }
            const accName = this.computer.computeName(elem);
            const tag = (elem.tag || "").toLowerCase();
            const role = elem.role ? elem.role.toLowerCase() : null;
            const attrs = elem.attributes || {};
            // Rule 1 & 2: Image Alt Checks
            if (tag === "img" || role === "img") {
                if (!("alt" in attrs) && !attrs["aria-label"] && !attrs["aria-labelledby"]) {
                    candidates.push(this.createCandidate("RULE_IMG_ALT_MISSING", elem, accName));
                }
                else if (attrs["alt"] && SUSPICIOUS_FILENAME_REGEX.test(attrs["alt"].trim())) {
                    candidates.push(this.createCandidate("RULE_IMG_ALT_FILENAME", elem, accName));
                }
            }
            // Rule 3: Button Name Check
            else if (tag === "button" ||
                role === "button" ||
                (tag === "input" && ["button", "submit", "reset", "image"].includes((attrs["type"] || "").toLowerCase()))) {
                if (!accName) {
                    candidates.push(this.createCandidate("RULE_BUTTON_NAME_MISSING", elem, accName));
                }
            }
            // Rule 4: Link Name Check
            else if (tag === "a" || role === "link") {
                if (!accName) {
                    candidates.push(this.createCandidate("RULE_LINK_NAME_MISSING", elem, accName));
                }
            }
            // Rule 5: Form Control Label Check
            else if (["input", "select", "textarea"].includes(tag) &&
                !["hidden", "button", "submit", "reset", "image"].includes((attrs["type"] || "").toLowerCase())) {
                if (!accName) {
                    candidates.push(this.createCandidate("RULE_FORM_LABEL_MISSING", elem, accName));
                }
            }
            // Rule 6: SVG Control Check
            else if (tag === "svg") {
                if ((role === "img" || role === "button" || attrs["tabindex"] === "0") && !accName) {
                    candidates.push(this.createCandidate("RULE_SVG_NAME_MISSING", elem, accName));
                }
            }
            // Rule 7: Custom Interactive ARIA Control Check
            else if (["checkbox", "radio", "combobox", "tab", "menuitem", "slider", "switch"].includes(role || "")) {
                if (!accName) {
                    candidates.push(this.createCandidate("RULE_CUSTOM_CONTROL_NAME_MISSING", elem, accName));
                }
            }
        }
        return candidates;
    }
    /**
     * Evaluates if element should be strictly EXCLUDED from defect flagging.
     */
    shouldExclude(elem) {
        const attrs = elem.attributes || {};
        const tag = (elem.tag || "").toLowerCase();
        const role = elem.role ? elem.role.toLowerCase() : null;
        // 1. Exclude Hidden Elements
        if (attrs["aria-hidden"] === "true" ||
            "hidden" in attrs ||
            (attrs["style"] && /display\s*:\s*none|visibility\s*:\s*hidden/i.test(attrs["style"]))) {
            return true;
        }
        // 2. Exclude Disabled Elements
        if ("disabled" in attrs || attrs["aria-disabled"] === "true") {
            return true;
        }
        // 3. Exclude Decorative Images
        if (role === "presentation" || role === "none") {
            return true;
        }
        // 4. Exclude Password, OTP, CAPTCHA, Payment, Credit Card Fields!
        const inputType = (attrs["type"] || "").toLowerCase();
        const fieldName = ((attrs["name"] || "") + " " + (attrs["id"] || "") + " " + (attrs["autocomplete"] || "")).toLowerCase();
        if (inputType === "password")
            return true;
        const sensitiveFieldRegex = /(password|passcode|otp|2fa|mfa|cvv|cvc|cardnumber|creditcard|ssn|aadhaar|pan|captcha|one-time-code)/i;
        if (sensitiveFieldRegex.test(fieldName)) {
            return true;
        }
        return false;
    }
    createCandidate(ruleId, elem, accName) {
        const rule = RULES_REGISTRY[ruleId] || RULES_REGISTRY["RULE_IMG_ALT_MISSING"];
        const tag = (elem.tag || "").toLowerCase();
        const id = elem.id ? `#${elem.id}` : "";
        const selector = `${tag}${id}`;
        const candidateId = `cand_${rule.issueType}_${Math.random().toString(36).substring(2, 9)}`;
        return {
            candidateId,
            ruleId,
            issueType: rule.issueType,
            selector,
            tag,
            role: elem.role || null,
            attributes: elem.attributes || {},
            currentAccessibleName: accName,
            severity: rule.severity,
            wcagReference: rule.wcagReference,
            permittedRemediationAttribute: rule.permittedRemediationAttribute
        };
    }
}
