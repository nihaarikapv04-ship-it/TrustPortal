import { SemanticPatch, IssueType, AllowlistedAttribute } from "@trustportal/schemas";
export type PatchStatus = "unseen" | "detected" | "queued" | "proposed" | "injected" | "rejected" | "reverted" | "stale" | "conflict";
export interface PatchLedgerEntry {
    patch: SemanticPatch;
    status: PatchStatus;
    createdAt: string;
    injectedAt?: string;
    revertedAt?: string;
    rejectionReason?: string;
}
export type PatchResult = {
    success: true;
    patchId: string;
    status: "injected" | "reverted";
} | {
    success: false;
    patchId: string;
    reason: "invalid-schema" | "invalid-attribute" | "invalid-issue-type" | "attribute-issue-mismatch" | "fingerprint-mismatch" | "target-missing" | "sensitive-context" | "unsafe-value" | "stale" | "conflict" | "already-applied" | "already-reverted";
    details?: string;
};
export declare const ALLOWLISTED_ATTRIBUTES: ReadonlySet<string>;
export declare const STRICTLY_FORBIDDEN_ATTRIBUTES: ReadonlySet<string>;
/**
 * Validates compatibility between issue type and permitted attribute.
 */
export declare function validateIssueAttributeCompatibility(issueType: IssueType, attribute: AllowlistedAttribute): boolean;
//# sourceMappingURL=patch_model.d.ts.map