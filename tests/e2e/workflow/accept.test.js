"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
const vitest_1 = require("vitest");
const patch_applicator_js_1 = require("../../../apps/extension/src/patches/patch_applicator.js");
const patch_ledger_js_1 = require("../../../apps/extension/src/patches/patch_ledger.js");
const fingerprint_js_1 = require("../../../apps/extension/src/patches/fingerprint.js");
(0, vitest_1.describe)("E2E Test: Proposal Accept Workflow & Reversible Patch Application", () => {
    let patcher;
    let ledger;
    let targetBtn;
    (0, vitest_1.beforeEach)(() => {
        document.body.innerHTML = "";
        patcher = new patch_applicator_js_1.PatchApplicator();
        ledger = new patch_ledger_js_1.PatchLedger();
        targetBtn = document.createElement("button");
        targetBtn.id = "unnamed-button";
        targetBtn.innerHTML = `<svg width="20" height="20"><path d="M0 0h20v20H0z"/></svg>`;
        document.body.appendChild(targetBtn);
    });
    (0, vitest_1.test)("Accepting proposal applies aria-label safely and records in ledger", () => {
        const fp = (0, fingerprint_js_1.computeTargetFingerprint)(targetBtn);
        const patch = {
            patchId: "patch_accept_1",
            issueType: "button-name",
            targetFingerprint: fp,
            attribute: "aria-label",
            previousValue: null,
            proposedValue: "Download Application Form",
            evidence: [{ source: "visible_text", quote: "Download" }],
            trustScore: 87,
            decision: "confirm",
            modelVersion: "v1.0.0"
        };
        const res = patcher.applyPatch(patch, targetBtn);
        (0, vitest_1.expect)(res.success).toBe(true);
        // Verify target attribute changed safely
        (0, vitest_1.expect)(targetBtn.getAttribute("aria-label")).toBe("Download Application Form");
        // Verify non-target attributes remain completely untouched
        (0, vitest_1.expect)(targetBtn.id).toBe("unnamed-button");
        (0, vitest_1.expect)(targetBtn.getAttribute("href")).toBeNull();
        // Verify Ledger status
        ledger.recordProposed(patch, targetBtn);
        ledger.recordInjected("patch_accept_1", targetBtn);
        (0, vitest_1.expect)(ledger.getPatchStatus("patch_accept_1")).toBe("injected");
    });
});
