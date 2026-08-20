import { describe, test, expect } from "vitest";
import { buildApp } from "../src/app.js";

describe("API Gateway Feedback Endpoint Tests", () => {
  test("POST /v1/feedback accepts valid FeedbackRequest schema payload", async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/v1/feedback",
      headers: {
        "content-type": "application/json",
        origin: "https://seva.gov.in"
      },
      payload: {
        patchId: "patch_456",
        action: "accept",
        customLabel: "Download Application Form",
        timestamp: new Date().toISOString()
      }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.success).toBe(true);
    expect(body.patchId).toBe("patch_456");

    await app.close();
  });

  test("POST /v1/feedback rejects invalid payload with HTTP 400 Bad Request", async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/v1/feedback",
      headers: {
        "content-type": "application/json",
        origin: "https://seva.gov.in"
      },
      payload: {
        action: "invalid_action_name"
      }
    });

    expect(response.statusCode).toBe(400);

    await app.close();
  });
});
