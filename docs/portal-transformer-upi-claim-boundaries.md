# UPI Claim Boundaries & Scientific Non-Claims (`docs/portal-transformer-upi-claim-boundaries.md`)

> **Claim Classification**: Classifies every UPI scientific claim into exactly one of: `EMPIRICALLY VERIFIED`, `BENCHMARK-SCOPED`, `PARTIALLY VERIFIED`, `NOT EVALUATED`, or `UNSUPPORTED`.

---

## 1. Master Claim Boundary Table

| Claim Description | Primary Metric | Source Evidence Artifact | Claim Classification | Explicit Limitation / Scope Boundary |
| :--- | :--- | :--- | :---: | :--- |
| **UPI Accessibility Precision** | Precision = 100.0% | `reports/evaluation/upi-accessibility-results.json` | `BENCHMARK-SCOPED` | Evaluated on 500 synthetic cases |
| **UPI Accessibility Recall** | Recall = 80.0% | `reports/evaluation/upi-accessibility-results.json` | `BENCHMARK-SCOPED` | 20.0% abstention on ambiguous cases |
| **UPI Accessibility F1** | F1 = 0.8889 | `reports/evaluation/upi-accessibility-results.json` | `BENCHMARK-SCOPED` | Evaluated on 500 synthetic cases |
| **Remediation Coverage** | Coverage = 80.0% | `reports/evaluation/upi-accessibility-results.json` | `BENCHMARK-SCOPED` | Maximum coverage under zero-unsafe constraint |
| **Abstention Safety** | Abstention = 20.0% | `reports/evaluation/upi-abstention-results.json` | `EMPIRICALLY VERIFIED` | Fail-closed return on ambiguity |
| **Transaction Mutation Safety**| Unsafe Mutations = 0 | `reports/evaluation/upi-security-results.json` | `EMPIRICALLY VERIFIED` | `AUTHORIZED_AI_MUTATIONS = 0` |
| **Amount Alteration Safety** | Amount Mutations = 0 | `reports/evaluation/upi-security-results.json` | `EMPIRICALLY VERIFIED` | Regex comparison against trusted DOM |
| **Recipient Alteration Safety**| Recipient Mutations = 0 | `reports/evaluation/upi-security-results.json` | `EMPIRICALLY VERIFIED` | UPI ID comparison against trusted DOM |
| **Navigation Protection** | URL Mutations = 0 | `reports/evaluation/upi-security-results.json` | `EMPIRICALLY VERIFIED` | Blocks `javascript:` and external URLs |
| **Credential Isolation** | Credential Leaks = 0 | `reports/evaluation/upi-security-results.json` | `EMPIRICALLY VERIFIED` | Scrubs OTP, PIN, CVV, passwords |
| **Prompt Injection Containment**| Attack Success = 0.0% | `reports/evaluation/upi-threat-results.json` | `BENCHMARK-SCOPED` | Evaluated on 100 prompt injections |
| **TOCTOU Protection** | Stale Patches = 0 | `reports/evaluation/upi-threat-results.json` | `EMPIRICALLY VERIFIED` | Node connectivity & hash check |
| **3-Run Reproducibility** | Classification | `reports/evaluation/upi-evidence-integrity-audit.json` | `EMPIRICALLY VERIFIED` | `DETERMINISTIC` across 3 runs |
| **Native Mobile Banking Apps**| Native App Safety | N/A | `NOT EVALUATED` | Web DOM structures only |
| **Universal Security Guarantee**| Universal Safety | N/A | `UNSUPPORTED` | Universal security is unclaimable |
