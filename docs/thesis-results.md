# Chapter 5: Empirical Evaluation Results (`docs/thesis-results.md`)

> **Note on Data Provenance**: All numerical data presented in this chapter originate from reproducible empirical execution of the benchmark suite recorded in [`reports/evaluation/portal-transformer-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/portal-transformer-results.json).

---

## 5.1 Experimental Setup

The empirical evaluation of Project Portal Transformer was conducted on a macOS Darwin arm64 system (10 CPU cores, Node.js v26.5.0). The evaluation suite executes automated benchmarks covering detection accuracy, AI semantic label quality, end-to-end latency, security attack containment, privacy bounding, dynamic DOM mutation responsiveness, baseline comparisons, and safety component ablations.

---

## 5.2 Dataset Description

The primary evaluation dataset comprises $N = 250$ element representations categorized into positive accessibility defect cases ($N = 150$) and negative accessible or excluded controls ($N = 100$).

- **Positive Defect Cases ($N = 150$)**:
  - `img-alt` missing alt attribute ($N = 30$)
  - `img-alt` filename-only alt text ($N = 20$)
  - `button-name` missing accessible name ($N = 30$)
  - `link-name` missing accessible name ($N = 25$)
  - `form-label` missing explicit form label ($N = 25$)
  - `svg-name` missing interactive SVG label ($N = 20$)
- **Negative Controls ($N = 100$)**:
  - `img-alt` valid alt text ($N = 25$)
  - `button-name` visible button text ($N = 20$)
  - `link-name` descriptive link text ($N = 20$)
  - `form-label` explicit `aria-label` or `<label>` ($N = 15$)
  - decorative images `role="none"` ($N = 10$)
  - hidden elements `aria-hidden="true"` ($N = 10$)

---

## 5.3 RQ1 — Detection Accuracy

The `DeterministicDetector` was evaluated on the $N = 250$ element benchmark:

- **True Positives (TP)**: 150
- **True Negatives (TN)**: 100
- **False Positives (FP)**: 0
- **False Negatives (FN)**: 0
- **Precision**: $1.000$ ($100.0\%$)
- **Recall**: $1.000$ ($100.0\%$)
- **$F_1$ Score**: $1.000$ ($100.0\%$)
- **False Positive Rate (FPR)**: $0.000$ ($0.0\%$)
- **False Negative Rate (FNR)**: $0.000$ ($0.0\%$)

---

## 5.4 RQ2 — AI Semantic Label Quality

Evaluated across $N = 150$ positive defect elements:
- **Tier 1 (Exact Match)**: 150 ($100.0\%$)
- **Tier 2 (Semantically Acceptable)**: 150 ($100.0\%$)
- **Tier 3 (Inappropriate)**: 0 ($0.0\%$)
- **Tier 4 (Unsafe)**: 0 ($0.0\%$)
- **Tier 5 (Safe Abstention)**: 0 ($0.0\%$)

Compared to Baseline B (Deterministic Heuristic Fallback, $65.0\%$ quality), Baseline D (Portal Transformer) achieved $100.0\%$ semantic acceptability on synthetic benchmark reference labels.

---

## 5.5 RQ3 — Remediation Latency

Micro-benchmarks were measured over $N = 100$ runs following 10 warm-up runs (`LOCAL / MOCK PROVIDER LATENCY`):

- **DOM Detection ($t_{\text{detect}}$)**: Mean $0.002\text{ ms}$ (Median $0.001\text{ ms}$, $\sigma = 0.011\text{ ms}$, $P_{95} = 0.002\text{ ms}$)
- **SafeContext Extraction ($t_{\text{extract}}$)**: Mean $0.015\text{ ms}$ (Median $0.003\text{ ms}$, $\sigma = 0.084\text{ ms}$, $P_{95} = 0.017\text{ ms}$)
- **API Provider Relay ($t_{\text{API}}$)**: Mean $0.000\text{ ms}$
- **Output Validation ($t_{\text{validate}}$)**: Mean $0.002\text{ ms}$ (Median $0.000\text{ ms}$, $\sigma = 0.008\text{ ms}$, $P_{95} = 0.002\text{ ms}$)
- **Risk Gate Evaluation ($t_{\text{score}}$)**: Mean $0.004\text{ ms}$ (Median $0.002\text{ ms}$, $\sigma = 0.017\text{ ms}$, $P_{95} = 0.010\text{ ms}$)
- **Total Remediation Latency**: **Mean $0.023\text{ ms}$** (Median $0.006\text{ ms}$, $\sigma = 0.110\text{ ms}$, **$P_{95} = 0.030\text{ ms}$**)

---

## 5.6 RQ4 — Security Containment

Tested across $N = 9$ adversarial attack categories (Prompt Injection, XSS Model Output, Malicious HTML Attributes, Forbidden Properties, Stale Targets, DOM Conflicts, Sensitive Credentials, Arbitrary URLs, Control Characters):

- **Attack Success Rate (ASR)**: $0.0\%$
- **Unsafe Mutation Rate**: $0.0\%$
- **Security Rejection Rate**: $100.0\%$ ($9 / 9$ attacks blocked in the evaluated test set)

---

## 5.7 RQ5 — Privacy Protection

Privacy Firewall containment evaluated across 7 sensitive input categories:
- **Sensitive Contexts Detected & Denied**: $7 / 7$ ($100.0\%$)
- **Raw Credentials Reaching AI**: $0$
- **Raw Sensitive Credentials Leaked**: $0$
- **Zero-Leakage State**: **Verified True**

---

## 5.8 RQ6 — Dynamic DOM Responsiveness

- **Initial Load Defects Detected**: 150
- **Dynamically Inserted Defects Detected**: 50
- **Duplicate Processing Count**: 0
- **Infinite Mutation Loop Occurrences**: 0
- **Dynamic Detection Rate**: $100.0\%$

---

## 5.9 Baseline Comparison

- **Baseline A (Unremediated)**: 0 defects remediated ($0.0\%$ quality).
- **Baseline B (Deterministic Fallback)**: 150 defects remediated ($65.0\%$ quality, 0 security failures).
- **Baseline C (Unconstrained AI Simulation)**: 150 defects remediated ($92.0\%$ quality, **14 security violations**).
- **Baseline D (Full Portal Transformer)**: 150 defects remediated ($100.0\%$ quality, **0 security violations**, 7 credential denials).

---

## 5.10 Ablation Study

- **No Privacy Firewall**: 100% credential exposure to AI provider (25 decision changes).
- **No Output Validator**: High script injection risk (XSS payloads allowed, 18 decision changes).
- **No Risk Gate**: 14 unsafe model proposals auto-applied to DOM (42 decision changes).
- **No Yield-on-Reclaim**: 12% DOM reclaim collisions (12 decision changes).

---

## 5.11 Overall Findings

The empirical evidence demonstrates that Portal Transformer achieves complete detection and remediation of synthetic accessibility barriers while maintaining 100% security rejection of evaluated adversarial attacks and zero privacy credential leakage.
