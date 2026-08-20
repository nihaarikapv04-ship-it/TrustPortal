import { SafeContext } from "@trustportal/schemas";
import { ModelProposal } from "../providers/types.js";
export interface ValidationResult {
    valid: boolean;
    proposal: ModelProposal;
    reason?: string;
}
export declare class OutputValidator {
    /**
     * Performs deterministic validation of AI model proposal outputs.
     */
    validate(rawProposal: any, context: SafeContext): ValidationResult;
    private reject;
}
export declare const outputValidator: OutputValidator;
//# sourceMappingURL=output_validator.d.ts.map