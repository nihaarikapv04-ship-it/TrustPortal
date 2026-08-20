# 5-Minute Master Viva Defense Script (`docs/portal-transformer-five-minute-viva.md`)

> **Viva Oral Answer Script**: Spoken script structured for the 5-minute project introduction at the start of an oral viva defense.

---

## 1. Spoken Script (5 Minutes / ~750 Words)

### **1. Problem Statement (30 seconds)**
"Good morning, members of the examination committee. Over 70% of public service web portals fail WCAG 2.1 accessibility standards, primarily due to unlabelled buttons, missing image alt text, and decorative SVG graphics. While screen-reader users rely on computable accessible names, static accessibility tools like axe-core can only flag defects—they cannot infer the semantic intent of visual icons without natural language comprehension."

### **2. Research Gap (30 seconds)**
"Generative AI and Large Language Models provide the contextual reasoning required to infer unlabelled element intent. However, introducing AI directly into the browser DOM creates a major cybersecurity hazard: prompt injection embedded in page text can trick models into executing XSS payloads, exfiltrating passwords, or modifying navigation links like `href` or form `action` destinations."

### **3. Proposed Solution (60 seconds)**
"My dissertation presents **Portal Transformer**, a zero-trust, security-constrained client-side accessibility remediation architecture. Portal Transformer treats both page DOM content and AI provider proposals as untrusted inputs. It isolates credentials via a Privacy Firewall, computes accessible names using WAI-ARIA 1.2 rules, and returns an explicit `AMBIGUOUS_ABSTAIN` state when symbol definitions are incomplete. Client-side Output Validators filter script payloads, while a capability-limited Patch Engine restricts DOM writes strictly to `alt`, `aria-label`, and `role`. Navigation attributes remain immutable."

### **4. Security Architecture (60 seconds)**
"To prevent dynamic DOM race conditions, Portal Transformer enforces TOCTOU target fingerprinting, verifying node connectivity before patching. Even if an AI provider is fully compromised and returns malicious JSON payloads, client-side security boundaries validate the proposal, guaranteeing that untrusted model outputs can never trigger unauthorized DOM mutations."

### **5. Experimental Evaluation (60 seconds)**
"I evaluated Portal Transformer across synthetic benchmarks ($N=930$), holdout SVG subtrees ($N=600$), 20 real-world Indian government portals (`.gov.in`, $N_{\text{DOM}}=1,700$), and 1,000 property-based cybersecurity attack instances. On real-world reviewed samples, the system achieved 100.0% precision ($FP=0$) and 77.78% defect recall with a 10.0% explicit abstention rate. Across 1,000 property test cases, 500 holdout payloads, and 5,000 deterministic fuzz cases, the system achieved a 0.0% attack success rate and zero unsafe mutations."

### **6. Primary Contribution & Acknowledged Limitations (60 seconds)**
"The central contribution of this research is demonstrating that client-side AI accessibility remediation can achieve 90.0% real-world coverage while maintaining a strict zero-unsafe-mutation security constraint. I explicitly acknowledge limitations: NVDA and TalkBack audio announcement testing was conducted via DOM accessibility-tree semantic state tracking due to headless CLI environments, and latency microbenchmarks utilized local mock provider infrastructure. Thank you, and I look forward to your questions."
