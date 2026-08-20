/**
 * Dynamic DOM Observer for Scanning Dynamically Inserted Candidates.
 * Includes debouncing and MutationObserver loop prevention.
 */
import { DetectedCandidate } from "./detector.js";
export declare class DynamicDOMObserver {
    private detector;
    private observer;
    private onCandidatesDetected;
    private debounceTimer;
    constructor(onCandidatesDetected: (candidates: DetectedCandidate[]) => void);
    /**
     * Starts observing dynamic DOM mutations.
     */
    start(root?: Node): void;
    stop(): void;
    scanDOM(root: HTMLElement): void;
}
//# sourceMappingURL=dynamic_observer.d.ts.map