# UPI Transaction Safety Adapter Architecture (`docs/portal-transformer-upi-architecture.md`)

> **Domain Extension Architecture**: Documents the placement of the UPI Transaction Safety Adapter as an isolated domain security layer sitting between the TSIF Risk Gate and the Patch Engine.

---

## 1. ASCII Pipeline Placement Diagram

```text
DOM (Live Web Page)
      │
      ▼
Deterministic Accessibility Detector
      │
      ▼
Context-Aware Accessible Name / SVG Resolver
      │
      ▼
AI Proposal Generation (Untrusted Model Output)
      │
      ▼
Privacy Firewall (Scrubs Sensitive Input Fields)
      │
      ▼
Output Validator (Filters HTML Tags & XSS Scripts)
      │
      ▼
TSIF Risk Gate (Non-Compensable Risk Assessment)
      │
      ▼
[NEW ISOLATED LAYER] UPI Transaction Safety Adapter
  (Checks Critical Fields, Amounts, Recipients, Credentials)
      │
      ▼
TOCTOU Verification (Node Connectivity & Fingerprint Hash)
      │
      ▼
Capability-Limited Patch Engine (Allowlist Attributes ONLY)
      │
      ▼
Safe DOM Remediation Patch
```

---

## 2. Core Operational Rules

1. **Explicit Domain Modes**: Supports `GENERIC_WEB` (bypasses UPI checks) and `UPI_FINANCIAL` (enforces strict financial invariants).
2. **Zero Transaction Mutation**: AI model proposals may NEVER mutate transaction-critical fields (`amount`, `recipient`, `recipientUpiId`, `otp`, `pin`, `cvv`).
3. **No Navigation Overrides**: Rejects proposals containing URLs, deep links, or `javascript:` scripts.
4. **Structured Security Logging**: Logs `UPI_POLICY_ALLOW`, `UPI_POLICY_BLOCK`, `UPI_TRANSACTION_FIELD_BLOCK`, `UPI_NAVIGATION_BLOCK`, `UPI_AUTH_FIELD_BLOCK`, and `UPI_AMBIGUOUS_ABSTAIN` events without recording raw secret credentials.
