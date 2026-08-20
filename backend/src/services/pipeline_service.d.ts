/**
 * TSIF Pipeline Service.
 * Implements trust gate policy evaluation, proposal generation, audit logging, and patch ledger.
 */
export interface PatchLedgerEntry {
    patchId: string;
    issueType: string;
    targetSelector: string;
    proposedLabel: string;
    confidence: number;
    thresholdUsed: number;
    decision: "auto" | "confirm" | "reject";
    timestamp: string;
    status: "applied" | "reverted" | "reported";
}
export declare class PipelineService {
    private ledger;
    private auditEvents;
    private policy;
    getPolicy(): {
        targetAlpha: number;
        globalLambdaStar: number;
        roleLambdaStars: {
            "img-alt": number;
            "button-name": number;
            "link-name": number;
            "form-label": number;
        };
        version: string;
    };
    processDefect(payload: any, urlPath: string): {
        patch: {
            patchId: string;
            issueType: string;
            targetFingerprint: any;
            targetSelector: any;
            attribute: string;
            previousValue: null;
            proposedValue: string;
            evidence: never[];
            trustScore: number;
            crcThresholdUsed: number;
            decision: string;
            modelVersion: string;
            timestamp: string;
            status: string;
            reason: string;
        };
    } | {
        patch: {
            patchId: string;
            issueType: string;
            targetFingerprint: any;
            targetSelector: any;
            attribute: string;
            previousValue: null;
            proposedValue: string;
            evidence: string[];
            trustScore: number;
            crcThresholdUsed: any;
            decision: "reject" | "auto" | "confirm";
            modelVersion: string;
            timestamp: string;
            status: string;
            reason?: undefined;
        };
    };
    recordFeedback(patchId: string, feedback: string): {
        success: boolean;
    };
    recordRevert(patchId: string, reason: string): {
        success: boolean;
    };
    private isSensitiveUrl;
    private containsPromptInjection;
    private detectIssueType;
    private getAttributeForIssue;
    private generateProposedLabel;
    private logAudit;
}
//# sourceMappingURL=pipeline_service.d.ts.map