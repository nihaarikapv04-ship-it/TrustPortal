import { IssueType } from "@trustportal/schemas";
import { computeECE } from "@trustportal/scoring";

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
    auto: { auto: number; confirm: number; abstain: number };
    confirm: { auto: number; confirm: number; abstain: number };
    abstain: { auto: number; confirm: number; abstain: number };
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
  highImpactAutoApplyCount: number; // MUST BE ZERO!
  ece: number;
  brierScore: number;
  categoryMetrics: Record<string, CategoryPerformance>;
  confusionMatrix: ConfusionMatrix;
  reliabilityBins: ReliabilityBin[];
}

export function computeBrierScore(predictions: number[], labels: boolean[]): number {
  if (predictions.length === 0 || predictions.length !== labels.length) return 0.0;
  let sum = 0.0;
  for (let i = 0; i < predictions.length; i++) {
    const p = predictions[i];
    const y = labels[i] ? 1.0 : 0.0;
    sum += Math.pow(p - y, 2);
  }
  return sum / predictions.length;
}

export function computeReliabilityBins(predictions: number[], labels: boolean[], numBins: number = 10): ReliabilityBin[] {
  const bins: ReliabilityBin[] = [];

  for (let b = 0; b < numBins; b++) {
    const binMin = b / numBins;
    const binMax = (b + 1) / numBins;
    let count = 0;
    let confSum = 0.0;
    let correctCount = 0;

    for (let i = 0; i < predictions.length; i++) {
      const p = predictions[i];
      if (p >= binMin && (b === numBins - 1 ? p <= binMax : p < binMax)) {
        count++;
        confSum += p;
        if (labels[i]) correctCount++;
      }
    }

    bins.push({
      binMin,
      binMax,
      count,
      avgConfidence: count > 0 ? confSum / count : 0.0,
      empiricalAccuracy: count > 0 ? correctCount / count : 0.0
    });
  }

  return bins;
}
