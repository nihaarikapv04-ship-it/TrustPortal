import { describe, test, expect } from "vitest";
import { ModelRouter } from "../src/providers/provider_router";
import { MockTextProvider, MockVisionProvider } from "../src/providers/mock_provider";
import { outputValidator } from "../src/security/output_validator";
describe("AI Inference Layer & Model Router Tests", () => {
    const router = new ModelRouter(new MockTextProvider(), new MockVisionProvider());
    const sampleContext = {
        issueType: "button-name",
        ruleId: "RULE_BUTTON_NAME_MISSING",
        elementRole: "button",
        safeAttributes: {},
        visibleElementText: "Download Form",
        associatedLabel: "",
        nearestHeading: "Public Welfare Guidelines",
        nearestLandmark: "main",
        boundedNearbyText: "Click to download application PDF",
        urlOrigin: "https://seva.gov.in/housing",
        coarsePageCategory: "public-information",
        language: "en",
        redactionFlags: []
    };
    test("Routes button-name defect to MockTextProvider and returns structured proposal", async () => {
        const res = await router.routeAndInference(sampleContext);
        expect(res.providerId).toBe("mock-text-v1");
        expect(res.proposal.action).toBe("propose");
        expect(res.proposal.label).toBe("Download Application Form");
        expect(res.proposal.evidence.length).toBeGreaterThan(0);
        expect(res.proposal.evidence[0].source).toBe("visible_text");
        expect(res.promptVersion).toBe("tsif-label-v1");
    });
    test("OutputValidator accepts valid structured model proposal", () => {
        const validRaw = {
            action: "propose",
            label: "Download Application Form",
            language: "en",
            evidence: [{ source: "visible_text", quote: "Download Form" }],
            rationale: "Nearby visible text identifies download action.",
            modelConfidence: 0.91,
            riskFlags: []
        };
        const val = outputValidator.validate(validRaw, sampleContext);
        expect(val.valid).toBe(true);
        expect(val.proposal.label).toBe("Download Application Form");
    });
    test("OutputValidator rejects proposal missing evidence items", () => {
        const rawNoEvidence = {
            action: "propose",
            label: "Download Application Form",
            language: "en",
            evidence: [], // Missing required evidence!
            rationale: "No evidence provided",
            modelConfidence: 0.91
        };
        const val = outputValidator.validate(rawNoEvidence, sampleContext);
        expect(val.valid).toBe(false);
        expect(val.proposal.action).toBe("abstain");
        expect(val.reason).toContain("lacks required verifiable evidence");
    });
});
