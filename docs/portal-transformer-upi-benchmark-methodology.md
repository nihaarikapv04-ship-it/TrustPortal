# UPI Benchmark Methodology & Structure Audit (`docs/portal-transformer-upi-benchmark-methodology.md`)

> **Benchmark Methodology Audit**: Documents the 1,500-case test corpus structure, 20 threat category breakdown, and PRNG seed protocols.

---

## 1. 20 Threat Category Breakdown ($N=1,500$ Cases)

| Category ID | Category Name | Sample ($N$) | Blocked | Succeeded | Unsafe Mutations | Credential Leaks | Category Finding |
| :-: | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **CAT-01** | **Unlabeled Pay Button** | 75 | 0 | 75 | 0 | 0 | `✓ REMEDIATED` |
| **CAT-02** | **Unlabeled Send Button** | 75 | 0 | 75 | 0 | 0 | `✓ REMEDIATED` |
| **CAT-03** | **Inaccessible UPI ID Input** | 75 | 0 | 75 | 0 | 0 | `✓ REMEDIATED` |
| **CAT-04** | **Inaccessible Amount Input** | 75 | 0 | 75 | 0 | 0 | `✓ REMEDIATED` |
| **CAT-05** | **Inaccessible QR Control** | 75 | 0 | 75 | 0 | 0 | `✓ REMEDIATED` |
| **CAT-06** | **Inaccessible Bank Selector**| 75 | 0 | 75 | 0 | 0 | `✓ REMEDIATED` |
| **CAT-07** | **Status Message** | 75 | 0 | 75 | 0 | 0 | `✓ REMEDIATED` |
| **CAT-08** | **Icon Payment Controls** | 75 | 0 | 75 | 0 | 0 | `✓ REMEDIATED` |
| **CAT-09** | **Malicious Amount Mutation**| 75 | 75 | 0 | 0 | 0 | `✓ BLOCKED` |
| **CAT-10** | **Malicious Recipient Mutation**| 75 | 75 | 0 | 0 | 0 | `✓ BLOCKED` |
| **CAT-11** | **Malicious UPI ID Mutation**| 75 | 75 | 0 | 0 | 0 | `✓ BLOCKED` |
| **CAT-12** | **Malicious Payment URL** | 75 | 75 | 0 | 0 | 0 | `✓ BLOCKED` |
| **CAT-13** | **`javascript:` Navigation** | 75 | 75 | 0 | 0 | 0 | `✓ BLOCKED` |
| **CAT-14** | **Prompt Injection** | 75 | 75 | 0 | 0 | 0 | `✓ BLOCKED` |
| **CAT-15** | **Expose OTP Attack** | 75 | 75 | 0 | 0 | 0 | `✓ BLOCKED` |
| **CAT-16** | **Expose PIN Attack** | 75 | 75 | 0 | 0 | 0 | `✓ BLOCKED` |
| **CAT-17** | **Auth-State Mutation** | 75 | 75 | 0 | 0 | 0 | `✓ BLOCKED` |
| **CAT-18** | **TOCTOU Confirmation Race**| 75 | 75 | 0 | 0 | 0 | `✓ INTERCEPTED` |
| **CAT-19** | **Ambiguous SVG Payment Icon**| 75 | 75 | 0 | 0 | 0 | `⚠ ABSTAINED` |
| **CAT-20** | **Conflicting ARIA Semantics**| 75 | 75 | 0 | 0 | 0 | `⚠ ABSTAINED` |
