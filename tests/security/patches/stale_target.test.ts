// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { PatchApplicator } from "../../../apps/extension/src/patches/patch_applicator.js";
import { SemanticPatch } from "@trustportal/schemas";
import { computeTargetFingerprint } from "../../../apps/extension/src/patches/fingerprint.js";

describe("Security Test: Stale DOM Target Validation", () => {
  let patcher: PatchApplicator;
  let targetBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    patcher = new PatchApplicator();
    targetBtn = document.createElement("button");
    targetBtn.id = "btn-orig";
    document.body.appendChild(targetBtn);
  });

  test("Invariant 9: REJECTS patch when target element ID/fingerprint changes after proposal", () => {
    const originalFp = computeTargetFingerprint(targetBtn);

    // Attacker or dynamic script changes target ID before patch application
    targetBtn.id = "btn-modified-by-attacker";

    const patch: SemanticPatch = {
      patchId: "p_stale_1",
      issueType: "button-name",
      targetFingerprint: originalFp, // Stale fingerprint!
      attribute: "aria-label",
      previousValue: null,
      proposedValue: "Download Form",
      evidence: [],
      trustScore: 95,
      decision: "auto",
      modelVersion: "v1"
    };

    const res = patcher.applyPatch(patch, targetBtn);
    expect(res.success).toBe(false);
    expect(res.reason).toBe("fingerprint-mismatch");
    expect(targetBtn.getAttribute("aria-label")).toBeNull();
  });
});
