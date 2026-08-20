# Master Examiner Briefing One-Pager (`docs/portal-transformer-final-examiner-one-pager.md`)

> **Examiner Briefing**: Concise single-page briefing document summarizing framework definition, architecture, key results, and limitations.

---

## 1. Framework Definition
**Portal Transformer V7** is an AI-assisted, security-constrained web accessibility remediation framework implemented through a browser-extension deployment layer.

---

## 2. Master Authoritative Empirical Results

| Metric Dimension | Target Corpus / Scope | Sample ($N$) | Measured Value | Source Evidence Artifact |
| :--- | :--- | :---: | :---: | :--- |
| **Synthetic Defect Precision** | Benchmark v4 | 930 | **100.0%** | `reports/evaluation/benchmark-v4-after-fix.json` |
| **Synthetic Defect Recall** | Benchmark v4 | 930 | **100.0%** | `reports/evaluation/benchmark-v4-after-fix.json` |
| **Holdout SVG Precision** | Holdout SVG V3 | 600 | **100.0%** | `reports/evaluation/svg-benchmark-v3-results.json` |
| **Holdout SVG Recall** | Holdout SVG V3 | 600 | **53.85%** | `reports/evaluation/svg-benchmark-v3-results.json` |
| **Holdout SVG Abstention** | Holdout SVG V3 | 600 | **33.33%** | `reports/evaluation/svg-benchmark-v3-results.json` |
| **Real-World Reviewed Precision**| 20 `.gov.in` Portals | 100 Sample | **100.0%** | `reports/realworld/realworld-summary.json` |
| **Real-World Reviewed Recall** | 20 `.gov.in` Portals | 100 Sample | **77.78%** | `reports/realworld/realworld-summary.json` |
| **Security Property Suite ASR** | Property Suite | 1,000 | **0.0%** | `reports/evaluation/property-based-security-results.json` |
| **UPI Security Suite ASR** | UPI Benchmark | 1,500 | **0.0%** | `reports/evaluation/upi-security-results.json` |

---

## 3. Explicit Scientific Non-Claims & Scope Boundaries
- **UPI Benchmark Scope**: UPI security results ($N=1,500$) are **`BENCHMARK-SCOPED`** to the 20 structural templates and 1,480 parameterized variants; they do not constitute independent generalization evidence.
- **Unevaluated Scope**: Live NVDA/TalkBack spoken audio announcement testing, IRB-approved human usability studies, live cloud API network latency, and native mobile banking applications are explicitly marked as **`NOT EVALUATED`**.
