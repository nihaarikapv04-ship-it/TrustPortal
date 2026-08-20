import { describe, test, expect } from "vitest";
import { DeterministicDetector, ElementRepresentation } from "@trustportal/rules";

describe("E2E Test: Dynamic DOM Defect Detection", () => {
  const detector = new DeterministicDetector();

  test("Detects dynamic-button inserted after 2-second timer", () => {
    const dynamicElement: ElementRepresentation = {
      tag: "button",
      id: "dynamic-button",
      attributes: { "data-trustportal-test": "dynamic-button" },
      textContent: "" // Icon-only SVG button without accessible name!
    };

    const candidates = detector.scan([dynamicElement]);
    expect(candidates.length).toBe(1);
    expect(candidates[0].issueType).toBe("button-name");
    expect(candidates[0].ruleId).toBe("RULE_BUTTON_NAME_MISSING");
  });
});
