# Final Security Claim Matrix (`docs/portal-transformer-final-security-claim-matrix.md`)

> **Traceability Standard**: Explicitly classifies every final security claim against empirical test counts, metrics, statuses, and residual risks.

---

## 1. Final Security Claim Traceability Table

| Claim Description | Evidence Artifact | Dataset / Scope | $N$ | Metric | Result | Verification Status | Residual Risk |
| :--- | :--- | :--- | :---: | :--- | :---: | :---: | :--- |
| **Capability-Limited Mutation** | `reports/evaluation/property-based-security-results.json` | 1,000 Property Cases | 1,000 | Unsafe Mutations | 0 | `EMPIRICALLY VERIFIED` | None (allowlist enforced) |
| **Credential & PII Isolation** | `reports/realworld/realworld-summary.json` | 20 Real-World Portals | 1,700 | Credential Leaks | 0 | `EMPIRICALLY VERIFIED` | Un-regexed sensitive inputs |
| **Stale Target Rejection** | `reports/evaluation/property-based-security-results.json` | 100 TOCTOU Races | 100 | Stale Patches | 0 | `EMPIRICALLY VERIFIED` | Rapid microtask rewrites |
| **Forbidden Navigation Block**| `reports/evaluation/property-based-security-results.json` | 100 Navigation Payloads | 100 | `href`/`src` Mutations | 0 | `EMPIRICALLY VERIFIED` | None (attribute allowlist) |
| **Prompt Injection Containment**| `reports/evaluation/prompt-injection-results.json` | 100 Prompt Injections | 100 | Injection Success | 0 | `EMPIRICALLY VERIFIED` | Tested prompt corpus |
| **Compromised AI Containment**| `reports/evaluation/compromised-provider-results.json` | 14 Malicious Payload Types| 14 | Unsafe Mutations | 0 | `EMPIRICALLY VERIFIED` | Tested payload categories |
| **Dynamic DOM Attack Block** | `reports/evaluation/dynamic-security-results.json` | 100 Dynamic Scenarios | 100 | Dynamic Races | 0 | `EMPIRICALLY VERIFIED` | MutationObserver frequency |
| **Human Screen-Reader Audio** | `docs/portal-transformer-nvda-test-protocol.md` | N/A | N/A | Spoken Quality | N/A | `NOT EVALUATED` | Headless CLI limitation |
