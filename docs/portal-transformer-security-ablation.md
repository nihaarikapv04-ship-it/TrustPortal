# 7-Configuration Empirical Security Ablation Matrix (`docs/portal-transformer-security-ablation.md`)

> **Source Data**: Generated empirically via `npm run evaluate:portal-transformer` -> [`reports/evaluation/ablation-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/ablation-results.json)  
> **Ablation Methodology**: Safety components were disabled in isolated evaluation configurations without modifying production code.

---

## 1. Security Ablation Matrix Summary

| Safety Configuration | Security / Privacy Risk Identified | Decision Changes | Unsafe Mutation Count | Attack Acceptance |
| :--- | :--- | :---: | :---: | :---: |
| **1. Full System (Baseline D)** | Zero Security Violations & Zero Credential Leakage | 0 | **0** | **0%** |
| **2. No Privacy Firewall** | 100% Credential Exposure (Passwords, OTPs, PINs sent to AI) | 35 | 0 | N/A (Privacy Failure) |
| **3. No Output Validator** | High Script Injection Risk (XSS `<script>` allowed in DOM) | 22 | **17** | **100% XSS Allowed** |
| **4. No Attribute Allowlist** | Navigation Mutation Risk (`href`, `action`, `src` mutated) | 17 | **17** | **100% Nav Mutated** |
| **5. No Risk Gate** | Unsafe Model Proposals Auto-Applied to DOM | 50 | **17** | **100% Auto-Applied** |
| **6. No TOCTOU Protection** | Stale Target Collisions (Patching disconnected/swapped nodes)| 10 | **10** | **100% Stale Accepted** |
| **7. No DOM Clobbering Defense**| Global Window Scope Hijacking Vulnerability | 8 | **8** | **100% Clobber Allowed** |

---

## 2. Key Findings
Each of the 6 safety subsystems (Privacy Firewall, Output Validator, Attribute Allowlist, TSIF Risk Gate, TOCTOU Protection, DOM Clobbering Defense) is **strictly necessary** to maintain security containment and prevent credential leaks, script execution, or DOM corruption.
