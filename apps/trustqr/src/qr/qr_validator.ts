/**
 * Deterministic Validation Rules for Payment Payloads.
 * Establishing STRUCTURAL integrity only — does not guarantee recipient legitimacy.
 */

const DANGEROUS_PROTOCOLS_REGEX = /^(javascript:|data:|file:|http:|https:|vbscript:|blob:)/i;
const UPI_ID_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9.\-_]{2,64}$/;
const SUPPORTED_CURRENCIES = new Set(["INR", "USD", "EUR", "GBP"]);

export class QRValidator {
  /**
   * Checks whether the raw string attempts dangerous script execution or protocol navigation.
   */
  public isDangerousProtocol(raw: string): boolean {
    if (!raw) return false;
    return DANGEROUS_PROTOCOLS_REGEX.test(raw.trim());
  }

  /**
   * Validates UPI ID structural format (username@handle).
   */
  public isValidUPIFormat(recipient: string): boolean {
    if (!recipient) return false;
    return UPI_ID_REGEX.test(recipient.trim());
  }

  /**
   * Validates numeric amount.
   */
  public isValidAmount(amount: number): boolean {
    return typeof amount === "number" && !isNaN(amount) && isFinite(amount) && amount >= 0;
  }

  /**
   * Validates 3-letter currency ISO code.
   */
  public isValidCurrency(currency: string): boolean {
    if (!currency || typeof currency !== "string") return false;
    return SUPPORTED_CURRENCIES.has(currency.toUpperCase());
  }
}

export const qrValidator = new QRValidator();
