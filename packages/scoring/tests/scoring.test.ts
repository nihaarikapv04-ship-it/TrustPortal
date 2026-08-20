import { describe, test, expect } from "vitest";
import { calculateTrustScore } from "../src/trust_score.js";
import { SignalComponents } from "../src/types.js";

describe("TAS Trust Score Formula Tests", () => {
  test("Computes high TAS score for perfect signals without penalties", () => {
    const perfectSignals: SignalComponents = {
      ruleConfidence: 1.0,
      contextAgreement: 1.0,
      modelConfidenceRaw: 0.95,
      modelConfidenceCalibrated: 0.95,
      domConsistency: 1.0,
      candidateAgreement: 1.0,
      visualConfidence: 0.0,
      privacyPenalty: 0.0,
      riskPenalty: 0.0
    };

    const score = calculateTrustScore(perfectSignals);
    expect(score).toBe(89); // 0.25*1 + 0.20*1 + 0.20*0.95 + 0.15*1 + 0.10*1 + 0.10*0 = 0.89 -> 89
  });

  test("Applies privacy and risk penalties correctly to clamp score in [0, 100]", () => {
    const penalizedSignals: SignalComponents = {
      ruleConfidence: 0.95,
      contextAgreement: 0.80,
      modelConfidenceRaw: 0.90,
      modelConfidenceCalibrated: 0.90,
      domConsistency: 1.0,
      candidateAgreement: 0.80,
      visualConfidence: 0.0,
      privacyPenalty: 0.30,
      riskPenalty: 0.50
    };

    const score = calculateTrustScore(penalizedSignals);
    expect(score).toBeLessThan(40);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});
