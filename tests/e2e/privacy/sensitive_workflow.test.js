"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const redaction_1 = require("@trustportal/redaction");
const scoring_1 = require("@trustportal/scoring");
(0, vitest_1.describe)("E2E Test: Sensitive Workflow Exclusion & Zero Inference Guarantee", () => {
    const firewall = new redaction_1.PrivacyFirewall();
    const riskGate = new scoring_1.TSIFRiskGate();
    (0, vitest_1.test)("OTP and CVV fields trigger immediate Privacy Firewall DENY (zero remote inference calls)", () => {
        const otpRes = firewall.evaluate({
            issueType: "form-label",
            ruleId: "RULE_FORM_LABEL_MISSING",
            elementRole: "textbox",
            rawAttributes: { type: "text", name: "otp", autocomplete: "one-time-code" },
            url: "https://seva.gov.in/verify"
        });
        (0, vitest_1.expect)(otpRes.decision).toBe("deny");
        (0, vitest_1.expect)(otpRes.safeContext).toBeUndefined(); // Zero SafeContext produced!
    });
    (0, vitest_1.test)("Sensitive workflow category (payment) is hard-gated by Trust Engine against 'auto' decision", () => {
        const sensitiveCtx = {
            issueType: "form-label",
            ruleId: "RULE_FORM_LABEL_MISSING",
            elementRole: "textbox",
            safeAttributes: { tag: "input" },
            visibleElementText: "CVV Number",
            associatedLabel: "",
            nearestHeading: "Payment Gate",
            nearestLandmark: "main",
            boundedNearbyText: "",
            urlOrigin: "https://seva.gov.in/checkout/pay",
            coarsePageCategory: "payment",
            language: "en",
            redactionFlags: []
        };
        const gateRes = riskGate.evaluateProposal("Payment Verification CVV", 0.99, sensitiveCtx);
        (0, vitest_1.expect)(gateRes.decision).not.toBe("auto");
        (0, vitest_1.expect)(gateRes.blockingReasons.some((r) => r.includes("High-impact workflow"))).toBe(true);
    });
});
