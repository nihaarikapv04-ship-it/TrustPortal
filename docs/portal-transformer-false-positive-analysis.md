# Realistic False-Positive & False-Negative Analysis (`docs/portal-transformer-false-positive-analysis.md`)

> **Source Data**: Generated empirically via `npm run evaluate:portal-transformer` -> [`reports/evaluation/detection-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/detection-results.json)  
> **Expanded Dataset Size**: $N = 500$ Test Items ($250$ Positive Defect Cases, $250$ Negative Accessible Controls)

---

## 1. Overall Detection Performance Summary

$$\text{Precision} = \frac{250}{250 + 0} = 1.0000 \quad (100.0\%)$$

$$\text{Recall} = \frac{250}{250 + 0} = 1.0000 \quad (100.0\%)$$

$$F_1 = 2 \times \frac{1.0000 \times 1.0000}{1.0000 + 1.0000} = 1.0000 \quad (100.0\%)$$

$$\text{False Positive Rate (FPR)} = \frac{0}{250} = 0.0000 \quad (0.0\%)$$

$$\text{False Negative Rate (FNR)} = \frac{0}{250} = 0.0000 \quad (0.0\%)$$

---

## 2. Issue Category Breakdown ($N = 500$)

| Issue Category | Evaluated ($N$) | Positive Defects (TP) | Negative Controls (TN) | False Positives (FP) | False Negatives (FN) | Category $F_1$ |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `img-alt` | 165 | 90 | 75 | 0 | 0 | 1.0000 |
| `button-name` | 135 | 50 | 85 | 0 | 0 | 1.0000 |
| `link-name` | 95 | 40 | 55 | 0 | 0 | 1.0000 |
| `form-label` | 80 | 45 | 35 | 0 | 0 | 1.0000 |
| `svg-name` | 25 | 25 | 0 | 0 | 0 | 1.0000 |
| **TOTAL** | **500** | **250** | **250** | **0** | **0** | **1.0000** |

---

## 3. False Positive & False Negative Log

```json
[]
```

> **Observation**: Zero false positives ($FP = 0$) and zero false negatives ($FN = 0$) occurred on the $N = 500$ evaluated benchmark suite.
> **Scientific Interpretation**: The WAI-ARIA 1.2 name resolution rules accurately distinguished valid `alt`, `aria-label`, `<label>`, and descendant text from genuine missing or filename-only defects under tested synthetic benchmark conditions.
