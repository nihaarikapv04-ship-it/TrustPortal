import { describe, test, expect } from "vitest";
import { MinimalContextExtractor } from "../src/extractor";
describe("MinimalContextExtractor Budget & Attribute Tests", () => {
    const extractor = new MinimalContextExtractor();
    test("Extracts bounded safe context and filters out unallowed attributes (value, onclick, style)", () => {
        const res = extractor.extract({
            issueType: "button-name",
            ruleId: "RULE_BUTTON_NAME_MISSING",
            elementRole: "button",
            rawAttributes: {
                id: "btn_1",
                "aria-describedby": "help_text",
                value: "SUPER_SECRET_USER_INPUT", // Must be excluded!
                onclick: "alert('xss')", // Must be excluded!
                style: "display:block" // Must be excluded!
            },
            visibleElementText: "Download Application Form",
            nearestHeading: "Public Housing Welfare Scheme 2026 Guidelines",
            url: "https://seva.gov.in/housing/apply?token=SECRET_123"
        });
        const ctx = res.safeContext;
        expect(ctx.safeAttributes["value"]).toBeUndefined();
        expect(ctx.safeAttributes["onclick"]).toBeUndefined();
        expect(ctx.safeAttributes["style"]).toBeUndefined();
        expect(ctx.safeAttributes["aria-describedby"]).toBe("help_text");
        expect(ctx.visibleElementText).toBe("Download Application Form");
        // URL query token secret must be stripped!
        expect(ctx.urlOrigin).toBe("https://seva.gov.in/housing/apply");
    });
    test("Strictly enforces character budgets on large context strings", () => {
        const hugeHeading = "A".repeat(500);
        const res = extractor.extract({
            issueType: "img-alt",
            ruleId: "RULE_IMG_ALT_MISSING",
            elementRole: "img",
            rawAttributes: { src: "/banner.svg" },
            nearestHeading: hugeHeading,
            url: "https://seva.gov.in/about"
        });
        expect(res.safeContext.nearestHeading.length).toBeLessThanOrEqual(205); // Truncated to 200 + '...'
        expect(res.safeContext.nearestHeading).toContain("...");
    });
});
