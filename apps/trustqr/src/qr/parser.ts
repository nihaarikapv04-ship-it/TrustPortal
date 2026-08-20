import { RawDecodedQR, ParsedPaymentData, ParseResult } from "./payment_schema.js";
import { qrValidator } from "./qr_validator.js";

/**
 * Deterministic Payment Payload Parser for TrustQR.
 * Safe prototype subset supporting UPI URIs (`upi://pay?...`).
 */
export class PaymentPayloadParser {
  /**
   * Parses raw decoded QR input into an immutable ParsedPaymentData object or structured failure.
   */
  public parse(input: RawDecodedQR | string): ParseResult {
    const rawText = (typeof input === "string" ? input : input.rawPayload).trim();

    // Security Check 1: Reject dangerous protocol schemes or script execution attempts
    if (qrValidator.isDangerousProtocol(rawText)) {
      return {
        success: false,
        errorCode: "UNSUPPORTED_SCHEME",
        errorMessage: "Security Rejection: Dangerous protocol scheme or script attempt detected in QR payload",
        rawPayload: rawText
      };
    }

    // Check scheme: Only upi:// URI scheme is supported in prototype
    if (!rawText.toLowerCase().startsWith("upi://pay")) {
      return {
        success: false,
        errorCode: "UNSUPPORTED_SCHEME",
        errorMessage: "Unsupported Payment Scheme: Only 'upi://pay' payment URIs are supported",
        rawPayload: rawText
      };
    }

    try {
      // Safely parse URI query string parameters using standard URLSearchParams
      const queryString = rawText.includes("?") ? rawText.split("?")[1] : "";
      const searchParams = new URLSearchParams(queryString);

      // Extract explicit UPI parameters
      const rawRecipient = searchParams.get("pa");
      const rawMerchantName = searchParams.get("pn");
      const rawAmount = searchParams.get("am");
      const rawCurrency = searchParams.get("cu") || "INR";
      const rawTransactionRef = searchParams.get("tr");
      const rawTransactionNote = searchParams.get("tn");

      const warnings: string[] = [];

      // Validate Recipient (pa parameter)
      if (!rawRecipient || !rawRecipient.trim()) {
        return {
          success: false,
          errorCode: "MISSING_RECIPIENT",
          errorMessage: "Malformed Payment Payload: Missing required payee address parameter ('pa')",
          rawPayload: rawText
        };
      }

      const recipient = rawRecipient.trim();
      if (!qrValidator.isValidUPIFormat(recipient)) {
        return {
          success: false,
          errorCode: "SUSPICIOUS_PAYLOAD",
          errorMessage: `Invalid Payee Format: Recipient '${recipient}' is not a valid UPI handle format`,
          rawPayload: rawText
        };
      }

      // Validate Amount (am parameter)
      if (rawAmount === null || rawAmount.trim() === "") {
        return {
          success: false,
          errorCode: "INVALID_AMOUNT",
          errorMessage: "Malformed Payment Payload: Missing required amount parameter ('am')",
          rawPayload: rawText
        };
      }

      const parsedAmount = parseFloat(rawAmount.trim());
      if (!qrValidator.isValidAmount(parsedAmount)) {
        return {
          success: false,
          errorCode: "INVALID_AMOUNT",
          errorMessage: `Invalid Amount: Amount '${rawAmount}' is not a valid non-negative number`,
          rawPayload: rawText
        };
      }

      // Validate Currency (cu parameter)
      const currency = rawCurrency.trim().toUpperCase();
      if (!qrValidator.isValidCurrency(currency)) {
        return {
          success: false,
          errorCode: "INVALID_CURRENCY",
          errorMessage: `Invalid Currency: Currency '${rawCurrency}' is not supported`,
          rawPayload: rawText
        };
      }

      // Collect unrecognised parameters into metadata without trusting them as payment facts
      const metadata: Record<string, string> = {};
      const knownKeys = new Set(["pa", "pn", "am", "cu", "tr", "tn", "mode", "orgid", "sign"]);
      for (const [key, val] of searchParams.entries()) {
        if (!knownKeys.has(key.toLowerCase())) {
          metadata[key] = val;
          warnings.push(`Unrecognised query parameter '${key}' captured in metadata`);
        }
      }

      // Construct immutable payment facts object
      const parsedData: ParsedPaymentData = Object.freeze({
        scheme: "upi",
        recipient,
        merchantName: rawMerchantName ? rawMerchantName.trim() : undefined,
        amount: parsedAmount,
        currency,
        transactionRef: rawTransactionRef ? rawTransactionRef.trim() : undefined,
        transactionNote: rawTransactionNote ? rawTransactionNote.trim() : undefined,
        metadata: Object.freeze(metadata)
      });

      return {
        success: true,
        data: parsedData,
        warnings
      };
    } catch (e: any) {
      return {
        success: false,
        errorCode: "MALFORMED_URI",
        errorMessage: `Malformed URI Parse Failure: ${e.message || "Failed to parse payment string"}`,
        rawPayload: rawText
      };
    }
  }
}

export const paymentPayloadParser = new PaymentPayloadParser();
