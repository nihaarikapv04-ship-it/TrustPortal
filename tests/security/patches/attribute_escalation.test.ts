// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { PatchApplicator } from "../../../apps/extension/src/patches/patch_applicator.js";
import { SemanticPatch } from "@trustportal/schemas";
import { computeTargetFingerprint } from "../../../apps/extension/src/patches/fingerprint.js";

describe("Security Test: Patch Applicator Attribute Escalation & Confinement", () => {
  let patcher: PatchApplicator;
  let targetBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    patcher = new PatchApplicator();
    targetBtn = document.createElement("button");
    targetBtn.id = "test-btn";
    document.body.appendChild(targetBtn);
  });

  test("Invariant 1 & 2: REJECTS patch attempt on forbidden attribute 'href'", () => {
    const fp = computeTargetFingerprint(targetBtn);
    const patch: SemanticPatch = {
      patchId: "p_attack_1",
      issueType: "button-name",
      targetFingerprint: fp,
      attribute: "href" as any, // Illegal escalation attempt!
      previousValue: null,
      proposedValue: "https://evil.com",
      evidence: [],
      trustScore: 95,
      decision: "auto",
      modelVersion: "v1"
    };

    const res = patcher.applyPatch(patch, targetBtn);
    expect(res.success).toBe(false);
    expect(res.reason).toBe("invalid-attribute");
    expect(targetBtn.getAttribute("href")).toBeNull();
  });

  test("Invariant 1 & 3: REJECTS patch attempt on forbidden attribute 'onclick'", () => {
    const fp = computeTargetFingerprint(targetBtn);
    const patch: SemanticPatch = {
      patchId: "p_attack_2",
      issueType: "button-name",
      targetFingerprint: fp,
      attribute: "onclick" as any, // Illegal escalation attempt!
      previousValue: null,
      proposedValue: "alert(1)",
      evidence: [],
      trustScore: 95,
      decision: "auto",
      modelVersion: "v1"
    };

    const res = patcher.applyPatch(patch, targetBtn);
    expect(res.success).toBe(false);
    expect(res.reason).toBe("invalid-attribute");
    expect(targetBtn.getAttribute("onclick")).toBeNull();
  });

  test("Invariant 1 & 3: REJECTS patch attempt on forbidden attribute 'style'", () => {
    const fp = computeTargetFingerprint(targetBtn);
    const patch: SemanticPatch = {
      patchId: "p_attack_3",
      issueType: "button-name",
      targetFingerprint: fp,
      attribute: "style" as any, // Illegal escalation attempt!
      previousValue: null,
      proposedValue: "display:none",
      evidence: [],
      trustScore: 95,
      decision: "auto",
      modelVersion: "v1"
    };

    const res = patcher.applyPatch(patch, targetBtn);
    expect(res.success).toBe(false);
    expect(res.reason).toBe("invalid-attribute");
    expect(targetBtn.getAttribute("style")).toBeNull();
  });

  test("Invariant 1: Accepts valid allowlisted attribute 'aria-label'", () => {
    const fp = computeTargetFingerprint(targetBtn);
    const patch: SemanticPatch = {
      patchId: "p_valid_1",
      issueType: "button-name",
      targetFingerprint: fp,
      attribute: "aria-label",
      previousValue: null,
      proposedValue: "Download Application Form",
      evidence: [],
      trustScore: 95,
      decision: "auto",
      modelVersion: "v1"
    };

    const res = patcher.applyPatch(patch, targetBtn);
    expect(res.success).toBe(true);
    expect(targetBtn.getAttribute("aria-label")).toBe("Download Application Form");
  });
});
