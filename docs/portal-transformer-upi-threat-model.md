# UPI Domain Threat Model & Attack Surface (`docs/portal-transformer-upi-threat-model.md`)

> **Domain Threat Model**: Analyzes threat vectors specific to financial and UPI transaction workflows.

---

## 1. UPI Threat Vector Matrix

| Threat Vector ID | Threat Vector Description | Adversarial Payload / Attack Mechanism | System Mitigation Boundary | Status |
| :-: | :--- | :--- | :--- | :---: |
| **UPI-01** | **Amount Alteration Attack** | AI proposal alters `"Pay ₹500"` to `"Pay ₹5000"` | Amount regex comparison check | `✓ BLOCKED` |
| **UPI-02** | **Recipient Hijacking Attack**| AI proposal alters `"merchant@upi"` to `"attacker@upi"` | Recipient UPI ID regex comparison | `✓ BLOCKED` |
| **UPI-03** | **OTP / PIN Extraction** | Model output attempts to expose PIN/OTP in label | Critical field block (`otp`, `pin`) | `✓ BLOCKED` |
| **UPI-04** | **Payment Link Override** | Injection introduces malicious `paymentUrl` or `href` | Navigation block (`javascript:`, URLs) | `✓ BLOCKED` |
| **UPI-05** | **State Confirmation Race** | TOCTOU replacement race during payment confirmation | Target fingerprint verification | `✓ BLOCKED` |
| **UPI-06** | **Ambiguous Payment Icon** | Symbol graph missing local payment icon definition | Fail-closed `AMBIGUOUS_ABSTAIN` return | `✓ ABSTAINED` |
