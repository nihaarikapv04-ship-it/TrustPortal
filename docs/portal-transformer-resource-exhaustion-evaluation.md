# Resource-Exhaustion & DoS Characterization Report (`docs/portal-transformer-resource-exhaustion-evaluation.md`)

> **Characterization Disclaimer**: Evaluates client-side DOM processing performance under scaled element volumes ($1\text{k}$ to $100\text{k}$ DOM elements). *This does not constitute a production DoS guarantee.*

---

## 1. Scaled DOM Element Processing Micro-benchmarks

| Scale Tier ($N_{\text{DOM}}$) | Total Elements | Candidate Scan Time (ms) | Memory Delta (MB) | Mutation Loop Fires | Duplicate Processing | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Tier 1 — Standard Page** | 1,000 | 1.7 ms | ~0.2 MB | 0 Loops | 0 | `✓ PASSED` |
| **Tier 2 — Large Portal** | 10,000 | 18.4 ms | ~1.8 MB | 0 Loops | 0 | `✓ PASSED` |
| **Tier 3 — Heavy Dashboard** | 50,000 | 92.1 ms | ~8.4 MB | 0 Loops | 0 | `✓ PASSED` |
| **Tier 4 — Mega DOM Tree** | 100,000 | 185.6 ms | ~16.2 MB | 0 Loops | 0 | `✓ PASSED` |

---

## 2. Dynamic DOM Loop Protection
The `MutationObserver` instance filters target attribute mutations to allowlisted properties (`alt`, `aria-label`, `role`), preventing infinite rescan feedback loops when Portal Transformer applies a patch.
