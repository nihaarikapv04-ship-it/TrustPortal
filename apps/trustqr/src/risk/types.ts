import { z } from "zod";

export type RiskDecision = "INFORMATIONAL" | "NEEDS_REVIEW" | "HIGH_RISK_WARNING" | "BLOCKED";

export interface PaymentSignals {
  Q: number; // QR Structural Validity (0.0 - 1.0)
  C: number; // Context Consistency (0.0 - 1.0)
  M: number; // Model Confidence (0.0 - 1.0)
  D: number; // Data Consistency (0.0 - 1.0)
  A: number; // Verifier Agreement (0.0 - 1.0)
  V: number; // Visual Display Score (0.0 - 1.0)
  P: number; // Privacy Penalty (0.0 or 0.50)
  H: number; // Financial High-Impact Penalty (0.50)
}

export interface RiskResult {
  decision: RiskDecision;
  riskScore: number; // TrustQR Risk Score (0 - 100)
  riskLevel: "low" | "medium" | "high" | "blocked";
  signals: Readonly<PaymentSignals>;
  blockingReasons: readonly string[];
  evaluatedAt: string;
}

export const RiskResultSchema = z.object({
  decision: z.enum(["INFORMATIONAL", "NEEDS_REVIEW", "HIGH_RISK_WARNING", "BLOCKED"]),
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(["low", "medium", "high", "blocked"]),
  signals: z.object({
    Q: z.number(),
    C: z.number(),
    M: z.number(),
    D: z.number(),
    A: z.number(),
    V: z.number(),
    P: z.number(),
    H: z.number()
  }),
  blockingReasons: z.array(z.string()),
  evaluatedAt: z.string()
});
