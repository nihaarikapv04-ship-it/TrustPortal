import { describe, test, expect } from "vitest";
import { isValidOrigin } from "../src/security/origin_guard.js";
import { RateLimiter } from "../src/security/rate_limit.js";
import { IdempotencyStore } from "../src/security/idempotency.js";

describe("API Security Guard & Middleware Tests", () => {
  test("Origin Guard rejects javascript: and data: origins", () => {
    expect(isValidOrigin("https://seva.gov.in")).toBe(true);
    expect(isValidOrigin("javascript:alert(1)")).toBe(false);
    expect(isValidOrigin("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isValidOrigin("file:///etc/passwd")).toBe(false);
  });

  test("Rate Limiter blocks requests exceeding window threshold", () => {
    const limiter = new RateLimiter(3, 60); // 3 requests max
    expect(limiter.isAllowed("client_1")).toBe(true);
    expect(limiter.isAllowed("client_1")).toBe(true);
    expect(limiter.isAllowed("client_1")).toBe(true);
    expect(limiter.isAllowed("client_1")).toBe(false); // 4th request blocked!
  });

  test("Idempotency Store returns cached response for duplicate request key", () => {
    const store = new IdempotencyStore(300);
    const mockResponse = { proposalId: "prop_123", status: "cached" };

    store.set("key_abc", mockResponse);
    expect(store.get("key_abc")).toEqual(mockResponse);
    expect(store.get("key_missing")).toBeNull();
  });
});
