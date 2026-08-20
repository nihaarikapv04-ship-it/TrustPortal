import {
  RawPaymentContext,
  SanitizedPaymentContext,
  PaymentPrivacyResult,
  PrivacyDecision,
  PrivacyFlag
} from "./types.js";

const SENSITIVE_KEY_DENIAL_MAP: Record<string, PrivacyFlag> = {
  otp: "SENSITIVE_OTP_DENIED",
  pin: "SENSITIVE_PIN_DENIED",
  upipin: "SENSITIVE_PIN_DENIED",
  password: "SENSITIVE_PASSWORD_DENIED",
  passwd: "SENSITIVE_PASSWORD_DENIED",
  cvv: "SENSITIVE_CVV_DENIED",
  cvc: "SENSITIVE_CVV_DENIED",
  card: "SENSITIVE_CARD_DENIED",
  cardnumber: "SENSITIVE_CARD_DENIED",
  accountnumber: "SENSITIVE_ACCOUNT_DENIED",
  token: "SENSITIVE_TOKEN_DENIED",
  authorization: "SENSITIVE_TOKEN_DENIED",
  secret: "SENSITIVE_TOKEN_DENIED"
};

const SENSITIVE_VALUE_DENIAL_REGEX = /(otp|upi\s*pin|password|cvv|credit\s*card|account\s*number|bearer\s+[a-z0-9\-_.]+)/i;

export class PaymentPrivacyFilter {
  /**
   * Evaluates raw payment context against TrustQR privacy boundary rules.
   * Produces ALLOW, REDACT, or DENY results with zero credential leakage.
   */
  public evaluate(rawContext: RawPaymentContext): PaymentPrivacyResult {
    const flags: PrivacyFlag[] = [];
    const parsedData = rawContext.parsedData;
    const validationResult = rawContext.validationResult;
    const metadata = { ...parsedData.metadata, ...(rawContext.rawMetadata || {}) };

    // 1. Hard Denial Check: Inspect metadata keys and values for authentication secrets
    const denialReason = this.detectSensitiveCredentials(metadata, parsedData, flags);
    if (denialReason) {
      return Object.freeze({
        decision: "deny",
        sanitizedContext: null,
        flags: Object.freeze(flags),
        reason: denialReason,
        evaluatedAt: new Date().toISOString()
      });
    }

    // 2. Metadata Redaction: Scrub non-essential sensitive metadata strings
    const { sanitizedMetadata, wasRedacted } = this.sanitizeMetadata(metadata);
    if (wasRedacted) {
      flags.push("UNSAFE_METADATA_REDACTED");
    }

    if (flags.length === 0) {
      flags.push("SAFE_CONTEXT");
    }

    const decision: PrivacyDecision = wasRedacted ? "redact" : "allow";

    // 3. Construct Minimal Sanitized Context (Read-Only)
    const sanitizedContext: SanitizedPaymentContext = Object.freeze({
      recipient: parsedData.recipient,
      merchantName: parsedData.merchantName,
      amount: parsedData.amount,
      currency: parsedData.currency,
      transactionRef: parsedData.transactionRef,
      validationStatus: validationResult.status,
      riskIndicators: validationResult.riskIndicators,
      sanitizedMetadata: Object.freeze(sanitizedMetadata)
    });

    return Object.freeze({
      decision,
      sanitizedContext,
      flags: Object.freeze(flags),
      evaluatedAt: new Date().toISOString()
    });
  }

  private detectSensitiveCredentials(
    metadata: Record<string, string>,
    parsedData: any,
    flags: PrivacyFlag[]
  ): string | null {
    // Check metadata keys (case-insensitive)
    for (const rawKey of Object.keys(metadata)) {
      const cleanKey = rawKey.toLowerCase().replace(/[^a-z]/g, "");
      if (SENSITIVE_KEY_DENIAL_MAP[cleanKey]) {
        const flag = SENSITIVE_KEY_DENIAL_MAP[cleanKey];
        flags.push(flag);
        return `SENSITIVE_CREDENTIAL_DENIAL: High-risk authentication secret key detected in payload metadata`;
      }

      // Check metadata values for credential request strings
      const value = metadata[rawKey] || "";
      if (SENSITIVE_VALUE_DENIAL_REGEX.test(value)) {
        flags.push("SENSITIVE_TOKEN_DENIED");
        return `SENSITIVE_CREDENTIAL_DENIAL: Authentication credential value pattern detected in metadata`;
      }
    }

    // Check transaction note / merchant name text
    const textNote = `${parsedData.merchantName || ""} ${parsedData.transactionNote || ""}`;
    if (SENSITIVE_VALUE_DENIAL_REGEX.test(textNote)) {
      flags.push("SENSITIVE_TOKEN_DENIED");
      return `SENSITIVE_CREDENTIAL_DENIAL: Sensitive credential pattern detected in payment text parameters`;
    }

    return null;
  }

  private sanitizeMetadata(metadata: Record<string, string>): {
    sanitizedMetadata: Record<string, string>;
    wasRedacted: boolean;
  } {
    const sanitizedMetadata: Record<string, string> = {};
    let wasRedacted = false;

    for (const [key, val] of Object.entries(metadata)) {
      if (!val || typeof val !== "string") continue;

      let cleanVal = val;
      // Redact email addresses or phone numbers in metadata if present
      if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(cleanVal)) {
        cleanVal = cleanVal.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, "[REDACTED_EMAIL]");
        wasRedacted = true;
      }

      if (/\b\d{10,12}\b/.test(cleanVal)) {
        cleanVal = cleanVal.replace(/\b\d{10,12}\b/g, "[REDACTED_PHONE]");
        wasRedacted = true;
      }

      sanitizedMetadata[key] = cleanVal;
    }

    return { sanitizedMetadata, wasRedacted };
  }
}

export const paymentPrivacyFilter = new PaymentPrivacyFilter();
