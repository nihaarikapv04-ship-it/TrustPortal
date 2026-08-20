# Authoritative Contributions Slide Content (`docs/portal-transformer-final-contributions-slide.md`)

> **Contributions Slide Standard**: Summarizes the 5 core scientific research contributions of Portal Transformer.

---

## 1. 5 Core Research Contributions

### **C1 — Security-Constrained AI Remediation Architecture**
- *Mechanism*: Client-side zero-trust execution pipeline preventing AI outputs from directly accessing or mutating the DOM.
- *Evidence*: 1,000 property instances, 0 unsafe mutations.
- *Limitation*: Bounded by local validation rule strictness.

### **C2 — Context-Aware Accessibility Resolution**
- *Mechanism*: Parent container text traversal reasoning to eliminate standalone SVG false alarms.
- *Evidence*: Benchmark v4 false positive rate = 0.0% ($FP=0$).
- *Limitation*: Requires parent text availability.

### **C3 — Confidence-Based Explicit Abstention**
- *Mechanism*: Explicit `AMBIGUOUS_ABSTAIN` state deferring unresolved symbol subtrees to human review.
- *Evidence*: Holdout SVG V3 33.33% abstention rate preserving 100% precision.
- *Limitation*: Reduces defect recall on complex SVGs to 53.85%.

### **C4 — Capability-Limited Patch Engine**
- *Mechanism*: Attribute allowlist restricting writes to `alt`, `aria-label`, and `role`. Navigation `href`/`src` are immutable.
- *Evidence*: 500 security holdout payloads blocked.
- *Limitation*: Cannot repair layout attributes.

### **C5 — Empirical Adversarial Security Validation**
- *Mechanism*: Property-based security testing framework ($N=1,000$) evaluating untrusted AI models and prompt injections.
- *Evidence*: 0.0% Attack Success Rate across 1,000 property cases and 5,000 fuzz runs.
- *Limitation*: Evaluated against local adversarial corpus.
