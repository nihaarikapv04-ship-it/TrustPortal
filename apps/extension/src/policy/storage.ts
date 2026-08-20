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

export class PolicyStorage {
  private fallbackStore: Map<string, any> = new Map();

  /**
   * Retrieves whether TrustPortal is enabled for a given origin.
   */
  public async isSiteEnabled(origin: string): Promise<boolean> {
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
  public async setSiteEnabled(origin: string, enabled: boolean): Promise<void> {
    const key = `disabled_origin_${origin}`;
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      if (enabled) {
        await chrome.storage.local.remove(key);
      } else {
        await chrome.storage.local.set({ [key]: true });
      }
    } else {
      if (enabled) {
        this.fallbackStore.delete(key);
      } else {
        this.fallbackStore.set(key, true);
      }
    }
  }

  /**
   * Returns current site status summary.
   */
  public async getSiteStatus(origin: string): Promise<SiteStatus> {
    const enabled = await this.isSiteEnabled(origin);
    const statsKey = `stats_origin_${origin}`;
    let stats = { issuesDetected: 0, proposalsPending: 0, repairsApplied: 0 };

    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      const data = await chrome.storage.local.get(statsKey);
      if (data[statsKey]) {
        stats = data[statsKey];
      }
    } else if (this.fallbackStore.has(statsKey)) {
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
