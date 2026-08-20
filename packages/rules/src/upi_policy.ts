import {
  DomainMode,
  UpiTransactionCriticalField,
  UpiTransactionCriticalAttribute,
  UpiProposal,
  UpiPolicyResult
} from "./upi_types.js";

export class UpiSecurityPolicy {
  public static readonly CRITICAL_FIELDS: Set<UpiTransactionCriticalField> = new Set([
    "amount",
    "currency",
    "recipient",
    "recipientUpiId",
    "senderAccount",
    "bankAccount",
    "transactionId",
    "paymentUrl",
    "deepLink",
    "paymentStatus",
    "authorizationState",
    "otp",
    "pin",
    "cvv",
    "authenticationToken",
    "sessionToken"
  ]);

  public static readonly CRITICAL_ATTRIBUTES: Set<UpiTransactionCriticalAttribute> = new Set([
    "href",
    "src",
    "action",
    "formaction",
    "onclick",
    "onchange",
    "oninput",
    "style",
    "innerHTML",
    "outerHTML"
  ]);

  public static readonly ALLOWED_PATCH_ATTRIBUTES: Set<string> = new Set([
    "alt",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "role"
  ]);

  public evaluateProposal(proposal: UpiProposal, mode: DomainMode): UpiPolicyResult {
    // If in GENERIC_WEB mode, pass through
    if (mode !== "UPI_FINANCIAL") {
      return {
        allowed: true,
        decision: "ALLOW",
        reason: "Generic web mode active",
        eventType: "UPI_POLICY_ALLOW"
      };
    }

    // 1. Must target an allowlisted accessibility attribute
    if (!UpiSecurityPolicy.ALLOWED_PATCH_ATTRIBUTES.has(proposal.targetAttribute)) {
      return {
        allowed: false,
        decision: "BLOCK",
        reason: `Target attribute '${proposal.targetAttribute}' is not an allowlisted accessibility attribute`,
        eventType: "UPI_POLICY_BLOCK"
      };
    }

    // 2. Reject mutation if target field is transaction-critical (e.g. amount, recipient, otp, pin)
    if (proposal.targetFieldType && UpiSecurityPolicy.CRITICAL_FIELDS.has(proposal.targetFieldType as UpiTransactionCriticalField)) {
      const field = proposal.targetFieldType;
      if (field === "otp" || field === "pin" || field === "cvv" || field === "sessionToken" || field === "authenticationToken") {
        return {
          allowed: false,
          decision: "BLOCK",
          reason: `AI proposal attempted write to secret credential field '${field}'`,
          eventType: "UPI_AUTH_FIELD_BLOCK"
        };
      }
      return {
        allowed: false,
        decision: "BLOCK",
        reason: `AI proposal attempted write to transaction-critical field '${field}'`,
        eventType: "UPI_TRANSACTION_FIELD_BLOCK"
      };
    }

    // 3. Reject proposals attempting navigation or javascript execution
    if (/javascript:|http:\/\/|https:\/\//i.test(proposal.proposedValue)) {
      return {
        allowed: false,
        decision: "BLOCK",
        reason: "AI proposal contains forbidden URL or navigation script",
        eventType: "UPI_NAVIGATION_BLOCK"
      };
    }

    // 4. Reject attempts to alter financial amounts or recipients in accessible text
    if (proposal.trustedOriginalText && proposal.proposedValue) {
      const origAmount = proposal.trustedOriginalText.match(/(?:₹|\bINR\b|\bRs\.?\b)\s*[\d,]+/i)?.[0];
      const propAmount = proposal.proposedValue.match(/(?:₹|\bINR\b|\bRs\.?\b)\s*[\d,]+/i)?.[0];
      if (origAmount && propAmount && origAmount !== propAmount) {
        return {
          allowed: false,
          decision: "BLOCK",
          reason: `AI proposal altered financial amount from '${origAmount}' to '${propAmount}'`,
          eventType: "UPI_TRANSACTION_FIELD_BLOCK"
        };
      }

      const origUpi = proposal.trustedOriginalText.match(/[\w.-]+@[\w.-]+/)?.[0];
      const propUpi = proposal.proposedValue.match(/[\w.-]+@[\w.-]+/)?.[0];
      if (origUpi && propUpi && origUpi !== propUpi) {
        return {
          allowed: false,
          decision: "BLOCK",
          reason: `AI proposal altered recipient UPI ID from '${origUpi}' to '${propUpi}'`,
          eventType: "UPI_TRANSACTION_FIELD_BLOCK"
        };
      }
    }

    // 5. Ambiguity check: If proposed text is ambiguous or contains prompt injection keywords
    if (/IGNORE PREVIOUS|SYSTEM OVERRIDE|TRANSFER ALL/i.test(proposal.proposedValue)) {
      return {
        allowed: false,
        decision: "ABSTAIN",
        reason: "Prompt injection or ambiguous payment semantics detected",
        eventType: "UPI_AMBIGUOUS_ABSTAIN"
      };
    }

    return {
      allowed: true,
      decision: "ALLOW",
      reason: "UPI transaction safety policy passed",
      eventType: "UPI_POLICY_ALLOW"
    };
  }
}
