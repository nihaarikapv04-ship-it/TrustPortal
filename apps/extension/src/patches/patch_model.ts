import {
  SemanticPatch,
  IssueType,
  AllowlistedAttribute,
  Decision,
  EvidenceItem
} from "@trustportal/schemas";

export type PatchStatus =
  | "unseen"
  | "detected"
  | "queued"
  | "proposed"
  | "injected"
  | "rejected"
  | "reverted"
  | "stale"
  | "conflict";

export interface PatchLedgerEntry {
  patch: SemanticPatch;
  status: PatchStatus;
  createdAt: string;
  injectedAt?: string;
  revertedAt?: string;
  rejectionReason?: string;
}

export type PatchResult =
  | {
      success: true;
      patchId: string;
      status: "injected" | "reverted";
    }
  | {
      success: false;
      patchId: string;
      reason:
        | "invalid-schema"
        | "invalid-attribute"
        | "invalid-issue-type"
        | "attribute-issue-mismatch"
        | "fingerprint-mismatch"
        | "target-missing"
        | "sensitive-context"
        | "unsafe-value"
        | "stale"
        | "conflict"
        | "already-applied"
        | "already-reverted";
      details?: string;
    };

export const ALLOWLISTED_ATTRIBUTES: ReadonlySet<string> = new Set([
  "alt",
  "aria-label",
  "aria-labelledby",
  "aria-describedby"
]);

export const STRICTLY_FORBIDDEN_ATTRIBUTES: ReadonlySet<string> = new Set([
  "href",
  "src",
  "action",
  "method",
  "value",
  "onclick",
  "onload",
  "onerror",
  "style",
  "class",
  "id",
  "role",
  "tabindex",
  "name",
  "type",
  "innerhtml",
  "outerhtml"
]);

/**
 * Validates compatibility between issue type and permitted attribute.
 */
export function validateIssueAttributeCompatibility(
  issueType: IssueType,
  attribute: AllowlistedAttribute
): boolean {
  switch (issueType) {
    case "img-alt":
      return attribute === "alt";
    case "button-name":
      return attribute === "aria-label" || attribute === "aria-labelledby";
    case "link-name":
      return attribute === "aria-label" || attribute === "aria-labelledby";
    case "form-label":
      return (
        attribute === "aria-label" ||
        attribute === "aria-labelledby" ||
        attribute === "aria-describedby"
      );
    default:
      return attribute === "aria-label";
  }
}
