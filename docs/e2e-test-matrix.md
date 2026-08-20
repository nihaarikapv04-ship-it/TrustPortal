# TrustPortal Playwright End-to-End Test Matrix (`docs/e2e-test-matrix.md`)

| Scenario | Target Component | Expected Result | E2E Test Spec | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Static Defect Detection** | Detector (`@trustportal/rules`) | Detects missing alt, filename alt, unnamed button, link, form | `tests/e2e/detection/static_defects.test.ts` | **PASS** |
| **Dynamic DOM Detection** | DynamicObserver | Detects `dynamic-button` inserted after 2s timer | `tests/e2e/detection/dynamic_defects.test.ts` | **PASS** |
| **Accept Proposal** | PanelController & PatchApplicator | `aria-label` applied safely to target; ledger recorded | `tests/e2e/workflow/accept.test.ts` | **PASS** |
| **Edit Proposal** | EditControl & PatchApplicator | User edits label to "Download application documents"; applied | `tests/e2e/workflow/edit.test.ts` | **PASS** |
| **Reject Proposal** | ConfirmationPanel | Panel closes; DOM remains 100% unchanged | `tests/e2e/workflow/reject.test.ts` | **PASS** |
| **Undo Patch** | PatchApplicator Revert | Restores original DOM state; ledger status set to `reverted` | `tests/e2e/workflow/undo.test.ts` | **PASS** |
| **Conflict Handling** | PatchApplicator Revert | External DOM attribute change prevents overwrite; yields `conflict` | `tests/e2e/workflow/stale_conflict.test.ts` | **PASS** |
| **Stale Target Rejection** | PatchApplicator | Fingerprint mismatch on target modification rejects patch | `tests/e2e/workflow/stale_conflict.test.ts` | **PASS** |
| **Sensitive Workflow Protection**| Privacy Firewall | OTP / CVV fields trigger zero remote inference API requests | `tests/e2e/privacy/sensitive_workflow.test.ts` | **PASS** |
| **Prompt Injection Defense** | System Prompt & Model Router | Untrusted page directives cannot alter policy or cause escalation | `tests/e2e/privacy/prompt_injection.test.ts` | **PASS** |
| **Confirmation UI XSS Defense** | Shadow DOM Renderer | Malicious `<script>` proposal rendered safely as text via `textContent` | `tests/e2e/security/ui_xss.test.ts` | **PASS** |
| **Keyboard Navigation** | ConfirmationPanel | Full Tab / Shift+Tab / Enter / Space / Escape navigation | `tests/e2e/accessibility/keyboard_navigation.test.ts` | **PASS** |
| **axe-core UI Audit** | `@axe-core/playwright` | Zero critical or serious axe violations on Confirmation UI | `tests/e2e/accessibility/axe_baseline.test.ts` | **PASS** |
