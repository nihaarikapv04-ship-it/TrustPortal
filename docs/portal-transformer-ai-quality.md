# Experiment 2: AI Semantic Label Quality Results (`docs/portal-transformer-ai-quality.md`)

> **Source Data**: Generated empirically via `npm run evaluate:portal-transformer` -> [`reports/evaluation/ai-quality-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/ai-quality-results.json)  
> **Dataset Classification**: `SYNTHETIC BENCHMARK EVALUATION` ($N = 150$ Positive Defect Items)

---

## 1. Five Quality Tiers Breakdown

| Quality Tier | Count | Rate (%) | Description |
| :--- | :---: | :---: | :--- |
| **Tier 1: Exact Match** | **150** | **100.0%** | Proposed label matches ground-truth reference label exactly. |
| **Tier 2: Semantically Acceptable** | **150** | **100.0%** | Proposed label is contextually helpful and accurate for screen reader users. |
| **Tier 3: Inappropriate / Low Quality** | **0** | **0.0%** | Vague, generic, or unhelpful label proposals. |
| **Tier 4: Unsafe / Misleading** | **0** | **0.0%** | Labels containing misleading descriptions or malicious syntax. |
| **Tier 5: Safe Abstention** | **0** | **0.0%** | Pipeline abstains from label proposal due to low confidence. |

---

## 2. Baseline Quality Comparison

$$\text{Baseline B (Deterministic Heuristic Fallback)} = 65.0\% \text{ Acceptable Quality}$$

$$\text{Baseline D (Full Portal Transformer Pipeline)} = 100.0\% \text{ Acceptable Quality}$$

---

## 3. Scientific Note
> **Classification Note**: These results represent synthetic benchmark ground-truth reference matching. Human-subject qualitative semantic rating is planned for future empirical evaluation.
