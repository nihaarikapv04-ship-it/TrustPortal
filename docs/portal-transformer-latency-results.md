# Experiment 3: End-to-End Remediation Latency Results (`docs/portal-transformer-latency-results.md`)

> **Source Data**: Generated empirically via `npm run evaluate:portal-transformer` -> [`reports/evaluation/latency-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/latency-results.json)  
> **Measurement Method**: High-resolution `performance.now()` across $N = 100$ measured runs following $10$ warm-up runs.  
> **Provider Classification**: `LOCAL / MOCK PROVIDER LATENCY`

---

## 1. Latency Breakdown by Pipeline Stage

| Pipeline Processing Stage | Mean Latency (ms) | Median Latency (ms) | Std Dev ($\sigma$) (ms) | 95th Percentile ($P_{95}$) (ms) |
| :--- | :---: | :---: | :---: | :---: |
| **1. DOM Detection ($t_{\text{detect}}$)** | 0.002 | 0.001 | 0.011 | 0.002 |
| **2. SafeContext Extraction ($t_{\text{extract}}$)** | 0.015 | 0.003 | 0.084 | 0.017 |
| **3. API Provider Relay ($t_{\text{API}}$)** | 0.000 | 0.000 | 0.000 | 0.000 |
| **4. Output Validation ($t_{\text{validate}}$)** | 0.002 | 0.000 | 0.008 | 0.002 |
| **5. Risk Gate Evaluation ($t_{\text{score}}$)** | 0.004 | 0.002 | 0.017 | 0.010 |
| **6. Patch Application ($t_{\text{patch}}$)** | 0.000 | 0.000 | 0.000 | 0.000 |
| **TOTAL REMEDIATION LATENCY** | **0.023 ms** | **0.006 ms** | **0.110 ms** | **0.030 ms** |

---

## 2. Key Findings
1. **Interactive Performance**: Mean total client-side remediation latency ($0.023\text{ ms}$) is well within interactive browser performance bounds ($\le 100.0\text{ ms}$).
2. **Provider Distinction**: Local mock provider execution exhibits sub-millisecond overhead. Live cloud API provider calls (e.g. Gemini 1.5 Flash Vision / Text API) will introduce additional network round-trip latency.
