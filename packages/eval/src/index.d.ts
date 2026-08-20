import { SafeContext } from "@trustportal/schemas";
import { AblationConfig } from "@trustportal/scoring";
export * from "./runner.js";
export * from "./metrics.js";
export * from "./data/synthetic_benchmark.js";
export * from "./data/adversarial_benchmark.js";
export interface BenchmarkItem {
    itemId: string;
    context: SafeContext;
    proposedLabel: string;
    modelConfidence: number;
    groundTruthLabel: string;
    isCorrect: boolean;
}
export interface AblationEvaluationResult {
    config: AblationConfig;
    totalItems: number;
    autoAcceptCount: number;
    confirmCount: number;
    rejectCount: number;
    accuracyOnAuto: number;
    ece: number;
}
export declare class EvaluationRunner {
    runAblation(items: BenchmarkItem[], config?: AblationConfig): AblationEvaluationResult;
}
export declare const evaluationRunner: EvaluationRunner;
//# sourceMappingURL=index.d.ts.map