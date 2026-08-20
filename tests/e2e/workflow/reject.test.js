"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
const vitest_1 = require("vitest");
const patch_ledger_js_1 = require("../../../apps/extension/src/patches/patch_ledger.js");
(0, vitest_1.describe)("E2E Test: Proposal Reject Workflow", () => {
    let ledger;
    let targetBtn;
    (0, vitest_1.beforeEach)(() => {
        document.body.innerHTML = "";
        ledger = new patch_ledger_js_1.PatchLedger();
        targetBtn = document.createElement("button");
        targetBtn.id = "unnamed-button";
        document.body.appendChild(targetBtn);
    });
    (0, vitest_1.test)("Rejecting proposal leaves DOM 100% unchanged and records rejection in ledger", () => {
        ledger.recordRejected("patch_reject_1", targetBtn);
        // Target element attribute MUST remain completely unchanged!
        (0, vitest_1.expect)(targetBtn.getAttribute("aria-label")).toBeNull();
        (0, vitest_1.expect)(ledger.getPatchStatus("patch_reject_1")).toBe("rejected");
    });
});
