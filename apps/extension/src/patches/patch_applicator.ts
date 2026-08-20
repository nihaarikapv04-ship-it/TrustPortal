/**
 * Reversible Semantic Patch Applicator.
 * Enforces strict attribute allowlisting, value safety validation, fingerprint matching,
 * and conflict-aware revert behavior.
 */

import { SemanticPatch } from "@trustportal/schemas";
import {
  PatchResult,
  ALLOWLISTED_ATTRIBUTES,
  STRICTLY_FORBIDDEN_ATTRIBUTES,
  validateIssueAttributeCompatibility
} from "./patch_model.js";
import { computeElementFingerprint } from "./fingerprint.js";
import { patchLedger } from "./patch_ledger.js";

const SENSITIVE_INPUT_REGEX = /(password|passcode|otp|2fa|mfa|cvv|cvc|cardnumber|creditcard|ssn|aadhaar|pan|captcha|one-time-code)/i;
const PROMPT_INJECTION_KEYWORDS = /(ignore\s+previous|system\s+prompt|you\s+are\s+now|override\s+policy|eval\(|<script)/i;

export class PatchApplicator {
  /**
   * Applies a SemanticPatch to a target DOM Element with 10-step security validation.
   */
  public applyPatch(patch: SemanticPatch, target: Element): PatchResult {
    // 1. Validate Patch Schema & ID
    if (!patch || !patch.patchId || !patch.attribute || !patch.proposedValue) {
      return { success: false, patchId: patch?.patchId || "unknown", reason: "invalid-schema" };
    }

    // 2. Validate Attribute Allowlist
    const attrLower = patch.attribute.toLowerCase();
    if (STRICTLY_FORBIDDEN_ATTRIBUTES.has(attrLower)) {
      console.error(`CRITICAL SECURITY REJECTION: Attempted mutation of forbidden attribute '${patch.attribute}'!`);
      return {
        success: false,
        patchId: patch.patchId,
        reason: "invalid-attribute",
        details: `Attribute '${patch.attribute}' is strictly forbidden for modification!`
      };
    }

    if (!ALLOWLISTED_ATTRIBUTES.has(attrLower)) {
      return {
        success: false,
        patchId: patch.patchId,
        reason: "invalid-attribute",
        details: `Attribute '${patch.attribute}' is not in the allowed accessibility list [alt, aria-label, aria-labelledby, aria-describedby]`
      };
    }

    // 3. Validate Issue Type & Attribute Compatibility
    if (!validateIssueAttributeCompatibility(patch.issueType, patch.attribute)) {
      return {
        success: false,
        patchId: patch.patchId,
        reason: "attribute-issue-mismatch",
        details: `Attribute '${patch.attribute}' is incompatible with issue type '${patch.issueType}'`
      };
    }

    // 4. Validate Target Existence in Document DOM
    if (typeof document !== "undefined" && document.body && !document.body.contains(target)) {
      return { success: false, patchId: patch.patchId, reason: "target-missing" };
    }

    // 5. Validate Target Fingerprint Match
    const currentFingerprint = computeElementFingerprint(target, patch.issueType);
    if (patch.targetFingerprint && patch.targetFingerprint !== currentFingerprint) {
      return {
        success: false,
        patchId: patch.patchId,
        reason: "fingerprint-mismatch",
        details: `Fingerprint mismatch: expected ${patch.targetFingerprint}, got ${currentFingerprint}`
      };
    }

    // 6. Verify Target is NOT inside Sensitive Workflow / Field
    if (this.isSensitiveTarget(target)) {
      return {
        success: false,
        patchId: patch.patchId,
        reason: "sensitive-context",
        details: "Target element is inside a sensitive authentication, payment, or OTP field!"
      };
    }

    // 7. Verify Target is NOT Hidden or Disabled
    if (this.isHiddenOrDisabled(target)) {
      return {
        success: false,
        patchId: patch.patchId,
        reason: "stale",
        details: "Target element is hidden, disabled, or decorative."
      };
    }

    // 8. Validate Proposed Value Safety
    const safeValue = this.validateAndSanitizeValue(patch.proposedValue);
    if (!safeValue) {
      return {
        success: false,
        patchId: patch.patchId,
        reason: "unsafe-value",
        details: "Proposed label contains unsafe HTML, control characters, or prompt injection strings!"
      };
    }

    // 9. Register Proposal in Ledger & Capture Original Value
    const previousVal = target.getAttribute(patch.attribute);
    patch.previousValue = previousVal;
    patch.proposedValue = safeValue;

    // Check if already injected
    const elementState = patchLedger.getElementState(target);
    if (elementState && elementState.status === "injected" && elementState.patchId === patch.patchId) {
      return { success: false, patchId: patch.patchId, reason: "already-applied" };
    }

    // 10. Perform Safe DOM Mutation via setAttribute ONLY (NEVER innerHTML)
    try {
      target.setAttribute(patch.attribute, safeValue);
      target.setAttribute("data-tsif-patched", "true");
      target.setAttribute("data-tsif-patch-id", patch.patchId);

      patchLedger.registerProposal(patch);
      patchLedger.updateStatus(patch.patchId, "injected");
      patchLedger.bindElementState(target, patch.patchId, "injected", currentFingerprint);

      return { success: true, patchId: patch.patchId, status: "injected" };
    } catch (err: any) {
      return {
        success: false,
        patchId: patch.patchId,
        reason: "unsafe-value",
        details: err.message
      };
    }
  }

  /**
   * Conflict-aware patch reversal.
   * Restores exact previous attribute value ONLY if current attribute value still matches TSIF applied value.
   */
  public revertPatch(patchId: string, target: Element): PatchResult {
    const entry = patchLedger.getEntry(patchId);
    if (!entry) {
      return { success: false, patchId, reason: "target-missing", details: "Patch ID not found in ledger!" };
    }

    if (entry.status === "reverted") {
      return { success: false, patchId, reason: "already-reverted" };
    }

    const patch = entry.patch;
    const currentVal = target.getAttribute(patch.attribute);

    // Conflict Check: If live page changed attribute after TSIF patched it, DO NOT overwrite!
    if (currentVal !== patch.proposedValue) {
      console.warn(`Conflict detected: Live page modified attribute '${patch.attribute}' to '${currentVal}'. TSIF yielding.`);
      patchLedger.updateStatus(patchId, "conflict", "Live page modified attribute after TSIF patch");
      return {
        success: false,
        patchId,
        reason: "conflict",
        details: `Attribute value '${currentVal}' does not match TSIF applied value '${patch.proposedValue}'. Yielding to live page.`
      };
    }

    // Perform Reversal
    try {
      if (patch.previousValue === null || patch.previousValue === undefined) {
        target.removeAttribute(patch.attribute);
      } else {
        target.setAttribute(patch.attribute, patch.previousValue);
      }

      target.removeAttribute("data-tsif-patched");
      target.removeAttribute("data-tsif-patch-id");

      patchLedger.updateStatus(patchId, "reverted");
      patchLedger.bindElementState(target, patchId, "reverted", computeElementFingerprint(target, patch.issueType));

      return { success: true, patchId, status: "reverted" };
    } catch (err: any) {
      return { success: false, patchId, reason: "stale", details: err.message };
    }
  }

  /**
   * Validates and sanitizes proposed label value.
   */
  public validateAndSanitizeValue(rawLabel: string): string | null {
    if (typeof rawLabel !== "string" || !rawLabel.trim()) return null;

    let clean = rawLabel.trim();

    // Rejects if contains HTML tags
    if (/<[^>]*>/.test(clean)) return null;

    // Rejects control characters
    if (/[\x00-\x1F\x7F]/.test(clean)) return null;

    // Rejects prompt injection override syntax
    if (PROMPT_INJECTION_KEYWORDS.test(clean)) return null;

    // Enforce max length (200 chars)
    if (clean.length > 200) {
      clean = clean.slice(0, 200).trim();
    }

    return clean;
  }

  private isSensitiveTarget(element: Element): boolean {
    const inputType = (element.getAttribute("type") || "").toLowerCase();
    if (inputType === "password") return true;

    const nameAttr = (element.getAttribute("name") || "").toLowerCase();
    const idAttr = (element.id || "").toLowerCase();
    const autocomplete = (element.getAttribute("autocomplete") || "").toLowerCase();
    const combined = `${nameAttr} ${idAttr} ${autocomplete}`;

    return SENSITIVE_INPUT_REGEX.test(combined);
  }

  private isHiddenOrDisabled(element: Element): boolean {
    if (element.getAttribute("aria-hidden") === "true" || element.hasAttribute("hidden")) return true;
    if (element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true") return true;
    const role = element.getAttribute("role");
    if (role === "presentation" || role === "none") return true;
    return false;
  }
}

export const patchApplicator = new PatchApplicator();
