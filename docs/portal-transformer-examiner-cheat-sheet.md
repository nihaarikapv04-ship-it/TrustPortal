# Examiner Single-Page Summary Cheat Sheet (`docs/portal-transformer-examiner-cheat-sheet.md`)

> **Examiner Cheat Sheet**: Ultra-dense single-page briefing document for thesis defense examiners.

---

## 1. Dissertation Overview
- **PROJECT**: Portal Transformer V7 (Zero-Trust AI Web Accessibility Remediation).
- **PROBLEM**: Over 70% of public portals lack accessible names. AI provides contextual text generation, but introduces security risks (prompt injection, XSS, credential theft).
- **SOLUTION**: Context-aware detection + Privacy Firewall + Bounded AI context + Output Validator + TSIF Risk Gate + Attribute Allowlist + TOCTOU target check.

---

## 2. Key Authoritative Empirical Results

| Metric Dimension | Target Scope | Value | Source Artifact |
| :--- | :--- | :---: | :--- |
| **Synthetic Defect Precision** | Benchmark v4 ($N=930$) | **100.0%** | `reports/evaluation/benchmark-v4-after-fix.json` |
| **Holdout SVG Precision** | Holdout SVG V3 ($N=600$) | **100.0%** | `reports/evaluation/svg-benchmark-v3-results.json` |
| **Holdout SVG Recall** | Holdout SVG V3 ($N=600$) | **53.85%** | `reports/evaluation/svg-benchmark-v3-results.json` |
| **Holdout SVG Abstention** | Holdout SVG V3 ($N=600$) | **33.33%** | `reports/evaluation/svg-benchmark-v3-results.json` |
| **Real-World Reviewed Precision**| 20 `.gov.in` Portals ($N=100$) | **100.0%** | `reports/realworld/realworld-summary.json` |
| **Real-World Reviewed Recall** | 20 `.gov.in` Portals ($N=100$) | **77.78%** | `reports/realworld/realworld-summary.json` |
| **Security Attack Success Rate** | 1,000 Property Cases | **0.0%** | `reports/evaluation/property-based-security-results.json` |
| **Deterministic Fuzzing** | 5,000 Fuzz Runs | **0 Violations** | `reports/evaluation/security-fuzz-results.json` |

---

## 3. Core Contributions vs. Explicit Non-Claims
- **MAIN CONTRIBUTION**: Demonstrating security-constrained client-side AI accessibility remediation with explicit fail-closed abstention.
- **MAIN LIMITATION**: Unresolved complex or remote SVG symbol references trigger abstention, reducing recall.
- **EXPLICIT NON-CLAIMS**: Universal security, population-level `.gov.in` generalization, live NVDA/TalkBack audio announcement testing, live cloud latency.
