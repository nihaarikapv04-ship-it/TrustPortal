import { syntheticQRDecoder } from "../qr/decoder.js";
import { paymentPayloadParser } from "../qr/parser.js";
import { paymentValidator } from "../validation/payment_validator.js";
import { paymentPrivacyFilter } from "../privacy/payment_privacy.js";
import { mockPaymentAIProvider } from "../ai/mock_provider.js";
import { adversarialMockAIProvider } from "../ai/adversarial_mock_provider.js";
import { paymentOutputValidator } from "../ai/output_validator.js";
import { paymentRiskEngine } from "../risk/payment_risk.js";
import { DEMO_SCENARIO_CATALOG } from "../scenarios/demo_scenarios.js";
import { ValidatedPaymentExplanation } from "../ai/types.js";
import { PipelineInput, PipelineResult, PipelineTraceEvent } from "./types.js";

export class TrustQRPipeline {
  /**
   * Executes the full TrustQR end-to-end pipeline in strict fail-closed order.
   * Consumes PipelineInput and returns an immutable PipelineResult with execution trace.
   */
  public async run(input: PipelineInput): Promise<PipelineResult> {
    const executedAt = new Date().toISOString();
    const trace: PipelineTraceEvent[] = [];

    // Resolve scenario payload or custom raw input
    let scenarioKey = input.scenarioKey || "NORMAL_PAYMENT";
    let scenario = DEMO_SCENARIO_CATALOG[scenarioKey];
    let rawPayload = input.rawPayload || (scenario ? scenario.syntheticPayload : "upi://pay?pa=abc@upi&am=2500&cu=INR");
    let rawMetadata = input.rawMetadata || (scenario ? scenario.rawMetadata : undefined);
    let isAdversarialAI = input.isAdversarialAI || (scenario ? scenario.isAdversarialAI : false);

    // 1. Stage 1: QR Decode
    const decodedQR = await syntheticQRDecoder.decode(rawPayload);
    trace.push({ stage: "QR_DECODE", status: "success", detail: "QR payload decoded successfully", timestamp: new Date().toISOString() });

    // 2. Stage 2: Payment Payload Parser
    const parseResult = paymentPayloadParser.parse(decodedQR);
    if (!parseResult.success) {
      trace.push({ stage: "PAYMENT_PARSE", status: "fail", detail: `Parse failed: ${parseResult.errorMessage}`, timestamp: new Date().toISOString() });
      trace.push({ stage: "DETERMINISTIC_VALIDATION", status: "skipped", detail: "Skipped due to parse failure", timestamp: new Date().toISOString() });
      trace.push({ stage: "PRIVACY_FILTER", status: "skipped", detail: "Skipped due to parse failure", timestamp: new Date().toISOString() });
      trace.push({ stage: "AI_ANALYSIS", status: "skipped", detail: "Skipped due to parse failure", timestamp: new Date().toISOString() });
      trace.push({ stage: "PAYMENT_RISK_ENGINE", status: "blocked", detail: "Payment Risk Engine blocked transaction", timestamp: new Date().toISOString() });

      const defaultBlockedRisk = this.createBlockedRiskResult("Parse Failure: Malformed payment payload URI");
      return this.freezeResult({
        scenarioId: scenario?.id,
        decodedQR,
        parseResult,
        parsedData: null,
        validationResult: null,
        privacyResult: null,
        aiExplanation: null,
        aiExecuted: false,
        riskResult: defaultBlockedRisk,
        executionTrace: trace,
        executedAt
      });
    }

    const parsedData = parseResult.data;
    trace.push({ stage: "PAYMENT_PARSE", status: "success", detail: "UPI URI parameters parsed successfully", timestamp: new Date().toISOString() });

    // 3. Stage 3: Deterministic Validation
    const validationResult = paymentValidator.validate(parsedData);
    if (validationResult.status === "invalid") {
      trace.push({ stage: "DETERMINISTIC_VALIDATION", status: "fail", detail: "Validation failed closed", timestamp: new Date().toISOString() });
      trace.push({ stage: "PRIVACY_FILTER", status: "skipped", detail: "Skipped due to validation failure", timestamp: new Date().toISOString() });
      trace.push({ stage: "AI_ANALYSIS", status: "skipped", detail: "Skipped due to validation failure", timestamp: new Date().toISOString() });
      trace.push({ stage: "PAYMENT_RISK_ENGINE", status: "blocked", detail: "Payment Risk Engine blocked transaction", timestamp: new Date().toISOString() });

      const defaultBlockedRisk = this.createBlockedRiskResult("Deterministic Validation FAIL");
      return this.freezeResult({
        scenarioId: scenario?.id,
        decodedQR,
        parseResult,
        parsedData,
        validationResult,
        privacyResult: null,
        aiExplanation: null,
        aiExecuted: false,
        riskResult: defaultBlockedRisk,
        executionTrace: trace,
        executedAt
      });
    }

    trace.push({ stage: "DETERMINISTIC_VALIDATION", status: "success", detail: `Validation completed with status '${validationResult.status}'`, timestamp: new Date().toISOString() });

    // 4. Stage 4: Privacy Boundary Filtering
    const privacyResult = paymentPrivacyFilter.evaluate({
      parsedData,
      validationResult,
      rawMetadata
    });

    if (privacyResult.decision === "deny") {
      trace.push({ stage: "PRIVACY_FILTER", status: "blocked", detail: "Privacy Firewall DENY: Sensitive credential detected", timestamp: new Date().toISOString() });
      trace.push({ stage: "AI_ANALYSIS", status: "skipped", detail: "AI Provider execution halted due to Privacy DENY", timestamp: new Date().toISOString() });
      trace.push({ stage: "PAYMENT_RISK_ENGINE", status: "blocked", detail: "Payment Risk Engine blocked transaction", timestamp: new Date().toISOString() });

      const riskResult = paymentRiskEngine.evaluate(parsedData, validationResult, privacyResult, null);
      return this.freezeResult({
        scenarioId: scenario?.id,
        decodedQR,
        parseResult,
        parsedData,
        validationResult,
        privacyResult,
        aiExplanation: null,
        aiExecuted: false,
        riskResult,
        executionTrace: trace,
        executedAt
      });
    }

    trace.push({ stage: "PRIVACY_FILTER", status: "success", detail: `Privacy Filter decision '${privacyResult.decision}'`, timestamp: new Date().toISOString() });

    // 5. Stage 5 & 6: AI Analysis & Output Security Validation
    let aiExplanation: ValidatedPaymentExplanation | null = null;
    let aiExecuted = false;

    if (privacyResult.sanitizedContext) {
      aiExecuted = true;
      const provider = isAdversarialAI ? adversarialMockAIProvider : mockPaymentAIProvider;
      const rawAnalysis = await provider.analyze(privacyResult.sanitizedContext);
      trace.push({ stage: "AI_ANALYSIS", status: "success", detail: "AI provider analysis generated", timestamp: new Date().toISOString() });

      const validatedRes = paymentOutputValidator.validate(rawAnalysis);
      if (validatedRes.success && validatedRes.data) {
        aiExplanation = validatedRes.data;
        trace.push({ stage: "AI_OUTPUT_VALIDATION", status: "success", detail: "Output Security Validator approved explanation", timestamp: new Date().toISOString() });
      } else {
        trace.push({ stage: "AI_OUTPUT_VALIDATION", status: "fail", detail: `Output Security Validator rejected analysis: ${validatedRes.rejectionReason}`, timestamp: new Date().toISOString() });
      }
    }

    // 6. Stage 7: Payment Risk Engine Evaluation
    const riskResult = paymentRiskEngine.evaluate(parsedData, validationResult, privacyResult, aiExplanation);
    trace.push({ stage: "PAYMENT_RISK_ENGINE", status: riskResult.decision === "BLOCKED" ? "blocked" : "success", detail: `Risk decision assigned '${riskResult.decision}' (Score: ${riskResult.riskScore})`, timestamp: new Date().toISOString() });

    return this.freezeResult({
      scenarioId: scenario?.id,
      decodedQR,
      parseResult,
      parsedData,
      validationResult,
      privacyResult,
      aiExplanation,
      aiExecuted,
      riskResult,
      executionTrace: trace,
      executedAt
    });
  }

  private createBlockedRiskResult(reason: string) {
    return Object.freeze({
      decision: "BLOCKED" as const,
      riskScore: 0,
      riskLevel: "blocked" as const,
      signals: Object.freeze({ Q: 0, C: 0, M: 0, D: 0, A: 0, V: 0, P: 0.5, H: 0.5 }),
      blockingReasons: Object.freeze([reason]),
      evaluatedAt: new Date().toISOString()
    });
  }

  private freezeResult(res: any): PipelineResult {
    return Object.freeze({
      ...res,
      executionTrace: Object.freeze(res.executionTrace)
    });
  }
}

export const trustQRPipeline = new TrustQRPipeline();
