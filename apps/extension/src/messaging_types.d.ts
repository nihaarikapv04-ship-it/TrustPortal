import { Decision, EvidenceItem } from "@trustportal/schemas";
export type ExtensionMessageType = "SCAN_REQUEST" | "SCAN_RESPONSE" | "PROPOSAL_REQUEST" | "PROPOSAL_RESPONSE" | "PROPOSAL_ACCEPT" | "PROPOSAL_EDIT" | "PROPOSAL_REJECT" | "PATCH_APPLIED" | "PATCH_REVERT" | "PATCH_CONFLICT" | "POLICY_QUERY" | "POLICY_RESPONSE";
export interface ExtensionMessage<T = any> {
    type: ExtensionMessageType;
    payload: T;
    requestId?: string;
}
export declare function createMessage<T>(type: ExtensionMessageType, payload: T, requestId?: string): ExtensionMessage<T>;
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
//# sourceMappingURL=messaging_types.d.ts.map