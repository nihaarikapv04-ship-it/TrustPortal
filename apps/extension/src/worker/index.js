/**
 * TrustPortal MV3 Service Worker Entry Point.
 * Ephemeral-safe background worker listening for typed messages and managing policy state.
 */
import { handleWorkerMessage } from "./messaging";
if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.onInstalled.addListener(() => {
        console.log("🛡️ TrustPortal TSIF Background Worker Installed.");
    });
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        handleWorkerMessage(message)
            .then((response) => sendResponse(response))
            .catch((err) => {
            sendResponse({
                type: "ERROR_RESPONSE",
                schemaVersion: 1,
                requestId: message?.requestId || "err",
                payload: { error: err.message }
            });
        });
        return true; // Keep async channel open for sendResponse
    });
}
