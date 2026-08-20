import { describe, test, expect } from "vitest";
import { computeRuleConfidence, computePrivacyPenalty, computeRiskPenalty } from "../src/signals";
describe("Trust Signals Unit Tests", () => {
    test("Computes rule confidence from rule ID", () => {
        expect(computeRuleConfidence("RULE_IMG_ALT_MISSING")).toBe(0.95);
        expect(computeRuleConfidence("RULE_IMG_ALT_FILENAME")).toBe(0.85);
    });
    test("Computes privacy penalty from redaction flags", () => {
        const ctx = { redactionFlags: ["PII_EMAIL_REDACTED", "PII_PHONE_REDACTED"] };
        expect(computePrivacyPenalty(ctx)).toBe(0.30);
    });
    test("Computes high-impact risk penalty for sensitive categories", () => {
        expect(computeRiskPenalty("authentication")).toBe(0.50);
        expect(computeRiskPenalty("payment")).toBe(0.50);
        expect(computeRiskPenalty("public-information")).toBe(0.0);
    });
});
