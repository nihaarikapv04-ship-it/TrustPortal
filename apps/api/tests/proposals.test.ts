import { describe, test, expect } from "vitest";
import { buildApp } from "../src/app.js";

describe("API Gateway Proposals Endpoint Tests", () => {
  const validSafeContext = {
    issueType: "button-name",
    ruleId: "RULE_BUTTON_NAME_MISSING",
    elementRole: "button",
    safeAttributes: { tag: "button" },
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

  test("POST /v1/proposals returns valid ProposalResponse for low-risk context", async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: {
        "content-type": "application/json",
        origin: "https://seva.gov.in"
      },
      payload: {
        schemaVersion: "1.0.0",
        origin: "https://seva.gov.in",
        coarsePageCategory: "public-information",
        issueType: "button-name",
        targetRole: "button",
        safeContext: validSafeContext,
        language: "en",
        privacyFlags: [],
        clientVersion: "1.0.0",
        idempotencyKey: "key_proposal_test_1"
      }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.proposalId).toBeDefined();
    expect(body.trustScore).toBeGreaterThanOrEqual(75);
    expect(["auto", "confirm"]).toContain(body.decision);

    await app.close();
  });

  test("POST /v1/proposals enforces body size limit (rejects >100KB)", async () => {
    const app = await buildApp();

    const hugeText = "X".repeat(120000);
    const response = await app.inject({
      method: "POST",
      url: "/v1/proposals",
      headers: {
        "content-type": "application/json",
        origin: "https://seva.gov.in"
      },
      payload: {
        schemaVersion: "1.0.0",
        origin: "https://seva.gov.in",
        coarsePageCategory: "public-information",
        issueType: "button-name",
        targetRole: "button",
        safeContext: { ...validSafeContext, visibleElementText: hugeText },
        language: "en",
        privacyFlags: [],
        clientVersion: "1.0.0",
        idempotencyKey: "key_proposal_huge"
      }
    });

    expect(response.statusCode).toBe(413); // Payload Too Large

    await app.close();
  });
});
