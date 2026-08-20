# Examiner Briefing One-Pager (`docs/portal-transformer-examiner-one-pager.md`)

> **Examiner Briefing**: High-density summary designed for external thesis examiners.

---

## 1. Thesis Summary
- **Research Problem**: Over 70% of public service web pages contain missing accessible names. Static rules detect defects but cannot generate contextual semantic text. Unconstrained AI models create security risks (prompt injection, XSS, credential theft).
- **Proposed Solution**: **Portal Transformer V7**—a client-side Chrome Extension architecture enforcing zero-trust security boundaries around AI accessibility remediation.
- **Security Boundaries**: Privacy Firewall (scraps passwords/OTPs/PII), Capability-Limited Patch Engine (writes to `alt`/`aria-label`/`role` ONLY; navigation `href`/`src` are immutable), Output Validator (XSS filter), TSIF Risk Gate, TOCTOU target fingerprinting.
- **Key Empirical Results**:
  - Benchmark v4: Precision **100.0%**, Recall **100.0%** ($N=930$).
  - Holdout SVG V3: Precision **100.0%**, Recall **53.85%**, Abstention Rate **33.33%** ($N=600$).
  - Real-World `.gov.in`: 20 Portals ($N_{\text{DOM}}=1,700$), Precision **100.0%**, Recall **77.78%**, Abstention **10.0%**.
  - Security Property Suite: **0.0% Attack Success Rate** across 1,000 property instances, 500 holdouts, 5,000 fuzz runs.
- **Primary Contribution**: Demonstrating that client-side AI accessibility remediation can achieve 90.0% real-world coverage while maintaining a strict zero-unsafe-mutation security constraint.
- **Acknowledged Limitations**: Headless NVDA/TalkBack audio testing (`NOT EVALUATED`), local mock provider latency, curated 20-page sample scope.
