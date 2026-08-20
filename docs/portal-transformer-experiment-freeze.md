# Strict Experiment Freeze Specification (`docs/portal-transformer-experiment-freeze.md`)

> **Authoritative Freeze Document**: Locks all system configurations, benchmark datasets, evaluation commands, random seeds, allowed attributes, and environmental variables.

---

## 1. System Invariants & Environment Configurations

- **Monorepo Version**: TrustPortal / Portal Transformer V7.0.0 (Frozen)
- **Node.js Environment**: Node v20+ / macOS / Linux Headless Execution
- **TypeScript Compiler**: TypeScript v5.3.3 (`strict: true`)
- **Random Seed**: Deterministic PRNG Seed (`0x41434345`)
- **Allowed Patch Attributes**: `alt`, `aria-label`, `aria-labelledby`, `aria-describedby`, `role` ONLY
- **Forbidden Properties**: `href`, `src`, `action`, `formaction`, `style`, `onclick`, `onload`, `onerror`, `innerHTML`, `outerhtml`, `script`, `foreignObject`
- **Abstention Policy**: Returns `AMBIGUOUS_ABSTAIN` on conflicting ARIA definitions, external sprite symbols, or missing local definitions
- **AI Provider**: Local Deterministic Mock Provider Infrastructure (Zero external RTT)

---

## 2. Benchmark Dataset & Artifact Register

| Dataset Identifier | Target Artifact Path | Sample Count ($N$) | Evaluation Command |
| :--- | :--- | :---: | :--- |
| **Benchmark v2** | `reports/evaluation/benchmark-v2-results.json` | 500 | `npm run evaluate:portal-transformer` |
| **Benchmark v3** | `reports/evaluation/benchmark-v3-results.json` | 500 | `npm run evaluate:portal-transformer` |
| **Benchmark v4** | `reports/evaluation/benchmark-v4-after-fix.json` | 930 | `npm run evaluate:portal-transformer` |
| **Holdout SVG V3** | `reports/evaluation/svg-benchmark-v3-results.json` | 600 | `npm run evaluate:portal-transformer` |
| **Real-World `.gov.in`** | `reports/realworld/realworld-summary.json` | 1,700 DOM / 100 Review | `npm run evaluate:portal-transformer-realworld` |
| **Screen-Reader State** | `reports/screen-reader/accessibility-state-before-after.json` | 425 | `npm run evaluate:portal-transformer-screen-reader` |
| **Security Property Suite** | `reports/evaluation/property-based-security-results.json` | 1,000 | `npm run evaluate:portal-transformer-security` |
| **Security Holdout Suite** | `reports/evaluation/security-holdout-results.json` | 500 | `npm run evaluate:portal-transformer-security-holdout` |
| **Security Fuzz Suite** | `reports/evaluation/security-fuzz-results.json` | 5,000 | `npm run evaluate:portal-transformer-fuzz` |
| **Dynamic Security Suite** | `reports/evaluation/dynamic-security-results.json` | 100 | `npm run evaluate:portal-transformer-dynamic-security` |
