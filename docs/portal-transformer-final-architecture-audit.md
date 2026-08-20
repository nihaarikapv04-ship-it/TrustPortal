# Master Runtime Architecture Audit (`docs/portal-transformer-final-architecture-audit.md`)

> **Runtime Architecture Audit**: Detailed documentation of all 13 monorepo architectural layers, browser extension isolated world boundaries, and client-side zero-trust security components.

---

## 1. ASCII System Architecture Flowchart

```text
                        Browser Web Page (Untrusted DOM)
                                     │
                                     ▼
                     MutationObserver (DOM Observer)
                                     │
                                     ▼
                    Deterministic Accessibility Detector
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
  Accessible-Name Resolver                           SvgSemanticResolver
 (WAI-ARIA 1.2 Computation)                     (Parent Context Traversal)
           │                                                   │
           └─────────────────────────┬─────────────────────────┘
                                     ▼
                          Candidate Generation
                                     │
                                     ▼
                        Target Intersection Firewall
                            (Privacy Redaction)
                                     │
                                     ▼
                        AI Provider / LLM Boundary
                            (Untrusted Component)
                                     │
                                     ▼
                             Output Validator
                           (XSS & Tag Regex Check)
                                     │
                                     ▼
                              TSIF Risk Gate
                        (Non-Compensable Risk Check)
                                     │
                                     ▼
                      Capability-Limited Patch Engine
                   (Attribute Write Allowlist ONLY)
                                     │
                                     ▼
                           TOCTOU Verification
                    (Node Connectivity & Fingerprint)
                                     │
                                     ▼
                     Safe Remediation DOM Patch
```

---

## 2. Architectural Subsystem Inventory

- **Detection Layer**: [`packages/rules/src/detector.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/rules/src/detector.ts)
- **Accessible-Name Resolver**: [`packages/rules/src/acc_name.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/rules/src/acc_name.ts)
- **SVG Semantic Resolver**: [`packages/rules/src/svg_resolver.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/rules/src/svg_resolver.ts)
- **Privacy Firewall**: [`packages/redaction/src/firewall.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/redaction/src/firewall.ts)
- **SafeContext Extractor**: [`packages/redaction/src/extractor.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/redaction/src/extractor.ts)
- **Output Validator**: [`apps/api/src/services/validator.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/apps/api/src/services/validator.ts)
- **TSIF Risk Gate**: [`packages/scoring/src/risk_gate.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/scoring/src/risk_gate.ts)
- **Patch Engine**: [`apps/extension/src/patcher.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/apps/extension/src/patcher.ts)
