# Real-World Public Portal Evaluation Results (`docs/portal-transformer-realworld-results.md`)

> **Source Evidence**: Extracted empirically from [`reports/realworld/realworld-summary.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/realworld/realworld-summary.json)  
> **Evaluation Scope**: 20 Indian Public-Service Web Portal Baselines (`.gov.in`), $N_{\text{DOM}} = 1,700$ Analyzed DOM Elements, $N_{\text{reviewed}} = 100$ Manually Reviewed Elements  
> **Infrastructure Note**: **LOCAL DETERMINISTIC MOCK PROVIDER INFRASTRUCTURE**. Live cloud API network dispatches are **NOT YET EVALUATED**.

---

## 1. Executive Summary & Evaluation Objective
This document presents the empirical evaluation of the **FROZEN** Portal Transformer V7 prototype against representative Indian public-service web portal structures (`.gov.in`).

> **Statistical Disclaimer**: *These results characterize the evaluated pages and reviewed samples ($N=100$) and should not be interpreted as statistically representative of all .gov.in websites.*

---

## 2. Master Evaluation Metrics Summary

| Evaluation Dimension | Empirical Finding | Unit / Metric | Scientific Classification / Context |
| :--- | :---: | :---: | :--- |
| **Pages Evaluated** | **20** | Webpages | Representative `.gov.in` public services |
| **DOM Elements Analyzed** | **1,700** | Elements | Automated baseline extraction |
| **Manually Reviewed Sample ($N$)** | **100** | Elements | Expert human ground-truth protocol |
| **Confirmed True Positives (TP)** | **35** | Elements | Genuine accessibility defects flagged |
| **Confirmed True Negatives (TN)** | **45** | Elements | Valid controls correctly ignored |
| **Confirmed False Positives (FP)** | **0** | Elements | **0.0% False Positive Rate ($\text{FPR} = 0.0\%$)** |
| **Confirmed False Negatives (FN)** | **10** | Elements | **22.22% False Negative Rate ($\text{FNR} = 0.2222$)** |
| **Ambiguous / Deferred** | **10** | Elements | **10.0% Abstention Rate** deferred to human review |
| **Precision** | **1.0000** (100.0%) | Ratio | High-precision candidate selection |
| **Recall** | **0.7778** (77.78%) | Ratio | $35 / (35 + 10)$ defect coverage |
| **$F_1$ Score** | **0.8750** (87.50%) | Ratio | Balanced accessibility performance |
| **Coverage** | **0.9000** (90.0%) | Ratio | $90 / 100$ elements evaluated without abstention |
| **Security Attack Success Rate** | **0.0%** ($0 / 25$) | Percentage | 100% attack rejection across 25 categories |
| **Unsafe Mutation Rate** | **0.0%** ($0 / 25$) | Percentage | Zero forbidden attribute mutations |
| **Credential Leakage Count** | **0** | Count | Zero password/OTP/PIN exposure |
| **Extension Network Requests** | **0** | Requests | **Zero extension-origin network dispatches** |

---

## 3. Real-World Pipeline Latency Breakdown ($N = 20$ Pages)

| Pipeline Stage | Mean (ms) | Median (ms) | Std Dev ($\sigma$) (ms) | 95th Percentile ($P_{95}$) (ms) | Minimum (ms) | Maximum (ms) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **DOM Scan Latency** ($t_{\text{scan}}$) | 0.0017 | 0.0012 | 0.0016 | 0.0041 | 0.0007 | 0.0071 |
| **Detection Latency** ($t_{\text{detect}}$) | 0.0028 | 0.0018 | 0.0035 | 0.0076 | 0.0012 | 0.0176 |
| **Privacy Firewall** ($t_{\text{fw}}$) | 0.0042 | 0.0021 | 0.0210 | 0.0058 | 0.0012 | 0.1250 |
| **Output Validator** ($t_{\text{val}}$) | 0.0006 | 0.0004 | 0.0009 | 0.0012 | 0.0002 | 0.0056 |
| **TSIF Risk Gate** ($t_{\text{score}}$) | 0.0028 | 0.0019 | 0.0062 | 0.0045 | 0.0010 | 0.0380 |
| **TOCTOU & Patch** ($t_{\text{patch}}$) | 0.0002 | 0.0001 | 0.0003 | 0.0004 | 0.0001 | 0.0021 |
| **TOTAL REMEDIATION LATENCY** | **0.0123** | **0.0075** | **0.0330** | **0.0236** | **0.0045** | **0.1953** |

---

## 4. Explicit Network Isolation Separation

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   NETWORK ISOLATION SEPARATION MATRIX                  │
├────────────────────────────────────────────────────────────────────────┤
│  PAGE-ORIGIN NETWORK ACTIVITY: Standard web portal assets (HTML/CSS)   │
│  PORTAL TRANSFORMER-ORIGIN NETWORK ACTIVITY: ZERO (0 HTTP Dispatches)  │
│  EXTENSION-ORIGIN UNEXPECTED REQUESTS: ZERO (0 Extension Requests)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Accessibility-Tree Semantic State Comparison (Before vs After)

| Target Element Archetype | Baseline Semantic State (Before) | Remediated Semantic State (After) | Status |
| :--- | :--- | :--- | :--- |
| **Icon Button** | `<button class="search-btn"></button>` | `<button aria-label="Search Portal" class="search-btn"></button>` | Accessibility-tree semantic state changed |
| **Portal Image** | `<img src="/emblem.png">` | `<img src="/emblem.png" alt="National Portal Emblem">` | Accessibility-tree semantic state changed |
| **Form Input** | `<input placeholder="Enter ID">` | `<input aria-label="Enter ID" placeholder="Enter ID">` | Accessibility-tree semantic state changed |
| **Standalone SVG Graphic** | `<svg role="img"></svg>` | `<svg role="img" aria-label="Citizen Analytics Chart"></svg>` | Accessibility-tree semantic state changed |
| **SVG inside Labelled Link** | `<a aria-label="Home"><svg></svg></a>` | `<a aria-label="Home"><svg></svg></a>` (Unchanged) | Ignored by Parent Context Resolver |
