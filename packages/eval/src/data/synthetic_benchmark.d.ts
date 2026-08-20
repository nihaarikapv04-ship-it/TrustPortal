import { IssueType, PageCategory } from "@trustportal/schemas";
export interface SyntheticBenchmarkItem {
    id: string;
    issueType: IssueType;
    ruleId: string;
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
    expectedLabel: string;
    acceptableLabels: string[];
    language: string;
    pageCategory: PageCategory;
    highImpact: boolean;
}
export declare const SYNTHETIC_BENCHMARK_DATASET: SyntheticBenchmarkItem[];
//# sourceMappingURL=synthetic_benchmark.d.ts.map