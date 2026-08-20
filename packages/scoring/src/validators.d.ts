import { SafeContext } from "@trustportal/schemas";
export interface ValidationCheckResult {
    consistent: boolean;
    score: number;
    reason?: string;
}
export declare class IndependentValidators {
    /**
     * Validates DOM Consistency D in [0.0, 1.0].
     * Verifies proposal remains compatible with target element role and tag.
     */
    validateDomConsistency(proposedLabel: string, context: SafeContext): ValidationCheckResult;
    /**
     * Validates Language Consistency.
     */
    validateLanguageConsistency(proposedLabel: string, context: SafeContext): ValidationCheckResult;
}
export declare const independentValidators: IndependentValidators;
//# sourceMappingURL=validators.d.ts.map