# Cybersecurity Final Evidence Traceability Matrix (`docs/portal-transformer-security-evidence-matrix.md`)

> **Traceability Standard**: Maps every cybersecurity threat category to empirical test counts, block rates, security properties, evidence artifacts, and status classifications.

---

## 1. Security Evidence Matrix Table

| Threat Category | Test Count | Blocked | Succeeded | Unsafe Mutation | Credential Leakage | Network Requests | Security Property | Evidence Artifact | Status | Residual Risk |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- | :---: | :--- |
| **XSS Model Output** | 100 | 100 | 0 | 0 | 0 | 0 | `P3_NO_SCRIPT_EXECUTION` | `reports/evaluation/property-based-security-results.json` | `EMPIRICALLY VERIFIED` | Novel encoding bypasses |
| **Prompt Injection** | 100 | 100 | 0 | 0 | 0 | 0 | `P6_OUTPUT_SCHEMA_INTEGRITY` | `reports/evaluation/prompt-injection-results.json` | `EMPIRICALLY VERIFIED` | Evaluated against prompt corpus |
| **Forbidden Navigation**| 100 | 100 | 0 | 0 | 0 | 0 | `P2_NO_NAVIGATION_MUTATION` | `reports/evaluation/property-based-security-results.json` | `EMPIRICALLY VERIFIED` | None (attribute allowlist) |
| **Dangerous URIs** | 100 | 100 | 0 | 0 | 0 | 0 | `P3_NO_SCRIPT_EXECUTION` | `reports/evaluation/property-based-security-results.json` | `EMPIRICALLY VERIFIED` | None (URI scheme block) |
| **SVG & foreignObject** | 100 | 100 | 0 | 0 | 0 | 0 | `P3_NO_SCRIPT_EXECUTION` | `reports/evaluation/property-based-security-results.json` | `EMPIRICALLY VERIFIED` | Remote SVG sprite sheets |
| **Credential / PII Leak** | 100 | 100 | 0 | 0 | 0 | 0 | `P1_NO_SECRET_LEAKAGE` | `reports/evaluation/property-based-security-results.json` | `EMPIRICALLY VERIFIED` | Un-regexed field types |
| **DOM Clobbering** | 100 | 100 | 0 | 0 | 0 | 0 | `P7_ORIGIN_ISOLATION` | `reports/evaluation/property-based-security-results.json` | `EMPIRICALLY VERIFIED` | Chrome DOM prototype bugs |
| **TOCTOU / Stale Target**| 100 | 100 | 0 | 0 | 0 | 0 | `P5_STALE_TARGET_REJECTION` | `reports/evaluation/property-based-security-results.json` | `EMPIRICALLY VERIFIED` | Rapid microtask DOM rewrites |
| **postMessage Spoofing** | 100 | 100 | 0 | 0 | 0 | 0 | `P7_ORIGIN_ISOLATION` | `reports/evaluation/property-based-security-results.json` | `EMPIRICALLY VERIFIED` | Chrome Extension host permissions |
| **Malformed AI Output** | 100 | 100 | 0 | 0 | 0 | 0 | `P6_OUTPUT_SCHEMA_INTEGRITY` | `reports/evaluation/property-based-security-results.json` | `EMPIRICALLY VERIFIED` | None (Zod schema validation) |
| **TOTAL** | **1,000** | **1,000** | **0** | **0** | **0** | **0** | **P1 - P10** | **All Property Benchmark Logs** | `EMPIRICALLY VERIFIED` | Zero unsafe mutations |
