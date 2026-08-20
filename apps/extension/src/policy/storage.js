/**
 * Storage Abstraction around chrome.storage.local for Policy & State Management.
 * Ephemeral-safe: Works reliably across MV3 Service Worker restarts.
 */
export class PolicyStorage {
    fallbackStore = new Map();
    /**
     * Retrieves whether TrustPortal is enabled for a given origin.
     */
    async isSiteEnabled(origin) {
        const key = `disabled_origin_${origin}`;
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            const data = await chrome.storage.local.get(key);
            return !data[key];
        }
        return !this.fallbackStore.get(key);
    }
    /**
     * Toggles enabled/disabled state for a given origin.
     */
    async setSiteEnabled(origin, enabled) {
        const key = `disabled_origin_${origin}`;
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            if (enabled) {
                await chrome.storage.local.remove(key);
            }
            else {
                await chrome.storage.local.set({ [key]: true });
            }
        }
        else {
            if (enabled) {
                this.fallbackStore.delete(key);
            }
            else {
                this.fallbackStore.set(key, true);
            }
        }
    }
    /**
     * Returns current site status summary.
     */
    async getSiteStatus(origin) {
        const enabled = await this.isSiteEnabled(origin);
        const statsKey = `stats_origin_${origin}`;
        let stats = { issuesDetected: 0, proposalsPending: 0, repairsApplied: 0 };
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            const data = await chrome.storage.local.get(statsKey);
            if (data[statsKey]) {
                stats = data[statsKey];
            }
        }
        else if (this.fallbackStore.has(statsKey)) {
            stats = this.fallbackStore.get(statsKey);
        }
        return {
            origin,
            enabled,
            issuesDetected: stats.issuesDetected || 0,
            proposalsPending: stats.proposalsPending || 0,
            repairsApplied: stats.repairsApplied || 0
        };
    }
}
export const policyStorage = new PolicyStorage();
