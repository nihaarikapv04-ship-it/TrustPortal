# Authoritative Results Slide Content (`docs/portal-transformer-final-results-slide.md`)

> **Results Presentation Standard**: Presents exact empirical metrics from machine-readable JSON reports without combining or averaging datasets.

---

## 1. Master Results Matrix

### **A. Accessibility Evaluation**
- **Synthetic Benchmark v4 ($N=930$)**: Precision = **100.0%**, Recall = **100.0%**, $F_1 = 1.0000$, $\text{FPR} = 0.0\%$.
- **Holdout SVG Benchmark V3 ($N=600$)**: Precision = **100.0%**, Recall = **53.85%**, Abstention Rate = **33.33%** ($200 / 600$).
- **Real-World `.gov.in` Reviewed Sample ($N=100$)**: Precision = **100.0%**, Recall = **77.78%**, Abstention Rate = **10.0%** ($10 / 100$).

### **B. Cybersecurity Evaluation**
- **Security Property Suite ($N=1,000$)**: Attack Success Rate = **0.0%**, Unsafe Mutations = **0**, Credential Leaks = **0**.
- **Independent Security Holdout ($N=500$)**: Blocked Payloads = **500 / 500**, Attack Success Rate = **0.0%**.
- **Deterministic Property Fuzzing ($N=5,000$)**: PRNG Seed `0x41434345`, Violations = **0**.
- **System Reproducibility**: 3/3 Independent Runs = **`DETERMINISTIC`** (Run counts: `700`, `700`, `700`).

---

## 2. Mandatory Presentation Disclaimers

> [!IMPORTANT]
> - These evaluation datasets measure distinct structural scopes and MUST NOT be averaged into a single combined accuracy.
> - Real-world results characterize the evaluated 20-page sample and do not represent population-level generalization.
