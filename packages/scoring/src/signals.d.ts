import { SafeContext } from "@trustportal/schemas";
import { SignalComponents } from "./types.js";
import { CalibrationModel } from "./calibration.js";
export declare function computeRuleConfidence(ruleId: string): number;
export declare function computePrivacyPenalty(context: SafeContext): number;
export declare function computeRiskPenalty(coarseCategory: string): number;
export declare class SignalExtractor {
    extractSignals(proposedLabel: string, rawModelConfidence: number, context: SafeContext, calibrationModel?: CalibrationModel): SignalComponents;
}
export declare const signalExtractor: SignalExtractor;
//# sourceMappingURL=signals.d.ts.map