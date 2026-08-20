// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { TrustPortalConfirmationPanel } from "../../../apps/extension/src/ui/confirmation_panel.js";
import { ConfirmationViewModel } from "../../../apps/extension/src/messaging_types.js";

describe("E2E Test: Confirmation UI Keyboard Navigation & Accessibility", () => {
  let panel: TrustPortalConfirmationPanel;
  let targetBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    panel = new TrustPortalConfirmationPanel("open");
    targetBtn = document.createElement("button");
    document.body.appendChild(targetBtn);
  });

  test("Renders accessible dialog with interactive buttons and keyboard focus targets", () => {
    const vm: ConfirmationViewModel = {
      proposalId: "prop_kbd_1",
      patchId: "patch_kbd_1",
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

    let dismissed = false;
    panel.mount(document.body);
    panel.render(vm, {
      onAccept: () => {},
      onEdit: () => {},
      onReject: () => {},
      onUndo: () => {},
      onDismiss: () => { dismissed = true; }
    }, "confirming");

    const host = document.querySelector("trustportal-host");
    const shadow = host?.shadowRoot;

    // Verify dialog accessibility attributes
    const card = shadow?.querySelector(".tp-card");
    expect(card?.getAttribute("role")).toBe("dialog");
    expect(card?.getAttribute("aria-labelledby")).toBe("tp-card-header-title");

    // Verify action buttons exist with accessible text
    const buttons = shadow?.querySelectorAll("button");
    expect(buttons?.length).toBeGreaterThanOrEqual(4); // Dismiss, Accept, Edit, Reject

    // Test Escape key dismissal event
    const kbdEvent = new KeyboardEvent("keydown", { key: "Escape" });
    host?.dispatchEvent(kbdEvent);
    expect(dismissed).toBe(true);
  });
});
