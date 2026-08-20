"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const scoring_1 = require("@trustportal/scoring");
(0, vitest_1.describe)("Security Test: Trust Engine & Risk Gate Bypasses", () => {
    const gate = new scoring_1.TSIFRiskGate();
    (0, vitest_1.test)("Invariant 7 & 8: High model confidence (0.99) NEVER overrides High-Impact Risk Gate", () => {
        const sensitiveCtx = {
            issueType: "form-label",
            ruleId: "RULE_FORM_LABEL_MISSING",
            elementRole: "textbox",
            safeAttributes: { tag: "input" },
            visibleElementText: "Enter OTP",
            associatedLabel: "",
            nearestHeading: "Payment Checkout",
            nearestLandmark: "main",
            boundedNearbyText: "",
            urlOrigin: "https://seva.gov.in/checkout/pay",
            coarsePageCategory: "payment", // High-impact category!
            language: "en",
            redactionFlags: []
        };
        const res = gate.evaluateProposal("Enter Payment OTP", 0.99, sensitiveCtx);
        // Decision MUST NOT be auto! Hard Gate Overrides Score!
        (0, vitest_1.expect)(res.decision).not.toBe("auto");
        (0, vitest_1.expect)(res.blockingReasons.some((r) => r.includes("High-impact workflow"))).toBe(true);
    });
    (0, vitest_1.test)("Invariant 7: DOM consistency failure forces immediate 'reject' regardless of model confidence", () => {
        const ctx = {
            issueType: "button-name",
            ruleId: "RULE_BUTTON_NAME_MISSING",
            elementRole: "button",
            safeAttributes: { tag: "button" },
            visibleElementText: "Download",
            associatedLabel: "",
            nearestHeading: "Public Housing Guidelines",
            nearestLandmark: "main",
            boundedNearbyText: "",
            urlOrigin: "https://seva.gov.in/housing",
            coarsePageCategory: "public-information",
            language: "en",
            redactionFlags: []
        };
        // Label sounds like page heading, causing DOM consistency failure
        const res = gate.evaluateProposal("Main heading of the website", 0.99, ctx);
        (0, vitest_1.expect)(res.signals.domConsistency).toBeLessThan(0.50);
        (0, vitest_1.expect)(res.decision).toBe("reject");
        (0, vitest_1.expect)(res.blockingReasons.some((r) => r.includes("DOM consistency"))).toBe(true);
    });
});
