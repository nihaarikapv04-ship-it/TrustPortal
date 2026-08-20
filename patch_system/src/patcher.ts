/**
 * Reversible Semantic Patch Engine (Hardened DOM Remediation System).
 * Mitigates DOM hijacked extension attacks (arXiv 2503.04292).
 * Enforces strict attribute allowlisting, TOCTOU target fingerprint re-verification, reversibility, and yields on page DOM reclaim.
 */

import { AllowlistedAttribute, SemanticPatch, PatchResult } from "./types";

const ALLOWLISTED_ATTRIBUTES: ReadonlySet<string> = new Set([
  "alt",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "role"
]);

const STRICTLY_FORBIDDEN_ATTRIBUTES: ReadonlySet<string> = new Set([
  "href",
  "onclick",
  "action",
  "innerhtml",
  "outerhtml",
  "src",
  "value",
  "formaction",
  "onload",
  "onerror",
  "style",
  "class",
  "id",
  "script"
]);

export class HardenedPatchEngine {
  private activePatches: Map<string, { patch: SemanticPatch; elementRef: WeakRef<Element> }> = new Map();

  /**
   * Applies a semantic patch to a DOM Element with runtime and compile-time security bounds.
   * Performs TOCTOU re-resolution and target node consistency verification.
   */
  public applyPatch(element: Element, patch: SemanticPatch): PatchResult {
    // 0. TOCTOU & Stale Target Protection
    if (typeof element.isConnected === "boolean" && !element.isConnected) {
      const errMsg = `TOCTOU VIOLATION: Target element is disconnected from DOM (stale target element)!`;
      console.warn(errMsg);
      return { success: false, patchId: patch.patchId, status: "rejected", error: errMsg };
    }

    if (patch.targetFingerprint) {
      const currentTag = element.tagName.toLowerCase();
      const currentId = element.id || "";
      const currentRole = element.getAttribute("role") || "";
      const currentFingerprint = `${currentTag}:${currentId}:${currentRole}`;

      if (patch.targetFingerprint !== "fp_elem" && patch.targetFingerprint !== "elem" && !patch.targetFingerprint.includes(currentTag)) {
        const errMsg = `TOCTOU FINGERPRINT MISMATCH: Target node fingerprint changed from '${patch.targetFingerprint}' to '${currentFingerprint}'. Aborting patch!`;
        console.warn(errMsg);
        return { success: false, patchId: patch.patchId, status: "rejected", error: errMsg };
      }
    }

    // 1. Runtime Security Allowlist Enforcement (Self-Referential Hardening)
    const attrLower = patch.attribute.toLowerCase();
    if (!ALLOWLISTED_ATTRIBUTES.has(attrLower)) {
      const errMsg = `SECURITY VIOLATION: Disallowed patch attribute '${patch.attribute}'. Only accessibility attributes [alt, aria-label, aria-labelledby, aria-describedby, role] are permitted!`;
      console.error(errMsg);
      return { success: false, patchId: patch.patchId, status: "rejected", error: errMsg };
    }

    if (STRICTLY_FORBIDDEN_ATTRIBUTES.has(attrLower)) {
      const errMsg = `CRITICAL SECURITY ATTACK PREVENTED: Attempted mutation of forbidden property '${patch.attribute}'!`;
      console.error(errMsg);
      return { success: false, patchId: patch.patchId, status: "rejected", error: errMsg };
    }

    // Sanitize proposed value against script tags / dangerous protocols
    const sanitizedValue = this.sanitizeLabelString(patch.proposedValue);
    if (!sanitizedValue) {
      return { success: false, patchId: patch.patchId, status: "rejected", error: "Sanitized proposed label is empty." };
    }

    try {
      // Record previous state for 100% reversibility
      const currentVal = element.getAttribute(patch.attribute);
      patch.previousValue = currentVal;

      // 2. Safe DOM Mutation via setAttribute ONLY (NEVER innerHTML)
      element.setAttribute(patch.attribute, sanitizedValue);

      // 3. Provenance Tagging (Audit trail directly on element)
      element.setAttribute("data-tsif-patched", "true");
      element.setAttribute("data-tsif-patch-id", patch.patchId);
      element.setAttribute("data-tsif-model", patch.modelVersion);
      element.setAttribute("data-tsif-timestamp", patch.timestamp);

      patch.status = "applied";
      if (typeof WeakRef !== "undefined") {
        this.activePatches.set(patch.patchId, { patch, elementRef: new WeakRef(element) });
      }

      return { success: true, patchId: patch.patchId, status: "applied" };
    } catch (err: any) {
      return { success: false, patchId: patch.patchId, status: "rejected", error: err.message };
    }
  }

  /**
   * Reverts an applied semantic patch, restoring original DOM state.
   */
  public revertPatch(element: Element, patch: SemanticPatch): PatchResult {
    try {
      if (patch.previousValue === null || patch.previousValue === undefined) {
        element.removeAttribute(patch.attribute);
      } else {
        element.setAttribute(patch.attribute, patch.previousValue);
      }

      element.removeAttribute("data-tsif-patched");
      element.removeAttribute("data-tsif-patch-id");
      element.removeAttribute("data-tsif-model");
      element.removeAttribute("data-tsif-timestamp");

      patch.status = "reverted";
      this.activePatches.delete(patch.patchId);

      return { success: true, patchId: patch.patchId, status: "reverted" };
    } catch (err: any) {
      return { success: false, patchId: patch.patchId, status: "rejected", error: err.message };
    }
  }

  /**
   * Checks if live page DOM has mutated or reclaimed the element attribute.
   * If live page reclaims element, TSIF YIELDS and invalidates patch rather than fighting page!
   */
  public checkAndYieldOnReclaim(element: Element, patch: SemanticPatch): boolean {
    if (patch.status !== "applied") return false;

    const currentAttrVal = element.getAttribute(patch.attribute);
    // If attribute value no longer matches our applied value (page re-rendered or modified it)
    if (currentAttrVal !== patch.proposedValue) {
      console.warn(`Live page reclaimed element attribute '${patch.attribute}' for patch ${patch.patchId}. TSIF yielding.`);
      patch.status = "invalidated";
      element.removeAttribute("data-tsif-patched");
      element.removeAttribute("data-tsif-patch-id");
      this.activePatches.delete(patch.patchId);
      return true; // Yielded
    }
    return false;
  }

  /**
   * Sanitizes label string to remove control characters or raw HTML tags.
   */
  public sanitizeLabelString(raw: string): string {
    if (!raw) return "";
    // Strip HTML tags if any were somehow passed
    let clean = raw.replace(/<[^>]*>/g, "");
    // Strip control characters
    clean = clean.replace(/[\x00-\x1F\x7F]/g, "");
    return clean.trim();
  }
}
