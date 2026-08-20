# Master Empirical Results Summary (`docs/portal-transformer-final-results.md`)

> **Master Authoritative Results**: Complete collection of authoritative metrics extracted directly from machine-readable JSON reports.

---

## 1. Core Empirical Results Breakdown

| Evaluation Dimension | Target Scope / Corpus | Sample ($N$) | Precision | Recall | $F_1$ | Abstention | Source Evidence Artifact |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Synthetic Benchmark v4** | Synthetic Defect Suite | 930 | **100.0%** | **100.0%** | **1.0000** | 0.0% | [`reports/evaluation/benchmark-v4-after-fix.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/benchmark-v4-after-fix.json) |
| **Holdout SVG V3** | Unseen SVG Subtrees | 600 | **100.0%** | **53.85%** | **0.7000** | **33.33%** | [`reports/evaluation/svg-benchmark-v3-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-benchmark-v3-results.json) |
| **Real-World `.gov.in`** | Reviewed Sample | 100 | **100.0%** | **77.78%** | **0.8750** | **10.0%** | [`reports/realworld/realworld-summary.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/realworld/realworld-summary.json) |
| **Security Property Suite** | Adversarial Instances | 1,000 | **0.0% ASR** | **0 Unsafe** | N/A | N/A | [`reports/evaluation/property-based-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/property-based-security-results.json) |
| **UPI Accessibility** | UPI Remediation | 500 | **100.0%** | **80.0%** | **0.8889** | **20.0%** | [`reports/evaluation/upi-accessibility-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-accessibility-results.json) |
| **UPI Security Suite** | Financial Attacks | 1,500 | **0.0% ASR** | **0 Unsafe** | N/A | N/A | [`reports/evaluation/upi-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-security-results.json) |
