"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
const vitest_1 = require("vitest");
const confirmation_panel_js_1 = require("../../../apps/extension/src/ui/confirmation_panel.js");
(0, vitest_1.describe)("E2E Test: Confirmation UI Safe Text Node Rendering & XSS Defense", () => {
    let panel;
    let targetBtn;
    (0, vitest_1.beforeEach)(() => {
        document.body.innerHTML = "";
        panel = new confirmation_panel_js_1.TrustPortalConfirmationPanel("open");
        targetBtn = document.createElement("button");
        document.body.appendChild(targetBtn);
    });
    (0, vitest_1.test)("Renders malicious proposal string safely as literal text without executing script nodes", () => {
        const maliciousLabel = "<script>alert('xss_attack')</script> Download";
        const vm = {
            proposalId: "prop_xss_1",
            patchId: "patch_xss_1",
            issue: { type: "button-name", ruleId: "RULE_BUTTON_NAME_MISSING", description: "<img src=x onerror=alert(1)> Issue" },
            target: { fingerprint: "fp1", role: "button", attribute: "aria-label", previousValue: null },
            proposedValue: maliciousLabel,
            evidence: [{ source: "visible_text", quote: "<script>alert(1)</script>" }],
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
        // Verify zero <script> elements rendered inside Shadow DOM
        (0, vitest_1.expect)(shadow?.querySelectorAll("script").length).toBe(0);
        (0, vitest_1.expect)(shadow?.textContent).toContain("<script>alert('xss_attack')</script>");
    });
});
