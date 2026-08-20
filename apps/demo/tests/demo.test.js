import { describe, test, expect } from "vitest";
import { DeterministicDetector } from "@trustportal/rules";
describe("SevaConnect Demo Fixture Integrity & Detector Tests", () => {
    const detector = new DeterministicDetector();
    test("Correctly detects missing image alt fixture", () => {
        const elements = [
            { tag: "img", id: "missing_alt_img", attributes: { src: "/banner.svg" } }
        ];
        const candidates = detector.scan(elements);
        expect(candidates.length).toBe(1);
        expect(candidates[0].issueType).toBe("img-alt");
    });
    test("Correctly detects filename alt fixture (IMG_1042.jpg)", () => {
        const elements = [
            { tag: "img", id: "fn_alt_img", attributes: { src: "/photo.jpg", alt: "IMG_1042.jpg" } }
        ];
        const candidates = detector.scan(elements);
        expect(candidates.length).toBe(1);
        expect(candidates[0].ruleId).toBe("RULE_IMG_ALT_FILENAME");
    });
    test("Correctly detects unnamed icon-only button fixture", () => {
        const elements = [
            { tag: "button", id: "unnamed_btn", attributes: {}, textContent: "" }
        ];
        const candidates = detector.scan(elements);
        expect(candidates.length).toBe(1);
        expect(candidates[0].issueType).toBe("button-name");
    });
    test("Correctly detects unnamed form control fixture", () => {
        const elements = [
            { tag: "input", id: "unnamed_input", attributes: { type: "text" } }
        ];
        const candidates = detector.scan(elements);
        expect(candidates.length).toBe(1);
        expect(candidates[0].issueType).toBe("form-label");
    });
    test("EXCLUDES sensitive OTP and Payment fixtures", () => {
        const sensitiveElements = [
            { tag: "input", id: "otp_field", attributes: { type: "text", name: "otp" } },
            { tag: "input", id: "cvv_field", attributes: { type: "password", name: "cvv" } }
        ];
        const candidates = detector.scan(sensitiveElements);
        expect(candidates.length).toBe(0); // Excluded!
    });
    test("EXCLUDES correctly named controls", () => {
        const namedElements = [
            { tag: "button", id: "named_btn", attributes: { "aria-label": "Download Guidelines" } },
            { tag: "a", id: "named_link", textContent: "Read Scheme Terms", attributes: {} },
            { tag: "input", id: "named_inp", labels: ["Applicant Name"], attributes: { type: "text" } }
        ];
        const candidates = detector.scan(namedElements);
        expect(candidates.length).toBe(0); // All correctly named controls ignored!
    });
});
