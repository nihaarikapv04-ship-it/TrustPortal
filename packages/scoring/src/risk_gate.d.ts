import { SafeContext } from "@trustportal/schemas";
import { TrustDecision, AblationConfig } from "./types.js";
import { CalibrationModel } from "./calibration.js";
export declare class TSIFRiskGate {
    private calibrationModel;
    private ablationConfig;
    constructor(calibrationModel?: CalibrationModel, ablationConfig?: AblationConfig);
    /**
     * Evaluates AI Model Proposal against signals, TAS formula, and Non-Compensable Risk Gate.
     */
    evaluateProposal(proposedLabel: string, rawModelConfidence: number, context: SafeContext): TrustDecision;
}
export declare const tsifRiskGate: TSIFRiskGate;
//# sourceMappingURL=risk_gate.d.ts.map