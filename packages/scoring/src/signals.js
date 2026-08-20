import { UncalibratedModel } from "./calibration.js";
import { evidenceAgreementCalculator } from "./evidence_agreement.js";
import { independentValidators } from "./validators.js";
export function computeRuleConfidence(ruleId) {
    if (ruleId.includes("MISSING"))
        return 0.95;
    if (ruleId.includes("FILENAME"))
        return 0.85;
    return 0.80;
}
export function computePrivacyPenalty(context) {
    const flagsCount = context.redactionFlags ? context.redactionFlags.length : 0;
    if (flagsCount === 0)
        return 0.0;
    return Math.min(0.50, flagsCount * 0.15);
}
export function computeRiskPenalty(coarseCategory) {
    const SENSITIVE_CATEGORIES = new Set([
        "authentication",
        "payment",
        "identity",
        "health",
        "tax",
        "legal",
        "benefits"
    ]);
    if (SENSITIVE_CATEGORIES.has(coarseCategory)) {
        return 0.50; // Hard risk penalty
    }
    return 0.0;
}
export class SignalExtractor {
    extractSignals(proposedLabel, rawModelConfidence, context, calibrationModel = new UncalibratedModel()) {
        const R = computeRuleConfidence(context.ruleId);
        const C = evidenceAgreementCalculator.computeAgreement(proposedLabel, context);
        const M_calibrated = calibrationModel.calibrate(rawModelConfidence);
        const domVal = independentValidators.validateDomConsistency(proposedLabel, context);
        const D = domVal.score;
        const A = 0.80; // Baseline candidate agreement
        const V = 0.0; // Text-only baseline (Visual signal disabled in text mock)
        const P = computePrivacyPenalty(context);
        const H = computeRiskPenalty(context.coarsePageCategory);
        return {
            ruleConfidence: R,
            contextAgreement: C,
            modelConfidenceRaw: rawModelConfidence,
            modelConfidenceCalibrated: M_calibrated,
            domConsistency: D,
            candidateAgreement: A,
            visualConfidence: V,
            privacyPenalty: P,
            riskPenalty: H
        };
    }
}
export const signalExtractor = new SignalExtractor();
