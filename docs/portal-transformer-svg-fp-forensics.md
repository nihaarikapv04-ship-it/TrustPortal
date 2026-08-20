# SVG False-Positive Forensic Analysis Report (`docs/portal-transformer-svg-fp-forensics.md`)

> **Source Evidence**: Extracted empirically from [`reports/evaluation/svg-fp-forensics.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-fp-forensics.json) and [`reports/evaluation/svg-context-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-context-results.json)

---

## 1. Forensic Summary of the 30 SVG False Positives

In the Targeted SVG Benchmark ($N = 300$), 30 False Positives ($FP = 30$) occurred exclusively in the `svg-with-child-title` category (Cases `SVG-OK-TITLE-1` through `SVG-OK-TITLE-30`).

### **Root Cause: Rule Dispatch Branching Collision**
1. **Target Element**: `<svg id="svg_title_1" role="img"><title>Official Chart 1</title></svg>`
2. **Computed Accessible Name**: `"Official Chart 1"` (Computed correctly by `AccessibleNameComputer`).
3. **Execution Branch Collision**:
   - In `DeterministicDetector.scan()`, Rule 1 checked:
     ```ts
     if (tag === "img" || role === "img") { ... }
     ```
   - Because the SVG specified `role="img"`, Rule 1 evaluated to `true` **before** Rule 6 (`tag === "svg"`) was ever reached.
   - Rule 1 enforces HTML `<img>` semantics, requiring an `alt` attribute:
     ```ts
     if (!("alt" in attrs) && !attrs["aria-label"] && !attrs["aria-labelledby"]) {
       candidates.push(this.createCandidate("RULE_IMG_ALT_MISSING", ...));
     }
     ```
   - Native SVGs do **not** use `alt` attributes; they use `<title>`, `<desc>`, or ARIA labels.
   - Because `alt` was absent, Rule 1 incorrectly flagged `SVG-OK-TITLE-1` with `RULE_IMG_ALT_MISSING`, completely bypassing Rule 6 (the Context-Aware SVG Resolver).

---

## 2. Architectural Remediation

To prevent Rule 1 (`RULE_IMG_ALT_MISSING`) from hijacking SVG elements:
1. **Restrict Rule 1 Dispatch**:
   ```ts
   if (tag === "img" || (role === "img" && tag !== "svg"))
   ```
2. **Direct All SVGs to Context-Aware Resolver**: All `<svg>` tags (regardless of `role="img"`) are routed exclusively to Rule 6 (`evaluateSvgContext`), which computes child `<title>`, `<desc>`, `aria-label`, `aria-labelledby`, and parent container semantics.
