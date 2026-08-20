import { describe, test, expect } from "vitest";
import { DeterministicDetector, ElementRepresentation } from "@trustportal/rules";

describe("E2E Test: Static Accessibility Defect Detection", () => {
  const detector = new DeterministicDetector();

  test("Detects missing alt, filename alt, unnamed button, link, and form control", () => {
    const demoElements: ElementRepresentation[] = [
      { tag: "img", id: "missing-image-alt", attributes: { src: "/banner.svg" } },
      { tag: "img", id: "filename-alt", attributes: { src: "/photo.jpg", alt: "IMG_1042.jpg" } },
      { tag: "button", id: "unnamed-button", attributes: {}, textContent: "" },
      { tag: "a", id: "unnamed-link", attributes: { href: "#search" }, textContent: "" },
      { tag: "input", id: "unnamed-form", attributes: { type: "text" } }
    ];

    const candidates = detector.scan(demoElements);
    expect(candidates.length).toBe(5);

    const issueTypes = candidates.map((c) => c.issueType);
    expect(issueTypes).toContain("img-alt");
    expect(issueTypes).toContain("button-name");
    expect(issueTypes).toContain("link-name");
    expect(issueTypes).toContain("form-label");
  });

  test("Excludes correctly named elements and decorative images", () => {
    const validElements: ElementRepresentation[] = [
      { tag: "img", id: "decorative-image", attributes: { role: "presentation", alt: "" } },
      { tag: "img", id: "correct-image", attributes: { alt: "Official Government Emblem" } },
      { tag: "button", id: "named-button", attributes: { "aria-label": "Download Form" } },
      { tag: "a", id: "named-link", textContent: "Read Scheme Terms", attributes: {} }
    ];

    const candidates = detector.scan(validElements);
    expect(candidates.length).toBe(0); // All correctly formatted controls ignored!
  });
});
