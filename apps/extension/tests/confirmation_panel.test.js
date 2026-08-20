// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { PanelController } from "../src/ui/panel_controller.js";
import { PatchApplicator } from "../src/patches/patch_applicator.js";
import { PatchLedger } from "../src/patches/patch_ledger.js";
import { computeTargetFingerprint } from "../src/patches/fingerprint.js";

describe("TrustPortal Confirmation UI & Workflow Tests", () => {
  let targetBtn;
  let controller;
  let patchApplicator;
  let patchLedger;

  beforeEach(() => {
    document.body.innerHTML = "";
    targetBtn = document.createElement("button");
    targetBtn.id = "download-btn";
    targetBtn.innerHTML = `<svg width="20" height="20"><path d="M0 0h20v20H0z"/></svg>`;
    document.body.appendChild(targetBtn);

    patchApplicator = new PatchApplicator();
    patchLedger = new PatchLedger();
    controller = new PanelController(patchApplicator, patchLedger);
  });

  test("Mounts Shadow DOM panel and renders ConfirmationViewModel", () => {
    const fp = computeTargetFingerprint(targetBtn);
    const vm = {
      proposalId: "prop_101",
      patchId: "patch_101",
      issue: { type: "button-name", ruleId: "RULE_BUTTON_NAME_MISSING", description: "This button has no accessible name." },
      target: { fingerprint: fp, role: "button", attribute: "aria-label", previousValue: null },
      proposedValue: "Download Application Form",
      evidence: [{ source: "visible_text", quote: "Download" }],
      trustScore: 87,
      decision: "confirm",
      blockingReasons: ["Trust score below auto threshold"],
      calibrationStatus: "uncalibrated",
      rawModelConfidence: 0.91,
      expiresAt: new Date(Date.now() + 600000).toISOString()
    };

    controller.showProposal(vm, targetBtn);

    const host = document.querySelector("trustportal-host");
    expect(host).not.toBeNull();
    const shadow = host?.shadowRoot;
    expect(shadow).not.toBeNull();

    expect(shadow?.querySelector("#tp-card-header-title")?.textContent).toContain("TrustPortal");
    expect(shadow?.textContent).toContain("This button has no accessible name.");
    expect(shadow?.textContent).toContain("Trust Score: 87 / 100");
  });

  test("Accept action invokes PatchApplicator and updates target DOM attribute", () => {
    const fp = computeTargetFingerprint(targetBtn);
    const vm = {
      proposalId: "prop_102",
      patchId: "patch_102",
      issue: { type: "button-name", ruleId: "RULE_BUTTON_NAME_MISSING", description: "This button has no accessible name." },
      target: { fingerprint: fp, role: "button", attribute: "aria-label", previousValue: null },
      proposedValue: "Download Application Form",
      evidence: [],
      trustScore: 87,
      decision: "confirm",
      blockingReasons: [],
      calibrationStatus: "uncalibrated",
      rawModelConfidence: 0.91,
      expiresAt: new Date(Date.now() + 600000).toISOString()
    };

    controller.showProposal(vm, targetBtn);

    const host = document.querySelector("trustportal-host");
    const shadow = host?.shadowRoot;
    const acceptBtn = shadow?.querySelectorAll("button")[1];
    acceptBtn?.click();

    expect(targetBtn.getAttribute("aria-label")).toBe("Download Application Form");
    expect(patchLedger.getPatchStatus("patch_102")).toBe("injected");
  });
});
