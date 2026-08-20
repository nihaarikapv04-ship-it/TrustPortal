/**
 * Reversible Semantic Patch Engine (Hardened DOM Remediation System).
 * Mitigates DOM hijacked extension attacks (arXiv 2503.04292).
 * Enforces strict attribute allowlisting, reversibility, and yields on page DOM reclaim.
 */
import { SemanticPatch, PatchResult } from "./types";
export declare class HardenedPatchEngine {
    private activePatches;
    /**
     * Applies a semantic patch to a DOM Element with runtime and compile-time security bounds.
     */
    applyPatch(element: Element, patch: SemanticPatch): PatchResult;
    /**
     * Reverts an applied semantic patch, restoring original DOM state.
     */
    revertPatch(element: Element, patch: SemanticPatch): PatchResult;
    /**
     * Checks if live page DOM has mutated or reclaimed the element attribute.
     * If live page reclaims element, TSIF YIELDS and invalidates patch rather than fighting page!
     */
    checkAndYieldOnReclaim(element: Element, patch: SemanticPatch): boolean;
    /**
     * Sanitizes label string to remove control characters or raw HTML tags.
     */
    private sanitizeLabelString;
}
//# sourceMappingURL=patcher.d.ts.map