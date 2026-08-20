// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { PatchApplicator } from "../../../apps/extension/src/patches/patch_applicator.js";
import { PatchLedger } from "../../../apps/extension/src/patches/patch_ledger.js";
import { SemanticPatch } from "@trustportal/schemas";
import { computeTargetFingerprint } from "../../../apps/extension/src/patches/fingerprint.js";

describe("E2E Test: Proposal Undo / Revert Workflow", () => {
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

  test("Undo restores original DOM state cleanly", () => {
    const fp = computeTargetFingerprint(targetBtn);
    const patch: SemanticPatch = {
      patchId: "patch_undo_1",
      issueType: "button-name",
      targetFingerprint: fp,
      attribute: "aria-label",
      previousValue: null,
      proposedValue: "Download Form",
      evidence: [],
      trustScore: 87,
      decision: "confirm",
      modelVersion: "v1"
    };

    // 1. Apply Patch
    patcher.applyPatch(patch, targetBtn);
    expect(targetBtn.getAttribute("aria-label")).toBe("Download Form");

    // 2. Revert Patch
    const revertRes = patcher.revertPatch("patch_undo_1", targetBtn);
    expect(revertRes.success).toBe(true);

    // Target attribute MUST be restored to original null state!
    expect(targetBtn.getAttribute("aria-label")).toBeNull();

    ledger.recordReverted("patch_undo_1", targetBtn);
    expect(ledger.getPatchStatus("patch_undo_1")).toBe("reverted");
  });
});
