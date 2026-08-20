/**
 * TrustPortal Content Script Entry Point.
 * Initializes the TrustPortal client runtime, establishes messaging connection with MV3 Service Worker,
 * and sets up lifecycle handlers.
 */

import { contentMessaging } from "./messaging.js";

export class TrustPortalClientRuntime {
  private initialized: boolean = false;
  private currentOrigin: string = window.location.origin;

  public async init(): Promise<void> {
    if (this.initialized) return;

    console.log(`🛡️ TrustPortal Runtime Initializing on [${this.currentOrigin}]...`);

    // Ping background service worker to establish connection
    const pingSuccess = await contentMessaging.ping();
    if (pingSuccess) {
      console.log("✅ TrustPortal Service Worker connection established.");
    } else {
      console.warn("⚠️ TrustPortal Service Worker unreachable or pending startup.");
    }

    // Query site status from worker
    const status = await contentMessaging.getStatus(this.currentOrigin);
    if (status) {
      console.log(`📊 TrustPortal Site Status [${this.currentOrigin}]: Enabled = ${status.enabled}`);
    }

    this.initialized = true;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public destroy(): void {
    this.initialized = false;
    console.log("🛡️ TrustPortal Runtime Shutdown.");
  }
}

// Auto-initialize when content script loads
const runtime = new TrustPortalClientRuntime();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => runtime.init());
} else {
  runtime.init();
}
