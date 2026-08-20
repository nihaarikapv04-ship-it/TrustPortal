import { z } from "zod";
import { SanitizedPaymentContext } from "../privacy/types.js";

export interface UntrustedPaymentAnalysis {
  riskLevel: "low" | "medium" | "high";
  summary: string;
  reasons: string[];
  verificationSteps: string[];
  confidence: number;
}

export interface PaymentAnalysisProvider {
  analyze(context: SanitizedPaymentContext): Promise<UntrustedPaymentAnalysis>;
}

export interface ValidatedPaymentExplanation {
  riskLevel: "low" | "medium" | "high";
  summary: string;
  reasons: readonly string[];
  verificationSteps: readonly string[];
  confidence: number;
  validatorFlags: readonly string[];
  validatedAt: string;
}

export interface OutputValidationResult {
  success: boolean;
  data: ValidatedPaymentExplanation | null;
  rejectionReason?: string;
  flags: readonly string[];
}

export const UntrustedPaymentAnalysisSchema = z.object({
  riskLevel: z.enum(["low", "medium", "high"]),
  summary: z.string().min(1),
  reasons: z.array(z.string()),
  verificationSteps: z.array(z.string()),
  confidence: z.number().min(0).max(1)
});

export const ValidatedPaymentExplanationSchema = z.object({
  riskLevel: z.enum(["low", "medium", "high"]),
  summary: z.string(),
  reasons: z.array(z.string()),
  verificationSteps: z.array(z.string()),
  confidence: z.number(),
  validatorFlags: z.array(z.string()),
  validatedAt: z.string()
});
