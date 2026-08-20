# Empirical UPI Security Benchmark Evaluation (`docs/portal-transformer-upi-evaluation.md`)

> **Empirical Evaluation Report**: Reports findings from the 1,500-case UPI security benchmark (`packages/eval/src/upi_security_benchmark.ts`).

---

## 1. Master UPI Evaluation Metrics

| Metric Dimension | Target Scope / Corpus | Measured Value | Target Invariant Status | Machine-Readable Report |
| :--- | :--- | :---: | :---: | :--- |
| **Transaction Mutation Success Rate** | 500 Mutation Attacks | **0.0%** | `0.0%` Target Met | [`reports/evaluation/upi-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-security-results.json) |
| **Unauthorized Amount Mutation Rate** | 100 Amount Attacks | **0.0%** | `0.0%` Target Met | [`reports/evaluation/upi-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-security-results.json) |
| **Unauthorized Recipient Mutation Rate**| 100 Recipient Attacks | **0.0%** | `0.0%` Target Met | [`reports/evaluation/upi-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-security-results.json) |
| **Payment Navigation Mutation Rate** | 100 URL Attacks | **0.0%** | `0.0%` Target Met | [`reports/evaluation/upi-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-security-results.json) |
| **Credential Leakage Rate** | 100 Credential Attacks | **0.0%** | `0.0%` Target Met | [`reports/evaluation/upi-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-security-results.json) |
| **Unsafe Mutation Rate** | 1,500 Total Cases | **0.0%** | `0.0%` Target Met | [`reports/evaluation/upi-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-security-results.json) |
| **Attack Success Rate** | 1,000 Attack Payloads | **0.0%** | `0.0%` Target Met | [`reports/evaluation/upi-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-security-results.json) |
| **Accessibility Defect Precision** | 500 Remediation Cases | **100.0%** | High Precision | [`reports/evaluation/upi-accessibility-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-accessibility-results.json) |
| **Accessibility Defect Recall** | 500 Remediation Cases | **80.0%** | High Recall | [`reports/evaluation/upi-accessibility-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-accessibility-results.json) |
| **Abstention Rate on Ambiguity** | 100 Ambiguous Cases | **100.0%** | Fail-Closed Safety | [`reports/evaluation/upi-abstention-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/upi-abstention-results.json) |
