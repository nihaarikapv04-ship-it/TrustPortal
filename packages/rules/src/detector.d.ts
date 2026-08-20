import { IssueType, AllowlistedAttribute } from "@trustportal/schemas";
import { AccessibleNameComputer, ElementRepresentation } from "./acc_name.js";
export interface DetectedCandidate {
    candidateId: string;
    ruleId: string;
    issueType: IssueType;
    selector: string;
    tag: string;
    role: string | null;
    attributes: Record<string, string>;
    currentAccessibleName: string;
    severity: "critical" | "serious" | "moderate";
    wcagReference: string;
    permittedRemediationAttribute: AllowlistedAttribute;
}
export declare class DeterministicDetector {
    private computer;
    constructor(computer?: AccessibleNameComputer);
    /**
     * Scans a list of ElementRepresentations for accessibility defects.
     */
    scan(elements: ElementRepresentation[]): DetectedCandidate[];
    /**
     * Evaluates if element should be strictly EXCLUDED from defect flagging.
     */
    shouldExclude(elem: ElementRepresentation): boolean;
    private createCandidate;
}
//# sourceMappingURL=detector.d.ts.map