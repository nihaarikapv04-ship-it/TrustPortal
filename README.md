# TrustPortal / Portal Transformer V7

> **Security-Constrained AI-Assisted Web Accessibility Remediation Framework**  
> *An AI-assisted, security-constrained accessibility remediation framework implemented through a browser-extension deployment layer.*

[![Build & Test Status](https://img.shields.io/badge/Monorepo%20Tests-251%20Passed-brightgreen)](https://github.com/nihaarikapv04-ship-it/TrustPortal)
[![Security Regression](https://img.shields.io/badge/Security%20ASR-0.0%25-blue)](https://github.com/nihaarikapv04-ship-it/TrustPortal)
[![UPI Financial Safety](https://img.shields.io/badge/UPI%20Unsafe%20Mutations-0-success)](https://github.com/nihaarikapv04-ship-it/TrustPortal)
[![Reproducibility](https://img.shields.io/badge/3--Run%20Reproducibility-DETERMINISTIC-purple)](https://github.com/nihaarikapv04-ship-it/TrustPortal)

---

## 📌 Executive Overview

Over **70% of public service web portals** contain missing WCAG 2.1 SC 1.1.1 accessible text labels on visual controls, locking out screen-reader users. While Generative AI provides the natural language comprehension required to infer element intent from surrounding DOM context, introducing AI directly into the browser DOM creates severe security threats—including prompt injection, XSS, and navigation manipulation.

**Portal Transformer** enforces a client-side **zero-trust execution pipeline**. It treats both web page DOM text and AI model responses as untrusted inputs. Sensitive data is scrubbed by a Privacy Firewall, while AI outputs are passed through client-side Output Validators, non-compensable Risk Gates, Domain Safety Adapters, and Capability-Limited Patch Engines—restricting attribute writes strictly to allowlisted accessibility attributes (`aria-label`, `alt`, `role`).

---

## 🏗️ System Architecture

```text
               [UNTRUSTED INPUT] Web Page DOM Subtree
                                   │
                                   ▼
                   MutationObserver (DOM Observer)
                                   │
                                   ▼
                  Deterministic Accessibility Detector
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
Accessible Name Computer                           SvgSemanticResolver
(WAI-ARIA 1.2 Rules)                           (Parent Context Traversal)
         │                                                   │
         └─────────────────────────┬─────────────────────────┘
                                   │
                                   ▼
                         [DECISION BOUNDARY]
                                   │
            ┌──────────────────────┴──────────────────────┐
            ▼                                             ▼
     [SAFE PROPOSAL]                              [AMBIGUOUS]
            │                                             │
            ▼                                             ▼
   Target Intersection                             AMBIGUOUS_ABSTAIN
     Privacy Firewall                            (Fail-Closed Return)
 (Credential Scrubbing)                                   │
            │                                             ▼
            ▼                                    NO DOM MUTATION
  [UNTRUSTED AI OUTPUT]
   AI / Model Proposal
            │
            ▼
    Output Validator
 (XSS & Tag Regex Filter)
            │
            ▼
     TSIF Risk Gate
  (Risk Score Check)
            │
            ▼
  [DOMAIN SAFETY ADAPTER]
(Generic Web / UPI Financial)
            │
            ▼
 Capability-Limited Patcher
(Attribute Write Allowlist ONLY)
            │
            ▼
   TOCTOU Verification
(Connectivity & Fingerprint)
            │
            ▼
   Targeted DOM Patch
```

---

## 📊 Master Authoritative Empirical Results

| Evaluation Benchmark / Dataset | Sample Size ($N$) | Primary Metric | Primary Outcome | Source Evidence Artifact |
| :--- | :---: | :---: | :---: | :--- |
| **Synthetic Benchmark v4** | 930 | Precision / Recall | **100.0% / 100.0%** | [`reports/evaluation/benchmark-v4-after-fix.json`](reports/evaluation/benchmark-v4-after-fix.json) |
| **Holdout SVG Benchmark V3** | 600 | Precision / Recall | **100.0% / 53.85%** | [`reports/evaluation/svg-benchmark-v3-results.json`](reports/evaluation/svg-benchmark-v3-results.json) |
| **Real-World `.gov.in` Portals** | 100 | Precision / Recall | **100.0% / 77.78%** | [`reports/realworld/realworld-summary.json`](reports/realworld/realworld-summary.json) |
| **Security Property Suite** | 1,000 | Attack Success Rate | **0.0% (0 Unsafe)** | [`reports/evaluation/property-based-security-results.json`](reports/evaluation/property-based-security-results.json) |
| **UPI Financial Benchmark** | 1,500 | Attack Success Rate | **0.0% (0 Unsafe)** | [`reports/evaluation/upi-security-results.json`](reports/evaluation/upi-security-results.json) |
| **3-Run Reproducibility Audit** | 3 Runs | Classification | **`DETERMINISTIC`** | [`reports/evaluation/reproducibility-results.json`](reports/evaluation/reproducibility-results.json) |

---

## 🚀 Quick Start & CLI Usage

### **1. Install Dependencies**
```bash
npm install
```

### **2. Run All Unit & Integration Tests (251 Tests Passed)**
```bash
npm test
```

### **3. Run Interactive / Automated Product Demo**
```bash
npm run demo:portal-transformer
```

### **4. Run Evaluation Benchmarks**
```bash
# Synthetic & SVG Benchmarks
npm run evaluate:portal-transformer

# Real-World .gov.in Evaluation (20 Portals)
npm run evaluate:portal-transformer-realworld

# 1,000-Instance Cybersecurity Property Suite
npm run evaluate:portal-transformer-security

# 1,500-Case UPI Financial Security Suite
npm run evaluate:portal-transformer-upi
```

### **5. Run Thesis & Security Audit Gates**
```bash
# Master Thesis Consistency Audit
npm run audit:portal-transformer-thesis

# Security Regression Gate
npm run audit:portal-transformer-security

# Patch Capability Allowlist Audit
npm run audit:portal-transformer-patch-capabilities

# 3-Run Independent Reproducibility Audit
npm run audit:portal-transformer-reproducibility

# UPI Evidence Integrity Audit
npm run audit:portal-transformer-upi-evidence
```

---

## 📚 Master Research Documentation Sitemap

Detailed dissertation documentation is maintained in the [`docs/`](docs/) directory:

- **[`docs/portal-transformer-examiner-cheat-sheet.md`](docs/portal-transformer-examiner-cheat-sheet.md)**: 1-Page Examiner Briefing Summary
- **[`docs/portal-transformer-final-viva-50.md`](docs/portal-transformer-final-viva-50.md)**: 50 Examiner Viva Questions & Answers
- **[`docs/portal-transformer-final-ppt.md`](docs/portal-transformer-final-ppt.md)**: 17-Slide Dissertation Defense Presentation Specification
- **[`docs/portal-transformer-final-demo-script.md`](docs/portal-transformer-final-demo-script.md)**: 7-Minute Spoken Demonstration Script
- **[`docs/portal-transformer-final-thesis.md`](docs/portal-transformer-final-thesis.md)**: Master 13-Chapter Dissertation Manuscript
- **[`docs/portal-transformer-final-contributions.md`](docs/portal-transformer-final-contributions.md)**: Research Contribution Hierarchy (C1 - C11)
- **[`docs/portal-transformer-final-evidence-index.md`](docs/portal-transformer-final-evidence-index.md)**: Master Claim Traceability Index
- **[`docs/portal-transformer-final-claim-boundaries.md`](docs/portal-transformer-final-claim-boundaries.md)**: Allowed vs Disallowed Scientific Claims
- **[`docs/portal-transformer-final-freeze-checklist.md`](docs/portal-transformer-final-freeze-checklist.md)**: 8-Point Project Freeze Verification Matrix

---

## 🔒 Scientific Framing & Non-Claims

> [!IMPORTANT]
> - **UPI Framing**: *"The UPI-domain safety policy was empirically evaluated against a 1,500-case benchmark comprising 20 structural attack templates and parameterized variants. Under the evaluated conditions, the policy prevented the tested classes of unsafe transaction mutation."*
> - **Scope Disclaimer**: *"These results are benchmark-scoped and do not constitute independent generalization evidence."*
> - **Unevaluated Scope**: Live NVDA/TalkBack spoken audio announcement testing, IRB-approved human usability studies, live cloud API RTT latency, and native mobile banking apps are explicitly cataloged as `NOT EVALUATED`.

---

## 📜 License & Citation

Developed for final-year dissertation research and defense. Distributed under the MIT License.
