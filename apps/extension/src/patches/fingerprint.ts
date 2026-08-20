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

export function computeTargetFingerprintRaw(params: FingerprintParams): string {
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

export function computeTargetFingerprint(targetOrParams: Element | FingerprintParams, issueType: string = "button-name"): string {
  if (typeof targetOrParams === "object" && targetOrParams !== null && "tagName" in targetOrParams) {
    return computeElementFingerprint(targetOrParams as Element, issueType);
  }
  return computeTargetFingerprintRaw(targetOrParams as FingerprintParams);
}

export function computeElementFingerprint(element: Element, issueType: string = "button-name"): string {
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
