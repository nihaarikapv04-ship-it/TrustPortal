import { SafeContext } from "@trustportal/schemas";
export declare class EvidenceAgreementCalculator {
    /**
     * Computes independent context agreement C in [0.0, 1.0] between proposed label and SafeContext evidence.
     */
    computeAgreement(proposedLabel: string, context: SafeContext): number;
    private tokenize;
}
export declare const evidenceAgreementCalculator: EvidenceAgreementCalculator;
//# sourceMappingURL=evidence_agreement.d.ts.map