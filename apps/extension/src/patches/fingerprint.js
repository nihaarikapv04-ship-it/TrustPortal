/**
 * Stable Target Fingerprinting Algorithm for DOM Elements.
 * Generates deterministic fingerprints based on safe, non-sensitive element characteristics.
 */
export function computeTargetFingerprintRaw(params) {
    const safeOrigin = params.origin.toLowerCase();
    const safeIssue = params.issueType.toLowerCase();
    const safeTag = params.tag.toLowerCase();
    const safeId = params.id ? params.id.trim() : "";
    const safeRole = params.role ? params.role.trim().toLowerCase() : "";
    const safeType = params.typeAttr ? params.typeAttr.trim().toLowerCase() : "";
    const safeParent = params.parentTag ? params.parentTag.toLowerCase() : "";
    const rawString = `${safeOrigin}|${safeIssue}|${safeTag}|${safeId}|${safeRole}|${safeType}|${safeParent}`;
    // Simple, fast string hashing (FNA1a-like integer hash)
    let hash = 2166136261;
    for (let i = 0; i < rawString.length; i++) {
        hash ^= rawString.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    const hashHex = (hash >>> 0).toString(16).padStart(8, "0");
    return `fp_${safeIssue}_${safeTag}_${hashHex}`;
}
export function computeTargetFingerprint(targetOrParams, issueType = "button-name") {
    if (typeof targetOrParams === "object" && targetOrParams !== null && "tagName" in targetOrParams) {
        return computeElementFingerprint(targetOrParams, issueType);
    }
    return computeTargetFingerprintRaw(targetOrParams);
}
export function computeElementFingerprint(element, issueType = "button-name") {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://local.test";
    const tag = element.tagName.toLowerCase();
    const id = element.id || null;
    const role = element.getAttribute("role");
    const typeAttr = element.getAttribute("type");
    const parentTag = element.parentElement ? element.parentElement.tagName.toLowerCase() : null;
    return computeTargetFingerprintRaw({
        origin,
        issueType,
        tag,
        id,
        role,
        typeAttr,
        parentTag
    });
}
