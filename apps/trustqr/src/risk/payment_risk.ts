import { ParsedPaymentData } from "../qr/payment_schema.js";
import { PaymentValidationResult } from "../validation/types.js";
import { PaymentPrivacyResult } from "../privacy/types.js";
import { ValidatedPaymentExplanation } from "../ai/types.js";
import { RiskResult, PaymentSignals, RiskDecision } from "./types.js";

export class PaymentRiskEngine {
  /**
   * Evaluates payment data, validation checks, privacy status, and AI explanation
   * to compute the TrustQR Risk Score and assign a non-compensable risk decision state.
   */
  public evaluate(
    parsedData: ParsedPaymentData,
    validationResult: PaymentValidationResult,
    privacyResult: PaymentPrivacyResult,
    explanation: ValidatedPaymentExplanation | null
  ): RiskResult {
    const blockingReasons: string[] = [];

    // 1. Hard Rejection Gate Check: Privacy DENY or Structural INVALID
    if (privacyResult.decision === "deny") {
      blockingReasons.push(privacyResult.reason || "Privacy Filter DENY: Sensitive credential detected");
      return this.buildResult("BLOCKED", 0, "blocked", this.extractSignals(0, 0, 0, 0, 0, 0, 0.50), blockingReasons);
    }

    if (validationResult.status === "invalid") {
      blockingReasons.push("Deterministic Validation FAIL: Structural or security check failed");
      return this.buildResult("BLOCKED", 0, "blocked", this.extractSignals(0, 0, 0, 0, 0, 0, 0), blockingReasons);
    }

    // 2. Extract Payment Signal Components
    const Q = validationResult.checks.some((c) => c.id === "CHK_RECIPIENT_FORMAT" && c.status === "pass") ? 1.0 : 0.0;
    const C = validationResult.riskIndicators.includes("recipient-context-mismatch") ? 0.0 : 1.0;
    const M = explanation ? Math.min(Math.max(explanation.confidence, 0), 1.0) : 0.50;
    const D = validationResult.checks.some((c) => c.id === "CHK_AMOUNT_STRUCTURAL" && c.status === "pass") ? 1.0 : 0.0;
    const A = validationResult.checks.every((c) => c.status === "pass") ? 1.0 : 0.50;
    const V = 1.0; // Visual display consistency baseline
    const P = privacyResult.decision === "redact" ? 0.20 : 0.0;
    const H = 0.50; // Financial High-Impact Penalty (Hard-coded Non-Compensable Gate for ALL payments)

    const signals = this.extractSignals(Q, C, M, D, A, V, P, H);

    // 3. Compute Calibrated TrustQR Risk Score (0 - 100)
    const rawScore = 0.25 * Q + 0.20 * C + 0.15 * M + 0.20 * D + 0.10 * A + 0.10 * V - P;
    const clampedScore = Math.min(Math.max(rawScore, 0), 1.0);
    const riskScore = Math.round(clampedScore * 100);

    // 4. Non-Compensable High-Impact Safety Gate Policy
    // Non-compensable rule: H = 0.50 prohibits AUTO_PAY execution under all circumstances.
    // Decision bands: >=90 = INFORMATIONAL (Human Review Required), 75-89 = NEEDS_REVIEW, <75 = HIGH_RISK_WARNING.
    let decision: RiskDecision = "INFORMATIONAL";
    let riskLevel: "low" | "medium" | "high" | "blocked" = "low";

    if (validationResult.riskIndicators.includes("high-value-transaction")) {
      decision = "HIGH_RISK_WARNING";
      riskLevel = "high";
      blockingReasons.push("High-value transaction threshold met (₹10,000+)");
    } else if (validationResult.riskIndicators.includes("recipient-context-mismatch")) {
      decision = "NEEDS_REVIEW";
      riskLevel = "medium";
      blockingReasons.push("Recipient identifier does not match merchant display name");
    } else if (riskScore < 75) {
      decision = "HIGH_RISK_WARNING";
      riskLevel = "high";
      blockingReasons.push(`TrustQR Risk Score (${riskScore}) below review threshold (75)`);
    } else if (riskScore < 90) {
      decision = "NEEDS_REVIEW";
      riskLevel = "medium";
      blockingReasons.push("Transaction requires human review before payment authorization");
    } else {
      decision = "INFORMATIONAL";
      riskLevel = "low";
    }

    return this.buildResult(decision, riskScore, riskLevel, signals, blockingReasons);
  }

  private extractSignals(
    Q: number,
    C: number,
    M: number,
    D: number,
    A: number,
    V: number,
    P: number,
    H: number = 0.50
  ): PaymentSignals {
    return Object.freeze({ Q, C, M, D, A, V, P, H });
  }

  private buildResult(
    decision: RiskDecision,
    riskScore: number,
    riskLevel: "low" | "medium" | "high" | "blocked",
    signals: PaymentSignals,
    blockingReasons: string[]
  ): RiskResult {
    return Object.freeze({
      decision,
      riskScore,
      riskLevel,
      signals,
      blockingReasons: Object.freeze(blockingReasons),
      evaluatedAt: new Date().toISOString()
    });
  }
}

export const paymentRiskEngine = new PaymentRiskEngine();
