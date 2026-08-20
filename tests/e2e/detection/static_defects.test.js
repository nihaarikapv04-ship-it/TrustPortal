"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const rules_1 = require("@trustportal/rules");
(0, vitest_1.describe)("E2E Test: Static Accessibility Defect Detection", () => {
    const detector = new rules_1.DeterministicDetector();
    (0, vitest_1.test)("Detects missing alt, filename alt, unnamed button, link, and form control", () => {
        const demoElements = [
            { tag: "img", id: "missing-image-alt", attributes: { src: "/banner.svg" } },
            { tag: "img", id: "filename-alt", attributes: { src: "/photo.jpg", alt: "IMG_1042.jpg" } },
            { tag: "button", id: "unnamed-button", attributes: {}, textContent: "" },
            { tag: "a", id: "unnamed-link", attributes: { href: "#search" }, textContent: "" },
            { tag: "input", id: "unnamed-form", attributes: { type: "text" } }
        ];
        const candidates = detector.scan(demoElements);
        (0, vitest_1.expect)(candidates.length).toBe(5);
        const issueTypes = candidates.map((c) => c.issueType);
        (0, vitest_1.expect)(issueTypes).toContain("img-alt");
        (0, vitest_1.expect)(issueTypes).toContain("button-name");
        (0, vitest_1.expect)(issueTypes).toContain("link-name");
        (0, vitest_1.expect)(issueTypes).toContain("form-label");
    });
    (0, vitest_1.test)("Excludes correctly named elements and decorative images", () => {
        const validElements = [
            { tag: "img", id: "decorative-image", attributes: { role: "presentation", alt: "" } },
            { tag: "img", id: "correct-image", attributes: { alt: "Official Government Emblem" } },
            { tag: "button", id: "named-button", attributes: { "aria-label": "Download Form" } },
            { tag: "a", id: "named-link", textContent: "Read Scheme Terms", attributes: {} }
        ];
        const candidates = detector.scan(validElements);
        (0, vitest_1.expect)(candidates.length).toBe(0); // All correctly formatted controls ignored!
    });
});
