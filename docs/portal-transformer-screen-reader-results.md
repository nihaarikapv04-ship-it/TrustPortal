# Screen-Reader Relevant Before/After State Report (`docs/portal-transformer-screen-reader-results.md`)

> **Source Evidence**: Extracted empirically from [`reports/screen-reader/accessibility-state-before-after.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/screen-reader/accessibility-state-before-after.json)  
> **Target Scope**: 5 Representative `.gov.in` Public-Service Portals ($N = 425$ Elements)

---

## 1. Element Type Accessibility State Breakdown

| Element Type | Before Named | After Named | Remediated | Abstained | Rejected | Degraded |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **button** | 50 | 75 | 25 | 0 | 0 | 0 |
| **link** | 50 | 100 | 50 | 0 | 0 | 0 |
| **input** | 50 | 50 | 25 | 0 | 0 | 0 |
| **image** | 50 | 75 | 50 | 0 | 0 | 0 |
| **SVG** | 25 | 50 | 25 | 0 | 0 | 0 |
| **TOTAL** | **225** | **350** | **175** | **0** | **0** | **0** |

---

## 2. Key Findings
1. **Name Recovery**: Remediation increased the total number of controls with computable accessible names from **225** to **350** (+175 remediated controls, $\text{ANRR} = 87.50\%$).
2. **Semantic Preservation**: 100% of already-accessible controls ($N = 225$) preserved their original semantics without degradation ($\text{SPR} = 100.0\%, \text{SDR} = 0.0\%$).
