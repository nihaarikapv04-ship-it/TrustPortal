# Accessibility Claim Audit Report (`docs/portal-transformer-accessibility-claim-audit.md`)

> **Audit Classification**: Explicitly distinguishes Deterministic Benchmark Performance vs. Holdout Performance vs. Real-World Performance vs. Screen-Reader Semantic State.

---

## 1. Metric Distinction Table

| Evaluation Tier | Scope / Dataset | Primary Precision | Primary Recall | Primary Abstention | Evaluation Standard |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Deterministic Benchmark** | Benchmark v4 ($N=930$) | **100.0%** | **100.0%** | 0.0% | Rule logic isolation |
| **Holdout SVG Benchmark** | Holdout SVG V3 ($N=600$) | **100.0%** | **53.85%** | **33.33%** | Unseen symbol reference graphs |
| **Real-World `.gov.in`** | 20 Portals ($N=100$ Sample) | **100.0%** | **77.78%** | **10.0%** | Public portal DOM baselines |
| **Screen-Reader Subset** | 5 Portals ($N=425$ Elements) | **0.8750** ($\text{ANRR}$) | **1.0000** ($\text{SPR}$) | 0.0% | DOM accessibility-tree semantic state |
