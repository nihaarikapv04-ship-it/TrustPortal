# 7-Minute Master Demonstration Script (`docs/portal-transformer-final-demo-script.md`)

> **7-Minute Demo Walkthrough Script**: Timed 7-minute demonstration script using deterministic local mock provider fixtures (`npm run demo:portal-transformer`). Zero live network dispatches.

---

## 1. Timed Demonstration Agenda

### **0:00 – 0:45: Problem Statement**
- *Action*: Display unlabelled icon button `<button><svg></svg></button>` on demo page.
- *Spoken Script*: "Over 70% of public web portals fail WCAG 2.1 SC 1.1.1 due to missing accessible names. Here is an unlabelled icon button: a screen-reader announces this merely as 'unlabelled button'."

### **0:45 – 1:30: Framework Architecture Overview**
- *Action*: Display architecture diagram panel.
- *Spoken Script*: "Portal Transformer is an AI-assisted, security-constrained accessibility remediation framework deployed as a Chrome extension. Notice that AI model output never directly mutates the DOM—it passes through Output Validation and Patch Allowlist filters."

### **1:30 – 2:30: Accessibility Defect Detection & Remediation**
- *Action*: Execute candidate scan (`CASE-01`). Display remediation panel.
- *Spoken Script*: "The detector identifies the missing label. Context extraction retrieves parent text, and the engine safely patches `aria-label='Download report'`. The accessible name is now fully resolved."

### **2:30 – 3:30: Untrusted AI Proposal & Security Rejection**
- *Action*: Trigger malicious AI output (`CASE-10`, proposal containing `onclick="alert(1)"`).
- *Spoken Script*: "Now consider an untrusted AI proposal attempting an XSS payload or attribute write to `onclick`. `LocalOutputValidator` and `LocalPatchEngine` intercept the proposal, returning an immediate security rejection. The DOM remains unmodified."

### **3:30 – 4:30: SVG Ambiguity & Explicit Abstention**
- *Action*: Trigger unresolved SVG symbol scenario (`CASE-09`). Display `ABSTAINED` panel.
- *Spoken Script*: "When an SVG references a remote symbol sheet lacking local definitions, the system returns `AMBIGUOUS_ABSTAIN`. It defers to human review rather than executing a speculative DOM mutation, preserving 100% precision."

### **4:30 – 5:15: UPI Financial Transaction Safety Adapter**
- *Action*: Trigger UPI transaction case (`CASE-UPI`). Display UPI Security Panel.
- *Spoken Script*: "In UPI mode, the adapter enforces zero AI transaction mutation authority. Proposals attempting to alter payment amounts, recipient UPI IDs, or expose PINs are blocked immediately (`UPI_TRANSACTION_FIELD_BLOCK`)."

### **5:15 – 6:00: Empirical Results & Reproducibility Audit**
- *Action*: Display Results Dashboard (`npm run audit:portal-transformer-reproducibility`).
- *Spoken Script*: "Across 1,000 security property cases and 1,500 UPI benchmark cases, zero unsafe mutations occurred. 3 independent runs return identical candidate counts (`700, 700, 700`)."

### **6:00 – 6:40: System Limitations**
- *Action*: Display Limitations Panel.
- *Spoken Script*: "We explicitly state our limitations: NVDA and TalkBack audio announcements were evaluated via DOM accessibility-tree semantic state tracking, local mock provider latency was measured, and UPI results are benchmark-scoped."

### **6:40 – 7:00: Conclusion**
- *Action*: Display final readiness summary.
- *Spoken Script*: "Portal Transformer proves that client-side AI accessibility remediation can achieve high coverage safely when constrained by zero-trust security boundaries. Thank you."
