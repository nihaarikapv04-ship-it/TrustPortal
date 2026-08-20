import { SanitizedPaymentContext } from "../privacy/types.js";
import { PaymentAnalysisProvider, UntrustedPaymentAnalysis } from "./types.js";

/**
 * Deterministic Local Mock AI Provider for TrustQR.
 * Generates structured explanation rationale based on sanitized context signals.
 * Contains ZERO network dependencies and zero transaction authority.
 */
export class MockPaymentAIProvider implements PaymentAnalysisProvider {
  public async analyze(context: SanitizedPaymentContext): Promise<UntrustedPaymentAnalysis> {
    const riskIndicators = context.riskIndicators || [];

    // Case 1: High-value or Severe Risk Indicators
    if (riskIndicators.includes("high-value-transaction") || context.validationStatus === "invalid") {
      return {
        riskLevel: "high",
        summary: "This transaction meets high-value or structural anomaly criteria. Exercise heightened review before continuing.",
        reasons: [
          "Transaction amount meets or exceeds the TrustQR demonstration high-value threshold.",
          "Payee identifier requires independent confirmation in your payment application."
        ],
        verificationSteps: [
          "Verify the payee display name matches your intended vendor.",
          "Confirm the payment amount matches your invoice or bill.",
          "Complete final authorization inside your official banking or UPI app."
        ],
        confidence: 0.88
      };
    }

    // Case 2: Recipient / Context Mismatch
    if (riskIndicators.includes("recipient-context-mismatch") || context.validationStatus === "needs_review") {
      return {
        riskLevel: "medium",
        summary: "The displayed merchant context and recipient identifier could not be deterministically matched. Verify payee details.",
        reasons: [
          "Merchant display name does not match the payee address username.",
          "Unrecognized metadata parameters captured in payment context."
        ],
        verificationSteps: [
          "Check the payee name in your payment application before confirming.",
          "Verify the exact bill amount with the store owner."
        ],
        confidence: 0.82
      };
    }

    // Case 3: Normal Safe Payment
    return {
      riskLevel: "low",
      summary: "Payment information passed available structural and consistency checks. Review details before confirming.",
      reasons: [
        "Payee handle format is structurally valid.",
        "Amount and currency parameters are consistent with demo context."
      ],
      verificationSteps: [
        "Verify recipient display name in your payment app.",
        "Confirm total amount before authorizing transaction."
      ],
      confidence: 0.95
    };
  }
}

export const mockPaymentAIProvider = new MockPaymentAIProvider();
