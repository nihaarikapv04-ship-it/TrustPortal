import { describe, test, expect } from "vitest";
import { ModelRouter } from "../src/providers/provider_router";
import { AdversarialMockProvider } from "../src/providers/mock_provider";
import { SafeContext } from "@trustportal/schemas";

describe("Adversarial Model Output & Security Guard Tests", () => {
  const sampleContext: SafeContext = {
    issueType: "button-name",
    ruleId: "RULE_BUTTON_NAME_MISSING",
    elementRole: "button",
    safeAttributes: {},
    visibleElementText: "Click Here",
    associatedLabel: "",
    nearestHeading: "Test Page",
    nearestLandmark: "main",
    boundedNearbyText: "",
    urlOrigin: "https://seva.gov.in/test",
    coarsePageCategory: "public-information",
    language: "en",
    redactionFlags: []
  };

  test("Adversarial XSS Payload Rejection: Rejects model output containing <script> tags", async () => {
    const router = new ModelRouter(new AdversarialMockProvider("xss"));
    const res = await router.routeAndInference(sampleContext);

    expect(res.proposal.action).toBe("abstain");
    expect(res.proposal.label).toBe("");
    expect(res.proposal.riskFlags).toContain("validation-rejected");
  });

  test("Adversarial Prompt Override Rejection: Rejects model output containing prompt override commands", async () => {
    const router = new ModelRouter(new AdversarialMockProvider("injection"));
    const res = await router.routeAndInference(sampleContext);

    expect(res.proposal.action).toBe("abstain");
    expect(res.proposal.label).toBe("");
    expect(res.proposal.riskFlags).toContain("validation-rejected");
  });

  test("Adversarial Malformed Proposal Rejection: Rejects proposal with empty label when action='propose'", async () => {
    const router = new ModelRouter(new AdversarialMockProvider("malformed"));
    const res = await router.routeAndInference(sampleContext);

    expect(res.proposal.action).toBe("abstain");
    expect(res.proposal.label).toBe("");
    expect(res.proposal.riskFlags).toContain("model-abstained");
  });
});
