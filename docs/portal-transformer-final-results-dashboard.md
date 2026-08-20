# Final Master Results Dashboard (`docs/portal-transformer-final-results-dashboard.md`)

> **Concise Master Dashboard**: Integrates all key metrics across accessibility, security, real-world, dynamic DOM, latency, and reproducibility suites into one authoritative table.

---

## 1. Master Results Dashboard

| Dimension | Evaluation Dataset | Sample ($N$) | Primary Result | Source Evidence Artifact | Primary Acknowledged Limitation |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Accessibility Detection** | Benchmark v4 | 930 | **100.0% Precision** | `reports/evaluation/benchmark-v4-after-fix.json` | Synthetic DOM fixtures |
| **SVG Resolution** | Holdout SVG V3 | 600 | **100.0% Precision** | `reports/evaluation/svg-benchmark-v3-results.json` | $33.33\%$ Abstention Rate on remote symbols |
| **Real-World Remediation** | 20 `.gov.in` Portals | 100 Sample | **100.0% Precision** | `reports/realworld/realworld-summary.json` | Curated 20-page sample scope |
| **Privacy Isolation** | 20 `.gov.in` Portals | 1,700 DOM | **0 Credential Leaks** | `reports/realworld/realworld-summary.json` | Regex field classification |
| **Security Property Suite** | 1,000 Property Cases | 1,000 | **0.0% ASR** | `reports/evaluation/property-based-security-results.json` | Local attack corpus |
| **Independent Security Holdout**| 500 Holdout Payloads | 500 | **0.0% ASR** | `reports/evaluation/security-holdout-results.json` | Structurally unique holdout payloads |
| **Deterministic Fuzzing** | 5,000 Fuzz Cases | 5,000 | **0 Violations** | `reports/evaluation/security-fuzz-results.json` | Seed `0x41434345` PRNG fuzz cases |
| **Dynamic DOM Security** | 100 Dynamic Races | 100 | **0 Stale Patches** | `reports/evaluation/dynamic-security-results.json` | TOCTOU fingerprint verification |
| **Compromised AI Provider** | 14 Malicious Proposals | 14 | **100.0% Contained** | `reports/evaluation/compromised-provider-results.json` | Client-side validation active |
| **Screen-Reader State** | 5 Subset Portals | 425 | **87.50% ANRR** | `reports/screen-reader/accessibility-state-before-after.json` | DOM accessibility-tree semantic state |
| **Remediation Latency** | 1,000 Microbenchmarks | 1,000 | **0.0123 ms Mean** | `reports/evaluation/latency-v2-results.json` | Local mock provider ($0.0\text{ ms}$) |
| **System Reproducibility** | 3 Independent Runs | 3 Runs | **Deterministic** | `reports/evaluation/reproducibility-results.json` | Identical candidate counts across runs |
