/**
 * Storage Abstraction around chrome.storage.local for Policy & State Management.
 * Ephemeral-safe: Works reliably across MV3 Service Worker restarts.
 */
export interface SiteStatus {
    origin: string;
    enabled: boolean;
    issuesDetected: number;
    proposalsPending: number;
    repairsApplied: number;
}
export declare class PolicyStorage {
    private fallbackStore;
    /**
     * Retrieves whether TrustPortal is enabled for a given origin.
     */
    isSiteEnabled(origin: string): Promise<boolean>;
    /**
     * Toggles enabled/disabled state for a given origin.
     */
    setSiteEnabled(origin: string, enabled: boolean): Promise<void>;
    /**
     * Returns current site status summary.
     */
    getSiteStatus(origin: string): Promise<SiteStatus>;
}
export declare const policyStorage: PolicyStorage;
//# sourceMappingURL=storage.d.ts.map