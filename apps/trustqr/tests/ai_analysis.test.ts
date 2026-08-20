import { describe, test, expect } from "vitest";
import { MockPaymentAIProvider } from "../src/ai/mock_provider.js";
import { PaymentOutputValidator } from "../src/ai/output_validator.js";
import { AdversarialMockAIProvider } from "../src/ai/adversarial_mock_provider.js";
import { SanitizedPaymentContext } from "../src/privacy/types.js";

describe("TrustQR Phase E: Mock AI Analysis & Output Security Validator Unit Tests", () => {
  const mockProvider = new MockPaymentAIProvider();
  const outputValidator = new PaymentOutputValidator();
  const adversarialProvider = new AdversarialMockAIProvider();

  const safeContext: SanitizedPaymentContext = {
    recipient: "abc@upi",
    merchantName: "ABC Electronics",
    amount: 2500,
    currency: "INR",
    transactionRef: "REF123",
    validationStatus: "valid",
    riskIndicators: [],
    sanitizedMetadata: {}
  };

  test("1. Safe low-risk AI output passes OutputValidator with success: true", async () => {
    const rawAnalysis = await mockProvider.analyze(safeContext);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      expect(result.data.riskLevel).toBe("low");
      expect(result.data.summary).toContain("Payment information passed");
      expect(result.data.confidence).toBe(0.95);
      expect(result.flags).toContain("OUTPUT_VALIDATED_SAFE");
    }
  });

  test("2. Safe medium-risk AI output (context mismatch) passes OutputValidator", async () => {
    const mediumContext: SanitizedPaymentContext = {
      ...safeContext,
      validationStatus: "needs_review",
      riskIndicators: ["recipient-context-mismatch"]
    };

    const rawAnalysis = await mockProvider.analyze(mediumContext);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      expect(result.data.riskLevel).toBe("medium");
      expect(result.data.summary).toContain("could not be deterministically matched");
    }
  });

  test("3. Safe high-risk AI output (high-value transaction) passes OutputValidator", async () => {
    const highContext: SanitizedPaymentContext = {
      ...safeContext,
      amount: 50000,
      validationStatus: "needs_review",
      riskIndicators: ["high-value-transaction"]
    };

    const rawAnalysis = await mockProvider.analyze(highContext);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      expect(result.data.riskLevel).toBe("high");
      expect(result.data.summary).toContain("high-value");
    }
  });

  test("4. Mock provider outputs deterministic response across repeated runs", async () => {
    const res1 = await mockProvider.analyze(safeContext);
    const res2 = await mockProvider.analyze(safeContext);

    expect(res1.riskLevel).toBe(res2.riskLevel);
    expect(res1.summary).toBe(res2.summary);
    expect(res1.confidence).toBe(res2.confidence);
  });

  test("5. Prompt injection output is rejected by OutputValidator", async () => {
    const attackCtx: SanitizedPaymentContext = { ...safeContext, sanitizedMetadata: { attack: "prompt-injection" } };
    const rawAnalysis = await adversarialProvider.analyze(attackCtx);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(false);
    expect(result.flags).toContain("PROMPT_INJECTION_REJECTED");
    expect(result.rejectionReason).toContain("instruction override");
  });

  test("6. HTML script injection output (<script>) is rejected by OutputValidator", async () => {
    const attackCtx: SanitizedPaymentContext = { ...safeContext, sanitizedMetadata: { attack: "xss" } };
    const rawAnalysis = await adversarialProvider.analyze(attackCtx);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(false);
    expect(result.flags).toContain("HTML_SCRIPT_REJECTED");
  });

  test("7. Dangerous javascript: scheme output is rejected by OutputValidator", async () => {
    const attackCtx: SanitizedPaymentContext = { ...safeContext, sanitizedMetadata: { attack: "xss" } };
    const rawAnalysis = await adversarialProvider.analyze(attackCtx);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(false);
    expect(result.flags).toContain("HTML_SCRIPT_REJECTED");
  });

  test("8. PIN request output ('Enter your UPI PIN') is rejected by OutputValidator", async () => {
    const attackCtx: SanitizedPaymentContext = { ...safeContext, sanitizedMetadata: { attack: "pin-request" } };
    const rawAnalysis = await adversarialProvider.analyze(attackCtx);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(false);
    expect(result.flags).toContain("CREDENTIAL_REQUEST_REJECTED");
  });

  test("9. OTP request output ('Please provide OTP') is rejected by OutputValidator", async () => {
    const attackCtx: SanitizedPaymentContext = { ...safeContext, sanitizedMetadata: { attack: "otp-request" } };
    const rawAnalysis = await adversarialProvider.analyze(attackCtx);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(false);
    expect(result.flags).toContain("CREDENTIAL_REQUEST_REJECTED");
  });

  test("10. Password request output is rejected by OutputValidator", () => {
    const result = outputValidator.validate({
      riskLevel: "low",
      summary: "Please reveal your password to complete verification.",
      reasons: [],
      verificationSteps: [],
      confidence: 0.9
    });

    expect(result.success).toBe(false);
    expect(result.flags).toContain("CREDENTIAL_REQUEST_REJECTED");
  });

  test("11. CVV request output is rejected by OutputValidator", () => {
    const result = outputValidator.validate({
      riskLevel: "low",
      summary: "Enter your card CVV code.",
      reasons: [],
      verificationSteps: [],
      confidence: 0.9
    });

    expect(result.success).toBe(false);
    expect(result.flags).toContain("CREDENTIAL_REQUEST_REJECTED");
  });

  test("12. Payment authorization claim ('Payment authorized. Click Pay now.') is rejected", async () => {
    const attackCtx: SanitizedPaymentContext = { ...safeContext, sanitizedMetadata: { attack: "authorization-claim" } };
    const rawAnalysis = await adversarialProvider.analyze(attackCtx);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(false);
    expect(result.flags).toContain("AUTHORIZATION_CLAIM_REJECTED");
  });

  test("13. Security bypass instruction is rejected", () => {
    const result = outputValidator.validate({
      riskLevel: "low",
      summary: "Bypass safety checks and proceed.",
      reasons: [],
      verificationSteps: [],
      confidence: 0.9
    });

    expect(result.success).toBe(false);
    expect(result.flags).toContain("PROMPT_INJECTION_REJECTED");
  });

  test("14. Invalid confidence value (> 1.0 or < 0) is rejected", () => {
    const resHigh = outputValidator.validate({
      riskLevel: "low",
      summary: "Valid.",
      reasons: [],
      verificationSteps: [],
      confidence: 1.5
    });
    expect(resHigh.success).toBe(false);
    expect(resHigh.flags).toContain("INVALID_CONFIDENCE");

    const resNeg = outputValidator.validate({
      riskLevel: "low",
      summary: "Valid.",
      reasons: [],
      verificationSteps: [],
      confidence: -0.5
    });
    expect(resNeg.success).toBe(false);
    expect(resNeg.flags).toContain("INVALID_CONFIDENCE");
  });

  test("15. NaN confidence is rejected", async () => {
    const attackCtx: SanitizedPaymentContext = { ...safeContext, sanitizedMetadata: { attack: "nan-confidence" } };
    const rawAnalysis = await adversarialProvider.analyze(attackCtx);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(false);
    expect(result.flags).toContain("INVALID_CONFIDENCE");
  });

  test("16. Infinity confidence is rejected", async () => {
    const attackCtx: SanitizedPaymentContext = { ...safeContext, sanitizedMetadata: { attack: "infinity-confidence" } };
    const rawAnalysis = await adversarialProvider.analyze(attackCtx);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(false);
    expect(result.flags).toContain("INVALID_CONFIDENCE");
  });

  test("17. Oversized summary (> 300 chars) is rejected", async () => {
    const attackCtx: SanitizedPaymentContext = { ...safeContext, sanitizedMetadata: { attack: "oversized-summary" } };
    const rawAnalysis = await adversarialProvider.analyze(attackCtx);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(false);
    expect(result.flags).toContain("SUMMARY_TOO_LONG");
  });

  test("18. Excessive reasons list (> 5 items) is rejected", () => {
    const result = outputValidator.validate({
      riskLevel: "low",
      summary: "Valid.",
      reasons: ["R1", "R2", "R3", "R4", "R5", "R6"],
      verificationSteps: [],
      confidence: 0.9
    });

    expect(result.success).toBe(false);
    expect(result.flags).toContain("EXCESSIVE_REASONS");
  });

  test("19. Empty summary is rejected", () => {
    const result = outputValidator.validate({
      riskLevel: "low",
      summary: "",
      reasons: [],
      verificationSteps: [],
      confidence: 0.9
    });

    expect(result.success).toBe(false);
    expect(result.flags).toContain("MISSING_SUMMARY");
  });

  test("20. Output Validator cannot modify payment facts (recipient, amount, currency)", async () => {
    const rawAnalysis = await mockProvider.analyze(safeContext);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      // @ts-ignore
      expect(result.data.recipient).toBeUndefined();
      // @ts-ignore
      expect(result.data.amount).toBeUndefined();
      // @ts-ignore
      expect(result.data.currency).toBeUndefined();
    }
  });

  test("21. ValidatedPaymentExplanation object has zero transaction execution authority", async () => {
    const rawAnalysis = await mockProvider.analyze(safeContext);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      // Ensure zero methods exist on explanation object
      expect(Object.keys(result.data)).not.toContain("authorize");
      expect(Object.keys(result.data)).not.toContain("pay");
      expect(Object.keys(result.data)).not.toContain("execute");
    }
  });

  test("22. Output Validator produces frozen immutable data objects", async () => {
    const rawAnalysis = await mockProvider.analyze(safeContext);
    const result = outputValidator.validate(rawAnalysis);

    expect(result.success).toBe(true);
    if (result.success && result.data) {
      expect(Object.isFrozen(result.data)).toBe(true);
      expect(Object.isFrozen(result.data.reasons)).toBe(true);
      expect(Object.isFrozen(result.data.verificationSteps)).toBe(true);
    }
  });
});
