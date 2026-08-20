# Master Thesis Evidence Traceability Index (`docs/portal-transformer-final-evidence-index.md`)

> **Master Traceability Index**: Maps every major thesis claim to its exact machine-readable evidence artifact.

---

## 1. Master Evidence Mapping Matrix

| Major Thesis Claim | Target Scope / Corpus | Empirical Result | Source JSON Evidence Artifact | Claim Classification |
| :--- | :--- | :---: | :--- | :---: |
| **Synthetic Defect Detection** | Benchmark v4 ($N=930$) | Precision: 100%, Recall: 100%, $F_1$: 100% | [`reports/evaluation/benchmark-v4-after-fix.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/benchmark-v4-after-fix.json) | `EMPIRICALLY VERIFIED` |
| **Holdout SVG Resolution** | Holdout SVG V3 ($N=600$) | Precision: 100%, Recall: 53.85%, Abstention: 33.33% | [`reports/evaluation/svg-benchmark-v3-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-benchmark-v3-results.json) | `EMPIRICALLY VERIFIED` |
| **Real-World Remediation** | 20 `.gov.in` Portals ($N=100$) | Precision: 100%, Recall: 77.78%, Abstention: 10% | [`reports/realworld/realworld-summary.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/realworld/realworld-summary.json) | `BENCHMARK-SCOPED` |
| **Security Property Suite** | Property Suite ($N=1,000$) | Attack Success: 0%, Unsafe Mutations: 0 | [`reports/evaluation/property-based-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/property-based-security-results.json) | `EMPIRICALLY VERIFIED` |
| **UPI Accessibility** | UPI Accessibility ($N=500$) | Precision: 100%, Recall: 80%, $F_1$: 88.89% | [`reports/evaluation/upi-accessibility-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-accessibility-results.json) | `BENCHMARK-SCOPED` |
| **UPI Transaction Security** | UPI Security ($N=1,500$) | Unsafe Mutations: 0, Attack Success: 0% | [`reports/evaluation/upi-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-security-results.json) | `BENCHMARK-SCOPED` |
| **UPI Abstention Safety** | UPI Ambiguity ($N=100$) | Abstention Rate: 100% | [`reports/evaluation/upi-abstention-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-abstention-results.json) | `EMPIRICALLY VERIFIED` |
| **System Reproducibility** | 3 Independent Runs | Classification: `DETERMINISTIC` | [`reports/evaluation/reproducibility-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/reproducibility-results.json) | `EMPIRICALLY VERIFIED` |
| **Patch Capability** | Allowlist Attributes | 5 Allowed, 12 Blocked | [`reports/evaluation/patch-capability-audit-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/patch-capability-audit-results.json) | `EMPIRICALLY VERIFIED` |
| **Idempotence** | 2-Pass Scanning | Pass 1: 175, Pass 2: 0 mutations | [`reports/evaluation/idempotence-final.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/idempotence-final.json) | `EMPIRICALLY VERIFIED` |
| **Screen-Reader Spoken Audio**| Live Audio Announcements | N/A | N/A | `NOT EVALUATED` |
| **Human-Subject Usability** | Blind User Usability | N/A | N/A | `NOT EVALUATED` |
| **Cloud API Latency** | Live Network RTT | N/A | N/A | `NOT EVALUATED` |
