// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { PatchApplicator } from "../../../apps/extension/src/patches/patch_applicator.js";
import { SemanticPatch } from "@trustportal/schemas";
import { computeTargetFingerprint } from "../../../apps/extension/src/patches/fingerprint.js";

describe("Security Test: Conflict-Aware Revert Protection", () => {
  let patcher: PatchApplicator;
  let targetBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    patcher = new PatchApplicator();
    targetBtn = document.createElement("button");
    targetBtn.id = "btn-revert-test";
    document.body.appendChild(targetBtn);
  });

  test("Invariant 10: Yields conflict and DOES NOT overwrite live DOM if attribute was modified externally", () => {
    const fp = computeTargetFingerprint(targetBtn);
    const patch: SemanticPatch = {
      patchId: "p_revert_conflict_1",
      issueType: "button-name",
      targetFingerprint: fp,
      attribute: "aria-label",
      previousValue: null,
      proposedValue: "TrustPortal Applied Label",
      evidence: [],
      trustScore: 95,
      decision: "auto",
      modelVersion: "v1"
    };

    // 1. Apply Patch
    patcher.applyPatch(patch, targetBtn);
    expect(targetBtn.getAttribute("aria-label")).toBe("TrustPortal Applied Label");

    // 2. External actor / page script modifies aria-label after patch application
    targetBtn.setAttribute("aria-label", "User / External Script Updated Label");

    // 3. TrustPortal attempts revertPatch
    const revertRes = patcher.revertPatch("p_revert_conflict_1", targetBtn);

    // MUST yield conflict and preserve external modification!
    expect(revertRes.success).toBe(false);
    expect(revertRes.reason).toBe("conflict");
    expect(targetBtn.getAttribute("aria-label")).toBe("User / External Script Updated Label");
  });
});
