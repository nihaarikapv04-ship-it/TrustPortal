import { MinimalContextExtractor } from "./extractor.js";
import { SENSITIVE_URL_PATTERNS } from "./policy.js";
const SENSITIVE_INPUT_REGEX = /(password|passcode|otp|2fa|mfa|cvv|cvc|cardnumber|creditcard|ssn|aadhaar|pan|captcha|one-time-code)/i;
export class PrivacyFirewall {
    extractor;
    constructor(extractor) {
        this.extractor = extractor || new MinimalContextExtractor();
    }
    /**
     * Processes an ExtractionInput through the Privacy Firewall.
     * Target Intersection Rule: Denies processing if target element or URL belongs to a sensitive workflow.
     */
    evaluate(input) {
        const redactionFlags = [];
        // 1. Target Intersection Check: Is target element itself a sensitive field?
        if (this.isSensitiveElement(input)) {
            return {
                decision: "deny",
                reason: "TARGET_INTERSECTION_DENIAL: Target element is a sensitive field (password, OTP, payment, or ID)",
                redactionFlags: ["SENSITIVE_FIELD_DENIED"]
            };
        }
        // 2. Sensitive URL / Workflow Path Check
        if (this.isSensitiveUrl(input.url)) {
            return {
                decision: "deny",
                reason: "SENSITIVE_WORKFLOW_DENIAL: Page URL path matches sensitive workflow policy",
                redactionFlags: ["SENSITIVE_URL_DENIED"]
            };
        }
        // 3. Extract Minimal SafeContext
        const { safeContext, redactionFlags: extractedFlags } = this.extractor.extract(input);
        extractedFlags.forEach((f) => redactionFlags.push(f));
        // 4. Sensitive Category Check (Classified as authentication, payment, health, tax, legal)
        if (["authentication", "payment", "health", "tax", "legal", "identity"].includes(safeContext.coarsePageCategory)) {
            return {
                decision: "deny",
                reason: `SENSITIVE_CATEGORY_DENIAL: Page coarse category '${safeContext.coarsePageCategory}' is restricted`,
                redactionFlags
            };
        }
        // 5. Decision: "redact" if PII was scrubbed, else "allow"
        const decision = redactionFlags.length > 0 ? "redact" : "allow";
        return {
            decision,
            safeContext,
            redactionFlags
        };
    }
    isSensitiveElement(input) {
        const attrs = input.rawAttributes || {};
        const inputType = (attrs["type"] || "").toLowerCase();
        if (inputType === "password")
            return true;
        const nameAttr = (attrs["name"] || "").toLowerCase();
        const idAttr = (attrs["id"] || "").toLowerCase();
        const autocomplete = (attrs["autocomplete"] || "").toLowerCase();
        const combined = `${nameAttr} ${idAttr} ${autocomplete}`;
        return SENSITIVE_INPUT_REGEX.test(combined);
    }
    isSensitiveUrl(urlStr) {
        if (!urlStr)
            return false;
        try {
            const parsed = new URL(urlStr);
            return SENSITIVE_URL_PATTERNS.some((pattern) => pattern.test(parsed.pathname));
        }
        catch (e) {
            return SENSITIVE_URL_PATTERNS.some((pattern) => pattern.test(urlStr));
        }
    }
}
export const privacyFirewall = new PrivacyFirewall();
