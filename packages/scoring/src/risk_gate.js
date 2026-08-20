import { DEFAULT_ABLATION_CONFIG } from "./types.js";
import { UncalibratedModel } from "./calibration.js";
import { signalExtractor } from "./signals.js";
import { calculateTrustScore } from "./trust_score.js";
const HIGH_IMPACT_CATEGORIES = new Set([
    "authentication",
    "payment",
    "identity",
    "health",
    "tax",
    "legal",
    "benefits"
]);
export class TSIFRiskGate {
    calibrationModel;
    ablationConfig;
    constructor(calibrationModel = new UncalibratedModel(), ablationConfig = DEFAULT_ABLATION_CONFIG) {
        this.calibrationModel = calibrationModel;
        this.ablationConfig = ablationConfig;
    }
    /**
     * Evaluates AI Model Proposal against signals, TAS formula, and Non-Compensable Risk Gate.
     */
    evaluateProposal(proposedLabel, rawModelConfidence, context) {
        const blockingReasons = [];
        // 1. Extract Signal Components
        const signals = signalExtractor.extractSignals(proposedLabel, rawModelConfidence, context, this.calibrationModel);
        // 2. Compute TAS Trust Score
        const trustScore = calculateTrustScore(signals, this.ablationConfig);
        // 3. Non-Compensable Safety Gate Inspections
        let decision = "reject";
        if (trustScore >= 90) {
            decision = "auto";
        }
        else if (trustScore >= 75) {
            decision = "confirm";
        }
        else {
            decision = "reject";
            blockingReasons.push(`Trust Score (${trustScore}) below confirmation threshold (75)`);
        }
        // Hard Safety Gate 1: High-Impact Workflow Penalty (NEVER auto-apply!)
        if (HIGH_IMPACT_CATEGORIES.has(context.coarsePageCategory)) {
            blockingReasons.push(`High-impact workflow category '${context.coarsePageCategory}' prohibits auto-apply`);
            if (decision === "auto") {
                decision = this.ablationConfig.useHumanConfirmation ? "confirm" : "reject";
            }
        }
        // Hard Safety Gate 2: DOM Consistency Failure
        if (signals.domConsistency < 0.50) {
            blockingReasons.push("DOM consistency validation failed");
            decision = "reject";
        }
        // Hard Safety Gate 3: Empty Label / Model Abstention
        if (!proposedLabel || !proposedLabel.trim()) {
            blockingReasons.push("Proposed label is empty or model abstained");
            decision = "reject";
        }
        return {
            decision,
            trustScore,
            signals,
            blockingReasons,
            calibrationStatus: this.calibrationModel.status
        };
    }
}
export const tsifRiskGate = new TSIFRiskGate();
