# Portal Transformer Authoritative Thesis Claim Matrix (`docs/thesis-claim-matrix.md`)

> **Traceability Standard**: Every claim maps to exact code boundaries, test suites, or JSON evaluation logs.  
> **Status Classifications**: `IMPLEMENTED`, `EMPIRICALLY EVALUATED`, `GENERALIZED ON UNSEEN DATA`, `NOT YET EVALUATED`.

---

## 1. Traceability & Evidence Status Matrix

| ID | System Claim / Capability | Status Classification | Evidence File Path / Evidence Artifact | Empirical Finding |
| :-: | :--- | :---: | :--- | :--- |
| **C1** | **DOM Interceptor & Defect Detection** | `GENERALIZED ON UNSEEN DATA` | `packages/rules/src/detector.ts`<br>[`reports/evaluation/benchmark-v4-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/benchmark-v4-results.json) | Evaluated on $N=930$ unseen elements. Achieved $87.18\%$ Precision, $100.0\%$ Recall, $93.15\%\text{ }F_1$. |
| **C2** | **WAI-ARIA 1.2 Name Resolution** | `GENERALIZED ON UNSEEN DATA` | `packages/rules/src/acc_name.ts`<br>[`reports/evaluation/benchmark-v4-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/benchmark-v4-results.json) | Resolves `aria-label`, `aria-labelledby`, `<label>`, `alt`, descendant text, SVG title/desc across 21 categories. |
| **C3** | **Privacy Firewall & Credential Bounding** | `EMPIRICALLY EVALUATED` | `packages/redaction/src/firewall.ts`<br>[`reports/evaluation/security-regression-suite.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/security-regression-suite.json) | Verified zero credential leakage across passwords, OTPs, PINs, CVVs, and PII. |
| **C4** | **SafeContext Redaction Engine** | `EMPIRICALLY EVALUATED` | `packages/redaction/src/extractor.ts`<br>[`reports/evaluation/privacy-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/privacy-results.json) | Scrubs emails, phone numbers, and IDs from surrounding context payload. |
| **C5** | **Output Security Validator (XSS Filter)** | `EMPIRICALLY EVALUATED` | `apps/api/src/services/validator.ts`<br>[`reports/evaluation/security-regression-suite.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/security-regression-suite.json) | Blocked 100.0% of XSS, HTML tag, and control character injection attempts ($15/15$ XSS attacks blocked). |
| **C6** | **Capability-Limited Allowlist Guard** | `EMPIRICALLY EVALUATED` | `patch_system/src/patcher.ts`<br>[`reports/evaluation/security-regression-suite.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/security-regression-suite.json) | Restricts DOM mutations strictly to `alt`, `aria-label`, `aria-labelledby`, `aria-describedby`, `role`. Rejects `href`, `src`, `action`. |
| **C7** | **TOCTOU & Target Fingerprint Verification** | `EMPIRICALLY EVALUATED` | `patch_system/src/patcher.ts`<br>[`reports/evaluation/security-regression-suite.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/security-regression-suite.json) | Aborts patches when target element is disconnected or fingerprint mismatches. |
| **C8** | **Yield-on-Reclaim Conflict Engine** | `EMPIRICALLY EVALUATED` | `patch_system/src/patcher.ts`<br>[`apps/extension/tests/patcher_security.test.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/apps/extension/tests/patcher_security.test.ts) | Extension yields to host page re-renders and invalidates patch rather than fighting page. |
| **C9** | **TSIF Trust Engine & Risk Gate** | `EMPIRICALLY EVALUATED` | `packages/scoring/src/risk_gate.ts`<br>[`reports/evaluation/security-ablation-v2-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/security-ablation-v2-results.json) | Computes TAS trust score and enforces `auto`, `confirm`, `reject` decision boundaries. |
| **C10**| **Local Deterministic Latency** | `EMPIRICALLY EVALUATED` | [`reports/evaluation/latency-v2-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/latency-v2-results.json) | Mean total local remediation latency: $0.006\text{ ms}$ ($P_{95} = 0.011\text{ ms}$) on $N=1000$ runs. |
| **C11**| **Live Cloud Network RTT Latency** | `NOT YET EVALUATED` | N/A | Requires live external cloud provider API network connection. |
| **C12**| **Human Screen-Reader Usability (NVDA)** | `NOT YET EVALUATED` | N/A | Requires empirical user studies measuring spoken audio comprehension and task completion speed. |

---

## 2. Scientific Claim Boundaries
- Claims **C1–C10** are fully verified through empirical benchmark code and JSON evidence logs.
- Claims **C11–C12** are explicitly declared as `NOT YET EVALUATED` to maintain scientific integrity.
