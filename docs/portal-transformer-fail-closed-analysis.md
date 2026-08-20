# Fail-Closed Security Analysis (`docs/portal-transformer-fail-closed-analysis.md`)

> **Resilience Standard**: Documents system behavior under component failures, unexpected malformed inputs, timeouts, or exceptions across all security boundaries.

---

## 1. Fail-Closed Boundary Verification Matrix

| Component Boundary | Unexpected Failure Event | Internal Subsystem Action | Security Outcome | Fail-Closed Status |
| :--- | :--- | :--- | :--- | :---: |
| **Privacy Firewall** | Regex parse exception or unknown URL scheme | Denies extraction (`SENSITIVE_URL_DENIED`) | Zero SafeContext data dispatched to provider | `✓ FAIL-CLOSED` |
| **Output Validator** | Model proposal non-JSON or schema validation throw | Returns `{ valid: false, reason: "Schema Failure" }` | Proposal rejected; zero DOM patch applied | `✓ FAIL-CLOSED` |
| **Patch Engine** | TOCTOU node disconnected or fingerprint mismatch | Returns `{ success: false, error: "TOCTOU" }` | DOM mutation aborted; zero attribute modification | `✓ FAIL-CLOSED` |
| **TSIF Risk Gate** | Missing signals or score calculation exception | Returns `decision: "reject"` | Proposal deferred to human confirmation panel | `✓ FAIL-CLOSED` |
| **SVG Resolver** | Missing symbol definition or conflicting ARIA | Returns `AMBIGUOUS_ABSTAIN` | Mutation aborted; zero SVG change | `✓ FAIL-CLOSED` |
