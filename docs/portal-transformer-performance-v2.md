# Client-Side Micro-Benchmark Latency Report v2 (`docs/portal-transformer-performance-v2.md`)

> **Source Evidence**: Extracted empirically from [`reports/evaluation/latency-v2-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/latency-v2-results.json)  
> **Benchmark Parameters**: $N = 1000$ Measured Runs, $10$ Warm-up Runs  
> **Infrastructure Note**: **LOCAL DETERMINISTIC MOCK PROVIDER INFRASTRUCTURE**. Live cloud network latency is **NOT YET EVALUATED**.

---

## 1. Pipeline Micro-Benchmark Latency Breakdown (8 Stages)

| Remediation Pipeline Stage | Mean (ms) | Median (ms) | Std Dev ($\sigma$) (ms) | 95th Percentile ($P_{95}$) (ms) | 99th Percentile ($P_{99}$) (ms) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **1. DOM Detection** ($t_{\text{detect}}$) | 0.001 | 0.000 | 0.001 | 0.001 | 0.003 |
| **2. Privacy Filtering** ($t_{\text{fw}}$) | 0.004 | 0.002 | 0.029 | 0.005 | 0.015 |
| **3. Context Extraction** ($t_{\text{extract}}$) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| **4. AI / Provider Stage** ($t_{\text{AI}}$)* | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| **5. Output Validation** ($t_{\text{val}}$) | 0.000 | 0.000 | 0.003 | 0.000 | 0.001 |
| **6. Risk Evaluation** ($t_{\text{score}}$) | 0.002 | 0.001 | 0.006 | 0.003 | 0.011 |
| **7. TOCTOU Verification** ($t_{\text{toctou}}$) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| **8. Patch Application** ($t_{\text{patch}}$) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| **TOTAL REMEDIATION LATENCY** | **0.006** | **0.004** | **0.038** | **0.011** | **0.030** |

*\*Note: AI Provider Stage latency reflects local mock execution (0.0 ms). External cloud provider network RTT remains unevaluated.*

---

## 2. Explicit Provider Latency Separation

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        LATENCY BOUNDARY STATEMENT                      │
├────────────────────────────────────────────────────────────────────────┤
│  LOCAL DETERMINISTIC LATENCY: Mean 0.006 ms (P95: 0.011 ms)           │
│  EXTERNAL CLOUD PROVIDER LATENCY: NOT YET EVALUATED                    │
│                                                                        │
│  Live cloud network dispatches (e.g. Gemini Vision API RTT) will       │
│  introduce network overhead (typically 200–800 ms) and are explicitly  │
│  classified as UNEVALUATED in this local research prototype.          │
└────────────────────────────────────────────────────────────────────────┘
```
