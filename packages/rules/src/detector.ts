import { IssueType, AllowlistedAttribute } from "@trustportal/schemas";
import { AccessibleNameComputer, ElementRepresentation } from "./acc_name.js";
import { RULES_REGISTRY, RuleDefinition } from "./rules_registry.js";
import { SvgSemanticResolver, SvgResolutionEvidence } from "./svg_resolver.js";

export type DecisionReason =
  | "DECORATIVE_CONTEXT"
  | "PARENT_NAMED"
  | "ARIA_HIDDEN"
  | "ROLE_PRESENTATION"
  | "INDEPENDENTLY_EXPOSED"
  | "MISSING_ACCESSIBLE_NAME"
  | "VALID_ACCESSIBLE_NAME"
  | "AMBIGUOUS_CONTEXT"
  | "EXTERNAL_OR_UNSAFE_REFERENCE"
  | "UNRESOLVED_LOCAL_SYMBOL_REFERENCE"
  | "CONFLICTING_ARIA_ATTRIBUTES";

export type ConfidenceState =
  | "HIGH_CONFIDENCE_DEFECT"
  | "HIGH_CONFIDENCE_VALID"
  | "AMBIGUOUS_ABSTAIN";

export interface DecisionEvidence {
  parentTag?: string | null;
  parentRole?: string | null;
  parentAccessibleName?: string | null;
  svgIndependentlyExposed?: boolean;
  hasTitleOrDesc?: boolean;
  hasAriaLabel?: boolean;
}

export interface DetectedCandidate {
  candidateId: string;
  ruleId: string;
  issueType: IssueType;
  selector: string;
  tag: string;
  role: string | null;
  attributes: Record<string, string>;
  currentAccessibleName: string;
  severity: "critical" | "serious" | "moderate";
  wcagReference: string;
  permittedRemediationAttribute: AllowlistedAttribute;
  decisionReason?: string;
  confidenceState?: ConfidenceState;
  evidence?: any;
}

const SUSPICIOUS_FILENAME_REGEX = /^(img|image|photo|pic|banner|button|icon|logo|dsc|dc|screen|captura|file)[\d_\-.]*\.(png|jpg|jpeg|gif|webp|svg)$/i;
const SUSPICIOUS_ALT_SENTINEL_REGEX = /^(undefined|null|n\/a|placeholder|image|photo|picture)[\d_\-.]*$/i;

export class DeterministicDetector {
  private computer: AccessibleNameComputer;
  private svgResolver: SvgSemanticResolver;

  constructor(computer?: AccessibleNameComputer, domMap?: Record<string, ElementRepresentation>) {
    this.computer = computer || new AccessibleNameComputer(domMap);
    this.svgResolver = new SvgSemanticResolver(this.computer, domMap);
  }

  public setDomMap(domMap: Record<string, ElementRepresentation>): void {
    this.computer.setDomMap(domMap);
    this.svgResolver.setDomMap(domMap);
  }

  /**
   * Scans a list of ElementRepresentations for accessibility defects using Context-Aware Analysis.
   */
  public scan(elements: ElementRepresentation[]): DetectedCandidate[] {
    const candidates: DetectedCandidate[] = [];

    for (const elem of elements) {
      // Exclusions Gate: Do NOT flag hidden, disabled, or sensitive payment/auth fields!
      if (this.shouldExclude(elem)) {
        continue;
      }

      const accName = this.computer.computeName(elem);
      const tag = (elem.tag || "").toLowerCase();
      const role = elem.role ? elem.role.toLowerCase() : null;
      const attrs = elem.attributes || {};

      // Rule 1 & 2: HTML Image Alt Checks (Strictly exclude SVG tags)
      if (tag === "img" || (role === "img" && tag !== "svg")) {
        const altVal = attrs["alt"] ? attrs["alt"].trim() : null;
        if (!("alt" in attrs) && !attrs["aria-label"] && !attrs["aria-labelledby"]) {
          candidates.push(this.createCandidate("RULE_IMG_ALT_MISSING", elem, accName, "MISSING_ACCESSIBLE_NAME", "HIGH_CONFIDENCE_DEFECT"));
        } else if (altVal && (SUSPICIOUS_FILENAME_REGEX.test(altVal) || SUSPICIOUS_ALT_SENTINEL_REGEX.test(altVal))) {
          candidates.push(this.createCandidate("RULE_IMG_ALT_FILENAME", elem, accName, "MISSING_ACCESSIBLE_NAME", "HIGH_CONFIDENCE_DEFECT"));
        }
      }

      // Rule 3: Button Name Check
      else if (
        tag === "button" ||
        role === "button" ||
        (tag === "input" && ["button", "submit", "reset", "image"].includes((attrs["type"] || "").toLowerCase()))
      ) {
        if (!accName) {
          candidates.push(this.createCandidate("RULE_BUTTON_NAME_MISSING", elem, accName, "MISSING_ACCESSIBLE_NAME", "HIGH_CONFIDENCE_DEFECT"));
        }
      }

      // Rule 4: Link Name Check
      else if (tag === "a" || role === "link") {
        if (!accName) {
          candidates.push(this.createCandidate("RULE_LINK_NAME_MISSING", elem, accName, "MISSING_ACCESSIBLE_NAME", "HIGH_CONFIDENCE_DEFECT"));
        }
      }

      // Rule 5: Form Control Label Check (WCAG 2.1 SC 3.3.2)
      else if (
        ["input", "select", "textarea"].includes(tag) &&
        !["hidden", "button", "submit", "reset", "image"].includes((attrs["type"] || "").toLowerCase())
      ) {
        const hasProgrammaticLabel =
          (attrs["aria-label"] && attrs["aria-label"].trim().length > 0) ||
          (attrs["aria-labelledby"] && attrs["aria-labelledby"].trim().length > 0) ||
          (elem.labels && elem.labels.length > 0) ||
          (attrs["title"] && attrs["title"].trim().length > 0);

        if (!hasProgrammaticLabel) {
          candidates.push(this.createCandidate("RULE_FORM_LABEL_MISSING", elem, accName, "MISSING_ACCESSIBLE_NAME", "HIGH_CONFIDENCE_DEFECT"));
        }
      }

      // Rule 6: Context-Aware SVG Control Check via SvgSemanticResolver
      else if (tag === "svg") {
        const evidence = this.svgResolver.resolve(elem);

        if (evidence.decision === "HIGH_CONFIDENCE_DEFECT") {
          candidates.push(this.createCandidate("RULE_SVG_NAME_MISSING", elem, evidence.svgAccessibleName || accName, evidence.reason, "HIGH_CONFIDENCE_DEFECT", evidence));
        }
      }

      // Rule 7: Custom Interactive ARIA Control Check
      else if (["checkbox", "radio", "combobox", "tab", "menuitem", "slider", "switch"].includes(role || "")) {
        if (!accName) {
          candidates.push(this.createCandidate("RULE_CUSTOM_CONTROL_NAME_MISSING", elem, accName, "MISSING_ACCESSIBLE_NAME", "HIGH_CONFIDENCE_DEFECT"));
        }
      }
    }

    return candidates;
  }

  /**
   * Evaluates Contextual Accessibility for SVG Subtrees.
   */
  public evaluateSvgContext(elem: ElementRepresentation): SvgResolutionEvidence {
    return this.svgResolver.resolve(elem);
  }

  /**
   * Evaluates if element should be strictly EXCLUDED from defect flagging.
   */
  public shouldExclude(elem: ElementRepresentation): boolean {
    const attrs = elem.attributes || {};
    const tag = (elem.tag || "").toLowerCase();
    const role = elem.role ? elem.role.toLowerCase() : null;

    // 1. Exclude Hidden Elements
    if (
      attrs["aria-hidden"] === "true" ||
      "hidden" in attrs ||
      (attrs["style"] && /display\s*:\s*none|visibility\s*:\s*hidden/i.test(attrs["style"]))
    ) {
      return true;
    }

    // 2. Exclude Disabled Elements
    if ("disabled" in attrs || attrs["aria-disabled"] === "true") {
      return true;
    }

    // 3. Exclude Decorative Images
    if (role === "presentation" || role === "none") {
      return true;
    }

    // 4. Exclude Password, OTP, CAPTCHA, Payment, Credit Card Fields!
    const inputType = (attrs["type"] || "").toLowerCase();
    const fieldName = ((attrs["name"] || "") + " " + (attrs["id"] || "") + " " + (attrs["autocomplete"] || "")).toLowerCase();

    if (inputType === "password") return true;

    const sensitiveFieldRegex = /(password|passcode|otp|2fa|mfa|cvv|cvc|cardnumber|creditcard|ssn|aadhaar|pan|captcha|one-time-code)/i;
    if (sensitiveFieldRegex.test(fieldName)) {
      return true;
    }

    return false;
  }

  private createCandidate(
    ruleId: string,
    elem: ElementRepresentation,
    accName: string,
    reason?: string,
    confidenceState?: ConfidenceState,
    evidence?: any
  ): DetectedCandidate {
    const rule: RuleDefinition = RULES_REGISTRY[ruleId] || RULES_REGISTRY["RULE_IMG_ALT_MISSING"];
    const tag = (elem.tag || "").toLowerCase();
    const id = elem.id ? `#${elem.id}` : "";
    const selector = `${tag}${id}`;
    const candidateId = `cand_${rule.issueType}_${Math.random().toString(36).substring(2, 9)}`;

    return {
      candidateId,
      ruleId,
      issueType: rule.issueType,
      selector,
      tag,
      role: elem.role || null,
      attributes: elem.attributes || {},
      currentAccessibleName: accName,
      severity: rule.severity,
      wcagReference: rule.wcagReference,
      permittedRemediationAttribute: rule.permittedRemediationAttribute,
      decisionReason: reason || "MISSING_ACCESSIBLE_NAME",
      confidenceState: confidenceState || "HIGH_CONFIDENCE_DEFECT",
      evidence
    };
  }
}
