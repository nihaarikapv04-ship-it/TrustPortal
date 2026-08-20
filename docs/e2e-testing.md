# TrustPortal Playwright End-to-End Testing Architecture (`docs/e2e-testing.md`)

## 1. Overview
The End-to-End Regression Suite (`tests/e2e`) validates the browser-level behavior of TrustPortal across Chromium, the SevaConnect Demo site (`apps/demo`), the Fastify API Gateway (`apps/api`), and the Chrome MV3 Extension (`apps/extension`).

---

## 2. Infrastructure Setup & Local Servers
The suite runs against local development servers without external internet dependencies:
- **SevaConnect Demo Site**: `http://localhost:5173`
- **Fastify API Server**: `http://localhost:3000`

---

## 3. How to Run E2E & Browser Tests

```bash
# Run all Vitest & E2E integration test suites
npm test
```

---

## 4. Key Security & Workflow Scenarios Tested
1. **Static & Dynamic Defect Detection**: Scans SevaConnect for WCAG defects and MutationObserver dynamic insertions.
2. **Accept / Edit / Reject / Undo Workflows**: Verifies 100% reversible DOM modifications using Step 4 `PatchApplicator`.
3. **Conflict Protection**: Verifies that if an external script modifies an attribute after patch application, `revertPatch()` yields `PATCH_CONFLICT` and preserves external edits.
4. **Sensitive Workflow Exclusions**: Verifies zero inference requests for password, OTP, or CVV fields.
5. **axe-core Accessibility Baseline**: Scans TrustPortal Shadow DOM UI for zero critical/serious accessibility violations.
