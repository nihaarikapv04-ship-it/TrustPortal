# Real-World False-Positive Forensic Distribution (`docs/portal-transformer-realworld-false-positive-analysis.md`)

> **Source Evidence**: Extracted empirically from [`reports/realworld/realworld-summary.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/realworld/realworld-summary.json)  
> **Empirical Real-World Finding**: **0 Confirmed False Positives ($FP = 0$)** observed on the $N = 100$ manually reviewed real-world portal element sample due to explicit `SvgSemanticResolver` and parent container context resolution.

---

## 1. Error Taxonomy & Potential Vulnerability Vectors

Although zero false positives were observed on the evaluated sample set ($FP = 0, \text{FPR} = 0.0\%$), ongoing monitoring categorizes potential false-alarm risks across 6 structural categories:

| Structural Risk Category | Potential Mechanism | Mitigation Strategy |
| :--- | :--- | :--- |
| **1. Complex Composite ARIA Widgets** | Custom ARIA tablist or combobox using non-standard data attributes | SvgSemanticResolver returns `AMBIGUOUS_ABSTAIN` |
| **2. Dynamic Shadow DOM Subtrees** | Encapsulated custom Web Components unreadable by standard query selectors | Shadow DOM traversal depth limits |
| **3. Framework-Generated DynIDs** | React / Angular auto-generated dynamic IDs (`:r0:`) causing reference mismatches | Ignore auto-generated numeric ID prefixes |
| **4. Multi-Language Unicode Labels** | Non-Latin scripts (Hindi, Tamil, Bengali) parsed as empty strings | WAI-ARIA Unicode text content normalization |
| **5. SVG Sprite Symbol References** | Remote sprite sheets loaded via external URLs | Disallow remote fetches; return `AMBIGUOUS_ABSTAIN` |
| **6. Lazy-Loaded Imagery** | Images rendered without `src` or `alt` prior to viewport scroll | Defer candidate evaluation until DOM mount |
