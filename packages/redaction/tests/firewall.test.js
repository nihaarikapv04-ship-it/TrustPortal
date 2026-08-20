import { describe, test, expect } from "vitest";
import { PrivacyFirewall } from "../src/firewall";
describe("PrivacyFirewall Target Intersection & Workflow Policy Tests", () => {
    const firewall = new PrivacyFirewall();
    test("Target Intersection Rule: DENIES sensitive password input field", () => {
        const res = firewall.evaluate({
            issueType: "form-label",
            ruleId: "RULE_FORM_LABEL_MISSING",
            elementRole: "textbox",
            rawAttributes: { type: "password", id: "user_pass" },
            url: "https://seva.gov.in/portal"
        });
        expect(res.decision).toBe("deny");
        expect(res.safeContext).toBeUndefined(); // No SafeContext returned!
        expect(res.reason).toContain("TARGET_INTERSECTION_DENIAL");
    });
    test("Target Intersection Rule: DENIES OTP input field", () => {
        const res = firewall.evaluate({
            issueType: "form-label",
            ruleId: "RULE_FORM_LABEL_MISSING",
            elementRole: "textbox",
            rawAttributes: { type: "text", name: "otp", autocomplete: "one-time-code" },
            url: "https://seva.gov.in/portal"
        });
        expect(res.decision).toBe("deny");
        expect(res.safeContext).toBeUndefined();
    });
    test("Sensitive URL Policy: DENIES sensitive payment URL path (/checkout/pay)", () => {
        const res = firewall.evaluate({
            issueType: "button-name",
            ruleId: "RULE_BUTTON_NAME_MISSING",
            elementRole: "button",
            rawAttributes: {},
            url: "https://seva.gov.in/checkout/pay"
        });
        expect(res.decision).toBe("deny");
        expect(res.safeContext).toBeUndefined();
        expect(res.reason).toContain("SENSITIVE_WORKFLOW_DENIAL");
    });
    test("Allows low-risk public service page defect with PII redaction", () => {
        const res = firewall.evaluate({
            issueType: "img-alt",
            ruleId: "RULE_IMG_ALT_MISSING",
            elementRole: "img",
            rawAttributes: { src: "/guidelines.png" },
            visibleElementText: "Contact coordinator john@example.com for info",
            nearestHeading: "Rural Housing Scheme 2026",
            url: "https://seva.gov.in/services/housing"
        });
        expect(res.decision).toBe("redact");
        expect(res.safeContext).toBeDefined();
        expect(res.safeContext.visibleElementText).toBe("Contact coordinator [REDACTED_EMAIL] for info");
        expect(res.redactionFlags).toContain("PII_EMAIL_REDACTED");
    });
});
