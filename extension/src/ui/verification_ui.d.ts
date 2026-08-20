/**
 * Human Verification UI (Shadow DOM Panel).
 * Uses a CLOSED Shadow DOM root (mode: "closed") to prevent DOM clickjacking and style hijacking (Marek Tóth research).
 * Fully accessible (keyboard navigable, screen reader compatible).
 */
export interface VerificationPanelProps {
    defectId: string;
    issueType: string;
    targetSelector: string;
    proposedLabel: string;
    confidence: number;
    thresholdUsed: number;
    evidence: string[];
    onAccept: (customLabel?: string) => void;
    onReject: (reason: string) => void;
    onReport: (feedback: string) => void;
}
export declare class ClosedVerificationUI {
    private hostContainer;
    private shadowRoot;
    render(props: VerificationPanelProps): void;
    destroy(): void;
    private escapeHtml;
}
//# sourceMappingURL=verification_ui.d.ts.map