"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const rules_1 = require("@trustportal/rules");
(0, vitest_1.describe)("E2E Test: Dynamic DOM Defect Detection", () => {
    const detector = new rules_1.DeterministicDetector();
    (0, vitest_1.test)("Detects dynamic-button inserted after 2-second timer", () => {
        const dynamicElement = {
            tag: "button",
            id: "dynamic-button",
            attributes: { "data-trustportal-test": "dynamic-button" },
            textContent: "" // Icon-only SVG button without accessible name!
        };
        const candidates = detector.scan([dynamicElement]);
        (0, vitest_1.expect)(candidates.length).toBe(1);
        (0, vitest_1.expect)(candidates[0].issueType).toBe("button-name");
        (0, vitest_1.expect)(candidates[0].ruleId).toBe("RULE_BUTTON_NAME_MISSING");
    });
});
