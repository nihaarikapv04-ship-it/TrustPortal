# Real-World False-Negative Forensic Distribution (`docs/portal-transformer-realworld-false-negative-analysis.md`)

> **Source Evidence**: Extracted empirically from [`reports/realworld/realworld-summary.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/realworld/realworld-summary.json)  
> **Empirical Real-World Finding**: **10 Missed Defects ($FN = 10, \text{FNR} = 22.22\%$)** observed on the $N = 100$ manually reviewed real-world portal element sample.

---

## 1. Classification of Missed Real-World Defects ($FN = 10$)

| Category Classification | Sample Count | Structural Cause | Remediation Automation Safety |
| :--- | :---: | :--- | :--- |
| **1. Requires Human Review** | 4 | Ambiguous icon-only controls relying on visual layout position | **Unsafe to auto-remediate**; defer to human review |
| **2. Requires Additional Semantic Context** | 3 | Canvas / WebGL rendered data graphics lacking DOM text | **Requires Vision LLM inference** |
| **3. Safe to Automate** | 2 | Placeholder-only inputs in nested fieldsets | **Safe for V8 rule enhancement** |
| **4. Unsafe to Automate** | 1 | Dynamic iframe cross-origin form controls | **Unsafe to cross iframe boundaries** |

---

## 2. Forensic Conclusion
The 22.22% False Negative Rate ($FN = 10$) confirms that rule-based client-side detectors alone cannot achieve 100% defect recall on complex public-service portals. This validates the thesis requirement for multi-modal AI semantic context dispatches coupled with human confirmation panels for high-risk or ambiguous controls.
