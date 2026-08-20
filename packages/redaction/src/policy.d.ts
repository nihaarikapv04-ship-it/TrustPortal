import { ContextBudget, PageCategory } from "./types.js";
export declare const DEFAULT_CONTEXT_BUDGET: ContextBudget;
export declare const SENSITIVE_URL_PATTERNS: RegExp[];
/**
 * Deterministically classifies page category based on URL path and page titles/headings.
 * Conservative fallback: "unknown" if uncertain.
 */
export declare function classifyPageCategory(urlPath: string, headingsText?: string): PageCategory;
//# sourceMappingURL=policy.d.ts.map