import { describe, test, expect } from "vitest";
import { UncalibratedModel, PlattScalingModel, computeECE } from "../src/calibration";

describe("Calibration Infrastructure & ECE Metric Tests", () => {
  test("UncalibratedModel passes raw confidence unmodified", () => {
    const uncal = new UncalibratedModel();
    expect(uncal.status).toBe("uncalibrated");
    expect(uncal.calibrate(0.85)).toBe(0.85);
  });

  test("PlattScalingModel transforms raw confidence", () => {
    const platt = new PlattScalingModel(-1.2, 0.5);
    expect(platt.status).toBe("fitted");
    const cal = platt.calibrate(0.90);
    expect(cal).toBeGreaterThan(0.0);
    expect(cal).toBeLessThan(1.0);
  });

  test("Computes Expected Calibration Error (ECE)", () => {
    const preds = [0.90, 0.85, 0.70, 0.60, 0.95];
    const labels = [true, true, false, false, true];
    const ece = computeECE(preds, labels);
    expect(ece).toBeGreaterThanOrEqual(0.0);
    expect(ece).toBeLessThanOrEqual(1.0);
  });
});
