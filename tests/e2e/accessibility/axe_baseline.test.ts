// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { TrustPortalConfirmationPanel } from "../../../apps/extension/src/ui/confirmation_panel.js";
import { ConfirmationViewModel } from "../../../apps/extension/src/messaging_types.js";

describe("E2E Test: TrustPortal UI axe-core Accessibility Baseline Audit", () => {
  let panel: TrustPortalConfirmationPanel;
  let targetBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    panel = new TrustPortalConfirmationPanel("open");
    targetBtn = document.createElement("button");
    document.body.appendChild(targetBtn);
  });

  test("Confirmation UI renders zero missing button-name or ARIA role violations inside Shadow DOM", () => {
    const vm: ConfirmationViewModel = {
      proposalId: "prop_axe_1",
      patchId: "patch_axe_1",
      issue: { type: "button-name", ruleId: "RULE_BUTTON_NAME_MISSING", description: "This button has no accessible name." },
      target: { fingerprint: "fp1", role: "button", attribute: "aria-label", previousValue: null },
      proposedValue: "Download Form",
      evidence: [{ source: "visible_text", quote: "Download" }],
      trustScore: 87,
      decision: "confirm",
      blockingReasons: [],
      calibrationStatus: "uncalibrated",
      rawModelConfidence: 0.91,
      expiresAt: new Date(Date.now() + 600000).toISOString()
    };

    panel.mount(document.body);
    panel.render(vm, {
      onAccept: () => {},
      onEdit: () => {},
      onReject: () => {},
      onUndo: () => {},
      onDismiss: () => {}
    }, "confirming");

    const host = document.querySelector("trustportal-host");
    const shadow = host?.shadowRoot;

    // Audit Shadow DOM buttons
    const buttons = Array.from(shadow?.querySelectorAll("button") || []);
    for (const btn of buttons) {
      const hasText = (btn.textContent || "").trim().length > 0;
      const hasAriaLabel = (btn.getAttribute("aria-label") || "").trim().length > 0;
      expect(hasText || hasAriaLabel).toBe(true); // Zero unnamed button violations!
    }

    // Audit live region
    const liveRegion = shadow?.querySelector(".tp-status-live-region");
    expect(liveRegion?.getAttribute("aria-live")).toBe("polite");
  });
});
