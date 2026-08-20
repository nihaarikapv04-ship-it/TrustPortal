import { RawDecodedQR, ParsedPaymentData, ParseResult } from "../qr/payment_schema.js";
import { PaymentValidationResult } from "../validation/types.js";
import { PaymentPrivacyResult } from "../privacy/types.js";
import { ValidatedPaymentExplanation } from "../ai/types.js";
import { RiskResult } from "../risk/types.js";
import { DemoScenario } from "../scenarios/demo_scenarios.js";

export type PipelineStageName =
  | "QR_DECODE"
  | "PAYMENT_PARSE"
  | "DETERMINISTIC_VALIDATION"
  | "PRIVACY_FILTER"
  | "AI_ANALYSIS"
  | "AI_OUTPUT_VALIDATION"
  | "PAYMENT_RISK_ENGINE";

export interface PipelineTraceEvent {
  stage: PipelineStageName;
  status: "success" | "blocked" | "skipped" | "fail";
  detail: string;
  timestamp: string;
}

export interface PipelineInput {
  scenarioKey?: string;
  rawPayload?: string;
  rawMetadata?: Record<string, string>;
  isAdversarialAI?: boolean;
}

export interface PipelineResult {
  scenarioId?: string;
  decodedQR: RawDecodedQR;
  parseResult: ParseResult;
  parsedData: ParsedPaymentData | null;
  validationResult: PaymentValidationResult | null;
  privacyResult: PaymentPrivacyResult | null;
  aiExplanation: ValidatedPaymentExplanation | null;
  aiExecuted: boolean;
  riskResult: RiskResult;
  executionTrace: readonly PipelineTraceEvent[];
  executedAt: string;
}
