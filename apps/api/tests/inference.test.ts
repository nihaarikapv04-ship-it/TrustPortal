import { describe, test, expect } from "vitest";
import { ModelRouter } from "../src/providers/provider_router.js";
import { MockTextProvider, MockVisionProvider } from "../src/providers/mock_provider.js";
import { outputValidator } from "../src/security/output_validator.js";
import { SafeContext } from "@trustportal/schemas";

describe("Structured Inference & Output Security Tests", () => {
  const sampleContext: SafeContext = {
    issueType: "button-name",
    ruleId: "RULE_BUTTON_NAME_MISSING",
    elementRole: "button",
    safeAttributes: {},
    visibleElementText: "Download Form",
    associatedLabel: "",
    nearestHeading: "Public Welfare Guidelines",
    nearestLandmark: "main",
    boundedNearbyText: "Click to download form PDF",
    urlOrigin: "https://seva.gov.in/housing",
    coarsePageCategory: "public-information",
    language: "en",
    redactionFlags: []
  };

  test("ModelRouter executes inference and returns structured proposal", async () => {
    const router = new ModelRouter(new MockTextProvider());
    const res = await router.routeAndInference(sampleContext);

    expect(res.providerId).toBe("mock-text-v1");
    expect(res.proposal.action).toBe("propose");
    expect(res.proposal.label).toBe("Download Application Form");
    expect(res.proposal.evidence.length).toBeGreaterThan(0);
    expect(res.proposal.modelConfidence).toBeGreaterThan(0.80);
  });

  test("OutputValidator approves valid proposal with verifiable evidence", () => {
    const rawProposal = {
      action: "propose",
      label: "Download Application Form",
      language: "en",
      evidence: [{ source: "visible_text", quote: "Download Form" }],
      rationale: "Nearby text indicates download action",
      modelConfidence: 0.92
    };

    const val = outputValidator.validate(rawProposal, sampleContext);
    expect(val.valid).toBe(true);
    expect(val.proposal.label).toBe("Download Application Form");
  });

  test("OutputValidator REJECTS proposed label lacking verifiable evidence", () => {
    const badProposal = {
      action: "propose",
      label: "Random Hallucinated Label",
      language: "en",
      evidence: [], // Empty evidence!
      rationale: "No evidence provided",
      modelConfidence: 0.95
    };

    const val = outputValidator.validate(badProposal, sampleContext);
    expect(val.valid).toBe(false);
    expect(val.proposal.action).toBe("abstain");
  });
});
