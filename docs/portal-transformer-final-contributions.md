# Final Research Contribution Hierarchy (C1 - C11) (`docs/portal-transformer-final-contributions.md`)

> **Authoritative Research Contribution Hierarchy**: Defines the 11 scientific research contributions of Portal Transformer.

---

## 1. Contribution Hierarchy

### **C1 — Deterministic Accessibility Defect Detection**
- **Problem**: Missing WAI-ARIA accessible text names on controls lock out screen-reader users.
- **Architectural Solution**: Local DOM scanning heuristics evaluating accessible name rules.
- **Evidence**: `reports/evaluation/benchmark-v4-after-fix.json` ($N=930$).
- **Metric**: Precision = 100.0%, Recall = 100.0%, FPR = 0.0%.
- **Limitation**: Evaluated on synthetic baseline DOM structures.

### **C2 — Context-Aware Accessible-Name Resolution**
- **Problem**: Traditional rules flag standalone icon SVGs as defective even when enclosed in labelled parent controls.
- **Architectural Solution**: Recursive WAI-ARIA 1.2 name computation traversing parent containers.
- **Evidence**: `reports/evaluation/benchmark-v4-after-fix.json` ($N=930$).
- **Metric**: FPR = 0.0% ($FP=0$).
- **Limitation**: Depends on local DOM text availability.

### **C3 — SVG Semantic Resolution**
- **Problem**: Visual icon SVGs lack standard HTML text attributes.
- **Architectural Solution**: Context-aware parent container semantics and SVG child element traversal.
- **Evidence**: `reports/evaluation/svg-benchmark-v3-results.json` ($N=600$).
- **Metric**: Precision = 100.0%, Coverage = 66.67%.
- **Limitation**: Unresolved remote symbol references trigger explicit abstention.

### **C4 — Explicit Confidence-Based Abstention**
- **Problem**: Forcing speculative DOM repairs on ambiguous controls creates false-alarm visual degradation.
- **Architectural Solution**: Fail-closed `AMBIGUOUS_ABSTAIN` state deferring ambiguous subtrees to human review.
- **Evidence**: `reports/evaluation/svg-benchmark-v3-results.json` ($N=600$).
- **Metric**: Abstention Rate = 33.33% ($200 / 600$), Precision = 100.0%.
- **Limitation**: Reduces defect recall on complex SVGs to 53.85%.

### **C5 — AI Zero-Trust Remediation Architecture**
- **Problem**: Granting LLMs direct DOM access introduces XSS, prompt injection, and navigation manipulation risks.
- **Architectural Solution**: Client-side zero-trust execution pipeline placing Output Validators and Patch Engines around untrusted model proposals.
- **Evidence**: `reports/evaluation/property-based-security-results.json` ($N=1,000$).
- **Metric**: Attack Success Rate = 0.0%, Unsafe Mutations = 0.
- **Limitation**: Evaluated against local adversarial corpus.

### **C6 — Privacy-Preserving AI Boundary**
- **Problem**: Context extraction risks transmitting password inputs, OTPs, PINs, or PII to cloud provider endpoints.
- **Architectural Solution**: Target Intersection Privacy Firewall scrubbing sensitive input fields prior to prompt dispatch.
- **Evidence**: `reports/realworld/realworld-summary.json` (20 `.gov.in` Portals).
- **Metric**: Credential Leaks = 0.
- **Limitation**: Relies on attribute regex field pattern matching.

### **C7 — Capability-Limited DOM Mutation**
- **Problem**: Adversarial outputs attempting privilege escalation via script or navigation property writes (`href`, `src`, `onclick`).
- **Architectural Solution**: Attribute write allowlist restricting patches to `alt`, `aria-label`, `aria-labelledby`, `aria-describedby`, `role`.
- **Evidence**: `reports/evaluation/patch-capability-audit-results.json` (12 Forbidden Attributes).
- **Metric**: Forbidden Mutations Allowed = 0.
- **Limitation**: Layout and navigation attributes cannot be modified.

### **C8 — Output Validation and Risk Gating**
- **Problem**: Malicious or malformed JSON responses from LLM endpoints.
- **Architectural Solution**: Dual-layer client-side Output Validator schema checking and non-compensable TSIF Risk Gate scoring.
- **Evidence**: `reports/evaluation/compromised-provider-results.json` ($N=14$).
- **Metric**: Malicious Output Containment = 100.0%.
- **Limitation**: Schema validation rules are client-bound.

### **C9 — TOCTOU-Safe Dynamic DOM Remediation**
- **Problem**: DOM element target replacement or removal between scanning and patching creates TOCTOU race conditions.
- **Architectural Solution**: Live node connectivity verification (`isConnected === true`) and target fingerprint hash check.
- **Evidence**: `reports/evaluation/dynamic-security-results.json` ($N=100$).
- **Metric**: Stale Patches = 0.
- **Limitation**: Microtask timing dependency.

### **C10 — Domain-Specific Safety Adapter Architecture**
- **Problem**: High-risk financial or identity domains require domain-specific safety constraints without polluting generic web rules.
- **Architectural Solution**: Modular domain adapter pattern intercepting proposals between Risk Gate and Patch Engine.
- **Evidence**: `reports/evaluation/upi-security-results.json` ($N=1,500$).
- **Metric**: Invariant `AI_CRITICAL_MUTATION_AUTHORITY = 0`.
- **Limitation**: Domain adapters must be authored per high-risk domain.

### **C11 — UPI Transaction Safety Adapter**
- **Problem**: AI models modifying payment amounts, recipient UPI IDs, or authorization states during financial remediation.
- **Architectural Solution**: Isolated `UpiTransactionSafetyAdapter` enforcing zero AI transaction mutation authority.
- **Evidence**: `reports/evaluation/upi-security-results.json` ($N=1,500$).
- **Metric**: Unsafe Transaction Mutations = 0, Amount Mutations = 0, Recipient Mutations = 0.
- **Limitation**: Results are benchmark-scoped to the 1,500-case parameter corpus.
