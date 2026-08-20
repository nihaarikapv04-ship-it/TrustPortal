# Master 50 Examiner Viva Questions & Precise Answers (`docs/portal-transformer-final-viva.md`)

> **Viva Preparation Pack**: 50 questions grouped into Categories A through J with concise, technically precise answers ($\le 120$ words each).

---

## Category A: Problem & Motivation (Questions 1-5)

### **Q1: Why use AI at all if deterministic rules work?**
Deterministic rules excel at detecting missing accessible names, but cannot generate contextual text descriptions for unlabelled icons or complex visual assets. Generative AI provides natural language comprehension to infer element intent from surrounding DOM context.

### **Q2: What does AI actually contribute to the architecture?**
AI contributes semantic context reasoning—transforming unlabelled `<button><svg></svg></button>` elements into meaningful accessible names (e.g., `"Download report"`) without hardcoding static selectors per web page.

### **Q3: Why is the browser extension not the main research contribution?**
The browser extension is merely the deployment layer. The primary research contribution is the security-constrained remediation architecture and its domain-adapter safety model.

### **Q4: What problem does the zero-trust model solve?**
Unconstrained AI in the browser DOM creates security threats including prompt injection, XSS, and credential theft. Zero-trust validation ensures untrusted model outputs cannot execute unauthorized DOM mutations.

### **Q5: Why focus on public service portals (.gov.in)?**
Public service portals serve diverse populations, contain high WCAG defect rates, and feature critical identity and financial workflows requiring strict privacy bounds.

---

## Category B: System Architecture (Questions 6-10)

### **Q6: How does the capability-limited patch engine work?**
`LocalPatchEngine` enforces an attribute allowlist (`alt`, `aria-label`, `aria-labelledby`, `aria-describedby`, `role`), making navigation attributes (`href`, `src`, `action`) and script attributes (`onclick`) strictly immutable.

### **Q7: What happens if the AI provider is compromised?**
All model responses pass through client-side Output Validators, Risk Gates, and Patch Allowlists. Malicious JSON outputs containing scripts or forbidden attributes are rejected client-side before DOM injection.

### **Q8: How is prompt injection prevented from leaking passwords?**
Target Intersection Privacy Firewall scrubbed sensitive input fields (passwords, OTPs, PINs, PII) prior to context extraction, ensuring secrets never enter the AI prompt context.

### **Q9: How does TOCTOU target verification work?**
Before applying a patch, `LocalPatchEngine` verifies live node connectivity (`isConnected === true`) and checks target fingerprint hashes to prevent stale node mutation race conditions.

### **Q10: How is DOM clobbering prevented?**
`SafeDOMRef` retrieves element properties via `Object.prototype` reflection to prevent overridden element `id` or `name` global properties from hijacking lookups.

---

## Category C: Accessibility & SVG Resolution (Questions 11-15)

### **Q11: Why is SVG accessibility difficult?**
SVG subtrees often lack standard HTML text attributes and may be enclosed inside parent controls that already possess accessible names, creating false-positive detection traps.

### **Q12: How does context-aware SVG resolution eliminate false positives?**
`SvgSemanticResolver` checks parent container attributes before evaluating nested SVGs. If the parent control already has an accessible name, the nested SVG is marked valid.

### **Q13: Why did recall fall to 53.85% on Holdout SVG V3?**
The resolver returned `AMBIGUOUS_ABSTAIN` on 200 unresolved external symbol subtrees lacking local definitions, choosing safety over speculative mutation to preserve 100% precision.

### **Q14: Why is explicit abstention necessary?**
Abstention prevents the system from executing speculative, potentially incorrect DOM mutations on complex or ambiguous controls, ensuring zero false-alarm visual degradation.

### **Q15: How are placeholder-only inputs handled?**
Placeholder text is evaluated as a fallback, but unlabelled inputs generate candidate defects requesting explicit form label remediation.

---

## Category D: AI Security & Boundaries (Questions 16-20)

### **Q16: Can an AI proposal modify an element's `href`?**
No. `href` is excluded from the capability allowlist. Any AI proposal attempting to modify `href` returns an immediate security rejection.

### **Q17: Why is 0% attack success not proof of universal security?**
Security boundaries are evaluated against a finite adversarial corpus ($N=1,000$). Universal security is unclaimable; results characterize performance on tested property instances.

### **Q18: What is the TSIF Risk Gate?**
TSIF Risk Gate evaluates non-compensable risk scores based on candidate criticality and proposal confidence, rejecting proposals exceeding risk thresholds.

### **Q19: How does the Output Validator filter malicious code?**
`LocalOutputValidator` inspects JSON string fields using regex tag filters, rejecting proposals containing `<script>` tags, control characters, or HTML elements.

### **Q20: Are extension-origin network dispatches permitted?**
No extension-origin network dispatches occurred during remediation; extraction context is scrubbed locally.

---

## Category E: UPI Transaction Safety Extension (Questions 21-25)

### **Q21: What is the UPI Transaction Safety Adapter?**
An isolated domain-specific security layer intercepting proposals between the Risk Gate and Patch Engine during `UPI_FINANCIAL` mode to prevent transaction mutations.

### **Q22: Why can AI proposals never mutate transaction-critical fields?**
AI models are untrusted components. Allowing AI to alter payment amounts, recipient UPI IDs, or authorization states would create severe financial fraud vulnerabilities.

### **Q23: How does the UPI adapter prevent amount alteration?**
The policy extracts financial amounts from trusted DOM text and compares them against proposed label text, rejecting proposals that alter amount values.

### **Q24: What happens if an AI proposal attempts to expose a PIN or OTP?**
The policy classifies PIN/OTP fields as critical credentials, triggering an immediate `UPI_AUTH_FIELD_BLOCK` rejection.

### **Q25: Why are UPI security results classified as benchmark-scoped?**
Evaluated on a 1,500-case corpus comprising 20 structural templates and 1,480 parameterized variants. Results characterize the tested corpus, not independent generalization.

---

## Category F: Experimental Methodology (Questions 26-30)

### **Q26: What datasets were evaluated?**
Synthetic Benchmark v4 ($N=930$), Holdout SVG V3 ($N=600$), Real-World `.gov.in` ($N=100$), Security Property Suite ($N=1,000$), and UPI Suite ($N=1,500$).

### **Q27: Why use synthetic benchmarks?**
Synthetic benchmarks isolate specific structural ARIA edge cases under controlled, reproducible conditions.

### **Q28: How was real-world `.gov.in` evaluation conducted?**
Evaluated across 20 Indian government portals ($N_{\text{DOM}}=1,700$), with a reviewed sample of 100 elements.

### **Q29: How was 3-run reproducibility verified?**
Executed the benchmark sequence 3 times under seed `0x41434345`, verifying identical candidate counts (`700, 700, 700`).

### **Q30: What is the local microbenchmark remediation latency?**
Mean client-side remediation latency was 0.0123 ms ($P_{95} = 0.0236\text{ ms}$) evaluated using local mock infrastructure.

---

## Category G: Metrics & Trade-offs (Questions 31-35)

### **Q31: What is the Pareto optimal trade-off frontier?**
Achieving zero unsafe DOM mutations ($\text{Unsafe Mutation Rate} = 0.0\%$) caps real-world coverage at 90.0% with a 10.0% explicit abstention rate.

### **Q32: Why not combine all benchmark metrics into one average?**
Each benchmark measures distinct structural scopes; combining them would create a misleading statistical composite.

### **Q33: What was the real-world reviewed sample recall?**
Recall was 77.78% ($TP=35, FN=10$), reflecting conservative safety filtering over aggressive coverage.

### **Q34: What was the Holdout SVG V3 precision?**
Precision was 100.0% ($FP=0$), preserved by a 33.33% explicit abstention rate on unresolved symbols.

### **Q35: What was the observed Attack Success Rate (ASR)?**
0.0% ASR across 1,000 property instances, 500 holdouts, 5,000 fuzz cases, and 1,500 UPI cases.

---

## Category H: Threats to Validity (Questions 36-40)

### **Q36: What is the main internal validity threat?**
Benchmark fitting on synthetic fixtures. Mitigated via independent holdout benchmarks ($N=600$ SVG, $N=500$ security holdout).

### **Q37: What is the main external validity threat?**
Restricted real-world sample scope (20 `.gov.in` portals). Cannot establish generalization to all global websites.

### **Q38: Why was NVDA spoken audio not evaluated?**
Headless CLI environments lack audio output dispatchers. Evaluated via DOM accessibility-tree semantic state tracking.

### **Q39: Was TalkBack mobile audio evaluated?**
No. TalkBack mobile audio evaluation was NOT EVALUATED due to headless test environment limits.

### **Q40: Was a human usability study conducted?**
No. Human-subject usability studies were NOT EVALUATED (no IRB participant trial conducted).

---

## Category I: System Limitations (Questions 41-45)

### **Q41: What is the biggest architectural limitation?**
Abstention on complex SVG symbol graphs lacking local definitions, which reduces defect recall to preserve safety.

### **Q42: Can the system guarantee financial transaction safety?**
No. Universal financial security is unclaimable; safety was verified empirically against the evaluated benchmark.

### **Q43: What happens if an input field uses custom obfuscated names?**
An un-regexed sensitive field could evade Privacy Firewall scrubbing. Mitigated by continuous allowlist pattern updates.

### **Q44: Was live cloud API network latency measured?**
No. Evaluated using local deterministic mock infrastructure; live cloud provider RTT remains unevaluated.

### **Q45: Can AI modify layout attributes?**
No. Attribute allowlists restrict writes strictly to accessibility attributes (`alt`, `aria-label`, `role`).

---

## Category J: Future Work (Questions 46-50)

### **Q46: What are the primary future research directions?**
Live cloud provider API latency profiling, IRB-approved blind user usability studies, and live NVDA/TalkBack spoken audio testing.

### **Q47: How can SVG symbol resolution be improved?**
By building cross-origin symbol graph caching to resolve remote SVG sprite sheet references safely.

### **Q48: How can domain safety adapters be extended?**
By authoring domain policy adapters for healthcare, e-commerce, and identity management portals.

### **Q49: How can sensitive field detection be enhanced?**
By combining regex attribute filters with local lightweight ML field classification models.

### **Q50: What is the ultimate takeaway of Portal Transformer?**
AI-assisted web accessibility remediation can achieve high coverage safely when constrained by client-side zero-trust security boundaries.
