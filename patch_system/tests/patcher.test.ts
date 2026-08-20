/**
 * Unit & Security Hardening Tests for TSIF Patch System.
 * Tests self-referential hardening: asserts rejection of disallowed attributes (href, onclick, innerHTML).
 */

import { HardenedPatchEngine } from "../src/patcher";
import { SemanticPatch } from "../src/types";

describe("HardenedPatchEngine Security Tests", () => {
  let engine: HardenedPatchEngine;
  let mockElement: any;

  beforeEach(() => {
    engine = new HardenedPatchEngine();
    const attrs: Record<string, string> = {};
    mockElement = {
      getAttribute: (k: string) => attrs[k] || null,
      setAttribute: (k: string, v: string) => { attrs[k] = v; },
      removeAttribute: (k: string) => { delete attrs[k]; },
      _attrs: attrs
    };
  });

  test("Allows valid ARIA attribute (aria-label)", () => {
    const patch: SemanticPatch = {
      patchId: "p1",
      issueType: "button-name",
      targetFingerprint: "fp1",
      targetSelector: "button#submit",
      attribute: "aria-label",
      previousValue: null,
      proposedValue: "Close Window",
      evidence: ["Icon: X"],
      trustScore: 0.95,
      crcThresholdUsed: 0.85,
      decision: "auto",
      modelVersion: "mock-v1",
      timestamp: new Date().toISOString(),
      status: "applied"
    };

    const res = engine.applyPatch(mockElement as any, patch);
    expect(res.success).toBe(true);
    expect(mockElement.getAttribute("aria-label")).toBe("Close Window");
    expect(mockElement.getAttribute("data-tsif-patched")).toBe("true");
  });

  test("Self-referential hardening: Rejects disallowed attribute 'href' at runtime", () => {
    const maliciousPatch: any = {
      patchId: "p_bad_1",
      issueType: "link-name",
      targetFingerprint: "fp_bad",
      targetSelector: "a#login",
      attribute: "href", // Disallowed!
      previousValue: "/login",
      proposedValue: "https://attacker.com/phish",
      evidence: [],
      trustScore: 0.99,
      crcThresholdUsed: 0.85,
      decision: "auto",
      modelVersion: "mock-v1",
      timestamp: new Date().toISOString(),
      status: "applied"
    };

    const res = engine.applyPatch(mockElement as any, maliciousPatch);
    expect(res.success).toBe(false);
    expect(res.status).toBe("rejected");
    expect(res.error).toContain("Disallowed patch attribute 'href'");
    expect(mockElement.getAttribute("href")).toBeNull();
  });

  test("Self-referential hardening: Rejects disallowed attribute 'onclick' at runtime", () => {
    const maliciousPatch: any = {
      patchId: "p_bad_2",
      issueType: "button-name",
      targetFingerprint: "fp_bad2",
      targetSelector: "button",
      attribute: "onclick", // Disallowed!
      previousValue: null,
      proposedValue: "alert('hacked')",
      evidence: [],
      trustScore: 0.99,
      crcThresholdUsed: 0.85,
      decision: "auto",
      modelVersion: "mock-v1",
      timestamp: new Date().toISOString(),
      status: "applied"
    };

    const res = engine.applyPatch(mockElement as any, maliciousPatch);
    expect(res.success).toBe(false);
    expect(res.status).toBe("rejected");
    expect(res.error).toContain("Disallowed patch attribute 'onclick'");
  });

  test("Supports 100% clean patch revert", () => {
    const patch: SemanticPatch = {
      patchId: "p_revert",
      issueType: "img-alt",
      targetFingerprint: "fp_rev",
      targetSelector: "img",
      attribute: "alt",
      previousValue: "Old Alt Text",
      proposedValue: "New Alt Text",
      evidence: [],
      trustScore: 0.90,
      crcThresholdUsed: 0.85,
      decision: "auto",
      modelVersion: "mock-v1",
      timestamp: new Date().toISOString(),
      status: "applied"
    };

    engine.applyPatch(mockElement as any, patch);
    expect(mockElement.getAttribute("alt")).toBe("New Alt Text");

    engine.revertPatch(mockElement as any, patch);
    expect(mockElement.getAttribute("alt")).toBe("Old Alt Text");
    expect(mockElement.getAttribute("data-tsif-patched")).toBeNull();
  });

  test("Yields and invalidates on live page DOM reclaim", () => {
    const patch: SemanticPatch = {
      patchId: "p_yield",
      issueType: "img-alt",
      targetFingerprint: "fp_yield",
      targetSelector: "img",
      attribute: "alt",
      previousValue: null,
      proposedValue: "Patch Alt",
      evidence: [],
      trustScore: 0.90,
      crcThresholdUsed: 0.85,
      decision: "auto",
      modelVersion: "mock-v1",
      timestamp: new Date().toISOString(),
      status: "applied"
    };

    engine.applyPatch(mockElement as any, patch);
    // Simulate live page mutating alt back to something else
    mockElement.setAttribute("alt", "Page Reclaimed Alt");

    const yielded = engine.checkAndYieldOnReclaim(mockElement as any, patch);
    expect(yielded).toBe(true);
    expect(patch.status).toBe("invalidated");
  });
});
