/**
 * Content Script Messaging Layer.
 * Provides typed message transmission to MV3 Service Worker.
 */

import {
  ExtensionMessage,
  createMessage
} from "../messaging_types.js";

export interface StatusResponsePayload {
  enabled: boolean;
  origin: string;
}

export class ContentMessaging {
  public async ping(): Promise<boolean> {
    const msg = createMessage("POLICY_QUERY" as any, {});
    const response = await this.sendMessage(msg);
    return response !== null;
  }

  public async getStatus(origin: string): Promise<StatusResponsePayload | null> {
    const msg = createMessage("POLICY_QUERY" as any, { origin });
    const response = await this.sendMessage(msg);
    if (response && response.payload) {
      return response.payload as StatusResponsePayload;
    }
    return null;
  }

  public async setSiteEnabled(origin: string, enabled: boolean): Promise<boolean> {
    const msg = createMessage("POLICY_QUERY" as any, { origin, enabled });
    const response = await this.sendMessage(msg);
    return response !== null;
  }

  private sendMessage(msg: ExtensionMessage): Promise<ExtensionMessage | null> {
    return new Promise((resolve) => {
      if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.sendMessage) {
        resolve(null);
        return;
      }

      chrome.runtime.sendMessage(msg, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("TrustPortal Messaging Error:", chrome.runtime.lastError.message);
          resolve(null);
          return;
        }

        resolve(response as ExtensionMessage);
      });
    });
  }
}

export const contentMessaging = new ContentMessaging();
