# Security Architecture Audit (`docs/portal-transformer-security-architecture-audit.md`)

> **Authoritative Security Specification**: Audits all 10 security boundaries of Portal Transformer V7, identifying trusted inputs, untrusted inputs, privileged operations, and safety invariants.

---

## 1. Security Boundary Auditing Matrix

| Component | Threat Addressed | Untrusted Input | Trusted Boundary | Security Invariant | Allowed Behavior | Forbidden Behavior | Failure Mode | Test Artifact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Privacy Firewall** | Credential / PII Exfiltration | DOM text, input attributes, URL path | `PrivacyFirewall` | Zero credential data in SafeContext | Extract public labels | Dispatches passwords/OTPs | Target intersection denial | `tests/firewall.test.ts` |
| **SafeContext Extractor**| Context Over-extraction | Raw DOM tree | `MinimalContextExtractor` | Strict context token budget limits | Extract nearby text | Raw DOM tree dump | Truncate to budget | `tests/extractor.test.ts` |
| **Output Validator** | Model XSS / Injection | Raw AI model JSON | `LocalOutputValidator` | Zero HTML/SVG tag injection | Pure text labels | `<script>`, `foreignObject` | Reject model proposal | `tests/security.test.ts` |
| **Patch Engine** | Privileged Mutation | Model patch attributes | `LocalPatchEngine` | Attribute allowlist enforcement | `alt`, `aria-label`, `role` | `href`, `src`, `onclick` | Refuse DOM patch | `tests/patcher_security.test.ts` |
| **Risk Gate** | High-Risk Mutation | TAS risk score | `TSIFRiskGate` | Non-compensable risk gate | Auto-patch high TAS | Auto-patch high risk | Escalated to confirm | `tests/risk_gate.test.ts` |
| **TOCTOU Protection** | Stale Node Race | Live DOM node | `LocalPatchEngine` | Node connectivity & fingerprint match | Patch connected node | Patch disconnected node | Reject stale patch | `tests/patcher_security.test.ts` |
| **DOM Clobbering Defense** | Property Poisoning | `id` / `name` attributes | `SafeDOMRef` | Protection of prototype properties | Standard element lookup | Global variable overwrite | Explicit property check | `tests/security.test.ts` |
| **Isolated World MV3** | Privilege Escalation | Webpage scripts | Extension Sandbox | Zero access to extension APIs | Read DOM text | Access extension tokens | Content script isolation | `tests/messaging.test.ts` |
| **SVG Resolver** | Malicious URI / Sprite | Remote SVG URIs | `SvgSemanticResolver` | Local symbol graph ONLY | Local `<title>`/`<desc>` | `javascript:`, `data:` | Return `AMBIGUOUS_ABSTAIN` | `tests/acc_name.test.ts` |
| **MutationObserver** | DOM Infinite Loop | Page dynamic updates | Extension Observer | Single mutation dispatch per node | Scan added nodes | Rescan remediated nodes | Disconnect observer loop | `tests/demo.test.ts` |
