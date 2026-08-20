// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { TrustPortalConfirmationPanel } from "../../../apps/extension/src/ui/confirmation_panel.js";
import { ConfirmationViewModel } from "../../../apps/extension/src/messaging_types.js";

describe("E2E Test: Confirmation UI Safe Text Node Rendering & XSS Defense", () => {
  let panel: TrustPortalConfirmationPanel;
  let targetBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    panel = new TrustPortalConfirmationPanel("open");
    targetBtn = document.createElement("button");
    document.body.appendChild(targetBtn);
  });

  test("Renders malicious proposal string safely as literal text without executing script nodes", () => {
    const maliciousLabel = "<script>alert('xss_attack')</script> Download";
    const vm: ConfirmationViewModel = {
      proposalId: "prop_xss_1",
      patchId: "patch_xss_1",
      issue: { type: "button-name", ruleId: "RULE_BUTTON_NAME_MISSING", description: "<img src=x onerror=alert(1)> Issue" },
      target: { fingerprint: "fp1", role: "button", attribute: "aria-label", previousValue: null },
      proposedValue: maliciousLabel,
      evidence: [{ source: "visible_text", quote: "<script>alert(1)</script>" }],
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

    // Verify zero <script> elements rendered inside Shadow DOM
    expect(shadow?.querySelectorAll("script").length).toBe(0);
    expect(shadow?.textContent).toContain("<script>alert('xss_attack')</script>");
  });
});
