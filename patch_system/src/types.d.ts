/**
 * TSIF Reversible Patch System Types.
 * Enforces strict attribute allowlists at compile-time to prevent DOM manipulation attacks.
 */
export type AllowlistedAttribute = "alt" | "aria-label" | "aria-labelledby" | "aria-describedby" | "role";
export type DisallowedAttribute = "href" | "onclick" | "action" | "innerHTML" | "outerHTML" | "src" | "value" | "formaction";
export interface EvidenceItem {
    key: string;
    value: string;
}
export interface SemanticPatch {
    patchId: string;
    issueType: "img-alt" | "button-name" | "link-name" | "form-label" | "svg-name" | "custom-control";
    targetFingerprint: string;
    targetSelector: string;
    attribute: AllowlistedAttribute;
    previousValue: string | null;
    proposedValue: string;
    evidence: string[];
    trustScore: number;
    crcThresholdUsed: number;
    decision: "auto" | "confirm" | "reject";
    modelVersion: string;
    timestamp: string;
    status: "applied" | "reverted" | "invalidated";
}
export interface PatchResult {
    success: boolean;
    patchId: string;
    status: "applied" | "reverted" | "invalidated" | "rejected";
    error?: string;
}
//# sourceMappingURL=types.d.ts.map