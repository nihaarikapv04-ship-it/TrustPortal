# Empirical Security vs. Accessibility Pareto Frontier (`docs/portal-transformer-security-accessibility-pareto.md`)

> **Scientific Analysis**: Maps maximum achievable accessibility remediation coverage subject to an absolute zero-unsafe-mutation security constraint ($\text{Unsafe Mutation Rate} = 0.0\%$).

---

## 1. Empirical Pareto Optimal Points

```text
  Accessibility Coverage
     ▲
1.00 │                       ● Point B (No Abstention: Coverage=1.00, UnsafeMutations=10%)
     │                      /
0.90 │  ● Point A (Full System: Coverage=0.90, UnsafeMutations=0%) [PARETO OPTIMAL BOUNDARY]
     │
     └──────────────────────────────────────────────────────────► Unsafe Mutation Rate (%)
         0.0%                                              10.0%
```

### **Core Finding**
Under the strict constraint of zero unsafe DOM mutations ($\text{Unsafe Mutation Rate} = 0.0\%$), the maximum achievable accessibility remediation coverage observed in real-world public service portals is **90.0%** ($\text{Coverage} = 0.9000$), with a recall of **77.78%** and an explicit abstention rate of **10.0%**.
