"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const redaction_1 = require("@trustportal/redaction");
(0, vitest_1.describe)("Security Test: PII Exfiltration & Sensitive Context Firewall", () => {
    const firewall = new redaction_1.PrivacyFirewall();
    (0, vitest_1.test)("Invariant 4: DENIES target element when type=password", () => {
        const res = firewall.evaluate({
            issueType: "form-label",
            ruleId: "RULE_FORM_LABEL_MISSING",
            elementRole: "textbox",
            rawAttributes: { type: "password", id: "user_pass" },
            url: "https://seva.gov.in/account"
        });
        (0, vitest_1.expect)(res.decision).toBe("deny");
        (0, vitest_1.expect)(res.safeContext).toBeUndefined();
    });
    (0, vitest_1.test)("Invariant 4: DENIES target element when name=otp or autocomplete=one-time-code", () => {
        const res = firewall.evaluate({
            issueType: "form-label",
            ruleId: "RULE_FORM_LABEL_MISSING",
            elementRole: "textbox",
            rawAttributes: { type: "text", name: "otp", autocomplete: "one-time-code" },
            url: "https://seva.gov.in/verify"
        });
        (0, vitest_1.expect)(res.decision).toBe("deny");
        (0, vitest_1.expect)(res.safeContext).toBeUndefined();
    });
    (0, vitest_1.test)("Invariant 4: Strips query parameter tokens from SafeContext URL", () => {
        const res = firewall.evaluate({
            issueType: "img-alt",
            ruleId: "RULE_IMG_ALT_MISSING",
            elementRole: "img",
            rawAttributes: { src: "/logo.png" },
            url: "https://seva.gov.in/apply?token=SECRET_JWT_TOKEN_12345&password=admin"
        });
        (0, vitest_1.expect)(res.decision).not.toBe("deny");
        (0, vitest_1.expect)(res.safeContext.urlOrigin).toBe("https://seva.gov.in/apply");
        (0, vitest_1.expect)(res.safeContext.urlOrigin).not.toContain("SECRET_JWT_TOKEN");
    });
    (0, vitest_1.test)("Invariant 4: Redacts email addresses and phone numbers completely without partial leakage", () => {
        const res = firewall.evaluate({
            issueType: "button-name",
            ruleId: "RULE_BUTTON_NAME_MISSING",
            elementRole: "button",
            rawAttributes: {},
            visibleElementText: "Contact coordinator john.doe@example.com at +1 (555) 019-2834",
            url: "https://seva.gov.in/contact"
        });
        (0, vitest_1.expect)(res.decision).toBe("redact");
        (0, vitest_1.expect)(res.safeContext.visibleElementText).toBe("Contact coordinator [REDACTED_EMAIL] at [REDACTED_PHONE]");
        (0, vitest_1.expect)(res.redactionFlags).toContain("PII_EMAIL_REDACTED");
        (0, vitest_1.expect)(res.redactionFlags).toContain("PII_PHONE_REDACTED");
    });
});
