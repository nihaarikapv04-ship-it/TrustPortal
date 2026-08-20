import { SignalComponents, AblationConfig, DEFAULT_ABLATION_CONFIG } from "./types.js";

export function calculateTrustScore(
  signals: SignalComponents,
  ablation: AblationConfig = DEFAULT_ABLATION_CONFIG
): number {
  const R = Math.max(0, Math.min(1, signals.ruleConfidence));
  const C = ablation.useEvidenceAgreement ? Math.max(0, Math.min(1, signals.contextAgreement)) : 0.50;
  const M = ablation.useCalibration ? Math.max(0, Math.min(1, signals.modelConfidenceCalibrated)) : Math.max(0, Math.min(1, signals.modelConfidenceRaw));
  const D = Math.max(0, Math.min(1, signals.domConsistency));
  const A = Math.max(0, Math.min(1, signals.candidateAgreement));
  const V = Math.max(0, Math.min(1, signals.visualConfidence));

  const P = ablation.usePrivacyPenalty ? Math.max(0, Math.min(1, signals.privacyPenalty)) : 0;
  const H = ablation.useRiskPenalty ? Math.max(0, Math.min(1, signals.riskPenalty)) : 0;

  const rawTAS = 0.25 * R + 0.20 * C + 0.20 * M + 0.15 * D + 0.10 * A + 0.10 * V - P - H;

  const clampedTAS = Math.max(0.0, Math.min(1.0, rawTAS));
  return Math.round(clampedTAS * 100);
}
