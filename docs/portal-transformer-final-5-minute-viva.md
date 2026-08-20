# 5-Minute Final Viva Presentation Script (`docs/portal-transformer-final-5-minute-viva.md`)

> **5-Minute Viva Guide**: Detailed oral script structured into 6 timed sections with diagram, metric, and limitation cues.

---

## 1. Timed Script & Visual Cues

### **0:00 - 0:30: Problem Statement**
- *What to Say*: "Members of the committee, WCAG 2.1 SC 1.1.1 requires all non-text content to have accessible text alternatives. Over 70% of public portals lack accessible names, locking out screen-reader users."
- *Diagram to Show*: Slide 2 (Unlabelled icon button screenshot).
- *Metric to Mention*: 70%+ defect rate in public portals.
- *What NOT to Claim*: Do not claim static rules solve accessibility.

### **0:30 - 1:00: Research Gap**
- *What to Say*: "Generative AI provides contextual reasoning to repair unlabelled controls. However, untrusted DOM text can trigger prompt injection, injecting XSS payloads or stealing passwords."
- *Diagram to Show*: Slide 4 (Prompt injection attack vector diagram).
- *Metric to Mention*: Security threat surface of browser extensions.
- *What NOT to Claim*: Do not claim unconstrained AI is safe.

### **1:00 - 2:00: System Architecture**
- *What to Say*: "Portal Transformer enforces a zero-trust execution pipeline. A Privacy Firewall scrubs sensitive fields, while model outputs are filtered by client-side Output Validators and capability allowlists."
- *Diagram to Show*: Slide 7 (ASCII System Architecture Flowchart).
- *Metric to Mention*: 13 architectural client-side subsystems.
- *What NOT to Claim*: Do not claim AI directly modifies the DOM.

### **2:00 - 3:00: Security Model & Controls**
- *What to Say*: "Attribute writes are strictly allowlisted to `alt`, `aria-label`, and `role`. Navigation attributes like `href` or script handlers like `onclick` are rejected."
- *Diagram to Show*: Slide 9 (Capability Allowlist Matrix).
- *Metric to Mention*: 5 allowed vs 12 forbidden attributes.
- *What NOT to Claim*: Do not claim universal security against OS/V8 zero-days.

### **3:00 - 4:00: Experimental Results**
- *What to Say*: "Evaluated across 930 synthetic cases, 600 holdout SVGs, 20 public portals, and 1,000 security property instances. On real-world reviewed samples, precision was 100.0% ($FP=0$) and recall was 77.78%."
- *Diagram to Show*: Slide 13 (Master Results Table).
- *Metric to Mention*: 100% Precision, 0.0% Attack Success Rate.
- *What NOT to Claim*: Do not combine synthetic and real-world datasets into one average.

### **4:00 - 4:30: Live Demonstration**
- *What to Say*: "In our live automated demo (`npm run demo:portal-transformer`), 10 scenarios execute locally with zero network dispatches, demonstrating safe remediation and security rejections."
- *Diagram to Show*: Slide 17 (Live Demo Console screenshot).
- *Metric to Mention*: 0 network requests dispatched.
- *What NOT to Claim*: Do not claim live cloud provider latency was measured.

### **4:30 - 5:00: Contributions & Limitations**
- *What to Say*: "The primary contribution is establishing security-constrained AI remediation. Limitations include headless CLI screen-reader testing boundaries and abstention on unresolved SVG symbols. Thank you."
- *Diagram to Show*: Slide 16 (Contributions & Limitations table).
- *Metric to Mention*: 33.33% SVG abstention rate preserving 100% precision.
- *What NOT to Claim*: Do not claim live human usability was evaluated.
