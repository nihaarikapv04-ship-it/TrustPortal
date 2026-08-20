# SVG Accessible-Name Reasoning & Multi-Benchmark Progression Report (`docs/portal-transformer-svg-accessible-name-v2.md`)

> **Source Evidence**: Extracted empirically from [`reports/evaluation/portal-transformer-v6-full-report.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/portal-transformer-v6-full-report.json) and [`reports/evaluation/svg-benchmark-v2-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-benchmark-v2-results.json)

---

## 1. Multi-Stage SVG & Accessibility Benchmark Comparative Matrix

| Benchmark Stage / Fixture Set | Sample Size ($N$) | True Positives (TP) | True Negatives (TN) | False Positives (FP) | False Negatives (FN) | Precision | Recall | $F_1$ Score | False Positive Rate (FPR) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Benchmark v3** (Overfitted Baseline) | 500 | 250 | 250 | 0 | 0 | **1.0000** | **1.0000** | **1.0000** | **0.0000** |
| **Benchmark v4** (Before SVG Rule 1 Fix)| 930 | 340 | 540 | 50 | 0 | **0.8718** | **1.0000** | **0.9315** | **0.0847** |
| **Benchmark v4** (After SVG Rule 1 Fix) | 930 | 340 | 590 | 0 | 0 | **1.0000** | **1.0000** | **1.0000** | **0.0000** |
| **Targeted SVG Benchmark** (Before Fix) | 300 | 150 | 120 | 30 | 0 | **0.8333** | **1.0000** | **0.9091** | **0.2000** |
| **Targeted SVG Benchmark** (After Fix)  | 300 | 150 | 150 | 0 | 0 | **1.0000** | **1.0000** | **1.0000** | **0.0000** |
| **NEW Unseen SVG Benchmark V2** | **500** | **250** | **200** | **50** | **0** | **0.8333** | **1.0000** | **0.9091** | **0.2000** |

---

## 2. Forensic Fix Verification Impact
- **Forensic Root Cause**: Rule 1 in `DeterministicDetector.scan()` matched `role="img"` on `<svg role="img">` before Rule 6 (SVG Context Resolver) executed. Since native SVGs do not use `alt` attributes, Rule 1 flagged `RULE_IMG_ALT_MISSING` on valid `<svg><title>Chart</title></svg>` elements.
- **Rule 1 Fix**: Restricted Rule 1 to `tag === "img" || (role === "img" && tag !== "svg")`. All `<svg>` elements are routed exclusively to Rule 6 (`evaluateSvgContext`).
- **Empirical Impact**: On the Targeted SVG Benchmark ($N = 300$), Precision improved from **$83.33\%$** to **$100.0\%$** (0 False Positives, 0 False Negatives). On Benchmark v4 ($N = 930$), Precision improved from **$87.18\%$** to **$100.0\%$**.

---

## 3. Generalization Performance on NEW Unseen SVG Benchmark V2 ($N = 500$)
- **Defect Recall**: $100.0\%$ ($TP = 250, FN = 0$).
- **Control Precision**: $83.33\%$ ($TN = 200, FP = 50$).
- **Generalization Finding**: Testing against complex SVG sprites referencing `<use href="#symbol">` without inline child titles exposed a $16.67\%$ precision gap ($50\text{ FP}$ on external symbol references). This confirms that deterministic static rules alone cannot resolve multi-node external SVG symbol chains without AI context evaluation.
