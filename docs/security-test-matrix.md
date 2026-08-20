# TrustPortal Security Test Matrix (`docs/security-test-matrix.md`)

| Attack Vector | Target Security Boundary | Expected Security Result | Security Test Module | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Prompt Injection Payload** | DOM $\rightarrow$ Model System Prompt | Treated strictly as raw untrusted page data | `tests/security/model/prompt_injection.test.ts` | **PASS** |
| **Password / OTP / PII Leak** | DOM $\rightarrow$ Privacy Firewall | Immediate DENY or complete redaction (`[REDACTED_*]`) | `tests/security/privacy/pii_exfiltration.test.ts` | **PASS** |
| **Query Parameter Token Leak** | SafeContext URL Extractor | Query secret stripped (`?token=SECRET` $\rightarrow$ origin/path) | `tests/security/privacy/pii_exfiltration.test.ts` | **PASS** |
| **Full DOM Exfiltration** | Context Extractor Budget | Enforces 800 character ceiling; excludes unrelated nodes | `tests/security/privacy/context_budget.test.ts` | **PASS** |
| **Dangerous Origin (`javascript:`)**| Fastify API Gateway | HTTP 403 `FORBIDDEN_ORIGIN` | `tests/security/api/origin_attacks.test.ts` | **PASS** |
| **Oversized Payload (>100KB)** | Fastify Request Gateway | HTTP 413 Payload Too Large / Fastify rejection | `tests/security/api/request_attacks.test.ts` | **PASS** |
| **Rate Limit Flooding** | API Security Layer | HTTP 429 `RATE_LIMIT_EXCEEDED` | `tests/security/api/rate_limit_attacks.test.ts` | **PASS** |
| **XSS Payload in Model Output** | OutputValidator | Proposal rejected (`action: "abstain"`) | `tests/security/model/malicious_output.test.ts` | **PASS** |
| **High-Impact Workflow Auto-Apply**| TSIF Trust Engine | Decision forced to `confirm` / `reject`; NEVER `auto` | `tests/security/scoring/risk_gate_attacks.test.ts` | **PASS** |
| **Patch Attribute Escalation (`href`)**| PatchApplicator Allowlist | Patch rejected (`INVALID_ATTRIBUTE`) | `tests/security/patches/attribute_escalation.test.ts` | **PASS** |
| **Executable Mutation (`onclick`)** | PatchApplicator Allowlist | Patch rejected (`INVALID_ATTRIBUTE`) | `tests/security/patches/attribute_escalation.test.ts` | **PASS** |
| **Stale DOM Target Mutation** | PatchApplicator Revalidation | Patch rejected (`STALE_TARGET`) | `tests/security/patches/stale_target.test.ts` | **PASS** |
| **Revert Conflict Overwrite** | PatchApplicator Revert | Revert yields (`PATCH_CONFLICT`); DOM preserved | `tests/security/patches/revert_attacks.test.ts` | **PASS** |
| **Forged Extension Message** | Messaging Architecture | Rejected by extension message handler | `tests/security/ui/message_forgery.test.ts` | **PASS** |
| **Confirmation UI HTML Injection** | Shadow DOM Renderer | Rendered safely as text via `textContent` | `tests/security/ui/xss.test.ts` | **PASS** |
