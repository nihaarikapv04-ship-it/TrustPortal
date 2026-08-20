# Portal Transformer Final Results Tables (`docs/portal-transformer-final-results-tables.md`)

> **Authoritative Thesis Tables**: Comprehensive collection of Tables 1 through 10 summarizing all empirical evaluation benchmark results, security suites, real-world portal metrics, latency breakdowns, and unevaluated scope items.

---

## TABLE 1 — Synthetic Benchmark Progression

| Benchmark Version | $N$ | TP | TN | FP | FN | Precision | Recall | $F_1$ | FPR | FNR |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Benchmark v1** | 245 | 100 | 145 | 0 | 0 | 100.0% | 100.0% | 1.0000 | 0.0% | 0.0% |
| **Benchmark v2** | 500 | 150 | 250 | 0 | 100 | 100.0% | 60.0% | 0.7500 | 0.0% | 40.0% |
| **Benchmark v3** | 500 | 250 | 250 | 0 | 0 | 100.0% | 100.0% | 1.0000 | 0.0% | 0.0% |
| **Benchmark v4 (Initial)**| 930 | 340 | 540 | 50 | 0 | 87.18% | 100.0% | 0.9315 | 8.47% | 0.0% |
| **Benchmark v4 (After Fix)**| 930 | 340 | 540 | 0 | 0 | 100.0% | 100.0% | 1.0000 | 0.0% | 0.0% |

---

## TABLE 2 — Holdout SVG Benchmark Progression

| SVG Suite | $N$ | TP | TN | FP | FN | Abstained | Precision | Recall | $F_1$ | Coverage |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Targeted SVG (Fix)** | 100 | 50 | 50 | 0 | 0 | 0 | 100.0% | 100.0% | 1.0000 | 100.0% |
| **Unseen SVG V2** | 500 | 250 | 200 | 50 | 0 | 0 | 83.33% | 100.0% | 0.9091 | 100.0% |
| **Holdout SVG V3** | 600 | 175 | 225 | 0 | 150 | 200 | 100.0% | 53.85% | 0.7000 | 66.67% |

---

## TABLE 3 — Real-World `.gov.in` Evaluation

| Evaluation Scope | Measured Quantity | Unit / Description | Primary Metric |
| :--- | :---: | :--- | :--- |
| **Pages Evaluated ($N_{\text{pages}}$)** | **20** | Webpages | Representative `.gov.in` public-service portals |
| **Total DOM Elements ($N_{\text{DOM}}$)** | **1,700** | Elements | Automated baseline extraction |
| **Reviewed Sample ($N_{\text{reviewed}}$)** | **100** | Elements | Expert human ground-truth protocol sample |
| **Confirmed Defects (TP)** | **35** | Elements | Genuine accessibility defects flagged |
| **Valid Controls (TN)** | **45** | Elements | Correctly accessible controls ignored |
| **False Positives (FP)** | **0** | Elements | **0.0% False Positive Rate ($\text{FPR} = 0.0\%$)** |
| **Missed Defects (FN)** | **10** | Elements | **22.22% False Negative Rate ($\text{FNR} = 22.22\%$)** |
| **Ambiguous / Deferred** | **10** | Elements | **10.0% Abstention Rate** deferred to human review |

---

## TABLE 4 — Screen-Reader-Relevant Accessibility State

| Element Type | Before Named | After Named | Remediated | Abstained | Rejected | Degraded |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **button** | 50 | 75 | 25 | 0 | 0 | 0 |
| **link** | 50 | 100 | 50 | 0 | 0 | 0 |
| **input** | 50 | 50 | 25 | 0 | 0 | 0 |
| **image** | 50 | 75 | 50 | 0 | 0 | 0 |
| **SVG** | 25 | 50 | 25 | 0 | 0 | 0 |
| **TOTAL** | **225** | **350** | **175** | **0** | **0** | **0** |

---

## TABLE 5 — Security Evaluation ($N = 100$ Test Payloads)

| Security Category | Payloads | Blocked | Unsafe Mutations | Extension Requests | Attack Success Rate |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **XSS Model Output** | 20 | 20 | 0 | 0 | **0.0%** |
| **Prompt Injection** | 15 | 15 | 0 | 0 | **0.0%** |
| **Disallowed Attribute Mutation** | 25 | 25 | 0 | 0 | **0.0%** |
| **Dangerous URI Injection** | 20 | 20 | 0 | 0 | **0.0%** |
| **SVG & DOM Clobbering** | 20 | 20 | 0 | 0 | **0.0%** |
| **TOTAL** | **100** | **100** | **0** | **0** | **0.0%** |

---

## TABLE 6 — Security Ablation Matrix

| Configuration | Precision | Recall | Coverage | Abstention Rate | Unsafe Mutation Rate | Security Invariant |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Full System (Baseline)** | **1.0000** | **0.7778** | **0.9000** | **0.1000** | **0.0%** | **Zero Unsafe Mutations** |
| **No Abstention** | 0.8333 | 0.8889 | 1.0000 | 0.0000 | 10.0% | Forced Repair on Ambiguous SVG |
| **No Output Validator** | 1.0000 | 0.7778 | 0.9000 | 0.1000 | 20.0% | Script Injection Allowed (XSS) |
| **No Patch Allowlist** | 1.0000 | 0.7778 | 0.9000 | 0.1000 | 15.0% | Navigation / `href` Mutated |

---

## TABLE 7 — Client-Side Remediation Latency Breakdown

| Pipeline Stage | Mean (ms) | Median (ms) | Std Dev ($\sigma$) (ms) | 95th Percentile ($P_{95}$) (ms) | Minimum (ms) | Maximum (ms) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **DOM Scan Latency** | 0.0017 | 0.0012 | 0.0016 | 0.0041 | 0.0007 | 0.0071 |
| **Detection Latency** | 0.0028 | 0.0018 | 0.0035 | 0.0076 | 0.0012 | 0.0176 |
| **Privacy Firewall** | 0.0042 | 0.0021 | 0.0210 | 0.0058 | 0.0012 | 0.1250 |
| **Output Validator** | 0.0006 | 0.0004 | 0.0009 | 0.0012 | 0.0002 | 0.0056 |
| **TSIF Risk Gate** | 0.0028 | 0.0019 | 0.0062 | 0.0045 | 0.0010 | 0.0380 |
| **TOCTOU & Patch** | 0.0002 | 0.0001 | 0.0003 | 0.0004 | 0.0001 | 0.0021 |
| **TOTAL REMEDIATION LATENCY** | **0.0123** | **0.0075** | **0.0330** | **0.0236** | **0.0045** | **0.1953** |

*\*Infrastructure Note: Evaluated using local deterministic mock provider infrastructure.*

---

## TABLE 8 — Privacy & Network Isolation Verification

| Privacy & Isolation Dimension | Operational Guarantee | Measured Value | Status |
| :--- | :--- | :---: | :---: |
| **Credential & PII Redaction** | Zero transmission of passwords, PINs, OTPs, Aadhaar | **0 Leaks** | `✓ PASSED` |
| **Extension Network Requests** | Zero remote HTTP/HTTPS requests originating from extension | **0 Requests** | `✓ PASSED` |
| **Local LocalStorage Integrity** | Zero local storage mutation of target portal state | **0 Mutations** | `✓ PASSED` |

---

## TABLE 9 — Dynamic DOM MutationObserver Performance

| Dynamic DOM Scenario | Test Iterations | Mutation Loop Fires | Element Remediated | Status |
| :--- | :---: | :---: | :---: | :---: |
| **SPA Route Client Navigation** | 50 | 0 Loops | Yes | `✓ PASSED` |
| **Modal Dialog Insertion** | 50 | 0 Loops | Yes | `✓ PASSED` |
| **Lazy-Loaded SVG Component** | 50 | 0 Loops | Yes | `✓ PASSED` |

---

## TABLE 10 — Mandatory Scope Items NOT Evaluated

| Research Dimension / Experiment | Execution Status | Reason / Environmental Limitation |
| :--- | :---: | :--- |
| **NVDA Spoken Audio Testing** | `NOT EVALUATED` | Headless Linux/macOS terminal execution without audio dispatcher |
| **TalkBack Android Audio Testing** | `NOT EVALUATED` | Headless terminal execution without physical Android hardware |
| **Human-Subject Usability Trial** | `NOT EVALUATED` | No IRB-approved human participant study was conducted |
| **Live Cloud Provider RTT Latency** | `NOT EVALUATED` | All micro-benchmarks evaluated via local mock provider ($0.0\text{ ms}$) |
| **Large-Scale Representative .gov.in Study** | `NOT EVALUATED` | Evaluation restricted to curated sample of 20 `.gov.in` baselines |
