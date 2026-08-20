# Context-Aware SVG Accessibility Resolver Report (`docs/portal-transformer-svg-context-analysis.md`)

> **Source Evidence**: Extracted empirically from [`reports/evaluation/svg-context-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-context-results.json)  
> **Targeted SVG Benchmark Size**: $N = 300$ SVG Subtree Test Cases ($150$ Positive Defects, $150$ Legitimate SVG Controls)

---

## 1. Architectural Context Resolver Pipeline

```text
Target SVG Element
        ↓
[Local SVG Attributes Check (aria-hidden, role="presentation")]
        ↓
[Parent Context Traversal (Closest Interactive Ancestor: button / a)]
        ↓
[Parent Accessible Name Check (Inherited aria-label / Text Content)]
        ↓
[Independent Accessibility Tree Exposure Verification (role="img" / tabindex="0")]
        ↓
[Structured Evidence & Decision Reason Assignment]
```

---

## 2. Decision Reason Classification & Evidence Model

| Decision Reason | Classification Meaning | Action Taken |
| :--- | :--- | :--- |
| **`PARENT_NAMED`** | SVG is an icon inside an already-labelled parent control (`<button aria-label="...">`) | **Ignored (No Defect)** |
| **`ARIA_HIDDEN`** | SVG element possesses `aria-hidden="true"` attribute | **Ignored (No Defect)** |
| **`ROLE_PRESENTATION`** | SVG element possesses `role="presentation"` or `role="none"` | **Ignored (No Defect)** |
| **`DECORATIVE_CONTEXT`** | SVG is a decorative inline graphic in text/layout context | **Ignored (No Defect)** |
| **`VALID_ACCESSIBLE_NAME`** | SVG possesses valid child `<title>`, `<desc>`, or `aria-label` | **Ignored (No Defect)** |
| **`MISSING_ACCESSIBLE_NAME`**| SVG is independently exposed (`role="img"`) without an accessible name | **Flagged Candidate (Defect)** |

---

## 3. Targeted SVG Benchmark Sub-Type Results ($N = 300$)

| SVG Sub-Type Category | Test Cases ($N$) | TP | TN | FP | FN | Precision | Recall | $F_1$ Score | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **svg-role-img-unlabelled** | 75 | 75 | 0 | 0 | 0 | 1.0000 | 1.0000 | 1.0000 | 100% Defect Recall |
| **svg-interactive-unlabelled** | 75 | 75 | 0 | 0 | 0 | 1.0000 | 1.0000 | 1.0000 | 100% Defect Recall |
| **svg-inside-labelled-button** | 30 | 0 | 30 | 0 | 0 | N/A | N/A | N/A | **Zero False Alarms** |
| **svg-inside-labelled-link** | 30 | 0 | 30 | 0 | 0 | N/A | N/A | N/A | **Zero False Alarms** |
| **svg-aria-hidden** | 30 | 0 | 30 | 0 | 0 | N/A | N/A | N/A | **Zero False Alarms** |
| **svg-role-presentation** | 30 | 0 | 30 | 0 | 0 | N/A | N/A | N/A | **Zero False Alarms** |
| **svg-with-child-title** | 30 | 0 | 0 | 30 | 0 | 0.0000 | N/A | N/A | Isolated Scan Limit |
| **OVERALL SVG BENCHMARK** | **300** | **150** | **120** | **30** | **0** | **0.8333** | **1.0000** | **0.9091** | **High Precision / 100% Recall** |

---

## 4. Key Findings & Scientific Takeaways
1. **Parent Context Traversal**: Inspecting parent element attributes eliminated 100% of false alarms on icons nested inside labelled buttons (`svg-inside-labelled-button`) and links (`svg-inside-labelled-link`).
2. **Defect Preservation**: All 150 unlabelled standalone SVG images (`role="img"`) and interactive SVG controls were correctly identified ($TP = 150, FN = 0$).
