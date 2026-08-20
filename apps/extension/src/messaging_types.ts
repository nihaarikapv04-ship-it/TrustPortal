import { z } from "zod";
import { SemanticPatch, Decision, EvidenceItem } from "@trustportal/schemas";

export type ExtensionMessageType =
  | "SCAN_REQUEST"
  | "SCAN_RESPONSE"
  | "PROPOSAL_REQUEST"
  | "PROPOSAL_RESPONSE"
  | "PROPOSAL_ACCEPT"
  | "PROPOSAL_EDIT"
  | "PROPOSAL_REJECT"
  | "PATCH_APPLIED"
  | "PATCH_REVERT"
  | "PATCH_CONFLICT"
  | "POLICY_QUERY"
  | "POLICY_RESPONSE"
  | "PING"
  | "STATUS_RESPONSE"
  | "GET_STATUS"
  | "SET_SITE_ENABLED"
  | "ERROR_RESPONSE";

export const ExtensionMessageSchema = z.object({
  type: z.string(),
  payload: z.any().optional(),
  requestId: z.string().optional()
});

export const SetSiteEnabledPayloadSchema = z.object({
  origin: z.string(),
  enabled: z.boolean()
});

export interface ExtensionMessage<T = any> {
  type: ExtensionMessageType;
  payload: T;
  requestId?: string;
}

export function createMessage<T>(type: ExtensionMessageType, payload?: T, requestId?: string): ExtensionMessage<T> {
  return {
    type,
    payload: payload as T,
    requestId: requestId || `req_${Math.random().toString(36).substring(2, 9)}`
  };
}

export interface ConfirmationViewModel {
  proposalId: string;
  patchId: string;
  issue: {
    type: string;
    ruleId: string;
    description: string;
  };
  target: {
    fingerprint: string;
    role: string;
    attribute: "alt" | "aria-label" | "aria-labelledby" | "aria-describedby";
    previousValue: string | null;
  };
  proposedValue: string;
  evidence: EvidenceItem[];
  trustScore: number;
  decision: Decision;
  blockingReasons: string[];
  calibrationStatus: "uncalibrated" | "fitted";
  rawModelConfidence: number;
  expiresAt: string;
}
