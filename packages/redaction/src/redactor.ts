import { PATTERNS } from "./detectors.js";

export interface RedactionResult {
  cleanText: string;
  redactionFlags: string[];
}

export class PIIRedactor {
  /**
   * Performs deterministic redaction on input string and returns clean text and redaction flags.
   */
  public redact(text: string): RedactionResult {
    if (!text) return { cleanText: "", redactionFlags: [] };

    let cleanText = text;
    const flagsSet = new Set<string>();

    if (PATTERNS.email.test(cleanText)) {
      cleanText = cleanText.replace(PATTERNS.email, () => {
        flagsSet.add("PII_EMAIL_REDACTED");
        return "[REDACTED_EMAIL]";
      });
    }

    if (PATTERNS.phone.test(cleanText)) {
      cleanText = cleanText.replace(PATTERNS.phone, () => {
        flagsSet.add("PII_PHONE_REDACTED");
        return "[REDACTED_PHONE]";
      });
    }

    if (PATTERNS.creditCard.test(cleanText)) {
      cleanText = cleanText.replace(PATTERNS.creditCard, () => {
        flagsSet.add("PII_CARD_REDACTED");
        return "[REDACTED_CARD]";
      });
    }

    if (PATTERNS.ssnAadhaarPan.test(cleanText)) {
      cleanText = cleanText.replace(PATTERNS.ssnAadhaarPan, () => {
        flagsSet.add("PII_ID_REDACTED");
        return "[REDACTED_ID]";
      });
    }

    if (PATTERNS.token.test(cleanText)) {
      cleanText = cleanText.replace(PATTERNS.token, () => {
        flagsSet.add("SECURITY_TOKEN_REDACTED");
        return "[REDACTED_TOKEN]";
      });
    }

    if (PATTERNS.queryStringSecret.test(cleanText)) {
      cleanText = cleanText.replace(PATTERNS.queryStringSecret, () => {
        flagsSet.add("QUERY_SECRET_REDACTED");
        return "?secret=[REDACTED_SECRET]";
      });
    }

    return {
      cleanText,
      redactionFlags: Array.from(flagsSet)
    };
  }
}

export const piiRedactor = new PIIRedactor();
