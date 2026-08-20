import { IssueType, AllowlistedAttribute } from "@trustportal/schemas";

export interface RuleDefinition {
  ruleId: string;
  issueType: IssueType;
  title: string;
  description: string;
  wcagReference: string;  // e.g. "WCAG 2.1 SC 1.1.1 Non-text Content (Level A)"
  ariaSemantics: string;   // e.g. "WAI-ARIA 1.2 Section 5.2.7"
  gigwRelevance: string;  // e.g. "GIGW 3.0 Rule 6.2.1"
  severity: "critical" | "serious" | "moderate";
  permittedRemediationAttribute: AllowlistedAttribute;
}

export const RULES_REGISTRY: Record<string, RuleDefinition> = {
  "RULE_IMG_ALT_MISSING": {
    ruleId: "RULE_IMG_ALT_MISSING",
    issueType: "img-alt",
    title: "Missing Image Alternative Text",
    description: "Image element lacks an alt attribute, aria-label, or aria-labelledby.",
    wcagReference: "WCAG 2.1 SC 1.1.1 Non-text Content (Level A)",
    ariaSemantics: "img role accessible name requirement",
    gigwRelevance: "GIGW 3.0 Section 6.2.1 Text Equivalents",
    severity: "critical",
    permittedRemediationAttribute: "alt"
  },
  "RULE_IMG_ALT_FILENAME": {
    ruleId: "RULE_IMG_ALT_FILENAME",
    issueType: "img-alt",
    title: "Suspicious Filename Alternative Text",
    description: "Image alt text contains only a raw filename or extension (e.g. IMG_1042.jpg).",
    wcagReference: "WCAG 2.1 SC 1.1.1 Non-text Content (Level A)",
    ariaSemantics: "img role quality name requirement",
    gigwRelevance: "GIGW 3.0 Section 6.2.1 Text Equivalents",
    severity: "serious",
    permittedRemediationAttribute: "alt"
  },
  "RULE_BUTTON_NAME_MISSING": {
    ruleId: "RULE_BUTTON_NAME_MISSING",
    issueType: "button-name",
    title: "Unnamed Interactive Button",
    description: "Button element or button role control has no computed accessible name.",
    wcagReference: "WCAG 2.1 SC 4.1.2 Name, Role, Value (Level A)",
    ariaSemantics: "button role accessible name requirement",
    gigwRelevance: "GIGW 3.0 Section 6.5.2 Control Identification",
    severity: "critical",
    permittedRemediationAttribute: "aria-label"
  },
  "RULE_LINK_NAME_MISSING": {
    ruleId: "RULE_LINK_NAME_MISSING",
    issueType: "link-name",
    title: "Unnamed Link",
    description: "Anchor link element or link role has no computed accessible name.",
    wcagReference: "WCAG 2.1 SC 2.4.4 Link Purpose (In Context) (Level A)",
    ariaSemantics: "link role accessible name requirement",
    gigwRelevance: "GIGW 3.0 Section 6.4.4 Meaningful Link Text",
    severity: "critical",
    permittedRemediationAttribute: "aria-label"
  },
  "RULE_FORM_LABEL_MISSING": {
    ruleId: "RULE_FORM_LABEL_MISSING",
    issueType: "form-label",
    title: "Form Input Without Accessible Name",
    description: "Form field (input, select, textarea) lacks associated label, aria-label, or title.",
    wcagReference: "WCAG 2.1 SC 3.3.2 Labels or Instructions (Level A)",
    ariaSemantics: "textbox/select/checkbox role accessible name requirement",
    gigwRelevance: "GIGW 3.0 Section 6.6.1 Form Input Labelling",
    severity: "critical",
    permittedRemediationAttribute: "aria-label"
  },
  "RULE_SVG_NAME_MISSING": {
    ruleId: "RULE_SVG_NAME_MISSING",
    issueType: "svg-name",
    title: "Interactive SVG Control Without Accessible Name",
    description: "SVG element used as interactive button or graphic symbol lacks title or aria-label.",
    wcagReference: "WCAG 2.1 SC 1.1.1 Non-text Content (Level A)",
    ariaSemantics: "graphics-symbol / button role accessible name requirement",
    gigwRelevance: "GIGW 3.0 Section 6.2.1 Non-text Content",
    severity: "serious",
    permittedRemediationAttribute: "aria-label"
  },
  "RULE_CUSTOM_CONTROL_NAME_MISSING": {
    ruleId: "RULE_CUSTOM_CONTROL_NAME_MISSING",
    issueType: "custom-control",
    title: "Custom Interactive Control Without Accessible Name",
    description: "Custom ARIA element (checkbox, radio, combobox, tab) lacks an accessible name.",
    wcagReference: "WCAG 2.1 SC 4.1.2 Name, Role, Value (Level A)",
    ariaSemantics: "WAI-ARIA 1.2 Custom Widget Name Requirement",
    gigwRelevance: "GIGW 3.0 Section 6.5.2 Control Identification",
    severity: "critical",
    permittedRemediationAttribute: "aria-label"
  }
};
