# Final Thesis Claim Matrix V2 (`docs/portal-transformer-final-claim-matrix-v2.md`)

> **Authoritative Thesis Claim Traceability Matrix**: Maps every quantitative thesis claim to evidence, numerators, denominators, datasets, primary metrics, statuses, and limitations.

---

## 1. Thesis Claim Verification Table

| Claim Description | Evidence Artifact | Numerator | Denominator | Dataset | Metric | Status | Limitation |
| :--- | :--- | :---: | :---: | :--- | :--- | :---: | :--- |
| **Deterministic Detection** | [`reports/evaluation/benchmark-v4-after-fix.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/benchmark-v4-after-fix.json) | 340 | 340 | Benchmark v4 ($N=930$) | Precision: 100.0%<br>Recall: 100.0% | `EMPIRICALLY VERIFIED` | Synthetic DOM fixtures |
| **SVG Context Resolution** | [`reports/evaluation/svg-benchmark-v3-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-benchmark-v3-results.json) | 175 | 175 | Holdout SVG V3 ($N=600$) | Precision: 100.0%<br>FPR: 0.0% | `EMPIRICALLY VERIFIED` | $33.33\%$ Abstention Rate on unresolved symbols |
| **Confidence Abstention** | [`reports/evaluation/svg-benchmark-v3-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-benchmark-v3-results.json) | 200 | 600 | Holdout SVG V3 ($N=600$) | Abstention: $33.33\%$<br>Coverage: $66.67\%$ | `EMPIRICALLY VERIFIED` | Defers ambiguous edge cases |
| **Cybersecurity Containment** | [`reports/evaluation/svg-v3-security-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-v3-security-results.json) | 100 | 100 | 100 Security Payloads | Attack Success Rate: 0.0% | `EMPIRICALLY VERIFIED` | Tested against local attack corpus |
| **Privacy Isolation** | [`reports/realworld/realworld-summary.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/realworld/realworld-summary.json) | 0 | 20 | 20 Real-World Pages | Credential Leakage: 0 | `EMPIRICALLY VERIFIED` | Excludes authenticated user sessions |
| **Real-World `.gov.in`** | [`reports/realworld/realworld-summary.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/realworld/realworld-summary.json) | 35 | 35 | 20 `.gov.in` Portals ($N=1,700$) | Sample Precision: 100.0% ($N=100$) | `PARTIALLY VERIFIED` | Evaluated on curated 20-page sample |
| **Remediation Latency** | [`reports/evaluation/latency-v2-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/latency-v2-results.json) | 6 | 1000 | $N=1000$ Micro-benchmarks | Mean Local Latency: 0.006 ms | `PARTIALLY VERIFIED` | Local mock provider only; cloud RTT unevaluated |
| **Screen-Reader State** | [`reports/screen-reader/accessibility-state-before-after.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/screen-reader/accessibility-state-before-after.json) | 175 | 200 | 5 Subset Portals ($N=425$) | ANRR: 87.50%<br>SPR: 100.0% | `PARTIALLY VERIFIED` | DOM accessibility-tree semantic state |
| **NVDA Spoken Audio** | [`docs/portal-transformer-nvda-test-protocol.md`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/docs/portal-transformer-nvda-test-protocol.md) | N/A | N/A | N/A | Spoken Audio Quality | `NOT EVALUATED` | Headless terminal execution limitation |
| **TalkBack Spoken Audio**| [`docs/portal-transformer-talkback-test-protocol.md`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/docs/portal-transformer-talkback-test-protocol.md) | N/A | N/A | N/A | Mobile Spoken Quality | `NOT EVALUATED` | Headless terminal execution limitation |
| **Human-Subject Usability**| [`docs/portal-transformer-human-usability-protocol.md`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/docs/portal-transformer-human-usability-protocol.md) | N/A | N/A | N/A | Task Completion Rate | `NOT EVALUATED` | Human study not conducted |
