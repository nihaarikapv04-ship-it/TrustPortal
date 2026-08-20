import { describe, test, expect } from "vitest";
import { TSIFRiskGate } from "../src/risk_gate";
describe("Scoring Layer Adversarial Security Tests", () => {
    const gate = new TSIFRiskGate();
    test("Adversarial High Model Confidence (0.99) cannot override High-Impact Risk Gate", () => {
        const sensitiveCtx = {
            issueType: "form-label",
            ruleId: "RULE_FORM_LABEL_MISSING",
            elementRole: "textbox",
            safeAttributes: { tag: "input" },
            visibleElementText: "Enter OTP",
            associatedLabel: "",
            nearestHeading: "Payment Verification",
            nearestLandmark: "main",
            boundedNearbyText: "",
            urlOrigin: "https://seva.gov.in/checkout/pay",
            coarsePageCategory: "payment", // High-impact category!
            language: "en",
            redactionFlags: []
        };
        const res = gate.evaluateProposal("Enter Payment Password", 0.99, sensitiveCtx);
        expect(res.decision).not.toBe("auto");
        expect(res.blockingReasons.some((r) => r.includes("High-impact workflow"))).toBe(true);
    });
    test("Adversarial Model Confidence (0.99) with empty label causes immediate 'reject'", () => {
        const ctx = {
            issueType: "button-name",
            ruleId: "RULE_BUTTON_NAME_MISSING",
            elementRole: "button",
            safeAttributes: { tag: "button" },
            visibleElementText: "",
            associatedLabel: "",
            nearestHeading: "Catalog",
            nearestLandmark: "main",
            boundedNearbyText: "",
            urlOrigin: "https://seva.gov.in/catalog",
            coarsePageCategory: "public-information",
            language: "en",
            redactionFlags: []
        };
        const res = gate.evaluateProposal("", 0.99, ctx); // Empty label!
        expect(res.decision).toBe("reject");
        expect(res.blockingReasons.some((r) => r.includes("label is empty"))).toBe(true);
    });
});
