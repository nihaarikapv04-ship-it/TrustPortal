"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
const vitest_1 = require("vitest");
const patch_applicator_js_1 = require("../../../apps/extension/src/patches/patch_applicator.js");
const patch_ledger_js_1 = require("../../../apps/extension/src/patches/patch_ledger.js");
const fingerprint_js_1 = require("../../../apps/extension/src/patches/fingerprint.js");
(0, vitest_1.describe)("E2E Test: Stale & Conflict Workflows", () => {
    let patcher;
    let ledger;
    let targetBtn;
    (0, vitest_1.beforeEach)(() => {
        document.body.innerHTML = "";
        patcher = new patch_applicator_js_1.PatchApplicator();
        ledger = new patch_ledger_js_1.PatchLedger();
        targetBtn = document.createElement("button");
        targetBtn.id = "target-btn";
        document.body.appendChild(targetBtn);
    });
    (0, vitest_1.test)("Conflict: External attribute update prevents overwrite during revert and yields conflict", () => {
        const fp = (0, fingerprint_js_1.computeTargetFingerprint)(targetBtn);
        const patch = {
            patchId: "patch_conflict_1",
            issueType: "button-name",
            targetFingerprint: fp,
            attribute: "aria-label",
            previousValue: null,
            proposedValue: "TrustPortal Applied Label",
            evidence: [],
            trustScore: 87,
            decision: "confirm",
            modelVersion: "v1"
        };
        patcher.applyPatch(patch, targetBtn);
        (0, vitest_1.expect)(targetBtn.getAttribute("aria-label")).toBe("TrustPortal Applied Label");
        // External script modifies attribute after patch application
        targetBtn.setAttribute("aria-label", "External Script Updated Label");
        // Revert attempt MUST yield conflict and preserve external update!
        const revertRes = patcher.revertPatch("patch_conflict_1", targetBtn);
        (0, vitest_1.expect)(revertRes.success).toBe(false);
        (0, vitest_1.expect)(revertRes.reason).toBe("conflict");
        (0, vitest_1.expect)(targetBtn.getAttribute("aria-label")).toBe("External Script Updated Label");
        ledger.recordConflict("patch_conflict_1", targetBtn);
        (0, vitest_1.expect)(ledger.getPatchStatus("patch_conflict_1")).toBe("conflict");
    });
});
