import { CalibrationStatus } from "./types.js";
export interface CalibrationModel {
    readonly status: CalibrationStatus;
    calibrate(rawConfidence: number): number;
}
export declare class UncalibratedModel implements CalibrationModel {
    readonly status: CalibrationStatus;
    calibrate(rawConfidence: number): number;
}
export declare class PlattScalingModel implements CalibrationModel {
    readonly status: CalibrationStatus;
    private a;
    private b;
    constructor(a?: number, b?: number);
    calibrate(rawConfidence: number): number;
}
/**
 * Computes Expected Calibration Error (ECE) for a set of predictions and binary ground truth labels.
 */
export declare function computeECE(predictions: number[], labels: boolean[], numBins?: number): number;
//# sourceMappingURL=calibration.d.ts.map