# AI Zero-Trust Runtime Verification (`docs/portal-transformer-ai-zero-trust-runtime.md`)

> **Zero-Trust AI Verification**: Demonstrates that the AI provider is never granted arbitrary DOM access.

---

## 1. Zero-Trust Verification Pipeline

```text
Untrusted Model Proposal
          │
          ▼
Schema & Tag Validator Check (Local OutputValidator)
          │
          ▼
TSIF Risk Gate Assessment (Non-Compensable Risk Gate)
          │
          ▼
Capability Allowlist Filter (LocalPatchEngine)
          │
          ▼
TOCTOU Fingerprint Verification (SafeDOMRef Target Check)
          │
          ▼
Targeted Allowlisted Attribute Write ONLY
```
