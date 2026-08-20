# TrustPortal (TSIF) Threat Model

## 1. Overview & Trust Boundaries
TrustPortal processes untrusted third-party web content inside browser pages. The system enforces strict capability mediation (CaMeL Dual-LLM pattern) where page content is isolated as raw data and prohibited from influencing execution flow.

```
+-----------------------------------------------------------------------+
| UNTRUSTED DOM CONTEXT                                                 |
| Web Page Text, Hidden Text (display:none), User Comments, Attributes   |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| PRIVACY + INJECTION FIREWALL (Local Gate)                            |
| Redacts PII, Denies Sensitive URLs, Detects Injection Patterns       |
+-----------------------------------------------------------------------+
                                  | (SafeContext Data Only)
                                  v
+-----------------------------------------------------------------------+
| QUARANTINED PROPOSAL STAGE (Sandboxed LLM Inference)                 |
| Returns strictly schema-validated JSON (ProposalResult)               |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
| PRIVILEGED CONTROLLER & HARDENED PATCH ENGINE                         |
| Evaluates CRC Risk Gate, Restricts Mutations to Allowlisted Attributes|
+-----------------------------------------------------------------------+
```

## 2. Threat Vector Mitigations

### 2.1 Indirect Prompt Injection (IPI) Attacks
- **Threat**: Adversary embeds prompt override commands in visible text or hidden nodes (`display:none`).
- **Mitigation**:
  1. Non-compensable firewall regex scanning visible and hidden text nodes.
  2. Quarantined proposal prompt explicitly framing inputs as raw untrusted data.
  3. Strict JSON schema validation rejecting non-conforming or executable returns.

### 2.2 DOM Hijacking & Malicious Patching
- **Threat**: Attacker attempts to trick patcher into rewriting `href`, `onclick`, `action`, or `innerHTML`.
- **Mitigation**:
  1. TypeScript type enforcement + runtime set validation restricting mutations to `alt`, `aria-label`, `aria-labelledby`, `aria-describedby`, `role`.
  2. Absolute prohibition of `innerHTML` or script execution.

### 2.3 DOM Clickjacking & UI Overlay Attacks
- **Threat**: Malicious page script manipulates extension UI overlay hitboxes or styles.
- **Mitigation**:
  1. Human verification panel rendered in a **closed** Shadow DOM root (`mode: "closed"`).
  2. Visual focus indicators and keyboard focus traps.

### 2.4 Sensitive Data Exposure
- **Threat**: Form values, credit card numbers, passwords, OTPs, or government IDs sent to remote AI.
- **Mitigation**:
  1. Deny-by-default on sensitive URLs (auth, checkout, health, tax, banking).
  2. Local regex PII redactor stripping emails, phone numbers, card numbers, national IDs, tokens.
  3. Never serializing full HTML or user-entered input fields.
