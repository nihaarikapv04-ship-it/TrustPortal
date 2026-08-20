/**
 * Stable Target Fingerprinting Algorithm for DOM Elements.
 * Generates deterministic fingerprints based on safe, non-sensitive element characteristics.
 */
export interface FingerprintParams {
    origin: string;
    issueType: string;
    tag: string;
    id?: string | null;
    role?: string | null;
    typeAttr?: string | null;
    parentTag?: string | null;
}
export declare function computeTargetFingerprintRaw(params: FingerprintParams): string;
export declare function computeTargetFingerprint(targetOrParams: Element | FingerprintParams, issueType?: string): string;
export declare function computeElementFingerprint(element: Element, issueType?: string): string;
//# sourceMappingURL=fingerprint.d.ts.map