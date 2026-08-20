# Thesis Defense Presentation Outline (`docs/thesis-presentation-outline.md`)

---

### Slide 1: Title & Overview
- **Title**: Portal Transformer: AI-Assisted Real-Time Accessibility Remediation for Public-Service Web Portals
- **Key Points**: Security-constrained, privacy-bounded client-side DOM remediation architecture.
- **Visual**: Title slide with project logo & monorepo architecture diagram reference.
- **Speaker Notes**: Good morning committee members. Today I present Portal Transformer, a browser extension framework investigating security-constrained AI accessibility remediation.

---

### Slide 2: The Problem
- **Title**: Public Web Portal Accessibility Barriers
- **Key Points**: Millions of public portal elements lack accessible alt text, button names, or form labels, blocking screen reader users.
- **Visual**: Screenshot of an unlabelled icon button on a government portal.
- **Speaker Notes**: Public service portals frequently contain accessibility defects that prevent citizens with vision impairments from accessing public welfare services.

---

### Slide 3: Motivation & Digital Inclusion
- **Title**: WCAG Compliance Gaps in Public Services
- **Key Points**: Manual remediation is slow; unconstrained automated tools create security risks.
- **Visual**: Comparison table of manual authoring vs automated overlays.
- **Speaker Notes**: Manual remediation of vast public web properties is cost-prohibitive, yet current automated overlays inject insecure scripts into client DOMs.

---

### Slide 4: Research Gap & Threat Model
- **Title**: Security Risks of AI Web Remediation
- **Key Points**: AI models can generate XSS payloads, succumb to prompt injection, or leak passwords.
- **Visual**: Diagram showing DOM hijacking attack vectors.
- **Speaker Notes**: Unconstrained AI tools given DOM access can be manipulated via prompt injection or output malicious script tags.

---

### Slide 5: Research Questions
- **Title**: Core Research Questions (RQ1–RQ6)
- **Key Points**: RQ1 Detection, RQ2 Quality, RQ3 Latency, RQ4 Security, RQ5 Privacy, RQ6 Dynamic DOM.
- **Visual**: Structured 6-box matrix of RQs.
- **Speaker Notes**: Our investigation is guided by six primary research questions evaluating detection accuracy, label quality, latency, security, privacy, and dynamic DOM behavior.

---

### Slide 6: Proposed Architecture
- **Title**: Three-Subsystem Architecture
- **Key Points**: (1) DOM Interceptor, (2) Cloud Inference Relay, (3) Hardened Patch Engine.
- **Visual**: Diagram referencing Figure 1.
- **Speaker Notes**: We propose a three-subsystem framework decoupling detection, privacy-bounded inference, and allowlisted DOM mutation.

---

### Slide 7: Subsystem 1 — DOM Interceptor
- **Title**: Deterministic Detection & Exclusions
- **Key Points**: Computes WCAG accessible names; excludes decorative and hidden elements.
- **Visual**: Code snippet of `DeterministicDetector.scan()`.
- **Speaker Notes**: Deterministic scanning computes WCAG accessible names using static rules before any network request is initiated.

---

### Slide 8: Subsystem 2 — Security & Privacy Architecture
- **Title**: Privacy Firewall & Output Validator
- **Key Points**: Credential denial, PII redaction, XSS filtering, attribute allowlisting.
- **Visual**: Dataflow diagram from raw DOM to SafeContext to AI to Validator.
- **Speaker Notes**: The Privacy Firewall denies sensitive credential inputs while the Output Validator isolates untrusted model proposals.

---

### Slide 9: Subsystem 3 — Semantic Injection Module
- **Title**: Hardened Reversible Patch Engine
- **Key Points**: Allows `alt`, `aria-label`, `role`; forbids `href`, `onclick`, `src`; yields on DOM reclaim.
- **Visual**: Table of allowed vs strictly forbidden attributes.
- **Speaker Notes**: Mutations are strictly restricted to accessibility attributes and support 100% reversible undo.

---

### Slide 10: Experimental Methodology
- **Title**: Reproducible Evaluation Benchmark
- **Key Points**: $N = 250$ element benchmark, $N = 9$ security attack vectors, $N = 100$ latency runs.
- **Visual**: Summary graphic of benchmark composition.
- **Speaker Notes**: We evaluated Portal Transformer on a synthetic benchmark of 250 elements and 9 adversarial attack categories.

---

### Slide 11: Quantitative Results (RQ1–RQ3)
- **Title**: Detection, Quality & Latency Performance
- **Key Points**: $F_1 = 1.000$, $100.0\%$ AI semantic quality, $0.023\text{ ms}$ mean total latency.
- **Visual**: Bar chart of detection precision/recall and latency breakdown.
- **Speaker Notes**: Results demonstrate perfect detection accuracy on the benchmark, 100% label quality, and sub-millisecond client-side latency.

---

### Slide 12: Security & Privacy Results (RQ4–RQ5)
- **Title**: 100% Security Rejection & Zero Credential Leakage
- **Key Points**: $0.0\%$ attack success rate ($9/9$ blocked), $0$ credentials leaked.
- **Visual**: Rejection rate chart referencing Figure 8.
- **Speaker Notes**: All 9 adversarial attacks were blocked, and zero raw passwords or OTPs were transmitted to the AI layer.

---

### Slide 13: Baseline Comparison & Ablation Study
- **Title**: Component Ablation Findings
- **Key Points**: Removing Privacy Firewall exposes credentials; removing Output Validator allows XSS.
- **Visual**: Stacked bar chart of ablation impact referencing Figure 6.
- **Speaker Notes**: Ablation tests confirm that every safety layer is necessary to maintain security containment.

---

### Slide 14: Limitations & Validity Boundaries
- **Title**: Threats to Validity
- **Key Points**: Local mock provider latency; human screen-reader usability is NOT YET EVALUATED.
- **Visual**: Validity boundary box.
- **Speaker Notes**: We explicitly note that real cloud network latency and human screen-reader usability studies remain for future evaluation.

---

### Slide 15: Conclusion & Research Contribution
- **Title**: Summary of Contributions
- **Key Points**: Security-constrained AI remediation framework proven feasible under bounded conditions.
- **Visual**: Final thesis contribution summary.
- **Speaker Notes**: In conclusion, Portal Transformer establishes that AI web remediation can be executed safely within strict client-side security and privacy bounds. Thank you.
