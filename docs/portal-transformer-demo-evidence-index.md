# Demo Evidence Traceability Index (`docs/portal-transformer-demo-evidence-index.md`)

> **Traceability Index**: Maps live demo scenarios to source implementations, unit test suites, evaluation scripts, and thesis RQs.

---

## 1. Demo Scenario Traceability Matrix

| Demo Scenario | Source Implementation File | Unit Test Suite File | Evaluation Benchmark Script | Thesis Research Question |
| :--- | :--- | :--- | :--- | :---: |
| **1. Missing Button Label** | [`packages/rules/src/detector.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/rules/src/detector.ts) | `tests/detector.test.ts` | Benchmark v4 ($N=930$) | **RQ1** |
| **2. Parent-Labelled SVG** | [`packages/rules/src/svg_resolver.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/rules/src/svg_resolver.ts) | `tests/acc_name.test.ts` | Benchmark v4 ($N=930$) | **RQ2** |
| **3. Ambiguous SVG Abstain**| [`packages/rules/src/svg_resolver.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/rules/src/svg_resolver.ts) | `tests/svg.test.ts` | Holdout SVG V3 ($N=600$) | **RQ3** |
| **4. Capability Allowlist** | [`apps/extension/src/patcher.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/apps/extension/src/patcher.ts) | `tests/patcher_security.test.ts` | Property Suite ($N=1,000$) | **RQ4** |
| **5. Privacy Scrubbing** | [`packages/redaction/src/firewall.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/redaction/src/firewall.ts) | `tests/firewall.test.ts` | 20 Real-World Portals | **RQ5** |
| **6. Compromised AI Output**| [`apps/api/src/services/validator.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/apps/api/src/services/validator.ts) | `tests/security.test.ts` | Compromised AI Test ($N=14$) | **RQ6** |
| **7. Pareto Trade-Off** | [`packages/eval/src/realworld/`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/eval/src/realworld/) | N/A | Pareto JSON Analysis | **RQ7** |
