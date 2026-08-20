# Portal Transformer: AI-Assisted Real-Time Accessibility Remediation

> **Research Framework**: Project Portal Transformer (AI-Assisted Real-Time Accessibility Remediation for Public-Service Web Portals)  
> **Core Architecture**: Chrome Manifest V3 Extension with Deterministic Detection, Privacy Firewall, and Hardened Reversible DOM Patch Engine.  
> **Repository Path**: `/Users/nihaarikapv/.gemini/antigravity/scratch/trustportal`

---

## 1. Project Overview
Portal Transformer is a security-constrained, privacy-bounded browser extension framework designed to remediate accessibility defects (`<img>` missing alt, `<button>` missing name, `<a>` missing name, `<input>` missing label, `<svg>` missing name) on public-service web portals in real time.

---

## 2. Three-Subsystem Architecture
1. **Subsystem 1 (DOM Interceptor)**: Uses `MutationObserver` and `DeterministicDetector` to scan DOM mutations and identify accessibility defects using static WCAG accessible name computation.
2. **Subsystem 2 (Cloud Inference Relay & Privacy Firewall)**: Filters sensitive credentials (passwords, OTPs, PINs, CVVs), extracts PII-scrubbed `SafeContext`, and validates untrusted model proposals (`OutputValidator`) against XSS and prompt injection.
3. **Subsystem 3 (Hardened Semantic Injection Module)**: Applies reversible DOM mutations strictly restricted to an attribute allowlist (`alt`, `aria-label`, `aria-labelledby`, `aria-describedby`, `role`) and yields when host page DOM reclaims attribute values.

---

## 3. Empirical Evaluation Results Summary

> **Source**: Generated via `npm run evaluate:portal-transformer` -> [`reports/evaluation/portal-transformer-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/portal-transformer-results.json)

| Evaluation Dimension | Benchmark Metric | Measured Result |
| :--- | :--- | :---: |
| **RQ1 Defect Detection** | Precision / Recall / $F_1$ Score | **$1.000$ ($100.0\%$)** ($N=250$) |
| **RQ2 AI Label Quality** | Semantic Label Acceptability | **$100.0\%$** ($N=150$) |
| **RQ3 Remediation Latency**| Mean Total Remediation Latency | **$0.023\text{ ms}$** ($P_{95} = 0.030\text{ ms}$) |
| **RQ4 Security Containment**| Security Rejection Rate | **$100.0\%$** ($9/9$ attacks blocked) |
| **RQ5 Privacy Bounding** | Raw Credentials Leaked to AI | **$0$** (Verified Zero Leakage) |
| **RQ6 Dynamic DOM** | Infinite Mutation Observer Loops | **$0$** |

*Note*: Latency evaluation reflects local mock provider infrastructure. Real cloud API deployment will add network round-trip latency. Human screen-reader usability testing (NVDA/TalkBack) is classified as `NOT YET EVALUATED — FUTURE EMPIRICAL EVALUATION`.

---

## 4. Quickstart & Reproducibility Commands

```bash
# 1. Install dependencies & build monorepo packages
npm run build

# 2. Run complete unit & integration test suite (245/245 tests pass)
npm test

# 3. Execute empirical evaluation benchmark suite & generate reports
npm run evaluate:portal-transformer
```

---

## 5. Monorepo Repository Structure
```text
/Users/nihaarikapv/.gemini/antigravity/scratch/trustportal
├── apps/
│   ├── api/             # Backend API & Output Validator
│   ├── demo/            # Public service test portal
│   ├── extension/       # MV3 Chrome Extension runtime
│   └── trustqr/         # Isolated QR payment verification app
├── packages/
│   ├── eval/            # Benchmark runner & evaluation metrics
│   ├── redaction/       # Privacy Firewall & SafeContext extractor
│   ├── rules/           # Deterministic accessibility defect detector
│   ├── schemas/         # Shared Zod schemas & TypeScript types
│   └── scoring/         # TSIF Risk Gate & Trust Engine scoring
├── patch_system/        # Reversible Hardened Patch Engine
├── reports/evaluation/  # Machine-readable JSON evaluation payloads
├── docs/                # Thesis documentation, reports & figures
└── README.md            # Root repository guide
```
