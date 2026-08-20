import { describe, test, expect } from "vitest";
import { MinimalContextExtractor } from "@trustportal/redaction";

describe("Security Test: SafeContext Character Budget & Serialization Limits", () => {
  const extractor = new MinimalContextExtractor();

  test("Invariant 5: Enforces character budgets on oversized headings and text fields", () => {
    const hugeText = "A".repeat(2000);
    const res = extractor.extract({
      issueType: "button-name",
      ruleId: "RULE_BUTTON_NAME_MISSING",
      elementRole: "button",
      rawAttributes: { id: "btn_1" },
      visibleElementText: hugeText,
      nearestHeading: hugeText,
      url: "https://seva.gov.in/portal"
    });

    const ctx = res.safeContext;
    expect(ctx.visibleElementText.length).toBeLessThanOrEqual(155); // 150 + '...'
    expect(ctx.nearestHeading.length).toBeLessThanOrEqual(205); // 200 + '...'
  });

  test("Invariant 1: Excludes forbidden DOM attributes (value, onclick, style, innerHTML)", () => {
    const res = extractor.extract({
      issueType: "form-label",
      ruleId: "RULE_FORM_LABEL_MISSING",
      elementRole: "textbox",
      rawAttributes: {
        id: "inp_1",
        value: "SUPER_SECRET_VALUE",
        onclick: "alert(1)",
        style: "display:none",
        "aria-describedby": "help_text"
      },
      url: "https://seva.gov.in/form"
    });

    const attrs = res.safeContext.safeAttributes;
    expect(attrs["value"]).toBeUndefined();
    expect(attrs["onclick"]).toBeUndefined();
    expect(attrs["style"]).toBeUndefined();
    expect(attrs["aria-describedby"]).toBe("help_text");
  });
});
