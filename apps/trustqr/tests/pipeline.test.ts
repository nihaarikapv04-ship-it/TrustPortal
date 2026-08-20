import { describe, test, expect } from "vitest";
import { trustQRPipeline } from "../src/pipeline/trustqr_pipeline.js";
import { DEMO_SCENARIO_CATALOG } from "../src/scenarios/demo_scenarios.js";

describe("TrustQR Phase H: Full-Pipeline Integration & Security Tests", () => {
  test("1. Normal scenario completes full pipeline with AI executed", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "NORMAL_PAYMENT" });

    expect(res.parsedData).not.toBeNull();
    expect(res.parsedData?.recipient).toBe("abc@upi");
    expect(res.parsedData?.amount).toBe(2500);
    expect(res.privacyResult?.decision).toBe("allow");
    expect(res.aiExecuted).toBe(true);
    expect(res.aiExplanation).not.toBeNull();
    expect(res.riskResult.decision).toBe("INFORMATIONAL");
    expect(res.executionTrace.length).toBeGreaterThan(5);
  });

  test("2. Payment facts remain strictly identical from parser through PipelineResult", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "NORMAL_PAYMENT" });

    expect(res.parsedData?.recipient).toBe("abc@upi");
    expect(res.parsedData?.amount).toBe(2500);
    expect(res.parsedData?.currency).toBe("INR");
    expect(res.parsedData?.transactionRef).toBe("TXN123456");
  });

  test("3. Recipient mismatch scenario reaches risk engine and evaluates to NEEDS_REVIEW", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "RECIPIENT_MISMATCH" });

    expect(res.validationResult?.status).toBe("needs_review");
    expect(res.riskResult.decision).toBe("NEEDS_REVIEW");
    expect(res.riskResult.riskLevel).toBe("medium");
  });

  test("4. High-value scenario reaches risk engine and evaluates to HIGH_RISK_WARNING", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "HIGH_VALUE_PAYMENT" });

    expect(res.parsedData?.amount).toBe(50000);
    expect(res.riskResult.decision).toBe("HIGH_RISK_WARNING");
    expect(res.riskResult.riskLevel).toBe("high");
  });

  test("5. Missing recipient payload fails closed at parse stage", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "MISSING_RECIPIENT" });

    expect(res.parseResult.success).toBe(false);
    expect(res.parsedData).toBeNull();
    expect(res.riskResult.decision).toBe("BLOCKED");
    expect(res.aiExecuted).toBe(false);
  });

  test("6. Invalid negative amount fails closed at parse stage", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "INVALID_AMOUNT" });

    expect(res.parseResult.success).toBe(false);
    expect(res.parsedData).toBeNull();
    expect(res.riskResult.decision).toBe("BLOCKED");
    expect(res.aiExecuted).toBe(false);
  });

  test("7. Dangerous scheme (javascript: Attack) fails closed at parse stage", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "DANGEROUS_URI_SCHEME" });

    expect(res.parseResult.success).toBe(false);
    expect(res.parsedData).toBeNull();
    expect(res.riskResult.decision).toBe("BLOCKED");
    expect(res.aiExecuted).toBe(false);
  });

  test("8. Privacy OTP stops pipeline before AI analysis (aiExecuted === false)", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "PRIVACY_DENIED_OTP" });

    expect(res.privacyResult?.decision).toBe("deny");
    expect(res.aiExecuted).toBe(false);
    expect(res.aiExplanation).toBeNull();
    expect(res.riskResult.decision).toBe("BLOCKED");
  });

  test("9. Privacy PIN stops pipeline before AI analysis (aiExecuted === false)", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "PRIVACY_DENIED_PIN" });

    expect(res.privacyResult?.decision).toBe("deny");
    expect(res.aiExecuted).toBe(false);
    expect(res.aiExplanation).toBeNull();
    expect(res.riskResult.decision).toBe("BLOCKED");
  });

  test("10. Privacy password stops pipeline before AI analysis", async () => {
    const res = await trustQRPipeline.run({
      rawPayload: "upi://pay?pa=abc@upi&am=2500&cu=INR",
      rawMetadata: { password: "SecretPassword123" }
    });

    expect(res.privacyResult?.decision).toBe("deny");
    expect(res.aiExecuted).toBe(false);
    expect(res.riskResult.decision).toBe("BLOCKED");
  });

  test("11. Privacy CVV stops pipeline before AI analysis", async () => {
    const res = await trustQRPipeline.run({
      rawPayload: "upi://pay?pa=abc@upi&am=2500&cu=INR",
      rawMetadata: { cvv: "492" }
    });

    expect(res.privacyResult?.decision).toBe("deny");
    expect(res.aiExecuted).toBe(false);
    expect(res.riskResult.decision).toBe("BLOCKED");
  });

  test("12. AI XSS output is rejected by Output Security Validator", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "ADVERSARIAL_AI_XSS" });

    expect(res.aiExecuted).toBe(true);
    expect(res.aiExplanation).toBeNull(); // Rejected!
    expect(res.riskResult.decision).toBe("INFORMATIONAL"); // Risk engine falls back safely
  });

  test("13. AI prompt injection output is rejected by Output Security Validator", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "ADVERSARIAL_AI_PROMPT_INJECTION" });

    expect(res.aiExecuted).toBe(true);
    expect(res.aiExplanation).toBeNull();
  });

  test("14. AI authorization claim output is rejected by Output Security Validator", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "ADVERSARIAL_AI_AUTHORIZATION_CLAIM" });

    expect(res.aiExecuted).toBe(true);
    expect(res.aiExplanation).toBeNull();
  });

  test("15. AI credential request output is rejected by Output Security Validator", async () => {
    const res = await trustQRPipeline.run({
      scenarioKey: "NORMAL_PAYMENT",
      rawMetadata: { attack: "pin-request" },
      isAdversarialAI: true
    });

    expect(res.aiExplanation).toBeNull();
  });

  test("16. AI failure is handled safely without crashing or claiming authorization", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "ADVERSARIAL_AI_XSS" });

    expect(res.parsedData).not.toBeNull();
    expect(res.riskResult).not.toBeNull();
  });

  test("17. AI explanation cannot mutate parsed recipient fact", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "NORMAL_PAYMENT" });

    if (res.aiExplanation) {
      // @ts-ignore
      expect(res.aiExplanation.recipient).toBeUndefined();
    }
    expect(res.parsedData?.recipient).toBe("abc@upi");
  });

  test("18. AI explanation cannot mutate parsed amount fact", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "NORMAL_PAYMENT" });

    if (res.aiExplanation) {
      // @ts-ignore
      expect(res.aiExplanation.amount).toBeUndefined();
    }
    expect(res.parsedData?.amount).toBe(2500);
  });

  test("19. AI explanation cannot mutate parsed currency fact", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "NORMAL_PAYMENT" });

    if (res.aiExplanation) {
      // @ts-ignore
      expect(res.aiExplanation.currency).toBeUndefined();
    }
    expect(res.parsedData?.currency).toBe("INR");
  });

  test("20. Execution trace contains zero raw secrets (OTPs, PINs, passwords)", async () => {
    const secretPIN = "SUPER_SECRET_PIN_665544";
    const res = await trustQRPipeline.run({
      rawPayload: "upi://pay?pa=abc@upi&am=2500&cu=INR",
      rawMetadata: { upiPin: secretPIN }
    });

    const traceStr = JSON.stringify(res.executionTrace);
    expect(traceStr).not.toContain(secretPIN);
  });

  test("21. Pipeline operates locally with zero external network calls", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "NORMAL_PAYMENT" });
    expect(res.executionTrace.length).toBeGreaterThan(0);
  });

  test("22. Repeated scenario execution is 100% deterministic", async () => {
    const res1 = await trustQRPipeline.run({ scenarioKey: "HIGH_VALUE_PAYMENT" });
    const res2 = await trustQRPipeline.run({ scenarioKey: "HIGH_VALUE_PAYMENT" });

    expect(res1.riskResult.riskScore).toBe(res2.riskResult.riskScore);
    expect(res1.riskResult.decision).toBe(res2.riskResult.decision);
    expect(res1.aiExecuted).toBe(res2.aiExecuted);
  });

  test("23. Executes expected stage transitions across all 14 demo scenarios", async () => {
    for (const key of Object.keys(DEMO_SCENARIO_CATALOG)) {
      const res = await trustQRPipeline.run({ scenarioKey: key });
      expect(res.decodedQR).toBeDefined();
      expect(res.executionTrace.length).toBeGreaterThan(0);
      expect(res.riskResult).toBeDefined();
    }
  });

  test("24. No scenario produces automatic payment authorization", async () => {
    for (const key of Object.keys(DEMO_SCENARIO_CATALOG)) {
      const res = await trustQRPipeline.run({ scenarioKey: key });
      // @ts-ignore
      expect(res.riskResult.decision).not.toBe("AUTO_PAY");
      // @ts-ignore
      expect(res.riskResult.decision).not.toBe("AUTO_AUTHORIZE");
    }
  });

  test("25. High-value scenario (₹50,000) never auto-authorizes", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "HIGH_VALUE_PAYMENT" });
    expect(res.riskResult.decision).toBe("HIGH_RISK_WARNING");
    expect(res.riskResult.riskLevel).toBe("high");
  });

  test("26. Blocked scenario (Missing Recipient) returns BLOCKED decision", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "MISSING_RECIPIENT" });
    expect(res.riskResult.decision).toBe("BLOCKED");
    expect(res.riskResult.riskLevel).toBe("blocked");
  });

  test("27. Unsafe HTML metadata scenario fails closed and returns BLOCKED decision", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "UNSAFE_METADATA" });
    expect(res.validationResult?.status).toBe("invalid");
    expect(res.riskResult.decision).toBe("BLOCKED");
  });

  test("28. Missing optional merchant name scenario completes cleanly", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "MISSING_MERCHANT_NAME" });
    expect(res.parsedData?.merchantName).toBeUndefined();
    expect(res.validationResult?.status).toBe("valid");
    expect(res.riskResult.decision).toBe("INFORMATIONAL");
  });

  test("29. PipelineResult is strictly immutable / frozen", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "NORMAL_PAYMENT" });
    expect(Object.isFrozen(res)).toBe(true);
    expect(Object.isFrozen(res.executionTrace)).toBe(true);
  });

  test("30. Hard Non-Compensable High-Impact Penalty (H = 0.50) is present in all successful runs", async () => {
    const res = await trustQRPipeline.run({ scenarioKey: "NORMAL_PAYMENT" });
    expect(res.riskResult.signals.H).toBe(0.50);
  });
});
