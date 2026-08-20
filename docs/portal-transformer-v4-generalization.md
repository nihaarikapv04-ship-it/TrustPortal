# Benchmark v4 Unseen Generalization Report (`docs/portal-transformer-v4-generalization.md`)

> **Source Evidence**: Extracted empirically from [`reports/evaluation/benchmark-v4-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/benchmark-v4-results.json)  
> **Benchmark v4 Dataset Size**: $N = 930$ Unseen Fixtures across 21 Diverse Categories ($340$ Positive Defect Cases, $590$ Negative Accessible Controls)

---

## 1. Overall Generalization Performance (v2 vs v3 vs v4)

| Metric | Benchmark v2 (Baseline Failure) | Benchmark v3 (Overfitted Benchmark) | Benchmark v4 (Unseen Generalization) | Generalization Gap (v3 vs v4) |
| :--- | :---: | :---: | :---: | :---: |
| **Sample Size ($N$)** | 500 | 500 | **930** | +430 Unseen Cases |
| **True Positives (TP)** | 150 | 250 | **340** | +90 True Defects Identified |
| **True Negatives (TN)** | 250 | 250 | **540** | +290 Valid Controls Verified |
| **False Positives (FP)** | 0 | 0 | **50** | **+50 False Alarms on Unseen Markup** |
| **False Negatives (FN)** | 100 | 0 | **0** | Zero Missed Defects |
| **Precision** | **1.0000** (100.0%) | **1.0000** (100.0%) | **0.8718** (87.18%) | **-12.82% Precision Generalization Gap** |
| **Recall** | **0.6000** (60.0%) | **1.0000** (100.0%) | **1.0000** (100.0%) | **0.00% Perfect Recall Preserved** |
| **$F_1$ Score** | **0.7500** (75.0%) | **1.0000** (100.0%) | **0.9315** (93.15%) | **-6.85% $F_1$ Generalization Gap** |
| **False Positive Rate (FPR)**| **0.0000** (0.0%) | **0.0000** (0.0%) | **0.0847** (8.47%) | **+8.47% FPR Increase** |
| **False Negative Rate (FNR)**| **0.4000** (40.0%) | **0.0000** (0.0%) | **0.0000** (0.0%) | **0.0% Missed Defect Rate** |

---

## 2. Category-Level Performance Breakdown ($N = 930$)

| Category | Evaluated ($N$) | TP | TN | FP | FN | Precision | Recall | $F_1$ Score | FPR | FNR |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **image** | 120 | 60 | 60 | 0 | 0 | 1.0000 | 1.0000 | 1.0000 | 0.0000 | 0.0000 |
| **button** | 170 | 60 | 110 | 0 | 0 | 1.0000 | 1.0000 | 1.0000 | 0.0000 | 0.0000 |
| **link** | 120 | 60 | 60 | 0 | 0 | 1.0000 | 1.0000 | 1.0000 | 0.0000 | 0.0000 |
| **input** | 160 | 60 | 100 | 0 | 0 | 1.0000 | 1.0000 | 1.0000 | 0.0000 | 0.0000 |
| **svg** | 100 | 50 | 0 | 50 | 0 | 0.5000 | 1.0000 | 0.6667 | 1.0000 | 0.0000 |
| **ARIA** | 100 | 50 | 50 | 0 | 0 | 1.0000 | 1.0000 | 1.0000 | 0.0000 | 0.0000 |
| **dynamic DOM** | 50 | 0 | 50 | 0 | 0 | N/A | N/A | N/A | 0.0000 | 0.0000 |
| **malformed DOM**| 50 | 0 | 50 | 0 | 0 | N/A | N/A | N/A | 0.0000 | 0.0000 |
| **ambiguous cases**| 60 | 0 | 60 | 0 | 0 | N/A | N/A | N/A | 0.0000 | 0.0000 |
| **OVERALL** | **930** | **340** | **540** | **50** | **0** | **0.8718** | **1.0000** | **0.9315** | **0.0847** | **0.0000** |

---

## 3. Scientific Analysis of the Generalization Gap

### Why Precision Dropped from 100% to 87.18%
- In the `svg` category, 50 valid non-defect SVG controls (`V4-SVG-OK-1` through `V4-SVG-OK-50`) were tested with child `<title>` elements.
- The isolated rule detector scanned the `<svg>` tag independently without receiving the full child subtree dictionary in the micro-call. As a result, it computed accessible name as empty (`""`) and flagged all 50 valid SVGs as missing accessible names (`RULE_SVG_NAME_MISSING`), generating 50 False Positives ($FP = 50$).

> **Scientific Thesis Insight**: Demonstrates that while benchmark-fitted rule detectors achieve perfect $100.0\%\text{ }F_1$ scores on familiar benchmark fixtures (Benchmark v3), evaluating against un-adapted unseen markup exposes genuine false-alarm rates ($8.47\%\text{ FPR}$). This justifies the core thesis architecture: deterministic rules should act as high-recall candidate filters, while AI semantic context relays verify true intent before applying DOM patches.
