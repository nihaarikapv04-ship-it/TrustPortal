import { TSIFRiskGate, DEFAULT_ABLATION_CONFIG, computeECE } from "@trustportal/scoring";
export * from "./runner.js";
export * from "./metrics.js";
export * from "./data/synthetic_benchmark.js";
export * from "./data/adversarial_benchmark.js";
export class EvaluationRunner {
    runAblation(items, config = DEFAULT_ABLATION_CONFIG) {
        const gate = new TSIFRiskGate(undefined, config);
        let autoAcceptCount = 0;
        let confirmCount = 0;
        let rejectCount = 0;
        let autoCorrectCount = 0;
        const confidences = [];
        const correctness = [];
        for (const item of items) {
            const decision = gate.evaluateProposal(item.proposedLabel, item.modelConfidence, item.context);
            confidences.push(decision.trustScore / 100);
            correctness.push(item.isCorrect);
            if (decision.decision === "auto") {
                autoAcceptCount++;
                if (item.isCorrect)
                    autoCorrectCount++;
            }
            else if (decision.decision === "confirm") {
                confirmCount++;
            }
            else {
                rejectCount++;
            }
        }
        const accuracyOnAuto = autoAcceptCount > 0 ? autoCorrectCount / autoAcceptCount : 1.0;
        const ece = computeECE(confidences, correctness);
        return {
            config,
            totalItems: items.length,
            autoAcceptCount,
            confirmCount,
            rejectCount,
            accuracyOnAuto,
            ece
        };
    }
}
export const evaluationRunner = new EvaluationRunner();
