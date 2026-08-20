# Portal Transformer: One-Page Research Project Summary (`docs/portal-transformer-one-page-summary.md`)

> **Project Executive Summary**: Designed for faculty review, project portfolio, poster presentation, and dissertation defense.

---

## 1. Problem & Gap
Over 70% of public service web pages suffer from missing accessible names, unlabelled buttons, or decorative SVG graphics. Static rule engines (e.g., axe-core) detect defects but cannot generate contextual semantic labels. Conversely, unconstrained AI models introduce severe web security risks including prompt injection, XSS, `javascript:` execution, and credential theft.

---

## 2. System Architecture & Zero-Trust Security Model
Portal Transformer introduces **Security-Constrained AI Accessibility Remediation**:

```text
Web Page DOM (Untrusted) ──► Privacy Firewall (Credential Scrubbing) ──► AI Provider (Untrusted Execution)
                                                                                  │
Live DOM Mutation ◄── TOCTOU & Allowlist Filter ◄── TSIF Risk Gate ◄── Output Validator (XSS Filter)
```

- **Privacy Isolation**: Target Intersection Firewall blocks passwords, OTPs, PINs, and PII from leaving the client.
- **Capability-Limited Mutation**: Patches are strictly restricted to `alt`, `aria-label`, `aria-labelledby`, `aria-describedby`, and `role`. Navigation attributes (`href`, `src`, `action`) are immutable.
- **Uncertainty Handling**: `AMBIGUOUS_ABSTAIN` safely defers complex or conflicting ARIA controls to human review rather than executing speculative DOM mutations.

---

## 3. Key Empirical Results

| Metric Dimension | Measured Value | Scope / Dataset |
| :--- | :---: | :--- |
| **Synthetic Defect Precision** | **100.0%** ($FP=0$) | Benchmark v4 ($N=930$) |
| **Real-World Reviewed Precision**| **100.0%** ($FP=0$) | 20 `.gov.in` Portals ($N=100$ Sample) |
| **Real-World Defect Recall** | **77.78%** ($TP=35, FN=10$) | 20 `.gov.in` Portals ($N=100$ Sample) |
| **Real-World Abstention Rate** | **10.0%** ($10 / 100$) | Explicit safety deferrals |
| **Remediation Coverage** | **90.0%** ($90 / 100$) | Maximum coverage under zero-unsafe-mutation constraint |
| **Security Attack Success Rate** | **0.0%** ($0 / 1,000$) | Property suite, holdouts, fuzzing, compromised AI |
| **Mean Local Latency** | **0.0123 ms** | Microsecond client-side execution ($P_{95} = 0.0236\text{ ms}$) |

---

## 4. Key Limitations & Unevaluated Scope
- **Screen-Reader Announcements**: Spoken NVDA / TalkBack audio was evaluated via DOM accessibility-tree semantic state tracking (`NOT EVALUATED — ENVIRONMENT LIMITATION`).
- **Human Usability**: No IRB-approved human participant trial was conducted (`NOT EVALUATED — HUMAN-SUBJECT STUDY NOT CONDUCTED`).
- **Cloud Latency**: Latency evaluated using local mock provider; live Cloud API RTT remains unevaluated.
