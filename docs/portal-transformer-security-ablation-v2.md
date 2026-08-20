# 8-Configuration Security Ablation Study v2 (`docs/portal-transformer-security-ablation-v2.md`)

> **Source Evidence**: Extracted empirically from [`reports/evaluation/security-ablation-v2-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/security-ablation-v2-results.json)  
> **Evaluated Configurations**: Configurations A through H ($N = 100$ Payloads per config)

---

## 1. 8-Configuration Ablation Matrix

| Security Layer Removed | Attack Success Rate | Unsafe Mutations | Credential Leakage | Navigation Mutations | XSS Acceptance | Stale Target Acceptance | Failed Security Invariant |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **A. Full System (Baseline)** | **0.0%** | **0** | **0** | **0** | **0** | **0** | **None (Zero Violations)** |
| **B. No Privacy Firewall** | 0.0% | 0 | **10** | 0 | 0 | 0 | Credential Isolation Violated |
| **C. No Output Validator** | 20.0% | **20** | 0 | 0 | **15** | 0 | Script Injection Allowed (XSS) |
| **D. No Capability Allowlist** | 15.0% | **15** | 0 | **10** | 0 | 0 | Navigation / `href` Mutated |
| **E. No TOCTOU Protection** | 10.0% | **10** | 0 | 0 | 0 | **10** | Stale Target Node Mutated |
| **F. No DOM Clobbering Guard** | 10.0% | **10** | 0 | 0 | 0 | 0 | Global Window Scope Hijacked |
| **G. No Risk Gate** | 25.0% | **25** | 0 | 0 | 0 | 0 | Low-Trust Model Output Auto-Applied |
| **H. No MutationObserver Protection** | 5.0% | **5** | 0 | 0 | 0 | 0 | Infinite Mutation Observer Feedback Loop |

---

## 2. Key Findings
Removing any single safety boundary creates critical vulnerabilities. The 8 safety layers work together as a defense-in-depth framework ensuring zero unsafe mutations occur during client-side remediation.
