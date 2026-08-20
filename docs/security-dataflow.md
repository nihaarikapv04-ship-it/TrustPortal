# TrustPortal Security Dataflow Boundary Audit (`docs/security-dataflow.md`)

```
[Boundary 1: Untrusted DOM]
       ↓ Deterministic Detector (Filters aria-hidden, hidden, sensitive fields)
[Boundary 2: Candidate Node]
       ↓ Privacy Firewall (Target Intersection check & PII Redaction)
[Boundary 3: SafeContext]
       ↓ Fastify API Gateway (Origin Guard, Body Limit, Zod Request Schema)
[Boundary 4: ProposalRequest]
       ↓ ModelRouter & System Prompt (PROMPT_VERSION = "tsif-label-v1")
[Boundary 5: AI Model Output]
       ↓ OutputValidator (Label HTML/script check, Evidence verifiability)
[Boundary 6: Validated ModelProposal]
       ↓ TSIF Trust Engine (TAS Formula, High-Impact Safety Gate)
[Boundary 7: TrustDecision]
       ↓ Extension Messaging (Typed JSON, origin verification)
[Boundary 8: Confirmation UI]
       ↓ PatchApplicator (Strict Attribute Allowlist & Fingerprint revalidation)
[Boundary 9: Reversible DOM Patch]
```

## Security Boundary Controls
1. **DOM $\rightarrow$ Detector**: Ignores `aria-hidden="true"`, `type="password"`, `name="otp"`, `id="cvv"`.
2. **Detector $\rightarrow$ Privacy Firewall**: Hard-rejects target elements inside sensitive workflows (`authentication`, `payment`, `identity`, `tax`, `health`). Replaces PII with `[REDACTED_*]` placeholders.
3. **Firewall $\rightarrow$ SafeContext**: Strips query parameter secrets (`?token=SECRET`). Enforces strict character budgets (max 800 chars total).
4. **SafeContext $\rightarrow$ API Gateway**: Enforces 100 KB Fastify request limit. Rejects `javascript:`, `data:`, `file:`, and credential-embedded origins.
5. **API Gateway $\rightarrow$ Model Router**: Wraps context in `[UNTRUSTED PAGE DATA]`. Page content cannot select providers, models, or URLs.
6. **Model Output $\rightarrow$ OutputValidator**: Rejects HTML tags (`<script>`), control characters, and prompt injection keywords. Validates evidence against `SafeContext`.
7. **Model Proposal $\rightarrow$ Trust Engine**: Calibrates confidence score. High-impact workflows are hard-gated against `auto` decisions.
8. **Trust Engine $\rightarrow$ Confirmation UI**: Renders content safely using Shadow DOM and DOM text nodes (`textContent`).
9. **UI $\rightarrow$ PatchApplicator**: Revalidates fingerprint and target DOM state. Applies ONLY `alt`, `aria-label`, `aria-labelledby`, `aria-describedby`. Revert yields on conflict.
