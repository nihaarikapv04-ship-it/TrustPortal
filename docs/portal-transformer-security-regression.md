# Expanded 100-Adversarial Security Regression Report (`docs/portal-transformer-security-regression.md`)

> **Source Evidence**: Extracted empirically from [`reports/evaluation/security-regression-suite.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/security-regression-suite.json)  
> **Total Adversarial Attack Payloads**: $N = 100$ Test Payloads across 10 Attack Categories

---

## 1. Quantitative Security Metrics ($N = 100$ Payloads)

$$\text{Attack Success Rate (ASR)} = \frac{0}{100} = 0.0\% \quad (\text{Target: } 0.0\%)$$

$$\text{Unsafe Mutation Rate} = \frac{0}{100} = 0.0\% \quad (\text{Target: } 0.0\%)$$

$$\text{Security Rejection Rate} = \frac{100}{100} = 100.0\% \quad (\text{Target: } 100.0\%)$$

$$\text{Credential Leakage Rate} = \frac{0}{10} = 0.0\% \quad (\text{Target: } 0.0\%)$$

$$\text{Navigation Mutation Rate} = \frac{0}{10} = 0.0\% \quad (\text{Target: } 0.0\%)$$

$$\text{Script Execution Rate} = \frac{0}{15} = 0.0\% \quad (\text{Target: } 0.0\%)$$

---

## 2. Category-Level Security Test Results

| Attack Category | Test Payloads ($N$) | Blocked Count | Attack Success Rate | Unsafe Mutations | Primary Security Boundary | Status |
| :--- | :---: | :---: | :---: | :---: | :--- | :---: |
| **Prompt Injection** | 20 | 20 | 0.0% | 0 | `LocalOutputValidator` | `✓ PASSED` |
| **XSS Output Injection** | 15 | 15 | 0.0% | 0 | `LocalOutputValidator` | `✓ PASSED` |
| **URI Scheme Injection** | 10 | 10 | 0.0% | 0 | `LocalPatchEngine` | `✓ PASSED` |
| **DOM Clobbering** | 10 | 10 | 0.0% | 0 | `SafeDOMRef` | `✓ PASSED` |
| **TOCTOU / Stale Target** | 10 | 10 | 0.0% | 0 | `LocalPatchEngine` (TOCTOU) | `✓ PASSED` |
| **postMessage Spoofing** | 10 | 10 | 0.0% | 0 | `Isolated World MV3` | `✓ PASSED` |
| **Credential Exposure** | 10 | 10 | 0.0% | 0 | `PrivacyFirewall` | `✓ PASSED` |
| **SVG Event Handler** | 5 | 5 | 0.0% | 0 | `LocalPatchEngine` | `✓ PASSED` |
| **Resource Exhaustion** | 5 | 5 | 0.0% | 0 | `LocalOutputValidator` | `✓ PASSED` |
| **ARIA Manipulation** | 5 | 5 | 0.0% | 0 | `LocalPatchEngine` | `✓ PASSED` |
| **TOTAL** | **100** | **100** | **0.0%** | **0** | **Security Pipeline** | `✓ PASSED` |
