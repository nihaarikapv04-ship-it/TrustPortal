/**
 * Reversible Semantic Patch Applicator.
 * Enforces strict attribute allowlisting, value safety validation, fingerprint matching,
 * and conflict-aware revert behavior.
 */
import { SemanticPatch } from "@trustportal/schemas";
import { PatchResult } from "./patch_model.js";
export declare class PatchApplicator {
    /**
     * Applies a SemanticPatch to a target DOM Element with 10-step security validation.
     */
    applyPatch(patch: SemanticPatch, target: Element): PatchResult;
    /**
     * Conflict-aware patch reversal.
     * Restores exact previous attribute value ONLY if current attribute value still matches TSIF applied value.
     */
    revertPatch(patchId: string, target: Element): PatchResult;
    /**
     * Validates and sanitizes proposed label value.
     */
    validateAndSanitizeValue(rawLabel: string): string | null;
    private isSensitiveTarget;
    private isHiddenOrDisabled;
}
export declare const patchApplicator: PatchApplicator;
//# sourceMappingURL=patch_applicator.d.ts.map