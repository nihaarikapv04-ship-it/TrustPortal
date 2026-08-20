import { ParsedPaymentData } from "../qr/payment_schema.js";
import { qrValidator } from "../qr/qr_validator.js";
import {
  PaymentValidationResult,
  ValidationCheck,
  RiskIndicatorID,
  ValidationStatus
} from "./types.js";

export const HIGH_VALUE_THRESHOLD_INR = 10000;
export const MAX_SAFE_AMOUNT_LIMIT = 10000000; // ₹1 Crore safe upper limit

const HTML_TAG_REGEX = /<[^>]*>/g;
const PROMPT_INJECTION_REGEX = /(ignore|override|bypass|disregard).*(previous|all|prior).*(instructions|rules|system)/i;
const CREDENTIAL_REQUEST_REGEX = /(enter|provide|input|send|reveal|share).*(pin|otp|password|cvv|passcode|code)/i;

export class PaymentValidator {
  /**
   * Deterministically validates an immutable ParsedPaymentData object.
   * Produces structured validation checks and risk indicators.
   */
  public validate(payment: ParsedPaymentData): PaymentValidationResult {
    const checks: ValidationCheck[] = [];
    const riskIndicators: RiskIndicatorID[] = [];

    // 1. Structural Recipient Check
    this.checkRecipient(payment, checks, riskIndicators);

    // 2. Structural Amount Check
    this.checkAmount(payment, checks, riskIndicators);

    // 3. Currency Check
    this.checkCurrency(payment, checks, riskIndicators);

    // 4. Merchant Name & Suspicious Content Check
    this.checkSuspiciousContent(payment, checks, riskIndicators);

    // 5. Merchant vs Recipient Context Consistency Check
    this.checkContextConsistency(payment, checks, riskIndicators);

    // 6. High-Value Transaction Threshold Check
    this.checkHighValueThreshold(payment, checks, riskIndicators);

    // Derive overall status: "invalid" if any check failed, "needs_review" if warnings/high-value present, else "valid"
    let status: "valid" | "needs_review" | "invalid" = "valid";
    const hasFailures = checks.some((c) => c.status === "fail");
    const hasWarnings = checks.some((c) => c.status === "warning") || riskIndicators.length > 0;

    if (hasFailures) {
      status = "invalid";
    } else if (hasWarnings) {
      status = "needs_review";
    }

    return Object.freeze({
      status,
      checks: Object.freeze(checks),
      riskIndicators: Object.freeze(riskIndicators),
      evaluatedAt: new Date().toISOString()
    });
  }

  private checkRecipient(
    payment: ParsedPaymentData,
    checks: ValidationCheck[],
    riskIndicators: RiskIndicatorID[]
  ): void {
    if (!payment.recipient || !payment.recipient.trim()) {
      checks.push({
        id: "CHK_RECIPIENT_REQUIRED",
        status: "fail",
        severity: "high",
        title: "Missing Recipient Handle",
        explanation: "Required payee address ('pa') is missing from payment payload."
      });
      riskIndicators.push("missing-recipient");
      return;
    }

    if (!qrValidator.isValidUPIFormat(payment.recipient)) {
      checks.push({
        id: "CHK_RECIPIENT_FORMAT",
        status: "fail",
        severity: "high",
        title: "Invalid Recipient Handle Format",
        explanation: `Recipient '${payment.recipient}' does not match standard UPI identifier format.`
      });
      riskIndicators.push("invalid-recipient");
      return;
    }

    checks.push({
      id: "CHK_RECIPIENT_FORMAT",
      status: "pass",
      severity: "info",
      title: "Recipient Format Valid",
      explanation: "Payee identifier is structurally valid."
    });
  }

  private checkAmount(
    payment: ParsedPaymentData,
    checks: ValidationCheck[],
    riskIndicators: RiskIndicatorID[]
  ): void {
    const amount = payment.amount;

    if (
      typeof amount !== "number" ||
      isNaN(amount) ||
      !isFinite(amount) ||
      amount < 0 ||
      amount > MAX_SAFE_AMOUNT_LIMIT
    ) {
      checks.push({
        id: "CHK_AMOUNT_STRUCTURAL",
        status: "fail",
        severity: "high",
        title: "Invalid Amount Value",
        explanation: `Amount value '${amount}' is invalid, non-numeric, or exceeds safe limit.`
      });
      riskIndicators.push("invalid-amount");
      return;
    }

    checks.push({
      id: "CHK_AMOUNT_STRUCTURAL",
      status: "pass",
      severity: "info",
      title: "Amount Value Valid",
      explanation: `Parsed amount of ${payment.currency} ${amount} is structurally valid.`
    });
  }

  private checkCurrency(
    payment: ParsedPaymentData,
    checks: ValidationCheck[],
    riskIndicators: RiskIndicatorID[]
  ): void {
    if (!qrValidator.isValidCurrency(payment.currency)) {
      checks.push({
        id: "CHK_CURRENCY_SUPPORTED",
        status: "fail",
        severity: "high",
        title: "Unsupported Currency",
        explanation: `Currency '${payment.currency}' is not supported.`
      });
      riskIndicators.push("unsupported-currency");
      return;
    }

    checks.push({
      id: "CHK_CURRENCY_SUPPORTED",
      status: "pass",
      severity: "info",
      title: "Currency Supported",
      explanation: `Currency '${payment.currency}' is supported.`
    });
  }

  private checkSuspiciousContent(
    payment: ParsedPaymentData,
    checks: ValidationCheck[],
    riskIndicators: RiskIndicatorID[]
  ): void {
    const textSources = [
      payment.merchantName || "",
      payment.transactionNote || "",
      ...Object.values(payment.metadata)
    ];

    for (const text of textSources) {
      if (!text) continue;

      // 1. Check HTML tags
      if (HTML_TAG_REGEX.test(text)) {
        checks.push({
          id: "CHK_SUSPICIOUS_HTML",
          status: "fail",
          severity: "high",
          title: "HTML / Executable Script Detected",
          explanation: "Merchant metadata contains HTML tags or executable script strings."
        });
        riskIndicators.push("unsafe-metadata");
        return;
      }

      // 2. Check Prompt Injection
      if (PROMPT_INJECTION_REGEX.test(text)) {
        checks.push({
          id: "CHK_PROMPT_INJECTION",
          status: "warning",
          severity: "warning",
          title: "Instruction Override Syntax Detected",
          explanation: "Payload metadata contains phrases attempting system instruction overrides."
        });
        riskIndicators.push("suspicious-instruction-text");
      }

      // 3. Check Credential Request (OTP / PIN)
      if (CREDENTIAL_REQUEST_REGEX.test(text)) {
        checks.push({
          id: "CHK_CREDENTIAL_REQUEST",
          status: "warning",
          severity: "high",
          title: "Sensitive Credential Request Text Detected",
          explanation: "Payload metadata contains requests urging user to enter PIN or OTP."
        });
        riskIndicators.push("suspicious-instruction-text");
      }
    }
  }

  private checkContextConsistency(
    payment: ParsedPaymentData,
    checks: ValidationCheck[],
    riskIndicators: RiskIndicatorID[]
  ): void {
    if (!payment.merchantName) {
      checks.push({
        id: "CHK_CONTEXT_CONSISTENCY",
        status: "pass",
        severity: "info",
        title: "Merchant Name Optional",
        explanation: "Merchant display name is absent from payload; payee ID is sole identifier."
      });
      return;
    }

    const merchantClean = payment.merchantName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const recipientUser = payment.recipient.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");

    // Check string containment / similarity
    const isConsistent =
      merchantClean.includes(recipientUser) ||
      recipientUser.includes(merchantClean) ||
      (merchantClean.length >= 3 && recipientUser.length >= 3 && (
        merchantClean.startsWith(recipientUser.substring(0, 3)) ||
        recipientUser.startsWith(merchantClean.substring(0, 3))
      ));

    if (!isConsistent) {
      checks.push({
        id: "CHK_CONTEXT_CONSISTENCY",
        status: "warning",
        severity: "warning",
        title: "Recipient & Merchant Context Mismatch",
        explanation: "Recipient identifier does not provide a deterministic match to the displayed merchant name."
      });
      riskIndicators.push("recipient-context-mismatch");
    } else {
      checks.push({
        id: "CHK_CONTEXT_CONSISTENCY",
        status: "pass",
        severity: "info",
        title: "Context Internally Consistent",
        explanation: "Recipient and merchant information are internally consistent with available demo context."
      });
    }
  }

  private checkHighValueThreshold(
    payment: ParsedPaymentData,
    checks: ValidationCheck[],
    riskIndicators: RiskIndicatorID[]
  ): void {
    if (payment.currency === "INR" && payment.amount >= HIGH_VALUE_THRESHOLD_INR) {
      checks.push({
        id: "CHK_HIGH_VALUE_THRESHOLD",
        status: "warning",
        severity: "warning",
        title: "High-Value Transaction Warning",
        explanation: `Transaction amount (${payment.currency} ${payment.amount}) meets or exceeds the high-value threshold (${payment.currency} ${HIGH_VALUE_THRESHOLD_INR}).`
      });
      riskIndicators.push("high-value-transaction");
    }
  }
}

export const paymentValidator = new PaymentValidator();
