import { IssueType } from "@trustportal/schemas";
export interface CategoryPerformance {
    issueType: IssueType;
    totalCount: number;
    tp: number;
    fp: number;
    fn: number;
    precision: number;
    recall: number;
    f1: number;
}
export interface ConfusionMatrix {
    matrix: {
        auto: {
            auto: number;
            confirm: number;
            abstain: number;
        };
        confirm: {
            auto: number;
            confirm: number;
            abstain: number;
        };
        abstain: {
            auto: number;
            confirm: number;
            abstain: number;
        };
    };
}
export interface ReliabilityBin {
    binMin: number;
    binMax: number;
    count: number;
    avgConfidence: number;
    empiricalAccuracy: number;
}
export interface MetricSummary {
    totalCount: number;
    exactMatchCount: number;
    acceptableCount: number;
    incorrectCount: number;
    abstainCount: number;
    exactMatchAccuracy: number;
    acceptableAccuracy: number;
    incorrectRate: number;
    abstentionRate: number;
    falseAcceptanceRate: number;
    falseRejectionRate: number;
    unsafeAutoApplyCount: number;
    highImpactAutoApplyCount: number;
    ece: number;
    brierScore: number;
    categoryMetrics: Record<string, CategoryPerformance>;
    confusionMatrix: ConfusionMatrix;
    reliabilityBins: ReliabilityBin[];
}
export declare function computeBrierScore(predictions: number[], labels: boolean[]): number;
export declare function computeReliabilityBins(predictions: number[], labels: boolean[], numBins?: number): ReliabilityBin[];
//# sourceMappingURL=metrics.d.ts.map