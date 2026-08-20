import { IssueType, AllowlistedAttribute } from "@trustportal/schemas";
export interface RuleDefinition {
    ruleId: string;
    issueType: IssueType;
    title: string;
    description: string;
    wcagReference: string;
    ariaSemantics: string;
    gigwRelevance: string;
    severity: "critical" | "serious" | "moderate";
    permittedRemediationAttribute: AllowlistedAttribute;
}
export declare const RULES_REGISTRY: Record<string, RuleDefinition>;
//# sourceMappingURL=rules_registry.d.ts.map