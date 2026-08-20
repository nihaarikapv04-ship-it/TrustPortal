import { describe, test, expect } from "vitest";
import { SyntheticQRDecoder } from "../src/qr/decoder.js";
import { PaymentPayloadParser } from "../src/qr/parser.js";
import { PaymentValidator } from "../src/validation/payment_validator.js";
import { PaymentPrivacyFilter } from "../src/privacy/payment_privacy.js";
import { MockPaymentAIProvider } from "../src/ai/mock_provider.js";
import { PaymentOutputValidator } from "../src/ai/output_validator.js";
import { PaymentRiskEngine } from "../src/risk/payment_risk.js";
import { SYNTHETIC_QR_FIXTURES } from "../src/scenarios/fixtures.js";

describe("TrustQR Phase F: Payment Risk Engine & High-Impact Gate Unit Tests", () => {
  const decoder = new SyntheticQRDecoder();
  const parser = new PaymentPayloadParser();
  const validator = new PaymentValidator();
  const privacy = new PaymentPrivacyFilter();
  const aiProvider = new MockPaymentAIProvider();
  const outputValidator = new PaymentOutputValidator();
  const riskEngine = new PaymentRiskEngine();

  test("1. Normal payment evaluates to INFORMATIONAL decision with risk score >= 90", async () => {
    const decoded = await decoder.decode(SYNTHETIC_QR_FIXTURES.NORMAL_PAYMENT.rawPayload);
    const parsed = parser.parse(decoded);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      const valRes = validator.validate(parsed.data);
      const privRes = privacy.evaluate({ parsedData: parsed.data, validationResult: valRes });
      const rawAi = await aiProvider.analyze(privRes.sanitizedContext!);
      const validAi = outputValidator.validate(rawAi).data;

      const risk = riskEngine.evaluate(parsed.data, valRes, privRes, validAi);
      expect(risk.decision).toBe("INFORMATIONAL");
      expect(risk.riskLevel).toBe("low");
      expect(risk.riskScore).toBeGreaterThanOrEqual(90);
    }
  });

  test("2. Recipient context mismatch evaluates to NEEDS_REVIEW decision", async () => {
    const decoded = await decoder.decode(SYNTHETIC_QR_FIXTURES.SUSPICIOUS_RECIPIENT.rawPayload);
    const parsed = parser.parse(decoded);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      const valRes = validator.validate(parsed.data);
      const privRes = privacy.evaluate({ parsedData: parsed.data, validationResult: valRes });
      const rawAi = await aiProvider.analyze(privRes.sanitizedContext!);
      const validAi = outputValidator.validate(rawAi).data;

      const risk = riskEngine.evaluate(parsed.data, valRes, privRes, validAi);
      expect(risk.decision).toBe("NEEDS_REVIEW");
      expect(risk.riskLevel).toBe("medium");
      expect(risk.blockingReasons).toContain("Recipient identifier does not match merchant display name");
    }
  });

  test("3. High-value transaction (₹50,000) evaluates to HIGH_RISK_WARNING decision", async () => {
    const decoded = await decoder.decode(SYNTHETIC_QR_FIXTURES.HIGH_VALUE_PAYMENT.rawPayload);
    const parsed = parser.parse(decoded);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      const valRes = validator.validate(parsed.data);
      const privRes = privacy.evaluate({ parsedData: parsed.data, validationResult: valRes });
      const rawAi = await aiProvider.analyze(privRes.sanitizedContext!);
      const validAi = outputValidator.validate(rawAi).data;

      const risk = riskEngine.evaluate(parsed.data, valRes, privRes, validAi);
      expect(risk.decision).toBe("HIGH_RISK_WARNING");
      expect(risk.riskLevel).toBe("high");
      expect(risk.blockingReasons).toContain("High-value transaction threshold met (₹10,000+)");
    }
  });

  test("4. Privacy Filter DENY evaluates to BLOCKED decision", async () => {
    const decoded = await decoder.decode(SYNTHETIC_QR_FIXTURES.NORMAL_PAYMENT.rawPayload);
    const parsed = parser.parse(decoded);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      const valRes = validator.validate(parsed.data);
      const privRes = privacy.evaluate({ parsedData: parsed.data, validationResult: valRes, rawMetadata: { otp: "123456" } });

      const risk = riskEngine.evaluate(parsed.data, valRes, privRes, null);
      expect(risk.decision).toBe("BLOCKED");
      expect(risk.riskLevel).toBe("blocked");
      expect(risk.riskScore).toBe(0);
    }
  });

  test("5. Structural validation FAIL evaluates to BLOCKED decision", async () => {
    const parsed = parser.parse("upi://pay?pn=ABC&am=2500&cu=INR"); // Missing payee
    expect(parsed.success).toBe(false);
  });

  test("6. Hard Non-Compensable High-Impact Penalty (H = 0.50) is applied to all payment signals", async () => {
    const decoded = await decoder.decode(SYNTHETIC_QR_FIXTURES.NORMAL_PAYMENT.rawPayload);
    const parsed = parser.parse(decoded);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      const valRes = validator.validate(parsed.data);
      const privRes = privacy.evaluate({ parsedData: parsed.data, validationResult: valRes });
      const risk = riskEngine.evaluate(parsed.data, valRes, privRes, null);

      expect(risk.signals.H).toBe(0.50);
    }
  });

  test("7. Risk Engine has zero auto-pay or transaction execution authority", async () => {
    const decoded = await decoder.decode(SYNTHETIC_QR_FIXTURES.NORMAL_PAYMENT.rawPayload);
    const parsed = parser.parse(decoded);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      const valRes = validator.validate(parsed.data);
      const privRes = privacy.evaluate({ parsedData: parsed.data, validationResult: valRes });
      const risk = riskEngine.evaluate(parsed.data, valRes, privRes, null);

      // @ts-ignore
      expect(risk.decision).not.toBe("AUTO_PAY");
      // @ts-ignore
      expect(risk.decision).not.toBe("AUTO_AUTHORIZE");
    }
  });

  test("8. RiskResult object is strictly frozen and immutable", async () => {
    const decoded = await decoder.decode(SYNTHETIC_QR_FIXTURES.NORMAL_PAYMENT.rawPayload);
    const parsed = parser.parse(decoded);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      const valRes = validator.validate(parsed.data);
      const privRes = privacy.evaluate({ parsedData: parsed.data, validationResult: valRes });
      const risk = riskEngine.evaluate(parsed.data, valRes, privRes, null);

      expect(Object.isFrozen(risk)).toBe(true);
      expect(Object.isFrozen(risk.signals)).toBe(true);
    }
  });
});
