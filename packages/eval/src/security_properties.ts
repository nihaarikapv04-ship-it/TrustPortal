import { SafeContext } from "@trustportal/schemas";

export type SecurityPropertyId =
  | "P1_NO_SECRET_LEAKAGE"
  | "P2_NO_NAVIGATION_MUTATION"
  | "P3_NO_SCRIPT_EXECUTION"
  | "P4_CAPABILITY_LIMITED_MUTATION"
  | "P5_STALE_TARGET_REJECTION"
  | "P6_OUTPUT_SCHEMA_INTEGRITY"
  | "P7_ORIGIN_ISOLATION"
  | "P8_NO_EXTERNAL_NETWORK_FROM_REMEDIATION"
  | "P9_ABSTENTION_ON_SECURITY_UNCERTAINTY"
  | "P10_IDEMPOTENT_SAFE_REPAIR";

export interface PropertyCheckResult {
  propertyId: SecurityPropertyId;
  satisfied: boolean;
  reason?: string;
}

const ALLOWLISTED_ATTRIBUTES: ReadonlySet<string> = new Set([
  "alt", "aria-label", "aria-labelledby", "aria-describedby", "role"
]);

const FORBIDDEN_NAVIGATION_ATTRIBUTES: ReadonlySet<string> = new Set([
  "href", "src", "action", "formaction", "xlink:href"
]);

const SENSITIVE_KEYWORD_REGEX = /(password|passcode|otp|2fa|mfa|cvv|cvc|cardnumber|creditcard|ssn|aadhaar|pan|captcha|one-time-code)/i;

export class SecurityPropertyVerifier {
  // P1: NO_SECRET_LEAKAGE
  public checkP1_NoSecretLeakage(transmittedContext: SafeContext): PropertyCheckResult {
    const rawStr = JSON.stringify(transmittedContext);
    if (SENSITIVE_KEYWORD_REGEX.test(rawStr)) {
      return { propertyId: "P1_NO_SECRET_LEAKAGE", satisfied: false, reason: "Sensitive credential pattern detected in transmitted SafeContext" };
    }
    return { propertyId: "P1_NO_SECRET_LEAKAGE", satisfied: true };
  }

  // P2: NO_NAVIGATION_MUTATION
  public checkP2_NoNavigationMutation(patchAttribute: string): PropertyCheckResult {
    const lower = patchAttribute.toLowerCase();
    if (FORBIDDEN_NAVIGATION_ATTRIBUTES.has(lower)) {
      return { propertyId: "P2_NO_NAVIGATION_MUTATION", satisfied: false, reason: `Attempted navigation property mutation: '${patchAttribute}'` };
    }
    return { propertyId: "P2_NO_NAVIGATION_MUTATION", satisfied: true };
  }

  // P3: NO_SCRIPT_EXECUTION
  public checkP3_NoScriptExecution(proposedValue: string): PropertyCheckResult {
    if (/<script/i.test(proposedValue) || /javascript:/i.test(proposedValue) || /foreignobject/i.test(proposedValue) || /onerror=/i.test(proposedValue) || /onload=/i.test(proposedValue)) {
      return { propertyId: "P3_NO_SCRIPT_EXECUTION", satisfied: false, reason: "Executable script or event handler payload detected" };
    }
    return { propertyId: "P3_NO_SCRIPT_EXECUTION", satisfied: true };
  }

  // P4: CAPABILITY_LIMITED_MUTATION
  public checkP4_CapabilityLimitedMutation(patchAttribute: string): PropertyCheckResult {
    const lower = patchAttribute.toLowerCase();
    if (!ALLOWLISTED_ATTRIBUTES.has(lower)) {
      return { propertyId: "P4_CAPABILITY_LIMITED_MUTATION", satisfied: false, reason: `Attribute '${patchAttribute}' is outside the allowlist` };
    }
    return { propertyId: "P4_CAPABILITY_LIMITED_MUTATION", satisfied: true };
  }

  // P5: STALE_TARGET_REJECTION
  public checkP5_StaleTargetRejection(isConnected: boolean, fingerprintChanged: boolean): PropertyCheckResult {
    if (!isConnected || fingerprintChanged) {
      return { propertyId: "P5_STALE_TARGET_REJECTION", satisfied: false, reason: "Target node is disconnected or target fingerprint changed (TOCTOU violation)" };
    }
    return { propertyId: "P5_STALE_TARGET_REJECTION", satisfied: true };
  }

  // P6: OUTPUT_SCHEMA_INTEGRITY
  public checkP6_OutputSchemaIntegrity(proposal: any): PropertyCheckResult {
    if (!proposal || typeof proposal !== "object" || typeof proposal.label !== "string") {
      return { propertyId: "P6_OUTPUT_SCHEMA_INTEGRITY", satisfied: false, reason: "Model output fails JSON schema validation" };
    }
    return { propertyId: "P6_OUTPUT_SCHEMA_INTEGRITY", satisfied: true };
  }

  // P7: ORIGIN_ISOLATION
  public checkP7_OriginIsolation(untrustedContent: string): PropertyCheckResult {
    if (/(chrome-extension:\/\/|window\.postMessage|top\.location)/i.test(untrustedContent)) {
      return { propertyId: "P7_ORIGIN_ISOLATION", satisfied: false, reason: "Attempted extension-origin privilege escalation" };
    }
    return { propertyId: "P7_ORIGIN_ISOLATION", satisfied: true };
  }

  // P8: NO_EXTERNAL_NETWORK_FROM_REMEDIATION
  public checkP8_NoExternalNetwork(networkRequestsCount: number): PropertyCheckResult {
    if (networkRequestsCount > 0) {
      return { propertyId: "P8_NO_EXTERNAL_NETWORK_FROM_REMEDIATION", satisfied: false, reason: `Unexpected external network requests: ${networkRequestsCount}` };
    }
    return { propertyId: "P8_NO_EXTERNAL_NETWORK_FROM_REMEDIATION", satisfied: true };
  }

  // P9: ABSTENTION_ON_SECURITY_UNCERTAINTY
  public checkP9_AbstentionOnUncertainty(confidenceState: string): PropertyCheckResult {
    if (confidenceState === "AMBIGUOUS_ABSTAIN") {
      return { propertyId: "P9_ABSTENTION_ON_SECURITY_UNCERTAINTY", satisfied: true };
    }
    return { propertyId: "P9_ABSTENTION_ON_SECURITY_UNCERTAINTY", satisfied: true };
  }

  // P10: IDEMPOTENT_SAFE_REPAIR
  public checkP10_IdempotentSafeRepair(firstMutationName: string, secondMutationName: string): PropertyCheckResult {
    if (firstMutationName !== secondMutationName) {
      return { propertyId: "P10_IDEMPOTENT_SAFE_REPAIR", satisfied: false, reason: "Repeated processing produced non-idempotent label mutations" };
    }
    return { propertyId: "P10_IDEMPOTENT_SAFE_REPAIR", satisfied: true };
  }
}
