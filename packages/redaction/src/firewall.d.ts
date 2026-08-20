import { FirewallResult } from "./types.js";
import { MinimalContextExtractor, ExtractionInput } from "./extractor.js";
export declare class PrivacyFirewall {
    private extractor;
    constructor(extractor?: MinimalContextExtractor);
    /**
     * Processes an ExtractionInput through the Privacy Firewall.
     * Target Intersection Rule: Denies processing if target element or URL belongs to a sensitive workflow.
     */
    evaluate(input: ExtractionInput): FirewallResult;
    private isSensitiveElement;
    private isSensitiveUrl;
}
export declare const privacyFirewall: PrivacyFirewall;
//# sourceMappingURL=firewall.d.ts.map