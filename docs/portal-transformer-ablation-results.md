# Experiment 8: Ablation Study Results (`docs/portal-transformer-ablation-results.md`)

> **Source Data**: Generated empirically via `npm run evaluate:portal-transformer` -> [`reports/evaluation/ablation-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/ablation-results.json)  
> **Simulation Note**: Safety layer ablations were conducted inside isolated test configurations without weakening production code boundaries.

---

## 1. Safety Layer Ablation Findings

| Safety Layer Removed | Security / Privacy Risk Identified | Decision Impact | Production Architecture Justification |
| :--- | :--- | :---: | :--- |
| **No Privacy Firewall** | 100% Credential Exposure to AI (Passwords, OTPs, PINs sent in context payload) | 25 Decision Changes | Required to guarantee zero secret leakage. |
| **No Output Validator** | High Script Injection Risk (XSS payloads `<script>` allowed in DOM) | 18 Decision Changes | Required to isolate untrusted model outputs. |
| **No Trust / Risk Gate** | 14 Unsafe Model Proposals Auto-Applied to DOM | 42 Decision Changes | Required to enforce high-impact safety bounds. |
| **No Yield-on-Reclaim** | 12% Reclaim Collisions (Extension overrides host page re-renders) | 12 Decision Changes | Required to respect page DOM authority. |

---

## 2. Key Takeaway
Every security boundary (Privacy Firewall, Output Validator, TSIF Risk Gate, Yield-on-Reclaim) is strictly necessary to prevent security escalation, credential leaks, or DOM corruption.
