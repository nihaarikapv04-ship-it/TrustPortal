# TrustPortal (TSIF) System Card

## System Summary
- **Name**: TrustPortal / TSIF (Trusted Semantic Injection Framework)
- **Model Role**: Context-aware assistive label proposal engine.
- **Supported Issue Types**: `img-alt`, `button-name`, `link-name`, `form-label`.
- **Supported Languages**: English (`en`), Hindi (`hi`).

## Intended Use
TrustPortal is designed as a **user-side assistive semantic remediation layer** operating inside web browsers. It detects missing accessibility names and proposes safe, reversible labels gated by statistical trust calibration.

## Out of Scope & Misuse Prohibitions
1. **No Compliance Claims**: TrustPortal does NOT certify or make web pages "WCAG compliant" or "DPDPA compliant."
2. **No Unsafe Automations**: Never automatically modifies payment controls, authentication, password fields, OTPs, or legally binding forms.
3. **No Executive Capabilities**: Model outputs cannot navigate the page, download files, submit forms, or execute script content.

## Risk Management & Trust Gate
- **Conformal Risk Control (CRC)**: Empirical threshold selection ($\lambda^*$) guaranteeing expected loss $\mathbb{E}[\text{Loss}] \le \alpha$ (default $\alpha = 0.05$).
- **Trust Score Formula (TAS)**: Composite 0–100 score combining rule confidence, context agreement, model confidence, DOM consistency, visual agreement, privacy penalty, and impact risk penalty.
