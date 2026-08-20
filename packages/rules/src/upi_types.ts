export type DomainMode = "GENERIC_WEB" | "UPI_FINANCIAL";

export type UpiTransactionCriticalField =
  | "amount"
  | "currency"
  | "recipient"
  | "recipientUpiId"
  | "senderAccount"
  | "bankAccount"
  | "transactionId"
  | "paymentUrl"
  | "deepLink"
  | "paymentStatus"
  | "authorizationState"
  | "otp"
  | "pin"
  | "cvv"
  | "authenticationToken"
  | "sessionToken";

export type UpiTransactionCriticalAttribute =
  | "href"
  | "src"
  | "action"
  | "formaction"
  | "onclick"
  | "onchange"
  | "oninput"
  | "style"
  | "innerHTML"
  | "outerHTML";

export type UpiSecurityEventType =
  | "UPI_POLICY_ALLOW"
  | "UPI_POLICY_BLOCK"
  | "UPI_TRANSACTION_FIELD_BLOCK"
  | "UPI_NAVIGATION_BLOCK"
  | "UPI_AUTH_FIELD_BLOCK"
  | "UPI_AMBIGUOUS_ABSTAIN";

export interface UpiSecurityLogEvent {
  timestamp: string;
  eventType: UpiSecurityEventType;
  candidateId: string;
  reason: string;
  securityDecision: "ALLOW" | "BLOCK" | "ABSTAIN";
}

export interface UpiProposal {
  candidateId: string;
  targetAttribute: string;
  proposedValue: string;
  trustedOriginalText?: string;
  targetFieldType?: string;
  targetAttributes?: Record<string, string>;
}

export interface UpiPolicyResult {
  allowed: boolean;
  decision: "ALLOW" | "BLOCK" | "ABSTAIN";
  reason: string;
  eventType: UpiSecurityEventType;
}
