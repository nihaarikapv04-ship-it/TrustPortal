import { describe, test, expect } from "vitest";
import { EvaluationRunner, BenchmarkItem } from "../src/index.js";
import { SafeContext } from "@trustportal/schemas";

describe("Evaluation Package Scaffolding Unit Tests", () => {
  const runner = new EvaluationRunner();

  const mockBenchmark: BenchmarkItem[] = [
    {
      itemId: "bm_1",
      context: {
        issueType: "button-name",
        ruleId: "RULE_BUTTON_NAME_MISSING",
        elementRole: "button",
        safeAttributes: {},
        visibleElementText: "Download Form",
        associatedLabel: "",
        nearestHeading: "Applications",
        nearestLandmark: "main",
        boundedNearbyText: "",
        urlOrigin: "https://seva.gov.in/housing",
        coarsePageCategory: "public-information",
        language: "en",
        redactionFlags: []
      },
      proposedLabel: "Download Application Form",
      modelConfidence: 0.95,
      groundTruthLabel: "Download Application Form",
      isCorrect: true
    }
  ];

  test("Runs benchmark evaluation and computes accuracy and ECE", () => {
    const res = runner.runAblation(mockBenchmark);
    expect(res.totalItems).toBe(1);
    expect(res.autoAcceptCount + res.confirmCount + res.rejectCount).toBe(1);
    expect(res.ece).toBeGreaterThanOrEqual(0.0);
  });
});
