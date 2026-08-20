# Experiment 7: Baseline Comparison Results (`docs/portal-transformer-baseline-results.md`)

> **Source Data**: Generated empirically via `npm run evaluate:portal-transformer` -> [`reports/evaluation/baseline-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/baseline-results.json)

---

## 1. System Baseline Comparison Matrix

| Evaluation Dimension | Baseline A: Unremediated Control | Baseline B: Deterministic Fallback | Baseline C: Unconstrained AI Simulation | Baseline D: Full Portal Transformer |
| :--- | :---: | :---: | :---: | :---: |
| **Defects Detected** | 0 | 150 | 150 | **150** |
| **Semantic Quality Rate** | 0.0% | 65.0% | 92.0% | **100.0%** |
| **Unsafe Model Proposals** | 0 | 0 | **14** | **0** |
| **Security Failures** | 0 | 0 | **14** | **0** |
| **Privacy Denials** | 0 | 7 | 0 | **7** |
| **Client-Side Latency** | 0.00 ms | 0.01 ms | 0.02 ms | **0.023 ms** |

---

## 2. Baseline Analysis
- **Baseline A vs D**: Demonstrates complete remediation of 150 accessibility barriers.
- **Baseline B vs D**: Demonstrates that AI-assisted remediation improves semantic label quality from 65.0% to 100.0%.
- **Baseline C vs D**: Demonstrates that an unconstrained AI model introduces 14 security/privacy violations, whereas Baseline D eliminates all 14 violations while preserving high quality.
