import { SafeContext, EvidenceItem } from "@trustportal/schemas";
export interface ModelCapabilities {
    text: boolean;
    vision: boolean;
    languages: string[];
    structuredOutput: boolean;
}
export interface InferenceRequest {
    promptVersion: string;
    maxTokens: number;
    temperature: number;
    timeoutMs: number;
}
export interface ModelProposal {
    action: "propose" | "abstain";
    label: string;
    language: string;
    evidence: EvidenceItem[];
    rationale: string;
    modelConfidence: number;
    riskFlags: string[];
}
export interface ModelProvider {
    readonly id: string;
    readonly capabilities: ModelCapabilities;
    proposeLabel(context: SafeContext, request: InferenceRequest): Promise<ModelProposal>;
}
export interface ProviderHealth {
    providerId: string;
    available: boolean;
    failureCount: number;
    lastFailureAt?: Date;
}
//# sourceMappingURL=types.d.ts.map