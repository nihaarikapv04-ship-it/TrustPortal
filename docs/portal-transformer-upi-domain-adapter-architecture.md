# Domain-Specific Adapter Architecture (`docs/portal-transformer-upi-domain-adapter-architecture.md`)

> **Adapter Pattern Specification**: Details how domain-specific security adapters plug into Portal Transformer V7 without modifying the core web remediation pipeline.

---

## 1. Domain Adapter Pattern

```text
                                Generic Web Pipeline
                                         │
                                         ▼
                                TSIF Risk Gate
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
          GENERIC_WEB Mode                              UPI_FINANCIAL Mode
       (Standard Allowlist)                     (UpiTransactionSafetyAdapter)
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                                TOCTOU Verification
                                         │
                                         ▼
                          Capability-Limited Patch Engine
```
