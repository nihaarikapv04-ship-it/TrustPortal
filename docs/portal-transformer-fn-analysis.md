# False Negative Forensics & Root Cause Analysis (`docs/portal-transformer-fn-analysis.md`)

> **Source Evidence**: Extracted empirically from [`reports/evaluation/benchmark-v2-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/benchmark-v2-results.json)  
> **Benchmark v2 Metrics**: $N = 500, TP = 150, TN = 250, FP = 0, FN = 100$ ($\text{Recall} = 60.0\%, \text{FNR} = 40.0\%$)

---

## 1. Grouped Root Cause Forensic Matrix

| Root Cause Category | FN Count | Example Case ID | Representative DOM Structure | Detector Miss Reason | WCAG Specification Standard | Proposed Remediation |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **Root Cause A: Placeholder-Only Form Inputs** | **50** | `V2-PH-DEF-1` | `<input type="text" placeholder="Enter Tax ID 1">` | `AccessibleNameComputer` treated `placeholder` as a valid accessible name. Detector evaluated `if (!accName)` to `false`. | **WCAG 2.1 SC 3.3.2 (Labels or Instructions)**: Placeholders are transient and not valid programmatic label substitutes. | Form control rule must require programmatic labels (`<label>`, `aria-label`, `aria-labelledby`) and flag placeholder-only fields. |
| **Root Cause B: Developer Sentinel Alt Text** | **50** | `V2-ALT-UNDEF-1` | `<img src="/photo_1.jpg" alt="undefined">` | `SUSPICIOUS_FILENAME_REGEX` caught `dsc_001.jpg` but missed JS string artifacts like `"undefined"`. Alt was non-empty so missing alt check passed. | **WCAG 2.1 SC 1.1.1 (Non-text Content)**: Alternative text must be meaningful. `"undefined"` or `"null"` is a code bug. | Expand suspicious alt regex to detect `"undefined"`, `"null"`, `"N/A"`, and generic placeholders while respecting decorative `alt=""`. |
| **TOTAL FALSE NEGATIVES** | **100** | | | | | |

---

## 2. Detailed False Negative Item Log ($FN = 100$)

### Root Cause A: Placeholder-Only Input Fields (Cases `V2-PH-DEF-1` to `V2-PH-DEF-50`)
- **Case IDs**: `V2-PH-DEF-1` through `V2-PH-DEF-50` ($50$ cases)
- **Element Type**: `<input type="text">`
- **DOM Structure**: `<input id="inp_ph_1" type="text" placeholder="Enter Tax ID 1">`
- **Expected Accessibility State**: Defect (Missing programmatic `<label>` or `aria-label`)
- **Actual Detector State**: Ignored (Not flagged)
- **Accessible Name Computation Result**: `"Enter Tax ID 1"` (Computed from `placeholder`)
- **Detector Rule Responsible**: `RULE_FORM_LABEL_MISSING`
- **Reason for Miss**: Rule checked `if (!accName)` which evaluated to `false` because `AccessibleNameComputer` fell back to `placeholder`.
- **Proposed Remediation**: Check whether input possesses an explicit programmatic label (`<label>`, `aria-label`, `aria-labelledby`, or `labels` array). If it relies solely on `placeholder`, flag as missing explicit label.

### Root Cause B: Developer Sentinel Image Alt Strings (Cases `V2-ALT-UNDEF-1` to `V2-ALT-UNDEF-50`)
- **Case IDs**: `V2-ALT-UNDEF-1` through `V2-ALT-UNDEF-50` ($50$ cases)
- **Element Type**: `<img>`
- **DOM Structure**: `<img id="img_undef_1" src="/photo_1.jpg" alt="undefined">`
- **Expected Accessibility State**: Defect (Non-meaningful string alt)
- **Actual Detector State**: Ignored (Not flagged)
- **Accessible Name Computation Result**: `"undefined"`
- **Detector Rule Responsible**: `RULE_IMG_ALT_MISSING` / `RULE_IMG_ALT_FILENAME`
- **Reason for Miss**: `alt` attribute was present and non-empty, and `"undefined"` did not match the filename extension regex (`.jpg`, `.png`).
- **Proposed Remediation**: Introduce `SUSPICIOUS_ALT_SENTINEL_REGEX` matching `/^(undefined|null|n\/a|placeholder|image|photo|picture)$/i`.

---

## 3. Scientific Summary
These 100 false negatives represent genuine weaknesses in heuristic detector rule construction. Upgrading the detector rules in `packages/rules/src/` will enable Portal Transformer to catch these defects while maintaining strict false-positive protections.
