import { describe, test, expect } from "vitest";
import { fullBenchmarkRunner } from "../src/runner";

describe("Full Benchmark Runner & Metrics Engine Unit Tests", () => {
  test("Executes full evaluation pipeline on synthetic and adversarial benchmarks", () => {
    const report = fullBenchmarkRunner.runFullEvaluation();

    expect(report.syntheticMetrics.totalCount).toBe(5);
    expect(report.syntheticMetrics.highImpactAutoApplyCount).toBe(0); // MUST BE ZERO!
    expect(report.adversarialMetrics.totalAttacks).toBe(4);
    expect(report.adversarialMetrics.blockedRate).toBe(1.0); // 100% attacks blocked!
    expect(report.adversarialMetrics.unsafeAutoApplyCount).toBe(0);
    expect(report.ablationResults["fullPipeline"]).toBeDefined();
  });
});
