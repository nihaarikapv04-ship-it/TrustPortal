# TrustPortal Security Invariants (`docs/security-invariants.md`)

This document defines the **15 Non-Negotiable Security Invariants** of the TrustPortal / TSIF architecture. All components and tests MUST strictly enforce these invariants.

---

### Invariant 1 — Attribute Confinement
TrustPortal may modify **ONLY** the following allowlisted attributes:
- `alt`
- `aria-label`
- `aria-labelledby`
- `aria-describedby`

No other attribute may be added, modified, or deleted by any patch under any circumstance.

---

### Invariant 2 — No Navigation Mutation
TrustPortal must **NEVER** modify navigation attributes: `href`, `src`, `action`, `method`, `target`.

---

### Invariant 3 — No Executable Mutation
TrustPortal must **NEVER** modify executable or styling attributes (`onclick`, `on*`, `style`, `innerHTML`, `outerHTML`) or inject executable `<script>` blocks into the DOM.

---

### Invariant 4 — No Sensitive-Data Transmission
Passwords, OTPs, CVV/credit card numbers, Aadhaar/PAN/SSN numbers, tokens, session IDs, cookies, and sensitive input values must **NEVER** enter remote inference context.

---

### Invariant 5 — Page Content is Untrusted Data
Text from web pages can **NEVER**:
- Change policy configuration
- Select an AI model, provider, or URL endpoint
- Invoke a tool or execute code
- Grant privileges or alter security thresholds

---

### Invariant 6 — Model Output is Untrusted
All model proposals must pass independent deterministic label validation (`OutputValidator`) and evidence verification before use.

---

### Invariant 7 — Model Confidence is Not Authorization
A raw model confidence score of `0.99` must **NEVER** bypass policy gates or automatically authorize a DOM modification without Trust Engine evaluation.

---

### Invariant 8 — High-Impact Workflows Never Auto-Apply
Proposals on high-impact workflow categories (`authentication`, `payment`, `identity`, `health`, `tax`, `legal`, `benefits`) must **NEVER** receive `decision: "auto"`, regardless of trust score.

---

### Invariant 9 — Stale Targets Cannot Be Patched
Any DOM modification to the target element (tag, role, ID, attributes, or removal) after detection invalidates the proposal and MUST result in patch rejection (`stale`).

---

### Invariant 10 — Revert Cannot Overwrite Newer Changes
If an external script modifies a target attribute after TrustPortal applies a patch, `revertPatch()` MUST yield (`conflict`) and **NEVER** overwrite the external modification.

---

### Invariant 11 — UI Cannot Bypass PatchApplicator
The confirmation UI must **NEVER** mutate DOM attributes directly (e.g. `element.setAttribute(...)`). All DOM mutations MUST go through `PatchApplicator.applyPatch()`.

---

### Invariant 12 — Untrusted Messages Cannot Invoke Privileged Operations
Malformed, unauthorized, or forged web page messages (`window.postMessage`) must **NEVER** trigger DOM patches, network requests, or policy modifications.

---

### Invariant 13 — No Arbitrary Network Destination
Page content can **NEVER** specify, alter, or override API endpoints, URLs, or network transmission destinations.

---

### Invariant 14 — No Raw HTML Rendering
Model-generated text, evidence quotes, and rationale strings must **NEVER** be rendered using `innerHTML`. All string rendering MUST use safe DOM text nodes (`textContent`).

---

### Invariant 15 — Fail-Closed (Deny-by-Default)
Any unknown, malformed, ambiguous, expired, or unsupported state must issue an immediate **DENY** / **REJECT** decision.
