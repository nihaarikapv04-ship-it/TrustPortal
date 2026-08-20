# 50 Viva Questions & Comprehensive Technical Answers (`docs/portal-transformer-final-viva-50.md`)

> **Viva Master Guide**: 50 questions across 8 categories (A through H) formatted with SHORT ANSWER, TECHNICAL ANSWER, EVIDENCE, and LIMITATION.

---

## Category A: Problem & Motivation (Questions 1-5)

### **Q1: Why is AI required for web accessibility remediation?**
- **SHORT ANSWER**: Static rule engines flag missing accessible names but cannot infer contextual text for visual icons without natural language comprehension.
- **TECHNICAL ANSWER**: Static tools evaluate deterministic DOM attributes. However, when an icon button lacks text nodes or ARIA labels, natural language comprehension is required to infer element intent from surrounding headings, parent containers, and sibling text.
- **EVIDENCE**: Benchmark v4 ($N=930$), Precision = 100.0%.
- **LIMITATION**: AI introduces prompt injection and XSS security risks.

---

## Category B: Accessibility (Questions 6-12)

### **Q6: How does context-aware SVG resolution eliminate false positives?**
- **SHORT ANSWER**: Traverses parent container attributes to check if the parent element already provides an accessible name before evaluating nested SVGs.
- **TECHNICAL ANSWER**: Standalone SVG elements inside `<button aria-label="Search"><svg></svg></button>` appear defective when evaluated independently. `SvgSemanticResolver` checks parent container labels, marking nested SVGs as valid and eliminating false alarms.
- **EVIDENCE**: Benchmark v4 False Positive Rate = 0.0% ($FP=0$).
- **LIMITATION**: Requires parent text or attributes to be present in the local DOM subtree.

---

## Category C: AI Architecture (Questions 13-18)

### **Q13: Why is the AI provider treated as untrusted?**
- **SHORT ANSWER**: LLMs are susceptible to prompt injection, model jailbreaks, and adversarial outputs that could execute malicious scripts if injected into the DOM.
- **TECHNICAL ANSWER**: In a zero-trust model, all external data providers are untrusted. Portal Transformer validates AI responses through client-side JSON schema checking, Output Validator tag filtering, and Patch Engine allowlists before modifying the DOM.
- **EVIDENCE**: Compromised AI Provider Test ($N=14$), 100.0% contained.
- **LIMITATION**: Validation relies on client-side regex rules.

---

## Category D: Security (Questions 19-30)

### **Q19: How does capability-limited patching prevent navigation hijacking?**
- **SHORT ANSWER**: The Patch Engine enforces a strict attribute allowlist (`alt`, `aria-label`, `role`), making `href`, `src`, and `action` immutable.
- **TECHNICAL ANSWER**: Even if an attacker controls prompt context or AI outputs, `LocalPatchEngine` rejects any property mutation outside the allowlist. Attempts to write `href` or `action` return security rejections.
- **EVIDENCE**: 500 Security Holdout Payloads, 500/500 blocked.
- **LIMITATION**: Cannot repair broken navigation links.

---

## Category E: Experimental Methodology (Questions 31-38)

### **Q31: What is the purpose of the 1,000-instance security property suite?**
- **SHORT ANSWER**: Evaluates system security properties (P1-P10) across 1,000 synthetic adversarial instances to measure attack success and unsafe mutation rates.
- **TECHNICAL ANSWER**: Defines 10 formal security properties (e.g., P1 credential isolation, P2 navigation protection, P4 capability allowlist) and tests the pipeline against 1,000 adversarial payloads.
- **EVIDENCE**: `reports/evaluation/property-based-security-results.json` ($N=1,000$).
- **LIMITATION**: Tested against synthetic adversarial corpus.

---

## Category F: Results & Statistics (Questions 39-43)

### **Q39: Why does Holdout SVG V3 report 53.85% recall?**
- **SHORT ANSWER**: The resolver returned `AMBIGUOUS_ABSTAIN` on 200 unresolved external symbol subtrees, choosing safety over speculative mutation.
- **TECHNICAL ANSWER**: On Holdout SVG V3 ($N=600$), 200 elements referenced remote sprite sheets lacking local definitions. Rather than applying guessed labels, the system abstained, preserving 100.0% precision ($FP=0$).
- **EVIDENCE**: `reports/evaluation/svg-benchmark-v3-results.json` ($N=600$).
- **LIMITATION**: Reduces defect recall on complex SVG structures.

---

## Category G: Limitations (Questions 44-47)

### **Q44: Why was NVDA spoken audio announcement quality not tested live?**
- **SHORT ANSWER**: Evaluated inside a headless CLI environment without audio dispatcher capabilities; measured via DOM accessibility-tree state tracking.
- **TECHNICAL ANSWER**: Headless macOS/Linux terminal test runners lack audio output devices required to evaluate NVDA or TalkBack speech synthesis. Accessibility state changes were verified by measuring DOM accessibility-tree attribute mutations.
- **EVIDENCE**: `reports/screen-reader/accessibility-state-before-after.json` ($N=425$).
- **LIMITATION**: Spoken audio pronunciation quality remains unevaluated.

---

## Category H: Future Work (Questions 48-50)

### **Q48: What would you test next with unlimited research funding?**
- **SHORT ANSWER**: Live Cloud API round-trip latency, IRB-approved human usability studies, and live NVDA/TalkBack spoken audio announcement verification.
- **TECHNICAL ANSWER**: Future research should deploy the browser extension to a live cloud LLM endpoint to measure network latency, conduct IRB-approved user studies with blind participants, and capture audio output from screen-readers.
- **EVIDENCE**: Section 13 of dissertation manuscript.
- **LIMITATION**: Out of scope for current headless research prototype.
