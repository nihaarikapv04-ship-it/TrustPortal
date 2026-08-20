// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { PatchApplicator } from "../../../apps/extension/src/patches/patch_applicator.js";
import { PatchLedger } from "../../../apps/extension/src/patches/patch_ledger.js";
import { SemanticPatch } from "@trustportal/schemas";
import { computeTargetFingerprint } from "../../../apps/extension/src/patches/fingerprint.js";

describe("E2E Test: Proposal Edit Workflow & Custom Label Application", () => {
  let patcher: PatchApplicator;
  let ledger: PatchLedger;
  let targetBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    patcher = new PatchApplicator();
    ledger = new PatchLedger();

    targetBtn = document.createElement("button");
    targetBtn.id = "unnamed-button";
    document.body.appendChild(targetBtn);
  });

  test("Applies user-edited custom label safely to DOM", () => {
    const fp = computeTargetFingerprint(targetBtn);
    const editedLabel = "Download Application Documents"; // User-edited label

    const patch: SemanticPatch = {
      patchId: "patch_edit_1",
      issueType: "button-name",
      targetFingerprint: fp,
      attribute: "aria-label",
      previousValue: null,
      proposedValue: editedLabel,
      evidence: [{ source: "visible_text", quote: "Download" }],
      trustScore: 87,
      decision: "confirm",
      modelVersion: "user-edited"
    };

    const res = patcher.applyPatch(patch, targetBtn);
    expect(res.success).toBe(true);

    expect(targetBtn.getAttribute("aria-label")).toBe("Download Application Documents");
  });
});
