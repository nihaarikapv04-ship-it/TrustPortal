import { SafeContext } from "@trustportal/schemas";

export interface ValidationCheckResult {
  consistent: boolean;
  score: number;
  reason?: string;
}

export class IndependentValidators {
  /**
   * Validates DOM Consistency D in [0.0, 1.0].
   * Verifies proposal remains compatible with target element role and tag.
   */
  public validateDomConsistency(proposedLabel: string, context: SafeContext): ValidationCheckResult {
    if (!proposedLabel || !proposedLabel.trim()) {
      return { consistent: false, score: 0.0, reason: "Empty proposed label" };
    }

    const tag = (context.safeAttributes["tag"] || "").toLowerCase();
    const role = (context.elementRole || "").toLowerCase();
    const labelLower = proposedLabel.toLowerCase();

    // Check 1: Button role consistency
    if (tag === "button" || role === "button") {
      if (labelLower.includes("page title") || labelLower.includes("main heading")) {
        return { consistent: false, score: 0.20, reason: "Button label sounds like page heading" };
      }
    }

    // Check 2: Form control consistency
    if (["input", "select", "textarea"].includes(tag)) {
      if (labelLower.startsWith("click here to")) {
        return { consistent: false, score: 0.30, reason: "Form input label sounds like button action" };
      }
    }

    return { consistent: true, score: 1.0 };
  }

  /**
   * Validates Language Consistency.
   */
  public validateLanguageConsistency(proposedLabel: string, context: SafeContext): ValidationCheckResult {
    const reqLang = (context.language || "en").toLowerCase();

    // Basic script validation for English vs Indic scripts
    const containsHindi = /[\u0900-\u097F]/.test(proposedLabel);
    const containsEnglish = /[a-zA-Z]/.test(proposedLabel);

    if (reqLang === "en" && containsHindi && !containsEnglish) {
      return { consistent: false, score: 0.40, reason: "Language mismatch: Hindi script returned for English request" };
    }

    if (reqLang === "hi" && containsEnglish && !containsHindi) {
      return { consistent: false, score: 0.50, reason: "Language mismatch: English script returned for Hindi request" };
    }

    return { consistent: true, score: 1.0 };
  }
}

export const independentValidators = new IndependentValidators();
