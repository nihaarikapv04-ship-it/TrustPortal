import { describe, test, expect } from "vitest";
import { TSIFRiskGate } from "../src/risk_gate.js";
describe("TSIFRiskGate & Non-Compensable Safety Gate Tests", () => {
    const gate = new TSIFRiskGate();
    const safeContext = {
        issueType: "button-name",
        ruleId: "RULE_BUTTON_NAME_MISSING",
        elementRole: "button",
        safeAttributes: { tag: "button" },
        visibleElementText: "Download Form",
        associatedLabel: "",
        nearestHeading: "Public Welfare Application Guidelines",
        nearestLandmark: "main",
        boundedNearbyText: "Click to download form PDF",
        urlOrigin: "https://seva.gov.in/housing",
        coarsePageCategory: "public-information",
        language: "en",
        redactionFlags: []
    };
    test("Evaluates low-risk validated proposal to 'auto' or 'confirm'", () => {
        const res = gate.evaluateProposal("Download Application Form", 0.95, safeContext);
        expect(res.trustScore).toBeGreaterThanOrEqual(75);
        expect(["auto", "confirm"]).toContain(res.decision);
        expect(res.blockingReasons.length).toBe(0);
    });
    test("Hard Safety Gate: High-impact workflow category NEVER allows 'auto' decision", () => {
        const sensitiveContext = {
            ...safeContext,
            coarsePageCategory: "authentication" // High-impact category!
        };
        const res = gate.evaluateProposal("Download Application Form", 0.99, sensitiveContext);
        expect(res.decision).not.toBe("auto"); // Hard Gate Prevents Auto!
        expect(res.blockingReasons.some((r) => r.includes("High-impact workflow"))).toBe(true);
    });
    test("Hard Safety Gate: DOM consistency failure causes immediate 'reject'", () => {
        const res = gate.evaluateProposal("Main heading of the website", 0.95, safeContext);
        expect(res.signals.domConsistency).toBeLessThan(0.50);
        expect(res.decision).toBe("reject");
        expect(res.blockingReasons.some((r) => r.includes("DOM consistency"))).toBe(true);
    });
});
