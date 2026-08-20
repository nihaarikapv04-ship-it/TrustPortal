"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
const vitest_1 = require("vitest");
const patch_applicator_js_1 = require("../../../apps/extension/src/patches/patch_applicator.js");
const patch_ledger_js_1 = require("../../../apps/extension/src/patches/patch_ledger.js");
const fingerprint_js_1 = require("../../../apps/extension/src/patches/fingerprint.js");
(0, vitest_1.describe)("E2E Test: Proposal Undo / Revert Workflow", () => {
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
    (0, vitest_1.test)("Undo restores original DOM state cleanly", () => {
        const fp = (0, fingerprint_js_1.computeTargetFingerprint)(targetBtn);
        const patch = {
            patchId: "patch_undo_1",
            issueType: "button-name",
            targetFingerprint: fp,
            attribute: "aria-label",
            previousValue: null,
            proposedValue: "Download Form",
            evidence: [],
            trustScore: 87,
            decision: "confirm",
            modelVersion: "v1"
        };
        // 1. Apply Patch
        patcher.applyPatch(patch, targetBtn);
        (0, vitest_1.expect)(targetBtn.getAttribute("aria-label")).toBe("Download Form");
        // 2. Revert Patch
        const revertRes = patcher.revertPatch("patch_undo_1", targetBtn);
        (0, vitest_1.expect)(revertRes.success).toBe(true);
        // Target attribute MUST be restored to original null state!
        (0, vitest_1.expect)(targetBtn.getAttribute("aria-label")).toBeNull();
        ledger.recordReverted("patch_undo_1", targetBtn);
        (0, vitest_1.expect)(ledger.getPatchStatus("patch_undo_1")).toBe("reverted");
    });
});
