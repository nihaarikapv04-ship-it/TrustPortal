import { CalibrationStatus } from "./types.js";

export interface CalibrationModel {
  readonly status: CalibrationStatus;
  calibrate(rawConfidence: number): number;
}

export class UncalibratedModel implements CalibrationModel {
  public readonly status: CalibrationStatus = "uncalibrated";

  public calibrate(rawConfidence: number): number {
    return Math.max(0.0, Math.min(1.0, rawConfidence));
  }
}

export class PlattScalingModel implements CalibrationModel {
  public readonly status: CalibrationStatus = "fitted";
  private a: number;
  private b: number;

  constructor(a: number = -1.2, b: number = 0.5) {
    this.a = a;
    this.b = b;
  }

  public calibrate(rawConfidence: number): number {
    const logit = Math.log(Math.max(1e-5, Math.min(0.99999, rawConfidence)) / (1 - rawConfidence));
    const calibratedLogit = this.a * logit + this.b;
    return 1 / (1 + Math.exp(-calibratedLogit));
  }
}

/**
 * Computes Expected Calibration Error (ECE) for a set of predictions and binary ground truth labels.
 */
export function computeECE(predictions: number[], labels: boolean[], numBins: number = 10): number {
  if (predictions.length === 0 || predictions.length !== labels.length) {
    return 0.0;
  }

  const binTotalCount = new Array(numBins).fill(0);
  const binCorrectCount = new Array(numBins).fill(0);
  const binConfidenceSum = new Array(numBins).fill(0);

  for (let i = 0; i < predictions.length; i++) {
    const p = predictions[i];
    const isCorrect = labels[i];
    const binIdx = Math.min(numBins - 1, Math.floor(p * numBins));

    binTotalCount[binIdx] += 1;
    binConfidenceSum[binIdx] += p;
    if (isCorrect) binCorrectCount[binIdx] += 1;
  }

  let ece = 0.0;
  const totalSamples = predictions.length;

  for (let b = 0; b < numBins; b++) {
    if (binTotalCount[b] > 0) {
      const acc = binCorrectCount[b] / binTotalCount[b];
      const conf = binConfidenceSum[b] / binTotalCount[b];
      const weight = binTotalCount[b] / totalSamples;
      ece += weight * Math.abs(acc - conf);
    }
  }

  return ece;
}
