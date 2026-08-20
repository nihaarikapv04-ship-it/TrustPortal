# Security Observability & Event Logging (`docs/portal-transformer-security-observability.md`)

> **Observability Standard**: Specifies 9 security event types and strict privacy invariants (never logging passwords, PINs, OTPs, CVVs, or full card numbers).

---

## 1. Security Event Register

- `PRIVACY_FILTER_TRIGGERED`: Sensitive field intersection detected and denied extraction.
- `AI_OUTPUT_REJECTED`: Malicious JSON proposal rejected by Output Validator.
- `FORBIDDEN_ATTRIBUTE_REJECTED`: Proposal attempted write to un-allowlisted attribute (`href`, `src`).
- `RISK_GATE_REJECTED`: Proposal score exceeded non-compensable risk gate threshold.
- `TOCTOU_REJECTED`: Node disconnected or target fingerprint mismatch prior to patch.
- `AMBIGUOUS_ABSTAIN`: Resolver returned `AMBIGUOUS_ABSTAIN` due to incomplete symbol graph.
- `PATCH_APPLIED`: Safe allowlisted patch applied to DOM target.
- `PATCH_REJECTED`: Live page content modified target attribute prior to patch.
- `PROMPT_INJECTION_DETECTED`: SafeContext extraction scrubbed prompt injection keywords.
