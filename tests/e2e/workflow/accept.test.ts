// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { PatchApplicator } from "../../../apps/extension/src/patches/patch_applicator.js";
import { PatchLedger } from "../../../apps/extension/src/patches/patch_ledger.js";
import { SemanticPatch } from "@trustportal/schemas";
import { computeTargetFingerprint } from "../../../apps/extension/src/patches/fingerprint.js";

describe("E2E Test: Proposal Accept Workflow & Reversible Patch Application", () => {
  let patcher: PatchApplicator;
  let ledger: PatchLedger;
  let targetBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    patcher = new PatchApplicator();
    ledger = new PatchLedger();

    targetBtn = document.createElement("button");
    targetBtn.id = "unnamed-button";
    targetBtn.innerHTML = `<svg width="20" height="20"><path d="M0 0h20v20H0z"/></svg>`;
    document.body.appendChild(targetBtn);
  });

  test("Accepting proposal applies aria-label safely and records in ledger", () => {
    const fp = computeTargetFingerprint(targetBtn);
    const patch: SemanticPatch = {
      patchId: "patch_accept_1",
      issueType: "button-name",
      targetFingerprint: fp,
      attribute: "aria-label",
      previousValue: null,
      proposedValue: "Download Application Form",
      evidence: [{ source: "visible_text", quote: "Download" }],
      trustScore: 87,
      decision: "confirm",
      modelVersion: "v1.0.0"
    };

    const res = patcher.applyPatch(patch, targetBtn);
    expect(res.success).toBe(true);

    // Verify target attribute changed safely
    expect(targetBtn.getAttribute("aria-label")).toBe("Download Application Form");

    // Verify non-target attributes remain completely untouched
    expect(targetBtn.id).toBe("unnamed-button");
    expect(targetBtn.getAttribute("href")).toBeNull();

    // Verify Ledger status
    ledger.recordProposed(patch, targetBtn);
    ledger.recordInjected("patch_accept_1", targetBtn);
    expect(ledger.getPatchStatus("patch_accept_1")).toBe("injected");
  });
});
