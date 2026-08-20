import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../src/app";
import { isValidOrigin } from "../src/security/origin_guard";
import { RateLimiter } from "../src/security/rate_limit";
import { IdempotencyStore } from "../src/security/idempotency";
describe("Backend Security & Guard Tests", () => {
    let app;
    beforeAll(async () => {
        app = buildApp();
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });
    test("Origin Guard rejects dangerous javascript: and data: origins", () => {
        expect(isValidOrigin("javascript:alert(1)")).toBe(false);
        expect(isValidOrigin("data:text/html,hack")).toBe(false);
        expect(isValidOrigin("file:///etc/passwd")).toBe(false);
        expect(isValidOrigin("https://user:pass@evil.com")).toBe(false);
        expect(isValidOrigin("https://seva.gov.in")).toBe(true);
        expect(isValidOrigin("http://localhost:5173", true)).toBe(true);
    });
    test("Rate limiter blocks requests exceeding max threshold", () => {
        const limiter = new RateLimiter(3, 60);
        expect(limiter.isAllowed("client_1")).toBe(true);
        expect(limiter.isAllowed("client_1")).toBe(true);
        expect(limiter.isAllowed("client_1")).toBe(true);
        expect(limiter.isAllowed("client_1")).toBe(false); // 4th request blocked!
    });
    test("Idempotency store caches and returns duplicate response", () => {
        const store = new IdempotencyStore(300);
        const mockRes = { proposalId: "prop_123", decision: "abstain" };
        store.set("key_abc", mockRes);
        const cached = store.get("key_abc");
        expect(cached).toBeDefined();
        expect(cached?.response.proposalId).toBe("prop_123");
    });
    test("Rejects request with forbidden origin header via API", async () => {
        const res = await app.inject({
            method: "POST",
            url: "/v1/proposals",
            headers: {
                "content-type": "application/json",
                origin: "javascript:alert(1)"
            },
            payload: { schemaVersion: "1.0.0" }
        });
        expect(res.statusCode).toBe(403);
        const body = JSON.parse(res.body);
        expect(body.error.code).toBe("FORBIDDEN_ORIGIN");
    });
});
