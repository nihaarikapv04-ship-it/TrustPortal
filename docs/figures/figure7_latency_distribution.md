# Figure 7: Latency Micro-benchmark Breakdown (`docs/figures/figure7_latency_distribution.md`)

> Generated directly from [`reports/evaluation/latency-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/latency-results.json) ($N = 100$ Measured Runs).

```text
 Stage                             Mean Latency (ms)
 ───────────────────────────────────────────────────
 1. DOM Detection (t_detect)      │ 0.002 ms
 2. SafeContext Extr (t_extract)  │ 0.015 ms
 3. API Relay (t_API)             │ 0.000 ms (Mock)
 4. Output Validation (t_val)     │ 0.002 ms
 5. Risk Gate (t_score)           │ 0.004 ms
 6. Patch Apply (t_patch)         │ 0.000 ms
 ───────────────────────────────────────────────────
 TOTAL REMEDIATION LATENCY        │ 0.023 ms (Mean) / 0.030 ms (P95)
```
