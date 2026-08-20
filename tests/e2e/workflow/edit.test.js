"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
const vitest_1 = require("vitest");
const patch_applicator_js_1 = require("../../../apps/extension/src/patches/patch_applicator.js");
const patch_ledger_js_1 = require("../../../apps/extension/src/patches/patch_ledger.js");
const fingerprint_js_1 = require("../../../apps/extension/src/patches/fingerprint.js");
(0, vitest_1.describe)("E2E Test: Proposal Edit Workflow & Custom Label Application", () => {
    let patcher;
    let ledger;
    let targetBtn;
    (0, vitest_1.beforeEach)(() => {
        document.body.innerHTML = "";
        patcher = new patch_applicator_js_1.PatchApplicator();
        ledger = new patch_ledger_js_1.PatchLedger();
        targetBtn = document.createElement("button");
        targetBtn.id = "unnamed-button";
        document.body.appendChild(targetBtn);
    });
    (0, vitest_1.test)("Applies user-edited custom label safely to DOM", () => {
        const fp = (0, fingerprint_js_1.computeTargetFingerprint)(targetBtn);
        const editedLabel = "Download Application Documents"; // User-edited label
        const patch = {
            patchId: "patch_edit_1",
            issueType: "button-name",
            targetFingerprint: fp,
            attribute: "aria-label",
            previousValue: null,
            proposedValue: editedLabel,
            evidence: [{ source: "visible_text", quote: "Download" }],
            trustScore: 87,
            decision: "confirm",
            modelVersion: "user-edited"
        };
        const res = patcher.applyPatch(patch, targetBtn);
        (0, vitest_1.expect)(res.success).toBe(true);
        (0, vitest_1.expect)(targetBtn.getAttribute("aria-label")).toBe("Download Application Documents");
    });
});
