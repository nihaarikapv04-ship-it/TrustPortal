// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { PatchApplicator } from "../../../apps/extension/src/patches/patch_applicator.js";
import { PatchLedger } from "../../../apps/extension/src/patches/patch_ledger.js";
import { SemanticPatch } from "@trustportal/schemas";
import { computeTargetFingerprint } from "../../../apps/extension/src/patches/fingerprint.js";

describe("E2E Test: Stale & Conflict Workflows", () => {
  let patcher: PatchApplicator;
  let ledger: PatchLedger;
  let targetBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    patcher = new PatchApplicator();
    ledger = new PatchLedger();

    targetBtn = document.createElement("button");
    targetBtn.id = "target-btn";
    document.body.appendChild(targetBtn);
  });

  test("Conflict: External attribute update prevents overwrite during revert and yields conflict", () => {
    const fp = computeTargetFingerprint(targetBtn);
    const patch: SemanticPatch = {
      patchId: "patch_conflict_1",
      issueType: "button-name",
      targetFingerprint: fp,
      attribute: "aria-label",
      previousValue: null,
      proposedValue: "TrustPortal Applied Label",
      evidence: [],
      trustScore: 87,
      decision: "confirm",
      modelVersion: "v1"
    };

    patcher.applyPatch(patch, targetBtn);
    expect(targetBtn.getAttribute("aria-label")).toBe("TrustPortal Applied Label");

    // External script modifies attribute after patch application
    targetBtn.setAttribute("aria-label", "External Script Updated Label");

    // Revert attempt MUST yield conflict and preserve external update!
    const revertRes = patcher.revertPatch("patch_conflict_1", targetBtn);
    expect(revertRes.success).toBe(false);
    expect(revertRes.reason).toBe("conflict");

    expect(targetBtn.getAttribute("aria-label")).toBe("External Script Updated Label");

    ledger.recordConflict("patch_conflict_1", targetBtn);
    expect(ledger.getPatchStatus("patch_conflict_1")).toBe("conflict");
  });
});
