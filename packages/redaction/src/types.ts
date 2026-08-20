import { SafeContext } from "@trustportal/schemas";

export type PageCategory =
  | "public-information"
  | "service-information"
  | "application"
  | "authentication"
  | "payment"
  | "identity"
  | "health"
  | "tax"
  | "legal"
  | "benefits"
  | "unknown";

export type FirewallDecision = "allow" | "redact" | "deny";

export type FirewallResult =
  | {
      decision: "allow";
      safeContext: SafeContext;
      redactionFlags: string[];
    }
  | {
      decision: "redact";
      safeContext: SafeContext;
      redactionFlags: string[];
    }
  | {
      decision: "deny";
      reason: string;
      redactionFlags: string[];
    };

export interface ContextBudget {
  maxElementText: number;
  maxAssociatedLabel: number;
  maxHeading: number;
  maxLandmark: number;
  maxNearbyText: number;
  maxNearbyNodes: number;
  maxTotalCharacters: number;
}
