import { Decision } from "@trustportal/schemas";
export interface SignalComponents {
    ruleConfidence: number;
    contextAgreement: number;
    modelConfidenceRaw: number;
    modelConfidenceCalibrated: number;
    domConsistency: number;
    candidateAgreement: number;
    visualConfidence: number;
    privacyPenalty: number;
    riskPenalty: number;
}
export type CalibrationStatus = "uncalibrated" | "fitted";
export interface TrustDecision {
    decision: Decision;
    trustScore: number;
    signals: SignalComponents;
    blockingReasons: string[];
    calibrationStatus: CalibrationStatus;
}
export interface AblationConfig {
    usePrivacyPenalty: boolean;
    useEvidenceAgreement: boolean;
    useCalibration: boolean;
    useRiskPenalty: boolean;
    useHumanConfirmation: boolean;
}
export declare const DEFAULT_ABLATION_CONFIG: AblationConfig;
//# sourceMappingURL=types.d.ts.map