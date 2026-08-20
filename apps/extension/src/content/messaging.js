/**
 * Content Script Messaging Layer.
 * Provides typed message transmission to MV3 Service Worker.
 */

import {
  ExtensionMessageSchema,
  createMessage
} from "../messaging_types.js";

export class ContentMessaging {
  async ping() {
    const msg = createMessage("POLICY_QUERY", {});
    const response = await this.sendMessage(msg);
    return response !== null;
  }

  async getStatus(origin) {
    const msg = createMessage("POLICY_QUERY", { origin });
    const response = await this.sendMessage(msg);
    if (response && response.payload) {
      return response.payload;
    }
    return null;
  }

  async setSiteEnabled(origin, enabled) {
    const msg = createMessage("POLICY_QUERY", { origin, enabled });
    const response = await this.sendMessage(msg);
    return response !== null;
  }

  sendMessage(msg) {
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

        resolve(response);
      });
    });
  }
}

export const contentMessaging = new ContentMessaging();
