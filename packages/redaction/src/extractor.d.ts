import { SafeContext, IssueType } from "@trustportal/schemas";
import { ContextBudget } from "./types.js";
export interface ExtractionInput {
    issueType: IssueType;
    ruleId: string;
    elementRole: string | null;
    rawAttributes: Record<string, string>;
    visibleElementText?: string;
    associatedLabel?: string;
    nearestHeading?: string;
    nearestLandmark?: string;
    nearbySiblingText?: string;
    url: string;
    language?: string;
}
export declare class MinimalContextExtractor {
    private budget;
    constructor(budget?: ContextBudget);
    /**
     * Extracts a bounded, sanitized SafeContext object from ExtractionInput.
     */
    extract(input: ExtractionInput): {
        safeContext: SafeContext;
        redactionFlags: string[];
    };
    private truncate;
}
export declare const minimalExtractor: MinimalContextExtractor;
//# sourceMappingURL=extractor.d.ts.map