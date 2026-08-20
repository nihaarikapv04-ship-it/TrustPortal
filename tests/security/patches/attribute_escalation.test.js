"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
const vitest_1 = require("vitest");
const patch_applicator_js_1 = require("../../../apps/extension/src/patches/patch_applicator.js");
const fingerprint_js_1 = require("../../../apps/extension/src/patches/fingerprint.js");
(0, vitest_1.describe)("Security Test: Patch Applicator Attribute Escalation & Confinement", () => {
    let patcher;
    let targetBtn;
    (0, vitest_1.beforeEach)(() => {
        document.body.innerHTML = "";
        patcher = new patch_applicator_js_1.PatchApplicator();
        targetBtn = document.createElement("button");
        targetBtn.id = "test-btn";
        document.body.appendChild(targetBtn);
    });
    (0, vitest_1.test)("Invariant 1 & 2: REJECTS patch attempt on forbidden attribute 'href'", () => {
        const fp = (0, fingerprint_js_1.computeTargetFingerprint)(targetBtn);
        const patch = {
            patchId: "p_attack_1",
            issueType: "button-name",
            targetFingerprint: fp,
            attribute: "href", // Illegal escalation attempt!
            previousValue: null,
            proposedValue: "https://evil.com",
            evidence: [],
            trustScore: 95,
            decision: "auto",
            modelVersion: "v1"
        };
        const res = patcher.applyPatch(patch, targetBtn);
        (0, vitest_1.expect)(res.success).toBe(false);
        (0, vitest_1.expect)(res.reason).toBe("invalid-attribute");
        (0, vitest_1.expect)(targetBtn.getAttribute("href")).toBeNull();
    });
    (0, vitest_1.test)("Invariant 1 & 3: REJECTS patch attempt on forbidden attribute 'onclick'", () => {
        const fp = (0, fingerprint_js_1.computeTargetFingerprint)(targetBtn);
        const patch = {
            patchId: "p_attack_2",
            issueType: "button-name",
            targetFingerprint: fp,
            attribute: "onclick", // Illegal escalation attempt!
            previousValue: null,
            proposedValue: "alert(1)",
            evidence: [],
            trustScore: 95,
            decision: "auto",
            modelVersion: "v1"
        };
        const res = patcher.applyPatch(patch, targetBtn);
        (0, vitest_1.expect)(res.success).toBe(false);
        (0, vitest_1.expect)(res.reason).toBe("invalid-attribute");
        (0, vitest_1.expect)(targetBtn.getAttribute("onclick")).toBeNull();
    });
    (0, vitest_1.test)("Invariant 1 & 3: REJECTS patch attempt on forbidden attribute 'style'", () => {
        const fp = (0, fingerprint_js_1.computeTargetFingerprint)(targetBtn);
        const patch = {
            patchId: "p_attack_3",
            issueType: "button-name",
            targetFingerprint: fp,
            attribute: "style", // Illegal escalation attempt!
            previousValue: null,
            proposedValue: "display:none",
            evidence: [],
            trustScore: 95,
            decision: "auto",
            modelVersion: "v1"
        };
        const res = patcher.applyPatch(patch, targetBtn);
        (0, vitest_1.expect)(res.success).toBe(false);
        (0, vitest_1.expect)(res.reason).toBe("invalid-attribute");
        (0, vitest_1.expect)(targetBtn.getAttribute("style")).toBeNull();
    });
    (0, vitest_1.test)("Invariant 1: Accepts valid allowlisted attribute 'aria-label'", () => {
        const fp = (0, fingerprint_js_1.computeTargetFingerprint)(targetBtn);
        const patch = {
            patchId: "p_valid_1",
            issueType: "button-name",
            targetFingerprint: fp,
            attribute: "aria-label",
            previousValue: null,
            proposedValue: "Download Application Form",
            evidence: [],
            trustScore: 95,
            decision: "auto",
            modelVersion: "v1"
        };
        const res = patcher.applyPatch(patch, targetBtn);
        (0, vitest_1.expect)(res.success).toBe(true);
        (0, vitest_1.expect)(targetBtn.getAttribute("aria-label")).toBe("Download Application Form");
    });
});
