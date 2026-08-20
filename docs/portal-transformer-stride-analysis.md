# STRIDE Threat Modeling Analysis (`docs/portal-transformer-stride-analysis.md`)

> **Industry Security Standard**: Maps Portal Transformer V7 architecture against the Microsoft STRIDE threat classification framework.

---

## 1. STRIDE Threat Analysis Matrix

| STRIDE Category | Specific Threat Description | Affected Component | Specific Defense Mechanism | Test Verification | Result | Residual Risk |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **Spoofing** | postMessage origin spoofing from web page script | Extension Sandbox | Strict `evt.origin` check in message handler | `tests/messaging.test.ts` | `✓ BLOCKED` | Chrome extension messaging trust model |
| **Tampering** | Model proposal mutating `href` or `action` attributes | `LocalPatchEngine` | Attribute allowlist (`alt`, `aria-label`, `role`) | `tests/patcher_security.test.ts` | `✓ BLOCKED` | Page scripts modifying DOM after patch |
| **Repudiation** | Model proposals without evidence provenance | `TSIFRiskGate` | Mandatory evidence item tracking in patch schema | `tests/scoring.test.ts` | `✓ BLOCKED` | Local log file tampering |
| **Information Disclosure**| PII/Credential leakage in SafeContext | `PrivacyFirewall` | Sensitive input regex & target intersection check | `tests/firewall.test.ts` | `✓ BLOCKED` | Novel, un-regexed sensitive field types |
| **Denial of Service** | Infinite MutationObserver loop during DOM patch | Extension Observer | Observer attribute filter on patch dispatch | `tests/demo.test.ts` | `✓ BLOCKED` | Extremely large 100k DOM element tree |
| **Elevation of Privilege**| Untrusted web page code invoking extension APIs | Isolated World MV3 | Chrome Extension Isolated World boundary | `tests/messaging.test.ts` | `✓ BLOCKED` | Chrome extension browser vulnerability |
