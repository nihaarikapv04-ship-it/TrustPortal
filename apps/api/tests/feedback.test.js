import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../src/app";
describe("POST /v1/feedback & GET /v1/policy Tests", () => {
    let app;
    beforeAll(async () => {
        app = buildApp();
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });
    test("POST /v1/feedback accepts valid user feedback action", async () => {
        const res = await app.inject({
            method: "POST",
            url: "/v1/feedback",
            headers: { "content-type": "application/json" },
            payload: {
                patchId: "patch_1001",
                action: "accept",
                timestamp: new Date().toISOString()
            }
        });
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.success).toBe(true);
        expect(body.patchId).toBe("patch_1001");
    });
    test("GET /v1/policy returns configuration with disabled sensitive workflows", async () => {
        const res = await app.inject({
            method: "GET",
            url: "/v1/policy"
        });
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.thresholds.autoApplyMinScore).toBe(90);
        expect(body.disabledIssueTypes).toContain("authentication");
        expect(body.disabledIssueTypes).toContain("payment");
        expect(body.providerAvailability.anthropic).toBe(false);
    });
});
