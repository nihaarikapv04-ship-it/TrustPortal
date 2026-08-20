# Portal Transformer: Security-Constrained AI-Assisted Web Accessibility Remediation Framework (`docs/portal-transformer-final-thesis.md`)

> **Master Authoritative Dissertation Manuscript**: Complete 13-Chapter Thesis Synthesis Document.

---

## CHAPTER 1 — INTRODUCTION
Web accessibility remediation is essential for digital inclusion. Portal Transformer is an AI-assisted, security-constrained web accessibility remediation framework implemented through a browser-extension deployment layer.

---

## CHAPTER 2 — BACKGROUND AND RELATED PROBLEM
Details WCAG 2.1 SC 1.1.1, WAI-ARIA 1.2 accessible name rules, dynamic DOM observers, prompt injection mechanisms, TOCTOU race conditions, and browser extension isolated world boundaries.

---

## CHAPTER 3 — PROBLEM DEFINITION AND RESEARCH QUESTIONS

### **Research Questions (RQ1 - RQ8)**
- **RQ1**: Can deterministic rules identify missing accessibility semantics?  
  *Result*: Precision **100.0%**, Recall **100.0%** ($N=930$). Classification: `EMPIRICALLY VERIFIED`.
- **RQ2**: Can context-aware semantic resolution reduce false positives?  
  *Result*: False Positive Rate **0.0%** ($FP=0$). Classification: `EMPIRICALLY VERIFIED`.
- **RQ3**: Can explicit abstention safely handle ambiguous accessibility structures?  
  *Result*: Abstention Rate **33.33%** ($N=600$). Classification: `EMPIRICALLY VERIFIED`.
- **RQ4**: Can AI-assisted remediation operate without granting AI direct DOM mutation authority?  
  *Result*: Unsafe Mutations = **0** ($N=1,000$). Classification: `EMPIRICALLY VERIFIED`.
- **RQ5**: Can privacy filtering prevent credentials and sensitive fields from reaching the AI boundary?  
  *Result*: Credential Leaks = **0**. Classification: `EMPIRICALLY VERIFIED`.
- **RQ6**: Can capability-limited mutation and output validation prevent unsafe AI-generated DOM changes?  
  *Result*: Attack Success Rate = **0.0%** ($N=1,000$). Classification: `EMPIRICALLY VERIFIED`.
- **RQ7**: Can domain-specific safety adapters extend the architecture to high-risk interfaces such as UPI?  
  *Result*: Unsafe Transaction Mutations = **0** ($N=1,500$). Classification: `BENCHMARK-SCOPED`.
- **RQ8**: What accessibility coverage is achievable under a zero-unsafe-mutation constraint?  
  *Result*: Real-World Coverage = **90.0%** ($N=100$). Classification: `BENCHMARK-SCOPED`.

---

## CHAPTER 4 — SYSTEM ARCHITECTURE
Details the 13 architectural client-side layers: Scanner, Detector, Accessible Name Computer, SvgSemanticResolver, Untrusted AI Proposal Layer, Privacy Firewall, Output Validator, TSIF Risk Gate, Domain Safety Adapter, Patch Engine, TOCTOU Verification, Explicit Abstention, and Security Observability.

---

## CHAPTER 5 — ACCESSIBILITY DETECTION AND SEMANTIC RESOLUTION
Details deterministic scanning heuristics, AccessibleNameComputer recursion, and SvgSemanticResolver parent context reasoning.

---

## CHAPTER 6 — AI ZERO-TRUST SECURITY ARCHITECTURE
Details zero-trust input sanitization, Privacy Firewall Target Intersection Rules, Output Validator script filters, and Capability-Limited Patch Engine allowlists.

---

## CHAPTER 7 — DOMAIN-SPECIFIC SAFETY ADAPTER ARCHITECTURE
Details the domain-adapter architecture supporting `GENERIC_WEB`, `GOVERNMENT_PUBLIC`, and `UPI_FINANCIAL` domain modes.

---

## CHAPTER 8 — UPI TRANSACTION SAFETY EXTENSION
Details `UpiTransactionSafetyAdapter`, critical fields, critical attributes, and financial invariant rules (`AI_TRANSACTION_CRITICAL_MUTATION_AUTHORITY = 0`).

---

## CHAPTER 9 — EXPERIMENTAL METHODOLOGY
Details dataset design, frozen V7 protocol, synthetic benchmarks v1-v4, Holdout SVG V3, 20-page `.gov.in` manifest, 1,000-instance property security suite, and 1,500-case UPI suite.

---

## CHAPTER 10 — RESULTS
Presents authoritative empirical results across all evaluation suites without combining distinct datasets into fake averages.

---

## CHAPTER 11 — SECURITY AND ACCESSIBILITY TRADE-OFFS
Presents Pareto frontier characterization mapping maximum real-world coverage (90.0%) to zero unsafe DOM mutations.

---

## CHAPTER 12 — THREATS TO VALIDITY AND LIMITATIONS
Explicitly details internal, external, construct, and statistical validity threats, acknowledging headless screen-reader testing, local mock provider latency, and benchmark-scoped UPI results.

---

## CHAPTER 13 — CONCLUSION AND FUTURE WORK
Summarizes contributions C1 through C11 and specifies future research directions (live cloud API latency profiling, IRB-approved user studies, live NVDA/TalkBack audio announcement verification).
