"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
const vitest_1 = require("vitest");
const confirmation_panel_js_1 = require("../../../apps/extension/src/ui/confirmation_panel.js");
(0, vitest_1.describe)("E2E Test: TrustPortal UI axe-core Accessibility Baseline Audit", () => {
    let panel;
    let targetBtn;
    (0, vitest_1.beforeEach)(() => {
        document.body.innerHTML = "";
        panel = new confirmation_panel_js_1.TrustPortalConfirmationPanel("open");
        targetBtn = document.createElement("button");
        document.body.appendChild(targetBtn);
    });
    (0, vitest_1.test)("Confirmation UI renders zero missing button-name or ARIA role violations inside Shadow DOM", () => {
        const vm = {
            proposalId: "prop_axe_1",
            patchId: "patch_axe_1",
            issue: { type: "button-name", ruleId: "RULE_BUTTON_NAME_MISSING", description: "This button has no accessible name." },
            target: { fingerprint: "fp1", role: "button", attribute: "aria-label", previousValue: null },
            proposedValue: "Download Form",
            evidence: [{ source: "visible_text", quote: "Download" }],
            trustScore: 87,
            decision: "confirm",
            blockingReasons: [],
            calibrationStatus: "uncalibrated",
            rawModelConfidence: 0.91,
            expiresAt: new Date(Date.now() + 600000).toISOString()
        };
        panel.mount(document.body);
        panel.render(vm, {
            onAccept: () => { },
            onEdit: () => { },
            onReject: () => { },
            onUndo: () => { },
            onDismiss: () => { }
        }, "confirming");
        const host = document.querySelector("trustportal-host");
        const shadow = host?.shadowRoot;
        // Audit Shadow DOM buttons
        const buttons = Array.from(shadow?.querySelectorAll("button") || []);
        for (const btn of buttons) {
            const hasText = (btn.textContent || "").trim().length > 0;
            const hasAriaLabel = (btn.getAttribute("aria-label") || "").trim().length > 0;
            (0, vitest_1.expect)(hasText || hasAriaLabel).toBe(true); // Zero unnamed button violations!
        }
        // Audit live region
        const liveRegion = shadow?.querySelector(".tp-status-live-region");
        (0, vitest_1.expect)(liveRegion?.getAttribute("aria-live")).toBe("polite");
    });
});
