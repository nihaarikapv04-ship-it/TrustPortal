# Experiment 1: Detection Accuracy Results (`docs/portal-transformer-detection-results.md`)

> **Source Data**: Generated empirically via `npm run evaluate:portal-transformer` -> [`reports/evaluation/detection-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/detection-results.json)  
> **Target Dataset Size**: $N = 250$ Elements ($150$ Positive Defect Cases, $100$ Negative Accessible Controls)

---

## 1. Confusion Matrix Overview

| Metric Dimension | Value | Definition |
| :--- | :---: | :--- |
| **True Positives (TP)** | **150** | Defective accessibility elements correctly identified. |
| **True Negatives (TN)** | **100** | Accessible or excluded elements correctly ignored. |
| **False Positives (FP)** | **0** | Accessible elements incorrectly flagged as defective. |
| **False Negatives (FN)** | **0** | Defective elements missed by `DeterministicDetector`. |

---

## 2. Quantitative Performance Metrics

$$\text{Precision} = \frac{TP}{TP + FP} = \frac{150}{150 + 0} = 1.000 \quad (100.0\%)$$

$$\text{Recall} = \frac{TP}{TP + FN} = \frac{150}{150 + 0} = 1.000 \quad (100.0\%)$$

$$F_1 = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}} = 1.000 \quad (100.0\%)$$

$$\text{False Positive Rate (FPR)} = \frac{FP}{FP + TN} = \frac{0}{0 + 100} = 0.000 \quad (0.0\%)$$

$$\text{False Negative Rate (FNR)} = \frac{FN}{TP + FN} = \frac{0}{0 + 150} = 0.000 \quad (0.0\%)$$

---

## 3. Issue Category Breakdown

| Issue Category | Total Evaluated | True Positives (TP) | True Negatives (TN) | FP | FN | Category $F_1$ |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `img-alt` | 85 | 50 | 35 | 0 | 0 | 1.000 |
| `button-name` | 60 | 30 | 30 | 0 | 0 | 1.000 |
| `link-name` | 45 | 25 | 20 | 0 | 0 | 1.000 |
| `form-label` | 40 | 25 | 15 | 0 | 0 | 1.000 |
| `svg-name` | 20 | 20 | 0 | 0 | 0 | 1.000 |
| **TOTAL** | **250** | **150** | **100** | **0** | **0** | **1.000** |

---

## 4. Key Findings
1. **Deterministic Accuracy**: The `DeterministicDetector` achieved $100.0\%$ Precision, Recall, and $F_1$ score across all $N = 250$ synthetic benchmark elements.
2. **Exclusion Gate Reliability**: Zero false positives ($FP = 0$) occurred on decorative (`role="none"`), hidden (`aria-hidden="true"`), or pre-labeled controls.
