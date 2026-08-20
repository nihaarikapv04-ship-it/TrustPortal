# Reproduction & Experiment Execution Guide (`docs/portal-transformer-reproduction-guide.md`)

> **Reproducibility Standard**: Provides a step-by-step guide for independent researchers to build, test, and re-run all empirical evaluations and data integrity audits.

---

## 1. Environment & Prerequisites
- Node.js v20.x or higher
- npm v10.x or higher
- Operating System: macOS / Linux (Headless CLI execution)

---

## 2. Reproduction Sequence Commands

```bash
# 1. Monorepo Setup & Test Suite Execution (245 Tests)
npm test

# 2. Build All Monorepo Workspaces
npm run build

# 3. Execute Synthetic & SVG Benchmarks (Benchmark v4 & Holdout SVG V3)
npm run evaluate:portal-transformer

# 4. Execute Real-World .gov.in Evaluation (20 Portals, 1,700 DOM Elements)
npm run evaluate:portal-transformer-realworld

# 5. Execute Screen-Reader Semantic State Evaluation (425 Elements)
npm run evaluate:portal-transformer-screen-reader

# 6. Execute 1,000-Instance Property Cybersecurity Benchmark
npm run evaluate:portal-transformer-security

# 7. Execute 500-Instance Independent Security Holdout Benchmark
npm run evaluate:portal-transformer-security-holdout

# 8. Execute 5,000-Case Deterministic Property Fuzzing (Seed 0x41434345)
npm run evaluate:portal-transformer-fuzz

# 9. Execute Dynamic DOM Security Evaluation (100 Dynamic Scenarios)
npm run evaluate:portal-transformer-dynamic-security

# 10. Execute Data Integrity & Accounting Audit
npm run audit:portal-transformer

# 11. Execute Security Regression Gate Check
npm run audit:portal-transformer-security

# 12. Execute 3-Run Independent Reproducibility Audit
npm run audit:portal-transformer-reproducibility
```
