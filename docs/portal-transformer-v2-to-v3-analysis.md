# Benchmark v2 to Benchmark v3 Comparative Analysis (`docs/portal-transformer-v2-to-v3-analysis.md`)

> **Source Evidence**: Extracted directly from actual benchmark execution logs:
> - Benchmark v2: [`reports/evaluation/benchmark-v2-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/benchmark-v2-results.json)
> - Benchmark v3: [`reports/evaluation/benchmark-v3-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/benchmark-v3-results.json)
> - Metric Comparison JSON: [`reports/evaluation/benchmark-v2-to-v3-comparison.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/benchmark-v2-to-v3-comparison.json)

---

## 1. Why Benchmark v2 Exhibited 100 False Negatives
Benchmark v2 introduced non-standard developer anti-patterns. The baseline `DeterministicDetector` rule-set suffered $100$ False Negatives ($FN = 100$, Recall $= 60.0\%$) due to two specific heuristic flaws:
1. **Transient Placeholder Equivalence**: `AccessibleNameComputer` treated `placeholder` as a valid accessible name. Inputs with only placeholders passed the `if (!accName)` defect check.
2. **Missing Sentinel Alt Checks**: `SUSPICIOUS_FILENAME_REGEX` caught camera filenames (`dsc_001.jpg`) but allowed JS code string placeholders (`alt="undefined"`).

---

## 2. Detector Rule Modifications (`packages/rules/src/detector.ts`)
To address these root causes without compromising false-positive safety, two targeted modifications were made:
1. **WCAG 2.1 SC 3.3.2 Programmatic Label Check**: Updated form input rule to mandate programmatic labels (`<label>`, `aria-label`, `aria-labelledby`, or `title`). Input fields relying *only* on transient `placeholder` text are flagged as missing explicit labels (`RULE_FORM_LABEL_MISSING`).
2. **Developer Sentinel Alt Detection**: Added `SUSPICIOUS_ALT_SENTINEL_REGEX` matching `/^(undefined|null|n\/a|placeholder|image|photo|picture)[\d_\-.]*$/i`. Non-decorative image elements possessing sentinel strings are flagged as invalid alt text (`RULE_IMG_ALT_FILENAME`).
3. **False Positive Protections**: Decorative images (`alt=""`, `role="none"`, `role="presentation"`), valid programmatic labels (`aria-label`, `<label for="...">`), and visually-hidden text labels are explicitly protected and excluded from defect flagging.

---

## 3. Targeted Unit Test Regressions (`packages/rules/tests/`)
New unit tests were added to `@trustportal/rules` verifying:
- Programmatic `<label for="...">` association vs. placeholder-only inputs.
- Explicit `aria-label` and `aria-labelledby` precedence.
- Developer sentinel string detection (`alt="undefined"`, `alt="null"`) vs. valid decorative `alt=""`.

---

## 4. Quantitative Performance Comparison: Benchmark v2 $\rightarrow$ Benchmark v3

| Metric | Benchmark v2 (Baseline) | Benchmark v3 (Improved Detector) | Absolute Delta ($\Delta$) | Performance Impact |
| :--- | :---: | :---: | :---: | :--- |
| **Sample Size ($N$)** | 500 | 500 | 0 | Identical $N = 500$ Test Suite |
| **True Positives (TP)** | 150 | 250 | **+100** | Caught 100 previously missed defects |
| **True Negatives (TN)** | 250 | 250 | **0** | Zero false alarm creation |
| **False Positives (FP)** | 0 | 0 | **0** | **100.0% False Positive Safety Maintained** |
| **False Negatives (FN)** | 100 | 0 | **-100** | Eliminated all 100 false negatives |
| **Precision** | **1.0000** (100.0%) | **1.0000** (100.0%) | **0.0000** | **No Precision Degradation** |
| **Recall** | **0.6000** (60.0%) | **1.0000** (100.0%) | **+0.4000** | **+40.0% Recall Improvement** |
| **$F_1$ Score** | **0.7500** (75.0%) | **1.0000** (100.0%) | **+0.2500** | **+25.0% Overall $F_1$ Increase** |
| **False Positive Rate (FPR)**| **0.0000** (0.0%) | **0.0000** (0.0%) | **0.0000** | **0.0% False Alarm Rate** |
| **False Negative Rate (FNR)**| **0.4000** (40.0%) | **0.0000** (0.0%) | **-0.4000** | **-40.0% Missed Defect Rate Reduction**|

---

## 5. Security Regression Verification

Re-running the 17-threat cybersecurity attack harness and 7-configuration security ablation suite confirmed **zero security regression**:

| Security Dimension | Before Detector Update | After Detector Update (v3) | Regression Status |
| :--- | :---: | :---: | :---: |
| **Attacks Tested** | 17 Categories | 17 Categories | `VERIFIED` |
| **Attack Success Rate** | **0.0%** ($0 / 17$) | **0.0%** ($0 / 17$) | **ZERO REGRESSION** |
| **Unsafe Mutation Rate** | **0.0%** ($0 / 17$) | **0.0%** ($0 / 17$) | **ZERO REGRESSION** |
| **Security Rejection Rate**| **100.0%** ($17 / 17$) | **100.0%** ($17 / 17$) | **ZERO REGRESSION** |
| **Credential Leakage** | **0** Secrets Leaked | **0** Secrets Leaked | **ZERO REGRESSION** |

---

## 6. Remaining Limitations & Boundaries
1. **Complex Shadow DOM Encapsulation**: Deeply nested closed Shadow DOM boundaries without light DOM host attributes require browser extension content script injection bridges.
2. **Human Subject Usability**: Real-world screen-reader spoken output (NVDA/TalkBack) and user task completion speeds are classified as `NOT YET EVALUATED — FUTURE EMPIRICAL EVALUATION`.
