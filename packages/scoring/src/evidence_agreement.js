export class EvidenceAgreementCalculator {
    /**
     * Computes independent context agreement C in [0.0, 1.0] between proposed label and SafeContext evidence.
     */
    computeAgreement(proposedLabel, context) {
        if (!proposedLabel || !proposedLabel.trim())
            return 0.0;
        const labelTokens = this.tokenize(proposedLabel);
        if (labelTokens.length === 0)
            return 0.0;
        const evidenceSources = [
            context.visibleElementText,
            context.associatedLabel,
            context.nearestHeading,
            context.boundedNearbyText
        ].filter(Boolean);
        if (evidenceSources.length === 0)
            return 0.20; // Default baseline baseline
        let maxMatchRatio = 0.0;
        for (const sourceText of evidenceSources) {
            const sourceTokens = new Set(this.tokenize(sourceText));
            if (sourceTokens.size === 0)
                continue;
            let matchedCount = 0;
            for (const token of labelTokens) {
                if (sourceTokens.has(token)) {
                    matchedCount++;
                }
            }
            const ratio = matchedCount / labelTokens.length;
            if (ratio > maxMatchRatio) {
                maxMatchRatio = ratio;
            }
        }
        return Math.max(0.10, Math.min(1.0, maxMatchRatio));
    }
    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter((t) => t.length > 2); // Exclude short stop words
    }
}
export const evidenceAgreementCalculator = new EvidenceAgreementCalculator();
