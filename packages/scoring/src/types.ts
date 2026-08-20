import { Decision } from "@trustportal/schemas";

export interface SignalComponents {
  ruleConfidence: number;              // R (0.0 to 1.0)
  contextAgreement: number;            // C (0.0 to 1.0)
  modelConfidenceRaw: number;          // M raw
  modelConfidenceCalibrated: number;   // M calibrated (0.0 to 1.0)
  domConsistency: number;              // D (0.0 to 1.0)
  candidateAgreement: number;          // A (0.0 to 1.0)
  visualConfidence: number;            // V (0.0 to 1.0)
  privacyPenalty: number;              // P (0.0 to 1.0)
  riskPenalty: number;                 // H (0.0 to 1.0)
}

export type CalibrationStatus = "uncalibrated" | "fitted";

export interface TrustDecision {
  decision: Decision;
  trustScore: number;                 // TAS score 0 to 100
  signals: SignalComponents;
  blockingReasons: string[];
  calibrationStatus: CalibrationStatus;
}

export interface AblationConfig {
  usePrivacyPenalty: boolean;
  useEvidenceAgreement: boolean;
  useCalibration: boolean;
  useRiskPenalty: boolean;
  useHumanConfirmation: boolean;
}

export const DEFAULT_ABLATION_CONFIG: AblationConfig = {
  usePrivacyPenalty: true,
  useEvidenceAgreement: true,
  useCalibration: true,
  useRiskPenalty: true,
  useHumanConfirmation: true
};
