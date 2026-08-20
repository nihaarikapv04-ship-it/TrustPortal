import { describe, test, expect } from "vitest";
import { AccessibleNameComputer } from "../src/acc_name";
describe("AccessibleNameComputer Unit Tests", () => {
    test("Computes name from aria-label", () => {
        const comp = new AccessibleNameComputer();
        const elem = {
            tag: "button",
            attributes: { "aria-label": "Close Modal Window" }
        };
        expect(comp.computeName(elem)).toBe("Close Modal Window");
    });
    test("Computes name from aria-labelledby reference map", () => {
        const domMap = {
            label_1: { tag: "span", textContent: "Shipping Address" }
        };
        const comp = new AccessibleNameComputer(domMap);
        const elem = {
            tag: "input",
            attributes: { "aria-labelledby": "label_1" }
        };
        expect(comp.computeName(elem)).toBe("Shipping Address");
    });
    test("Computes name from img alt attribute", () => {
        const comp = new AccessibleNameComputer();
        const elem = {
            tag: "img",
            attributes: { src: "/hero.png", alt: "Company Logo" }
        };
        expect(comp.computeName(elem)).toBe("Company Logo");
    });
    test("Returns empty string for decorative alt=''", () => {
        const comp = new AccessibleNameComputer();
        const elem = {
            tag: "img",
            attributes: { src: "/decorative.png", alt: "" }
        };
        expect(comp.computeName(elem)).toBe("");
    });
});
