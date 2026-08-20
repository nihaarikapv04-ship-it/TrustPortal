import { ElementRepresentation, AccessibleNameComputer } from "./acc_name.js";

export type SvgDecision = "HIGH_CONFIDENCE_VALID" | "HIGH_CONFIDENCE_DEFECT" | "AMBIGUOUS_ABSTAIN";

export type ReferenceType =
  | "local_symbol"
  | "external_url"
  | "data_uri"
  | "blob_uri"
  | "javascript_uri"
  | "file_uri"
  | "none";

export interface SvgResolutionEvidence {
  decision: SvgDecision;
  reason: string;
  confidence: number;
  parentAccessibleName: string | null;
  svgAccessibleName: string | null;
  referenceType: ReferenceType;
  referenceResolved: boolean;
  externalReference: boolean;
  ariaHidden: boolean;
  role: string | null;
  hasTitle: boolean;
  hasDescription: boolean;
}

export class SvgSemanticResolver {
  private nameComputer: AccessibleNameComputer;
  private domMap: Map<string, ElementRepresentation> = new Map();

  constructor(nameComputer?: AccessibleNameComputer, domMap?: Record<string, ElementRepresentation>) {
    this.nameComputer = nameComputer || new AccessibleNameComputer();
    if (domMap) {
      this.setDomMap(domMap);
    }
  }

  public setDomMap(domMap: Record<string, ElementRepresentation>): void {
    this.domMap.clear();
    for (const [id, elem] of Object.entries(domMap)) {
      this.domMap.set(id, elem);
    }
    this.nameComputer.setDomMap(domMap);
  }

  /**
   * Resolves SVG semantic accessibility and returns structured evidence and confidence state.
   */
  public resolve(elem: ElementRepresentation): SvgResolutionEvidence {
    const attrs = elem.attributes || {};
    const tag = (elem.tag || "").toLowerCase();
    const role = elem.role ? elem.role.toLowerCase() : (attrs["role"] ? attrs["role"].toLowerCase() : null);
    const parent = elem.parent;

    const parentTag = parent?.tag ? parent.tag.toLowerCase() : null;
    const parentRole = parent?.role ? parent.role.toLowerCase() : null;
    const parentAccName = elem.parentAccessibleName || (parent ? this.nameComputer.computeName(parent) : null);

    const isAriaHidden = attrs["aria-hidden"] === "true" || "hidden" in attrs;
    let hasTitle = false;
    let hasDesc = false;

    // Check inline title/desc children
    if (elem.children) {
      for (const child of elem.children) {
        const cTag = (child.tag || "").toLowerCase();
        if (cTag === "title" && child.textContent && child.textContent.trim()) hasTitle = true;
        if (cTag === "desc" && child.textContent && child.textContent.trim()) hasDesc = true;
      }
    }
    if (attrs["title"] || elem.title) {
      hasTitle = true;
    }

    const evidence: SvgResolutionEvidence = {
      decision: "HIGH_CONFIDENCE_VALID",
      reason: "DECORATIVE_CONTEXT",
      confidence: 0.90,
      parentAccessibleName: parentAccName || null,
      svgAccessibleName: null,
      referenceType: "none",
      referenceResolved: false,
      externalReference: false,
      ariaHidden: isAriaHidden,
      role: role || null,
      hasTitle,
      hasDescription: hasDesc
    };

    // 1. ARIA Hidden Gate
    if (isAriaHidden) {
      evidence.decision = "HIGH_CONFIDENCE_VALID";
      evidence.reason = "ARIA_HIDDEN";
      evidence.confidence = 1.0;
      return evidence;
    }

    // 2. Presentation Role Gate
    if (role === "presentation" || role === "none" || parentRole === "presentation" || parentRole === "none") {
      evidence.decision = "HIGH_CONFIDENCE_VALID";
      evidence.reason = "ROLE_PRESENTATION";
      evidence.confidence = 1.0;
      return evidence;
    }

    // 3. Parent Interactive Control Context Gate
    const isParentInteractive =
      ["button", "a", "summary", "details"].includes(parentTag || "") ||
      ["button", "link", "menuitem", "tab"].includes(parentRole || "");

    if (isParentInteractive && parentAccName && parentAccName.trim().length > 0) {
      evidence.decision = "HIGH_CONFIDENCE_VALID";
      evidence.reason = "PARENT_NAMED";
      evidence.confidence = 0.98;
      evidence.svgAccessibleName = parentAccName;
      return evidence;
    }

    // 4. Safe Reference Policy Verification (<use> element inspection)
    const useChild = elem.children?.find((c) => (c.tag || "").toLowerCase() === "use");
    if (useChild || attrs["href"] || attrs["xlink:href"]) {
      const refUri = (
        useChild?.attributes?.["href"] ||
        useChild?.attributes?.["xlink:href"] ||
        attrs["href"] ||
        attrs["xlink:href"] ||
        ""
      ).trim();

      if (refUri) {
        // Disallowed / External reference inspection
        if (/^(javascript:|data:|blob:|file:|https?:|\/\/)/i.test(refUri)) {
          evidence.externalReference = true;
          if (/^javascript:/i.test(refUri)) evidence.referenceType = "javascript_uri";
          else if (/^data:/i.test(refUri)) evidence.referenceType = "data_uri";
          else if (/^blob:/i.test(refUri)) evidence.referenceType = "blob_uri";
          else if (/^file:/i.test(refUri)) evidence.referenceType = "file_uri";
          else evidence.referenceType = "external_url";

          evidence.decision = "AMBIGUOUS_ABSTAIN";
          evidence.reason = "EXTERNAL_OR_UNSAFE_REFERENCE";
          evidence.confidence = 0.0;
          return evidence;
        }

        // Local Fragment Reference (#symbol_id)
        if (refUri.startsWith("#")) {
          evidence.referenceType = "local_symbol";
          const symbolId = refUri.substring(1);

          if (this.domMap.has(symbolId)) {
            evidence.referenceResolved = true;
            const symElem = this.domMap.get(symbolId)!;
            const symName = this.nameComputer.computeName(symElem);
            if (symName) {
              evidence.svgAccessibleName = symName;
              evidence.hasTitle = true;
            }
          } else {
            // Unresolved local symbol reference -> Abstain safely
            evidence.referenceResolved = false;
            evidence.decision = "AMBIGUOUS_ABSTAIN";
            evidence.reason = "UNRESOLVED_LOCAL_SYMBOL_REFERENCE";
            evidence.confidence = 0.0;
            return evidence;
          }
        }
      }
    }

    // 5. Conflicting ARIA or Duplicate ID Gate -> Abstain
    if (attrs["aria-labelledby"] && attrs["aria-label"]) {
      evidence.decision = "AMBIGUOUS_ABSTAIN";
      evidence.reason = "CONFLICTING_ARIA_ATTRIBUTES";
      evidence.confidence = 0.0;
      return evidence;
    }

    // 6. Compute Accessible Name
    let computedAccName = evidence.svgAccessibleName || this.nameComputer.computeName(elem);
    if (!computedAccName && (attrs["title"] || elem.title)) {
      computedAccName = attrs["title"] || elem.title || "";
    }

    if (computedAccName && computedAccName.trim().length > 0) {
      evidence.svgAccessibleName = computedAccName.trim();
      evidence.decision = "HIGH_CONFIDENCE_VALID";
      evidence.reason = "VALID_ACCESSIBLE_NAME";
      evidence.confidence = 0.95;
      return evidence;
    }

    // 7. Check Independent Exposure
    const isIndependentlyExposed =
      role === "img" ||
      role === "button" ||
      role === "graphics-document" ||
      attrs["tabindex"] === "0" ||
      attrs["role"] === "img";

    if (isIndependentlyExposed) {
      evidence.decision = "HIGH_CONFIDENCE_DEFECT";
      evidence.reason = "MISSING_ACCESSIBLE_NAME";
      evidence.confidence = 0.95;
      return evidence;
    }

    // Default: Decorative SVG
    evidence.decision = "HIGH_CONFIDENCE_VALID";
    evidence.reason = "DECORATIVE_CONTEXT";
    evidence.confidence = 0.90;
    return evidence;
  }
}
