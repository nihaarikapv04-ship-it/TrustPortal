import { SafeContext } from "@trustportal/schemas";
import { ModelProvider, ModelCapabilities, InferenceRequest, ModelProposal } from "./types.js";
export declare class MockTextProvider implements ModelProvider {
    readonly id = "mock-text-v1";
    readonly capabilities: ModelCapabilities;
    proposeLabel(context: SafeContext, _request: InferenceRequest): Promise<ModelProposal>;
}
export declare class MockVisionProvider implements ModelProvider {
    readonly id = "mock-vision-v1";
    readonly capabilities: ModelCapabilities;
    proposeLabel(context: SafeContext, _request: InferenceRequest): Promise<ModelProposal>;
}
export declare class AdversarialMockProvider implements ModelProvider {
    readonly id = "adversarial-mock-v1";
    readonly capabilities: ModelCapabilities;
    private attackMode;
    constructor(attackMode: "xss" | "injection" | "malformed" | "sensitive");
    proposeLabel(_context: SafeContext, _request: InferenceRequest): Promise<ModelProposal>;
}
//# sourceMappingURL=mock_provider.d.ts.map