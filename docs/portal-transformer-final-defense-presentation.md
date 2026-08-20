# Final Defense Presentation Specification (`docs/portal-transformer-final-defense-presentation.md`)

> **Final Presentation Specification**: 17-slide dissertation presentation specification detailing slide titles, bullet points, visual cues, evidence artifacts, and speaker notes.

---

## 1. 17-Slide Presentation Register

- **Slide 1 — Title**: Portal Transformer: Security-Constrained AI-Assisted Web Accessibility Remediation Framework.
- **Slide 2 — Web Accessibility Challenge**: 70%+ public portals lack accessible names (WCAG 2.1 SC 1.1.1).
- **Slide 3 — Motivation for AI**: Static rules flag defects; Generative AI provides contextual natural language comprehension.
- **Slide 4 — AI Security Boundary Hazard**: Untrusted DOM text enables prompt injection, XSS, and navigation mutations (`href`).
- **Slide 5 — Research Questions (RQ1 - RQ8)**: Trade-off between accessibility coverage and zero unsafe DOM mutations.
- **Slide 6 — Framework Architecture**: Client-side zero-trust execution pipeline with browser extension deployment layer.
- **Slide 7 — Zero-Trust Security Pipeline**: Flowchart from DOM extraction to TOCTOU target check.
- **Slide 8 — Privacy Firewall & Secret Scrubbing**: Scrubbing passwords, PINs, OTPs, CVVs, and PII pre-prompt.
- **Slide 9 — Capability-Limited Patch Engine**: Attribute allowlist (`alt`, `aria-label`, `role`). `href`/`src` immutable.
- **Slide 10 — Context-Aware SVG Resolution**: Eliminates false alarms on parent-labelled icon buttons.
- **Slide 11 — Confidence-Based Abstention**: Fail-closed `AMBIGUOUS_ABSTAIN` state preserving safety over speculative mutation.
- **Slide 12 — Domain-Specific Safety Adapters**: Adapter pattern extending safety to high-risk interfaces (UPI Financial).
- **Slide 13 — UPI Transaction Safety Adapter**: Zero AI transaction mutation authority (`AI_MUTATION_AUTHORITY = 0`).
- **Slide 14 — Accessibility Evaluation Results**: Benchmark v4 (100% P / 100% R), Holdout SVG V3 (100% P / 53.85% R / 33.33% Abstain).
- **Slide 15 — Cybersecurity & UPI Evaluation Results**: Property Suite (0.0% ASR), UPI Suite (0 unsafe transaction mutations across 1,500 cases).
- **Slide 16 — Pareto Frontier & System Trade-Offs**: 90% real-world coverage achieved under zero-unsafe-mutation constraint.
- **Slide 17 — Contributions & Dissertation Summary**: 11 research contributions and explicit unevaluated scope disclaimers.
