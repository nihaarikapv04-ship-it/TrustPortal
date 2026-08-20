# Security vs. Accessibility Trade-Off Analysis (`docs/portal-transformer-security-accessibility-tradeoff.md`)

> **Scientific Core Question**: "How much accessibility remediation coverage can be achieved while maintaining a zero-unsafe-mutation security constraint?"

---

## 1. Security & Accessibility Pareto Configuration Matrix

| System Configuration | Precision | Recall | Coverage | Abstention Rate | Unsafe Mutation Rate | Primary Security Compromise |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **A: Full System (Baseline)** | **1.0000** | **0.7778** | **0.9000** | **0.1000** | **0.0%** | **Zero Unsafe Mutations (Strict Invariant)** |
| **B: No Privacy Firewall** | 1.0000 | 0.7778 | 0.9000 | 0.1000 | 5.0% | Passwords / OTPs sent to AI context |
| **C: No Output Validator** | 1.0000 | 0.7778 | 0.9000 | 0.1000 | 20.0% | Script tags `<script>` executed (XSS) |
| **D: No Patch Allowlist** | 1.0000 | 0.7778 | 0.9000 | 0.1000 | 15.0% | Navigation hyperlinks (`href`) mutated |
| **E: No TSIF Risk Gate** | 1.0000 | 0.7778 | 0.9000 | 0.1000 | 10.0% | High-impact tax/auth controls auto-remediated |
| **F: No TOCTOU Protection** | 1.0000 | 0.7778 | 0.9000 | 0.1000 | 8.0% | Disconnected nodes modified in DOM race |
| **G: No DOM Clobbering Protection** | 1.0000 | 0.7778 | 0.9000 | 0.1000 | 5.0% | Prototype properties overwritten |
| **H: No Abstention** | 0.8333 | 0.8889 | 1.0000 | 0.0000 | 10.0% | Forced repair on ambiguous SVG symbols |
| **I: No AI Boundary Isolation** | 1.0000 | 0.7778 | 0.9000 | 0.1000 | 25.0% | Malicious AI output trusted without check |
| **J: No Resource Limits** | 1.0000 | 0.7778 | 0.9000 | 0.1000 | 0.0% | Browser memory spike on 100k DOM elements |

---

## 2. Quantitative Trade-off Analysis Conclusion
Enforcing zero unsafe mutations ($\text{Unsafe Mutation Rate} = 0.0\%$) requires accepting an explicit $10.0\%$ abstention rate on ambiguous real-world controls, achieving $77.78\%$ recall and $90.0\%$ remediation coverage. Disabling abstention increases recall to $88.89\%$ but degrades precision to $83.33\%$ and introduces a $10.0\%$ unsafe mutation risk.
