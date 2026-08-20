# Thesis Figure Source Mapping (`docs/portal-transformer-figure-source-map.md`)

> **Traceability Standard**: Maps Figures 1 through 14 to source JSON artifacts, data fields, and expected interpretations.

---

## 1. Figure Source Map Table

| Figure ID | Title / Content | Source Artifact Path | Data Fields Used | Expected Interpretation |
| :-: | :--- | :--- | :--- | :--- |
| **FIG 1** | **System Architecture** | `packages/rules/src/detector.ts` | Subsystem relationships | 16-component client extension pipeline |
| **FIG 2** | **Security Trust Boundaries** | `packages/redaction/src/firewall.ts` | Firewall & Patch boundaries | Zero-trust input sanitization |
| **FIG 3** | **Remediation Pipeline** | `apps/extension/src/patcher.ts` | Pipeline flowchart | Multi-stage security validation |
| **FIG 4** | **Benchmark Precision/Recall** | `reports/evaluation/benchmark-v4-after-fix.json` | `metrics` object | 100.0% precision and recall on v4 |
| **FIG 5** | **Benchmark Evolution** | Historical JSON reports | Precision/Recall sequence | Systematic defect resolution progression |
| **FIG 6** | **SVG Holdout Performance** | `reports/evaluation/svg-benchmark-v3-results.json` | `metrics` object | 33.33% abstention rate trade-off |
| **FIG 7** | **Real-World `.gov.in`** | `reports/realworld/realworld-summary.json` | `pageResults` array | 20-page DOM element breakdown |
| **FIG 8** | **Security Attack Block Rates**| `reports/evaluation/property-based-security-results.json` | `categoryResults` | 100% attack rejection across 1,000 cases |
| **FIG 9** | **Security Ablation** | `reports/evaluation/security-accessibility-pareto.json` | `configurations` | Unsafe mutation risk without boundaries |
| **FIG 10**| **Compromised AI Containment**| `reports/evaluation/compromised-provider-results.json` | `blockedCount` | 14 malicious provider outputs contained |
| **FIG 11**| **Fuzzing Case Distribution** | `reports/evaluation/security-fuzz-results.json` | `casesFuzzed` | 5,000 fuzz cases contained under seed |
| **FIG 12**| **Dynamic DOM Security** | `reports/evaluation/dynamic-security-results.json` | `totalBlocked` | 100 TOCTOU races intercepted |
| **FIG 13**| **Pareto Frontier** | `reports/evaluation/security-accessibility-pareto.json` | `configurations` | 90% coverage at 0% unsafe mutation |
| **FIG 14**| **Error Taxonomy** | `docs/portal-transformer-final-error-taxonomy.md` | Error counts | Distribution across 12 error classes |
