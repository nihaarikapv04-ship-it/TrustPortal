# Portal Transformer Final Research Report (`docs/portal-transformer-final-research-report.md`)

> **Master Authoritative Research Package**: Comprehensive 26-section final thesis research report integrating all empirical accessibility evaluation findings, real-world `.gov.in` baselines, 1,000-instance property-based cybersecurity benchmarks, 5,000-case fuzzing results, and acknowledged limitations.

---

## 1. Executive Summary
This report documents the design, implementation, and empirical evaluation of **Portal Transformer V7**, a security-constrained, privacy-preserving client-side accessibility remediation architecture.

### **Core Empirical Findings**:
- **Accessibility Benchmark v4**: Precision **1.0000** (100.0%), Recall **1.0000** (100.0%), $F_1$ **1.0000** ($N=930$).
- **Holdout SVG V3**: Precision **1.0000** (100.0%), Recall **0.5385** (53.85%), Abstention Rate **33.33%** ($N=600$).
- **Real-World `.gov.in` Portals**: 20 Pages ($N_{\text{DOM}} = 1,700$), $N_{\text{reviewed}} = 100$ Sample Precision **100.0%**, Recall **77.78%**, Abstention **10.0%**.
- **Cybersecurity Property Suite**: Attack Success Rate **0.0%**, Unsafe Mutation Rate **0.0%**, Credential Leaks **0** ($N=1,000$).
- **Deterministic Fuzzing**: 5,000 / 5,000 Fuzz Cases Contained (**0 Violations**).
- **Independent Security Holdout**: 500 / 500 Holdout Payloads Blocked (**0 Bypasses**).
- **Idempotence & Reproducibility**: 3/3 Independent Runs Deterministically Identical (**0 Repeated Mutations**).

---

## 2. Master Evaluation Summary Table

| Evaluation Dimension | Sample ($N$) | Precision / Safety | Recall / Coverage | Key Finding / Status | Machine-Readable Evidence Artifact |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Benchmark v4** | 930 | **1.0000** | **1.0000** | $FP = 0, \text{FPR} = 0.0\%$ | [`reports/evaluation/benchmark-v4-after-fix.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/benchmark-v4-after-fix.json) |
| **Holdout SVG V3** | 600 | **1.0000** | **0.5385** | $33.33\%$ Abstention Rate | [`reports/evaluation/svg-benchmark-v3-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-benchmark-v3-results.json) |
| **Real-World Review** | 100 | **1.0000** | **0.7778** | $10.0\%$ Abstention Rate | [`reports/realworld/realworld-summary.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/realworld/realworld-summary.json) |
| **Security Property Suite**| 1,000 | **0.0%** ASR | **0.0%** Unsafe | Zero Credential Leaks | [`reports/evaluation/property-based-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/property-based-security-results.json) |
| **Security Holdout Suite** | 500 | **0.0%** ASR | **0.0%** Unsafe | 500 / 500 Payloads Blocked| [`reports/evaluation/security-holdout-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/security-holdout-results.json) |
| **Security Fuzz Suite** | 5,000 | **1.0%** Fuzz Score | **0** Violations | 5,000 / 5,000 Contained | [`reports/evaluation/security-fuzz-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/security-fuzz-results.json) |
| **Screen-Reader Subset** | 425 | **0.8750** ($\text{ANRR}$) | **1.0000** ($\text{SPR}$) | Zero Semantic Degradation | [`reports/screen-reader/accessibility-state-before-after.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/screen-reader/accessibility-state-before-after.json) |

---

## 3. Explicit Statement of Unevaluated Scope Items

1. **NVDA Spoken Audio Announcement Quality**: Evaluated via DOM accessibility-tree semantic state tracking. Marked as `NOT EVALUATED — ENVIRONMENT LIMITATION`.
2. **TalkBack Mobile Audio Announcement Quality**: Marked as `NOT EVALUATED — ENVIRONMENT LIMITATION`.
3. **Human-Subject Usability Trials**: Marked as `NOT EVALUATED — HUMAN-SUBJECT STUDY NOT CONDUCTED`.
4. **Live Cloud Provider RTT Latency**: Evaluated via local mock provider ($0.0\text{ ms}$). Live cloud RTT remains **UNEVALUATED**.
5. **Universal Security Guarantee**: Security boundaries characterized across $N=1,000$ property instances; universal security is unclaimable.
