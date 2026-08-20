# Future V8 Architectural Improvement Proposal (`docs/portal-transformer-next-improvements.md`)

> **Scientific Principle**: The Portal Transformer V7 prototype was **FROZEN** during real-world evaluation. Limitations observed during evaluation are documented here for future V8 evaluation rather than modifying V7.

---

## 1. Observed Limitations & Proposed V8 Enhancements

| Observed Limitation | Empirical Evidence | Proposed V8 Solution | Expected Scientific Trade-off |
| :--- | :--- | :--- | :--- |
| **1. Missed Defects in Canvas Graphics** | $FN = 3$ canvas charts lacked DOM text nodes | Integrate Vision LLM multimodal prompt pipeline | Requires cloud API call; increases latency |
| **2. Unresolved External SVG Symbol Sheets** | $50\text{ FP}$ in Unseen SVG V2 sprite sheets | Implement local SVG sprite cache registry | Increases memory footprint; zero network dispatches preserved |
| **3. Iframe Cross-Boundary Inputs** | $FN = 1$ form input inside sandboxed iframe | Multi-frame content-script message passing | Requires broader Chrome Extension host permissions |
| **4. Dynamic SPA Route Changes** | Missed elements during client-side SPA navigation | Enhanced `MutationObserver` push-state listener | Increases DOM scan frequency |
