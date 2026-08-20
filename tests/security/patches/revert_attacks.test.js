"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
const vitest_1 = require("vitest");
const patch_applicator_js_1 = require("../../../apps/extension/src/patches/patch_applicator.js");
const fingerprint_js_1 = require("../../../apps/extension/src/patches/fingerprint.js");
(0, vitest_1.describe)("Security Test: Conflict-Aware Revert Protection", () => {
    let patcher;
    let targetBtn;
    (0, vitest_1.beforeEach)(() => {
        document.body.innerHTML = "";
        patcher = new patch_applicator_js_1.PatchApplicator();
        targetBtn = document.createElement("button");
        targetBtn.id = "btn-revert-test";
        document.body.appendChild(targetBtn);
    });
    (0, vitest_1.test)("Invariant 10: Yields conflict and DOES NOT overwrite live DOM if attribute was modified externally", () => {
        const fp = (0, fingerprint_js_1.computeTargetFingerprint)(targetBtn);
        const patch = {
            patchId: "p_revert_conflict_1",
            issueType: "button-name",
            targetFingerprint: fp,
            attribute: "aria-label",
            previousValue: null,
            proposedValue: "TrustPortal Applied Label",
            evidence: [],
            trustScore: 95,
            decision: "auto",
            modelVersion: "v1"
        };
        // 1. Apply Patch
        patcher.applyPatch(patch, targetBtn);
        (0, vitest_1.expect)(targetBtn.getAttribute("aria-label")).toBe("TrustPortal Applied Label");
        // 2. External actor / page script modifies aria-label after patch application
        targetBtn.setAttribute("aria-label", "User / External Script Updated Label");
        // 3. TrustPortal attempts revertPatch
        const revertRes = patcher.revertPatch("p_revert_conflict_1", targetBtn);
        // MUST yield conflict and preserve external modification!
        (0, vitest_1.expect)(revertRes.success).toBe(false);
        (0, vitest_1.expect)(revertRes.reason).toBe("conflict");
        (0, vitest_1.expect)(targetBtn.getAttribute("aria-label")).toBe("User / External Script Updated Label");
    });
});
