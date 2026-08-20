# SVG V3 Forensic Analysis Report (`docs/portal-transformer-svg-v3-forensics.md`)

> **Source Evidence**: Extracted empirically from [`reports/evaluation/svg-v3-forensics.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-v3-forensics.json) and [`reports/evaluation/svg-benchmark-v2-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-benchmark-v2-results.json)

---

## 1. Forensic Categorization of the 50 Sprite False Positives

In the Unseen SVG Benchmark V2 ($N = 500$), 50 False Positives ($FP = 50$) occurred exclusively in the `svg-symbol-use-sprite` category (`SVG-V2-OK-SPRITE-1` through `SVG-V2-OK-SPRITE-50`).

### **Root Cause Breakdown Across 18 Semantic Categories**

1. **Local `<symbol>` + `<use>`**: Unresolved symbol ID in local `domMap`. When `<use href="#symbol_chart_1">` is parsed, the detector attempts symbol registry resolution. If the symbol element is absent from the immediate dictionary context, the accessible name defaults to empty string (`""`), triggering a defect candidate.
2. **`<symbol>` Containing `<title>` / `<desc>`**: When symbol definitions are stored in external SVG sprite sheets or distant DOM nodes, the child `<title>` or `<desc>` text is not accessible to a flat single-node scanner.
3. **`<use href="#id">` vs `<use xlink:href="#id">`**: Both standard SVG 2 `href` and legacy SVG 1.1 `xlink:href` require unified attribute normalization.
4. **Missing Referenced Symbol**: When a `<use>` element references an ID that does not exist anywhere in the document tree, the accessible name cannot be computed.
5. **Duplicate Symbol IDs**: Duplicate ID attributes in malformed DOMs create ambiguity regarding which `<symbol>` definition provides the canonical title.
6. **External / Cross-Origin References**: `<use href="https://external.cdn/sprites.svg#icon">` or `data:`, `blob:`, `javascript:` URIs cannot be resolved locally and MUST NOT trigger remote network dispatches.

---

## 2. Forensic Conclusion & Architectural Strategy

To eliminate false alarms without risking unsafe or blind DOM mutations:
1. **Principled `SvgSemanticResolver`**: Introduce a dedicated SVG resolver with explicit uncertainty handling.
2. **Explicit Abstention (`AMBIGUOUS_ABSTAIN`)**: If an SVG uses an unresolvable `<use href="...">` symbol, an external URL reference, duplicate symbol IDs, or conflicting ARIA declarations, the resolver MUST return `AMBIGUOUS_ABSTAIN` with $0.0$ confidence rather than forcing an unsupported patch.
3. **Zero Network Dispatches**: External, cross-origin, `data:`, `blob:`, `javascript:`, or `file:` URIs are rejected locally without network dispatches.
