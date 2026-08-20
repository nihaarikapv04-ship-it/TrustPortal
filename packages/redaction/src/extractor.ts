import { SafeContext, IssueType } from "@trustportal/schemas";
import { ContextBudget } from "./types.js";
import { DEFAULT_CONTEXT_BUDGET, classifyPageCategory } from "./policy.js";
import { piiRedactor } from "./redactor.js";

export interface ExtractionInput {
  issueType: IssueType;
  ruleId: string;
  elementRole: string | null;
  rawAttributes: Record<string, string>;
  visibleElementText?: string;
  associatedLabel?: string;
  nearestHeading?: string;
  nearestLandmark?: string;
  nearbySiblingText?: string;
  url: string;
  language?: string;
}

const ALLOWED_ATTRIBUTES_SET: ReadonlySet<string> = new Set([
  "tag",
  "role",
  "alt",
  "title",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "type",
  "lang"
]);

export class MinimalContextExtractor {
  private budget: ContextBudget;

  constructor(budget: ContextBudget = DEFAULT_CONTEXT_BUDGET) {
    this.budget = budget;
  }

  /**
   * Extracts a bounded, sanitized SafeContext object from ExtractionInput.
   */
  public extract(input: ExtractionInput): { safeContext: SafeContext; redactionFlags: string[] } {
    const redactionFlagsSet = new Set<string>();

    // 1. Sanitize & Filter Attributes (Allowlist ONLY!)
    const safeAttributes: Record<string, string> = {};
    for (const [k, v] of Object.entries(input.rawAttributes || {})) {
      const keyLower = k.toLowerCase();
      // Exclude forbidden attributes: value, passwords, onclick, style, etc.
      if (ALLOWED_ATTRIBUTES_SET.has(keyLower)) {
        const redacted = piiRedactor.redact(v);
        safeAttributes[k] = redacted.cleanText;
        redacted.redactionFlags.forEach((f) => redactionFlagsSet.add(f));
      }
    }

    // 2. Sanitize & Truncate Text Fields According to Budget
    const visTextRes = piiRedactor.redact(input.visibleElementText || "");
    visTextRes.redactionFlags.forEach((f) => redactionFlagsSet.add(f));
    const visibleText = this.truncate(visTextRes.cleanText, this.budget.maxElementText);

    const labelRes = piiRedactor.redact(input.associatedLabel || "");
    labelRes.redactionFlags.forEach((f) => redactionFlagsSet.add(f));
    const associatedLabel = this.truncate(labelRes.cleanText, this.budget.maxAssociatedLabel);

    const headingRes = piiRedactor.redact(input.nearestHeading || "");
    headingRes.redactionFlags.forEach((f) => redactionFlagsSet.add(f));
    const nearestHeading = this.truncate(headingRes.cleanText, this.budget.maxHeading);

    const landmarkRes = piiRedactor.redact(input.nearestLandmark || "");
    landmarkRes.redactionFlags.forEach((f) => redactionFlagsSet.add(f));
    const nearestLandmark = this.truncate(landmarkRes.cleanText, this.budget.maxLandmark);

    const nearbyRes = piiRedactor.redact(input.nearbySiblingText || "");
    nearbyRes.redactionFlags.forEach((f) => redactionFlagsSet.add(f));
    const boundedNearbyText = this.truncate(nearbyRes.cleanText, this.budget.maxNearbyText);

    // 3. Sanitize URL (Strip query parameters and secrets!)
    let urlOrigin = "https://local.test";
    let urlPath = "/";
    try {
      const parsed = new URL(input.url);
      urlOrigin = parsed.origin;
      urlPath = parsed.pathname; // Strips query parameters (?token=123)!
    } catch (e) {
      urlOrigin = input.url || "https://local.test";
    }

    // 4. Classify Coarse Page Category
    const coarsePageCategory = classifyPageCategory(urlPath, nearestHeading);

    const safeContext: SafeContext = {
      issueType: input.issueType,
      ruleId: input.ruleId,
      elementRole: input.elementRole || null,
      safeAttributes,
      visibleElementText: visibleText,
      associatedLabel,
      nearestHeading,
      nearestLandmark,
      boundedNearbyText,
      urlOrigin: `${urlOrigin}${urlPath}`,
      coarsePageCategory,
      language: input.language || "en",
      redactionFlags: Array.from(redactionFlagsSet)
    };

    return {
      safeContext,
      redactionFlags: Array.from(redactionFlagsSet)
    };
  }

  private truncate(str: string, maxLen: number): string {
    if (!str) return "";
    const clean = str.trim();
    if (clean.length <= maxLen) return clean;
    return clean.slice(0, maxLen).trim() + "...";
  }
}

export const minimalExtractor = new MinimalContextExtractor();
