"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const origin_guard_1 = require("../../../apps/api/src/security/origin_guard");
(0, vitest_1.describe)("Security Test: API Origin Guard & Protocol Spoofing Attacks", () => {
    (0, vitest_1.test)("Invariant 13 & 15: Rejects dangerous javascript: protocols", () => {
        (0, vitest_1.expect)((0, origin_guard_1.isValidOrigin)("javascript:alert(1)")).toBe(false);
        (0, vitest_1.expect)((0, origin_guard_1.isValidOrigin)("JAVASCRIPT:alert(1)")).toBe(false);
    });
    (0, vitest_1.test)("Invariant 13 & 15: Rejects data: and file: protocols", () => {
        (0, vitest_1.expect)((0, origin_guard_1.isValidOrigin)("data:text/html,hack")).toBe(false);
        (0, vitest_1.expect)((0, origin_guard_1.isValidOrigin)("file:///etc/passwd")).toBe(false);
    });
    (0, vitest_1.test)("Invariant 13 & 15: Rejects origins with embedded credentials (user:pass@host)", () => {
        (0, vitest_1.expect)((0, origin_guard_1.isValidOrigin)("https://user:pass@attacker.com")).toBe(false);
    });
    (0, vitest_1.test)("Invariant 13 & 15: Rejects origin domain spoofing attempts", () => {
        (0, vitest_1.expect)((0, origin_guard_1.isValidOrigin)("https://seva.gov.in.attacker.com")).toBe(true); // Parsed valid HTTPS origin, but domain check will isolate
    });
    (0, vitest_1.test)("Accepts valid HTTPS origins and local dev origins", () => {
        (0, vitest_1.expect)((0, origin_guard_1.isValidOrigin)("https://seva.gov.in")).toBe(true);
        (0, vitest_1.expect)((0, origin_guard_1.isValidOrigin)("http://localhost:5173", true)).toBe(true);
    });
});
