# Final System Architecture Diagram Specification (`docs/portal-transformer-final-architecture-figure.md`)

> **Architecture Diagram Specification**: Complete ASCII diagram explicitly highlighting untrusted inputs, untrusted AI model outputs, zero-trust security boundaries, and fail-closed paths.

---

## 1. ASCII Architecture Diagram

```text
               [UNTRUSTED INPUT] Web Page DOM Subtree
                                   │
                                   ▼
                   MutationObserver (DOM Observer)
                                   │
                                   ▼
                  Deterministic Accessibility Detector
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
Accessible Name Computer                           SvgSemanticResolver
(WAI-ARIA 1.2 Rules)                           (Parent Context Traversal)
         │                                                   │
         └─────────────────────────┬─────────────────────────┘
                                   │
                                   ▼
                         [DECISION BOUNDARY]
                                   │
            ┌──────────────────────┴──────────────────────┐
            ▼                                             ▼
     [SAFE PROPOSAL]                              [AMBIGUOUS]
            │                                             │
            ▼                                             ▼
   Target Intersection                             AMBIGUOUS_ABSTAIN
     Privacy Firewall                            (Fail-Closed Return)
 (Credential Scrubbing)                                   │
            │                                             ▼
            ▼                                    NO DOM MUTATION
  [UNTRUSTED AI OUTPUT]
   AI / Model Proposal
            │
            ▼
    Output Validator
 (XSS & Tag Regex Filter)
            │
            ▼
     TSIF Risk Gate
  (Risk Score Check)
            │
            ▼
 Capability-Limited Patcher
(Attribute Write Allowlist ONLY)
            │
            ▼
   TOCTOU Verification
(Connectivity & Fingerprint)
            │
            ▼
   Targeted DOM Patch
```

---

## 2. Key Architecture Labels & Security Callouts

1. **UNTRUSTED INPUT**: Live Web Page DOM subtrees containing potential prompt injections.
2. **UNTRUSTED AI OUTPUT**: AI model responses validated client-side before DOM injection.
3. **TRUST BOUNDARY**: Isolated world extension execution scope.
4. **NO DIRECT AI DOM ACCESS**: Model proposals pass through Output Validator, Risk Gate, and Patch Allowlist.
5. **FAIL-CLOSED PATH**: `AMBIGUOUS_ABSTAIN` returns zero DOM modifications.
