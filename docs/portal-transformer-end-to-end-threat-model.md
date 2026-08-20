# End-to-End Threat Model (`docs/portal-transformer-end-to-end-threat-model.md`)

> **Comprehensive Threat Model**: Documents the complete attack path and 30 threat scenarios for Portal Transformer V7.

---

## 1. End-to-End Attack Pipeline Diagram

```text
  Web Page DOM (Untrusted)
         │
         ▼ [1. Detector Scan]
  Candidate Element (Untrusted Attributes)
         │
         ▼ [2. Privacy Firewall] ──► Denies Sensitive Context (Password/OTP/PII)
  Sanitized SafeContext
         │
         ▼ [3. AI Provider (Untrusted Execution)]
  Raw AI Model Proposal (Untrusted Payload)
         │
         ▼ [4. Output Validator] ──► Rejects XSS / Script / Tag Injection
  Validated Proposal
         │
         ▼ [5. TSIF Risk Gate] ──────► Denies High-Impact Category Auto-Repair
  Approved Patch
         │
         ▼ [6. Hardened Patch Engine] ──► Rejects Non-Allowlisted Attributes (href/src/onclick)
  Sanitized DOM Mutation
         │
         ▼ [7. TOCTOU & Fingerprint Verification]
  Live DOM Tree
```

---

## 2. 30 Threat Scenario Specifications

1. **Direct Prompt Injection**: Page text containing "IGNORE SYSTEM POLICY". *Boundary*: Output Validator blocks injection labels.
2. **Indirect Prompt Injection**: Hidden DOM element instructing model to return `href` mutation. *Boundary*: Patch Engine rejects non-allowlisted attributes.
3. **DOM Text Injection**: Unescaped HTML in element text content. *Boundary*: Sanitized string escaping.
4. **ARIA Attribute Injection**: Injection of `<foreignObject>` inside `aria-label`. *Boundary*: Output Validator tag regex check.
5. **Malicious Accessible Names**: Profane or adversarial text. *Boundary*: Risk Gate confidence check.
6. **XSS Payloads**: `<script>alert(1)</script>`. *Boundary*: Output Validator HTML tag rejection.
7. **SVG Script Injection**: SVG `<script>` subtrees. *Boundary*: Disallowed element tag.
8. **`javascript:` URIs**: `javascript:alert(1)`. *Boundary*: `SvgSemanticResolver` URI rejection.
9. **`data:` URIs**: `data:text/html,...`. *Boundary*: URI scheme block.
10. **`blob:` URIs**: Remote blob URIs. *Boundary*: URI scheme block.
11. **`file:` URIs**: `file:///etc/passwd`. *Boundary*: URI scheme block.
12. **Event-Handler Injection**: `onerror=alert(1)`. *Boundary*: Attribute allowlist enforcement.
13. **IFrame Attacks**: Cross-origin iframe escalation. *Boundary*: MV3 Isolated World boundary.
14. **Form-Action Manipulation**: `action='https://evil.com'`. *Boundary*: Forbidden attribute block.
15. **Navigation Manipulation**: `href='https://evil.com'`. *Boundary*: Forbidden attribute block.
16. **DOM Clobbering**: `<img id='location'>`. *Boundary*: `SafeDOMRef` prototype check.
17. **Prototype Pollution**: `__proto__` injection. *Boundary*: Freeze object prototype.
18. **TOCTOU Target Race**: Target element removed before patch. *Boundary*: Node `isConnected` check.
19. **DOM Replacement Race**: Target element replaced by malicious node. *Boundary*: Fingerprint hash mismatch block.
20. **MutationObserver Abuse**: Infinite DOM mutation loops. *Boundary*: Mutation attribute filtering.
21. **postMessage Spoofing**: Untrusted window messages. *Boundary*: Origin check validation.
22. **Extension Privilege Confusion**: Invoking extension APIs from web page. *Boundary*: Isolated World execution.
23. **Credential Extraction**: Scraping password input fields. *Boundary*: Privacy Firewall target intersection denial.
24. **PII Extraction**: Scraping Aadhaar / PAN numbers. *Boundary*: Privacy Firewall regex scrub.
25. **OTP/PIN Extraction**: Scraping 2FA input boxes. *Boundary*: Sensitive input regex block.
26. **Malicious Hidden Content**: Visually hidden payload text. *Boundary*: Visibility state parsing.
27. **CSS-Generated Content**: CSS `:after` pseudoelement text. *Boundary*: Computed style check.
28. **Resource Exhaustion**: 100,000 DOM element DOM tree. *Boundary*: Candidate scan batching.
29. **Repeated Mutation Attacks**: Repeatedly triggering observer events. *Boundary*: Idempotent state verification.
30. **AI Output Poisoning**: Compromised AI provider returning malicious JSON. *Boundary*: Zero-trust client-side validator.
