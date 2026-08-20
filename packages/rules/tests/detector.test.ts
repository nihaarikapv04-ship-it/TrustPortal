import { describe, test, expect } from "vitest";
import { DeterministicDetector } from "../src/detector";
import { ElementRepresentation } from "../src/acc_name";

describe("DeterministicDetector Unit Tests", () => {
  const detector = new DeterministicDetector();

  test("Flags missing img alt defect", () => {
    const elements: ElementRepresentation[] = [
      { tag: "img", id: "img1", attributes: { src: "/banner.png" } } // Defect!
    ];
    const candidates = detector.scan(elements);
    expect(candidates.length).toBe(1);
    expect(candidates[0].ruleId).toBe("RULE_IMG_ALT_MISSING");
    expect(candidates[0].issueType).toBe("img-alt");
  });

  test("Flags suspicious filename alt text (IMG_1042.jpg)", () => {
    const elements: ElementRepresentation[] = [
      { tag: "img", id: "img2", attributes: { src: "/pic.png", alt: "IMG_1042.jpg" } } // Defect!
    ];
    const candidates = detector.scan(elements);
    expect(candidates.length).toBe(1);
    expect(candidates[0].ruleId).toBe("RULE_IMG_ALT_FILENAME");
  });

  test("Flags unnamed button defect", () => {
    const elements: ElementRepresentation[] = [
      { tag: "button", id: "btn1", attributes: {}, textContent: "" } // Defect!
    ];
    const candidates = detector.scan(elements);
    expect(candidates.length).toBe(1);
    expect(candidates[0].ruleId).toBe("RULE_BUTTON_NAME_MISSING");
    expect(candidates[0].issueType).toBe("button-name");
  });

  test("Flags unnamed form control defect", () => {
    const elements: ElementRepresentation[] = [
      { tag: "input", id: "inp1", attributes: { type: "text" } } // Defect!
    ];
    const candidates = detector.scan(elements);
    expect(candidates.length).toBe(1);
    expect(candidates[0].ruleId).toBe("RULE_FORM_LABEL_MISSING");
    expect(candidates[0].issueType).toBe("form-label");
  });

  test("EXCLUDES sensitive fields (password, OTP, credit card)", () => {
    const elements: ElementRepresentation[] = [
      { tag: "input", id: "pass", attributes: { type: "password" } },
      { tag: "input", id: "otp_field", attributes: { type: "text", name: "otp" } },
      { tag: "input", id: "cvv_field", attributes: { type: "text", name: "cvv" } }
    ];
    const candidates = detector.scan(elements);
    expect(candidates.length).toBe(0); // All sensitive fields excluded!
  });

  test("EXCLUDES hidden and decorative elements", () => {
    const elements: ElementRepresentation[] = [
      { tag: "img", id: "hidden_img", attributes: { src: "/bg.png", "aria-hidden": "true" } },
      { tag: "img", id: "deco_img", role: "presentation", attributes: { src: "/bg2.png" } }
    ];
    const candidates = detector.scan(elements);
    expect(candidates.length).toBe(0); // All hidden/decorative excluded!
  });
});
