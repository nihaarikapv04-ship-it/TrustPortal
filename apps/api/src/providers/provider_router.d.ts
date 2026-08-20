import { SafeContext } from "@trustportal/schemas";
import { ModelProvider, ModelProposal, InferenceRequest } from "./types.js";
export interface InferenceResult {
    proposal: ModelProposal;
    providerId: string;
    latencyMs: number;
    promptVersion: string;
}
export declare class ModelRouter {
    private providers;
    private defaultTextProvider;
    private defaultVisionProvider;
    constructor(textProvider?: ModelProvider, visionProvider?: ModelProvider);
    registerProvider(provider: ModelProvider): void;
    /**
     * Routes SafeContext to the appropriate ModelProvider with timeout, retry, and validation bounds.
     */
    routeAndInference(context: SafeContext, requestParams?: Partial<InferenceRequest>): Promise<InferenceResult>;
    private selectProvider;
    private executeWithTimeout;
}
export declare const modelRouter: ModelRouter;
//# sourceMappingURL=provider_router.d.ts.map