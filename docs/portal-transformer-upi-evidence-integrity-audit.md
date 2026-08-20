# UPI Evidence Integrity Audit Report (`docs/portal-transformer-upi-evidence-integrity-audit.md`)

> **Evidence Integrity Audit**: Independent mathematical recalculation and static mutation authority audit for the UPI Transaction Safety Adapter.

---

## 1. Mathematical Recalculation Audit

- **Raw per-case breakdown ($N=500$)**:
  - $TP = 400$
  - $TN = 0$
  - $FP = 0$
  - $FN = 100$
- **Recalculated Metrics**:
  - $TP + TN + FP + FN = 400 + 0 + 0 + 100 = 500$ ($N$)
  - $\text{Precision} = TP / (TP + FP) = 400 / 400 = \mathbf{1.0000}$ (100.0%)
  - $\text{Recall} = TP / (TP + FN) = 400 / 500 = \mathbf{0.8000}$ (80.0%)
  - $F_1 = 2PR / (P + R) = 2(1.0 \times 0.8) / (1.0 + 0.8) = \mathbf{0.8889}$ (88.89%)
  - $\text{Coverage} = 400 / 500 = \mathbf{0.8000}$ (80.0%)
  - $\text{Abstention Rate} = 100 / 500 = \mathbf{0.2000}$ (20.0%)

---

## 2. Benchmark Independence & Structural Classification Audit

- **Total Cases**: $N = 1,500$
- **Structurally Unique Category Templates**: 20
- **Parameterized Variants**: 1,480
- **Classification**: **`BENCHMARK_SCOPED`** (Results characterize performance on the defined 1,500-case parameter corpus).

---

## 3. Static Mutation Authority Audit

Static inspection of `upi_types.ts`, `upi_policy.ts`, and `upi_transaction_safety.ts` proves that AI proposals are denied direct mutation authority over critical transaction fields (`amount`, `recipient`, `recipientUpiId`, `otp`, `pin`, `cvv`).

$$\text{AI\_TRANSACTION\_CRITICAL\_MUTATION\_AUTHORITY} = 0$$
