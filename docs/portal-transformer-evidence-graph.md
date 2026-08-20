# Master Evidence Graph & Traceability Sitemap (`docs/portal-transformer-evidence-graph.md`)

> **Traceability Graph**: Maps research questions (RQ1-RQ7) to hypotheses, mechanisms, implementations, experiments, datasets, primary metrics, results, acknowledged limitations, and final claims.

---

## 1. End-to-End Evidence Path Matrix

```text
  Research Question (RQ1 - RQ7)
              │
              ▼
         Hypothesis
              │
              ▼
    Architectural Mechanism
              │
              ▼
   Source Implementation File
              │
              ▼
     Evaluation Experiment
              │
              ▼
   Machine-Readable Dataset
              │
              ▼
    Empirical Primary Metric
              │
              ▼
       Result & Finding
              │
              ▼
    Acknowledged Limitation
              │
              ▼
   Defensible Final Thesis Claim
```

| RQ | Hypothesis | Mechanism | Source Code | Dataset | Metric | Result | Limitation | Claim Status |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **RQ1** | Rules detect accessible missing names | DOM scanning heuristics | `packages/rules/src/detector.ts` | Benchmark v4 ($N=930$) | Precision | 100.0% | Synthetic DOM fixtures | `EMPIRICALLY VERIFIED` |
| **RQ2** | Context traversal eliminates false alarms | Parent text traversal | `packages/rules/src/svg_resolver.ts` | Benchmark v4 ($N=930$) | FPR | 0.0% | Parent container text required | `EMPIRICALLY VERIFIED` |
| **RQ3** | Confidence model safely handles ambiguity | Explicit `AMBIGUOUS_ABSTAIN` | `packages/rules/src/svg_resolver.ts` | Holdout SVG V3 ($N=600$) | Abstention Rate | 33.33% | Reduces recall on complex SVGs | `EMPIRICALLY VERIFIED` |
| **RQ4** | Allowlist prevents unsafe mutations | Attribute allowlist patcher | `apps/extension/src/patcher.ts` | 1,000 Property Suite | Unsafe Mutations | 0.0% | Layout attributes immutable | `EMPIRICALLY VERIFIED` |
| **RQ5** | Target intersection prevents secret dispatches| Sensitive field classifier | `packages/redaction/src/firewall.ts` | 20 Real-World Portals | Credential Leaks | 0 | Regex field classification | `EMPIRICALLY VERIFIED` |
| **RQ6** | Boundaries contain compromised AI outputs | Client-side Output Validator | `apps/api/src/services/validator.ts` | Compromised Provider Test | Block Rate | 100.0% | Tested payload categories | `EMPIRICALLY VERIFIED` |
| **RQ7** | Zero unsafe mutations permits high coverage | Pareto frontier analysis | `packages/eval/src/realworld/` | 20 Real-World Portals | Real-World Coverage | 90.0% | Curated 20-page sample scope | `EMPIRICALLY VERIFIED` |
