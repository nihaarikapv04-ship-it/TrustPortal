import { z } from "zod";

export type ValidationStatus = "pass" | "warning" | "fail";
export type ValidationSeverity = "info" | "warning" | "high";

export interface ValidationCheck {
  id: string;
  status: ValidationStatus;
  severity: ValidationSeverity;
  title: string;
  explanation: string;
}

export type RiskIndicatorID =
  | "invalid-recipient"
  | "invalid-amount"
  | "unsupported-currency"
  | "high-value-transaction"
  | "missing-recipient"
  | "recipient-context-mismatch"
  | "unsafe-metadata"
  | "suspicious-instruction-text"
  | "malformed-payment-context";

export interface PaymentValidationResult {
  status: "valid" | "needs_review" | "invalid";
  checks: readonly ValidationCheck[];
  riskIndicators: readonly RiskIndicatorID[];
  evaluatedAt: string;
}

export const ValidationCheckSchema = z.object({
  id: z.string(),
  status: z.enum(["pass", "warning", "fail"]),
  severity: z.enum(["info", "warning", "high"]),
  title: z.string(),
  explanation: z.string()
});

export const PaymentValidationResultSchema = z.object({
  status: z.enum(["valid", "needs_review", "invalid"]),
  checks: z.array(ValidationCheckSchema),
  riskIndicators: z.array(z.string()),
  evaluatedAt: z.string()
});
