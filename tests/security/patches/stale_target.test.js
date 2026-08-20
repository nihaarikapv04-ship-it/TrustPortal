"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
const vitest_1 = require("vitest");
const patch_applicator_js_1 = require("../../../apps/extension/src/patches/patch_applicator.js");
const fingerprint_js_1 = require("../../../apps/extension/src/patches/fingerprint.js");
(0, vitest_1.describe)("Security Test: Stale DOM Target Validation", () => {
    let patcher;
    let targetBtn;
    (0, vitest_1.beforeEach)(() => {
        document.body.innerHTML = "";
        patcher = new patch_applicator_js_1.PatchApplicator();
        targetBtn = document.createElement("button");
        targetBtn.id = "btn-orig";
        document.body.appendChild(targetBtn);
    });
    (0, vitest_1.test)("Invariant 9: REJECTS patch when target element ID/fingerprint changes after proposal", () => {
        const originalFp = (0, fingerprint_js_1.computeTargetFingerprint)(targetBtn);
        // Attacker or dynamic script changes target ID before patch application
        targetBtn.id = "btn-modified-by-attacker";
        const patch = {
            patchId: "p_stale_1",
            issueType: "button-name",
            targetFingerprint: originalFp, // Stale fingerprint!
            attribute: "aria-label",
            previousValue: null,
            proposedValue: "Download Form",
            evidence: [],
            trustScore: 95,
            decision: "auto",
            modelVersion: "v1"
        };
        const res = patcher.applyPatch(patch, targetBtn);
        (0, vitest_1.expect)(res.success).toBe(false);
        (0, vitest_1.expect)(res.reason).toBe("fingerprint-mismatch");
        (0, vitest_1.expect)(targetBtn.getAttribute("aria-label")).toBeNull();
    });
});
