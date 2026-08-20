// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { PatchApplicator } from "../src/patches/patch_applicator.js";
import { SemanticPatch } from "@trustportal/schemas";

describe("PatchApplicator Security & Reversibility Tests", () => {
  let applicator: PatchApplicator;
  let targetElem: HTMLElement;

  beforeEach(() => {
    applicator = new PatchApplicator();
    targetElem = document.createElement("button");
    targetElem.id = "submit_btn";
    document.body.appendChild(targetElem);
  });

  test("Applies valid button aria-label patch successfully", () => {
    const patch: SemanticPatch = {
      patchId: "p_valid_1",
      issueType: "button-name",
      targetFingerprint: "",
      attribute: "aria-label",
      previousValue: null,
      proposedValue: "Download Application Form",
      evidence: [{ source: "visible_text", quote: "Download" }],
      trustScore: 92,
      decision: "auto",
      modelVersion: "mock-v1"
    };

    const res = applicator.applyPatch(patch, targetElem);
    expect(res.success).toBe(true);
    expect(targetElem.getAttribute("aria-label")).toBe("Download Application Form");
    expect(targetElem.getAttribute("data-tsif-patched")).toBe("true");
  });

  test("REJECTS invalid attribute 'href' (Self-Referential Hardening)", () => {
    const maliciousPatch: any = {
      patchId: "p_bad_href",
      issueType: "link-name",
      targetFingerprint: "",
      attribute: "href", // Forbidden!
      previousValue: "/login",
      proposedValue: "https://phishing.site/login",
      evidence: [],
      trustScore: 99,
      decision: "auto"
    };

    const res = applicator.applyPatch(maliciousPatch, targetElem);
    expect(res.success).toBe(false);
    expect(res.reason).toBe("invalid-attribute");
    expect(targetElem.getAttribute("href")).toBeNull();
  });

  test("REJECTS invalid attribute 'onclick'", () => {
    const maliciousPatch: any = {
      patchId: "p_bad_onclick",
      issueType: "button-name",
      targetFingerprint: "",
      attribute: "onclick", // Forbidden!
      previousValue: null,
      proposedValue: "alert('hacked')",
      evidence: [],
      trustScore: 99,
      decision: "auto"
    };

    const res = applicator.applyPatch(maliciousPatch, targetElem);
    expect(res.success).toBe(false);
    expect(res.reason).toBe("invalid-attribute");
  });

  test("REJECTS sensitive context fields (password, OTP, credit card)", () => {
    const passInput = document.createElement("input");
    passInput.type = "password";
    passInput.id = "user_pass";
    document.body.appendChild(passInput);

    const patch: SemanticPatch = {
      patchId: "p_sensitive",
      issueType: "form-label",
      targetFingerprint: "",
      attribute: "aria-label",
      previousValue: null,
      proposedValue: "Enter Password",
      evidence: [],
      trustScore: 85,
      decision: "confirm"
    };

    const res = applicator.applyPatch(patch, passInput);
    expect(res.success).toBe(false);
    expect(res.reason).toBe("sensitive-context");
  });

  test("REJECTS unsafe values with HTML/script tags or prompt injection overrides", () => {
    const xssPatch: SemanticPatch = {
      patchId: "p_xss",
      issueType: "button-name",
      targetFingerprint: "",
      attribute: "aria-label",
      previousValue: null,
      proposedValue: "<script>alert(1)</script> Click",
      evidence: [],
      trustScore: 95,
      decision: "auto"
    };

    const res = applicator.applyPatch(xssPatch, targetElem);
    expect(res.success).toBe(false);
    expect(res.reason).toBe("unsafe-value");
  });

  test("Reverts patch 100% cleanly restoring exact previous state", () => {
    targetElem.setAttribute("aria-label", "Original Label");

    const patch: SemanticPatch = {
      patchId: "p_revert_test",
      issueType: "button-name",
      targetFingerprint: "",
      attribute: "aria-label",
      previousValue: "Original Label",
      proposedValue: "Patched Label",
      evidence: [],
      trustScore: 90,
      decision: "auto"
    };

    const applyRes = applicator.applyPatch(patch, targetElem);
    expect(applyRes.success).toBe(true);
    expect(targetElem.getAttribute("aria-label")).toBe("Patched Label");

    const revertRes = applicator.revertPatch(patch.patchId, targetElem);
    expect(revertRes.success).toBe(true);
    expect(targetElem.getAttribute("aria-label")).toBe("Original Label");
    expect(targetElem.getAttribute("data-tsif-patched")).toBeNull();
  });

  test("Conflict Resolution: Yields without overwriting if live page modified attribute", () => {
    const patch: SemanticPatch = {
      patchId: "p_conflict_test",
      issueType: "button-name",
      targetFingerprint: "",
      attribute: "aria-label",
      previousValue: null,
      proposedValue: "TSIF Label",
      evidence: [],
      trustScore: 90,
      decision: "auto"
    };

    applicator.applyPatch(patch, targetElem);
    expect(targetElem.getAttribute("aria-label")).toBe("TSIF Label");

    // Simulate live page script changing attribute to something else
    targetElem.setAttribute("aria-label", "Live Page Changed Label");

    const revertRes = applicator.revertPatch(patch.patchId, targetElem);
    expect(revertRes.success).toBe(false);
    expect(revertRes.reason).toBe("conflict");
    // Assert TSIF did NOT overwrite the live page's newer change!
    expect(targetElem.getAttribute("aria-label")).toBe("Live Page Changed Label");
  });
});
