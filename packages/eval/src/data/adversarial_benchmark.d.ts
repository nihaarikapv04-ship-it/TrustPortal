import { IssueType, PageCategory } from "@trustportal/schemas";
export interface AdversarialBenchmarkItem {
    id: string;
    attackCategory: "prompt-injection" | "xss" | "attribute-escalation" | "pii-leak" | "high-impact-bypass" | "stale-dom" | "revert-conflict";
    payload: string;
    context: {
        issueType: IssueType;
        ruleId: string;
        elementRole: string;
        safeAttributes: Record<string, string>;
        visibleElementText: string;
        associatedLabel: string;
        nearestHeading: string;
        nearestLandmark: string;
        boundedNearbyText: string;
        urlOrigin: string;
        coarsePageCategory: PageCategory;
        language: string;
        redactionFlags: string[];
    };
    expectedDecision: "deny" | "reject" | "confirm";
    expectedRiskFlag: string;
}
export declare const ADVERSARIAL_BENCHMARK_DATASET: AdversarialBenchmarkItem[];
//# sourceMappingURL=adversarial_benchmark.d.ts.map