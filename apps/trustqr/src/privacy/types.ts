import { z } from "zod";
import { ParsedPaymentData } from "../qr/payment_schema.js";
import { PaymentValidationResult } from "../validation/types.js";

export type PrivacyDecision = "allow" | "redact" | "deny";

export type PrivacyFlag =
  | "SAFE_CONTEXT"
  | "SENSITIVE_OTP_DENIED"
  | "SENSITIVE_PIN_DENIED"
  | "SENSITIVE_PASSWORD_DENIED"
  | "SENSITIVE_CVV_DENIED"
  | "SENSITIVE_CARD_DENIED"
  | "SENSITIVE_ACCOUNT_DENIED"
  | "SENSITIVE_TOKEN_DENIED"
  | "UNSAFE_METADATA_REDACTED";

export interface RawPaymentContext {
  parsedData: ParsedPaymentData;
  validationResult: PaymentValidationResult;
  rawMetadata?: Record<string, string>;
}

export interface SanitizedPaymentContext {
  recipient: string;
  merchantName?: string;
  amount: number;
  currency: string;
  transactionRef?: string;
  validationStatus: "valid" | "needs_review" | "invalid";
  riskIndicators: readonly string[];
  sanitizedMetadata: Readonly<Record<string, string>>;
}

export interface PaymentPrivacyResult {
  decision: PrivacyDecision;
  sanitizedContext: Readonly<SanitizedPaymentContext> | null;
  flags: readonly PrivacyFlag[];
  reason?: string;
  evaluatedAt: string;
}

export const SanitizedPaymentContextSchema = z.object({
  recipient: z.string(),
  merchantName: z.string().optional(),
  amount: z.number(),
  currency: z.string(),
  transactionRef: z.string().optional(),
  validationStatus: z.enum(["valid", "needs_review", "invalid"]),
  riskIndicators: z.array(z.string()),
  sanitizedMetadata: z.record(z.string())
});
