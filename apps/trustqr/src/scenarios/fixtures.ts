/**
 * TRUSTQR SYNTHETIC TEST DATA & FIXTURES
 * All data in this file is purely synthetic test data.
 * Contains ZERO real bank accounts, real UPI IDs, or payment credentials.
 */

export interface SyntheticFixture {
  id: string;
  name: string;
  description: string;
  rawPayload: string;
  expectedOutcome: "success" | "failure";
  expectedErrorCode?: string;
  expectedRecipient?: string;
  expectedAmount?: number;
  expectedMerchantName?: string;
}

export const SYNTHETIC_QR_FIXTURES: Record<string, SyntheticFixture> = {
  // A. Normal Payment
  NORMAL_PAYMENT: {
    id: "SYNTH-QR-001",
    name: "Normal Merchant Payment",
    description: "TRUSTQR SYNTHETIC TEST DATA: Valid merchant payment for ABC Electronics (₹2,500)",
    rawPayload: "upi://pay?pa=abc@upi&pn=ABC%20Electronics&am=2500&cu=INR&tr=REF123456",
    expectedOutcome: "success",
    expectedRecipient: "abc@upi",
    expectedAmount: 2500,
    expectedMerchantName: "ABC Electronics"
  },

  // B. Suspicious Recipient Mismatch
  SUSPICIOUS_RECIPIENT: {
    id: "SYNTH-QR-002",
    name: "Suspicious Recipient Mismatch",
    description: "TRUSTQR SYNTHETIC TEST DATA: Displayed merchant ABC Electronics but recipient is random123@upi",
    rawPayload: "upi://pay?pa=random123@upi&pn=ABC%20Electronics&am=2500&cu=INR",
    expectedOutcome: "success",
    expectedRecipient: "random123@upi",
    expectedAmount: 2500,
    expectedMerchantName: "ABC Electronics"
  },

  // C. High-Value Payment
  HIGH_VALUE_PAYMENT: {
    id: "SYNTH-QR-003",
    name: "High-Value Payment",
    description: "TRUSTQR SYNTHETIC TEST DATA: High-value transaction ₹50,000 to unfamiliar recipient",
    rawPayload: "upi://pay?pa=random123@upi&am=50000&cu=INR",
    expectedOutcome: "success",
    expectedRecipient: "random123@upi",
    expectedAmount: 50000
  },

  // D. Malformed QR
  MALFORMED_QR: {
    id: "SYNTH-QR-004",
    name: "Malformed Payload",
    description: "TRUSTQR SYNTHETIC TEST DATA: Corrupted or unparseable QR string",
    rawPayload: "NOT_A_VALID_URI_PAYLOAD_STRING",
    expectedOutcome: "failure",
    expectedErrorCode: "UNSUPPORTED_SCHEME"
  },

  // E. Unsupported Scheme (Dangerous javascript: attack)
  JAVASCRIPT_SCHEME: {
    id: "SYNTH-QR-005",
    name: "JavaScript Scheme Rejection",
    description: "TRUSTQR SYNTHETIC TEST DATA: Attack payload attempting javascript: script injection",
    rawPayload: "javascript:alert('attack')",
    expectedOutcome: "failure",
    expectedErrorCode: "UNSUPPORTED_SCHEME"
  },

  // F. Missing Recipient
  MISSING_RECIPIENT: {
    id: "SYNTH-QR-006",
    name: "Missing Recipient Parameter",
    description: "TRUSTQR SYNTHETIC TEST DATA: UPI payload missing pa parameter",
    rawPayload: "upi://pay?pn=ABC%20Electronics&am=2500&cu=INR",
    expectedOutcome: "failure",
    expectedErrorCode: "MISSING_RECIPIENT"
  },

  // G. Invalid Amount
  INVALID_AMOUNT: {
    id: "SYNTH-QR-007",
    name: "Invalid Amount Value",
    description: "TRUSTQR SYNTHETIC TEST DATA: Amount is negative or non-numeric",
    rawPayload: "upi://pay?pa=abc@upi&am=-500&cu=INR",
    expectedOutcome: "failure",
    expectedErrorCode: "INVALID_AMOUNT"
  },

  // H. Invalid Currency
  INVALID_CURRENCY: {
    id: "SYNTH-QR-008",
    name: "Invalid Currency Code",
    description: "TRUSTQR SYNTHETIC TEST DATA: Currency code is invalid (XYZ)",
    rawPayload: "upi://pay?pa=abc@upi&am=2500&cu=XYZ",
    expectedOutcome: "failure",
    expectedErrorCode: "INVALID_CURRENCY"
  },

  // I. Encoded Merchant Name
  ENCODED_MERCHANT: {
    id: "SYNTH-QR-009",
    name: "Encoded Merchant Name",
    description: "TRUSTQR SYNTHETIC TEST DATA: URL-encoded merchant name space characters",
    rawPayload: "upi://pay?pa=merchant@upi&pn=SevaConnect%20Public%20Store&am=1500&cu=INR",
    expectedOutcome: "success",
    expectedRecipient: "merchant@upi",
    expectedMerchantName: "SevaConnect Public Store"
  },

  // J. Unexpected Query Parameters
  UNEXPECTED_PARAMS: {
    id: "SYNTH-QR-010",
    name: "Unexpected Metadata Parameters",
    description: "TRUSTQR SYNTHETIC TEST DATA: Payload containing custom tracking parameters",
    rawPayload: "upi://pay?pa=abc@upi&am=2500&cu=INR&custom_tracking_id=track_9988",
    expectedOutcome: "success",
    expectedRecipient: "abc@upi",
    expectedAmount: 2500
  }
};
