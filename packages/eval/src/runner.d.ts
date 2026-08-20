import { MetricSummary } from "./metrics.js";
export interface FullBenchmarkReport {
    timestamp: string;
    benchmarkVersion: string;
    environment: string;
    syntheticMetrics: MetricSummary;
    adversarialMetrics: {
        totalAttacks: number;
        blockedAttacks: number;
        blockedRate: number;
        unsafeAutoApplyCount: number;
        breakdownByCategory: Record<string, {
            total: number;
            blocked: number;
        }>;
    };
    ablationResults: Record<string, {
        autoCount: number;
        confirmCount: number;
        rejectCount: number;
    }>;
}
export declare class FullBenchmarkRunner {
    runFullEvaluation(): FullBenchmarkReport;
    private evaluateSyntheticDataset;
    private evaluateAdversarialDataset;
    private runAblationMatrix;
}
export declare const fullBenchmarkRunner: FullBenchmarkRunner;
//# sourceMappingURL=runner.d.ts.map