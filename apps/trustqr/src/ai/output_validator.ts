import {
  UntrustedPaymentAnalysis,
  ValidatedPaymentExplanation,
  OutputValidationResult
} from "./types.js";

const HTML_TAG_REGEX = /<[^>]*>/g;
const JAVASCRIPT_SCHEME_REGEX = /javascript:/i;
const PROMPT_INJECTION_REGEX = /(ignore|override|bypass|disregard)\s+.*(instructions|rules|system|safety|checks|policy)/i;
const CREDENTIAL_REQUEST_REGEX = /\b(enter|provide|input|send|reveal|share|request)\b.*?\b(pin|otp|password|cvv|cvc|passcode|code)\b/i;
const AUTHORIZATION_CLAIM_REGEX = /(payment\s*authorized|click\s*pay\s*now|automatically\s*approve|transaction\s*confirmed)/i;

export class PaymentOutputValidator {
  /**
   * Deterministically validates raw untrusted AI model output.
   * Rejects executable content, script injection, prompt overrides, credential requests, or authority claims.
   */
  public validate(untrusted: UntrustedPaymentAnalysis): OutputValidationResult {
    const flags: string[] = [];

    if (!untrusted || typeof untrusted !== "object") {
      return {
        success: false,
        data: null,
        rejectionReason: "REJECTION_NULL_INPUT: Analysis output is null or non-object",
        flags: ["INVALID_OBJECT"]
      };
    }

    // 1. Confidence Bounds Check
    const conf = untrusted.confidence;
    if (typeof conf !== "number" || isNaN(conf) || !isFinite(conf) || conf < 0 || conf > 1) {
      return {
        success: false,
        data: null,
        rejectionReason: `REJECTION_INVALID_CONFIDENCE: Confidence score '${conf}' is not a finite number in [0, 1]`,
        flags: ["INVALID_CONFIDENCE"]
      };
    }

    // 2. Risk Level Check
    if (!["low", "medium", "high"].includes(untrusted.riskLevel)) {
      return {
        success: false,
        data: null,
        rejectionReason: `REJECTION_INVALID_RISK_LEVEL: Risk level '${untrusted.riskLevel}' is invalid`,
        flags: ["INVALID_RISK_LEVEL"]
      };
    }

    // 3. Summary Checks & Length Bounds (<= 300 chars)
    if (!untrusted.summary || typeof untrusted.summary !== "string" || !untrusted.summary.trim()) {
      return {
        success: false,
        data: null,
        rejectionReason: "REJECTION_MISSING_SUMMARY: Explanation summary is empty",
        flags: ["MISSING_SUMMARY"]
      };
    }

    const summary = untrusted.summary.trim();
    if (summary.length > 300) {
      return {
        success: false,
        data: null,
        rejectionReason: `REJECTION_SUMMARY_TOO_LONG: Summary length (${summary.length}) exceeds 300 limit`,
        flags: ["SUMMARY_TOO_LONG"]
      };
    }

    // 4. Reasons Bounds Checks (<= 5 items, each <= 200 chars)
    const rawReasons = Array.isArray(untrusted.reasons) ? untrusted.reasons : [];
    if (rawReasons.length > 5) {
      return {
        success: false,
        data: null,
        rejectionReason: `REJECTION_EXCESSIVE_REASONS: Reason count (${rawReasons.length}) exceeds 5 limit`,
        flags: ["EXCESSIVE_REASONS"]
      };
    }

    const cleanReasons: string[] = [];
    for (const r of rawReasons) {
      if (typeof r !== "string" || !r.trim()) continue;
      const cleanR = r.trim();
      if (cleanR.length > 200) {
        return {
          success: false,
          data: null,
          rejectionReason: `REJECTION_REASON_TOO_LONG: Individual reason length exceeds 200 limit`,
          flags: ["REASON_TOO_LONG"]
        };
      }
      cleanReasons.push(cleanR);
    }

    // 5. Verification Steps Bounds Checks (<= 5 items, each <= 200 chars)
    const rawSteps = Array.isArray(untrusted.verificationSteps) ? untrusted.verificationSteps : [];
    if (rawSteps.length > 5) {
      return {
        success: false,
        data: null,
        rejectionReason: `REJECTION_EXCESSIVE_STEPS: Verification step count (${rawSteps.length}) exceeds 5 limit`,
        flags: ["EXCESSIVE_STEPS"]
      };
    }

    const cleanSteps: string[] = [];
    for (const s of rawSteps) {
      if (typeof s !== "string" || !s.trim()) continue;
      const cleanS = s.trim();
      if (cleanS.length > 200) {
        return {
          success: false,
          data: null,
          rejectionReason: `REJECTION_STEP_TOO_LONG: Individual step length exceeds 200 limit`,
          flags: ["STEP_TOO_LONG"]
        };
      }
      cleanSteps.push(cleanS);
    }

    // Total explanation character check (<= 1200 chars)
    const totalLength = summary.length + cleanReasons.join("").length + cleanSteps.join("").length;
    if (totalLength > 1200) {
      return {
        success: false,
        data: null,
        rejectionReason: `REJECTION_TOTAL_LENGTH_EXCEEDED: Total explanation length (${totalLength}) exceeds 1200 limit`,
        flags: ["TOTAL_LENGTH_EXCEEDED"]
      };
    }

    // 6. Security Content Checks: Rejects HTML, script, prompt injection, PIN/OTP request, authorization claims
    const allText = `${summary} ${cleanReasons.join(" ")} ${cleanSteps.join(" ")}`;

    if (HTML_TAG_REGEX.test(allText) || JAVASCRIPT_SCHEME_REGEX.test(allText)) {
      return {
        success: false,
        data: null,
        rejectionReason: "REJECTION_HTML_SCRIPT: AI output contains HTML tags or JavaScript execution syntax",
        flags: ["HTML_SCRIPT_REJECTED"]
      };
    }

    if (PROMPT_INJECTION_REGEX.test(allText)) {
      return {
        success: false,
        data: null,
        rejectionReason: "REJECTION_PROMPT_INJECTION: AI output contains instruction override syntax",
        flags: ["PROMPT_INJECTION_REJECTED"]
      };
    }

    if (CREDENTIAL_REQUEST_REGEX.test(allText)) {
      return {
        success: false,
        data: null,
        rejectionReason: "REJECTION_CREDENTIAL_REQUEST: AI output contains requests for PIN, OTP, or passwords",
        flags: ["CREDENTIAL_REQUEST_REJECTED"]
      };
    }

    if (AUTHORIZATION_CLAIM_REGEX.test(allText)) {
      return {
        success: false,
        data: null,
        rejectionReason: "REJECTION_AUTHORIZATION_CLAIM: AI output attempts to claim transaction authorization or prompt 'Click Pay'",
        flags: ["AUTHORIZATION_CLAIM_REJECTED"]
      };
    }

    flags.push("OUTPUT_VALIDATED_SAFE");

    // Construct Validated Explanation Object (Read-Only)
    const data: ValidatedPaymentExplanation = Object.freeze({
      riskLevel: untrusted.riskLevel,
      summary,
      reasons: Object.freeze(cleanReasons),
      verificationSteps: Object.freeze(cleanSteps),
      confidence: conf,
      validatorFlags: Object.freeze(flags),
      validatedAt: new Date().toISOString()
    });

    return Object.freeze({
      success: true,
      data,
      flags: Object.freeze(flags)
    });
  }
}

export const paymentOutputValidator = new PaymentOutputValidator();
