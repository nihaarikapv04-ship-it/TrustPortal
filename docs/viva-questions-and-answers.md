# Viva Defense Preparation: 25 Difficult Questions & Evidence-Based Answers (`docs/viva-questions-and-answers.md`)

> **Viva Defense Guide**: Provides rigorous, scientifically defensible answers grounded in empirical data and acknowledged limitations for 25 examiner defense questions.

---

## 1. 25 Examiner Questions & Empirical Defense Answers

1. **Q1: Why is AI required? Why not use deterministic accessibility rules only?**  
   *Answer*: Deterministic rules detect accessibility missing names, but cannot generate contextually accurate semantic text labels for novel icon controls or unlabelled images without natural language comprehension.
2. **Q2: Why should the AI provider be treated as untrusted?**  
   *Answer*: Modern LLMs are susceptible to prompt injection, model jailbreaks, and adversarial outputs. Treating the provider as untrusted enforces zero-trust client-side validation before any DOM mutation occurs.
3. **Q3: What happens if the AI provider is fully compromised?**  
   *Answer*: Empirical testing on 14 malicious payload types (`reports/evaluation/compromised-provider-results.json`) confirms that 100% of malicious provider outputs (XSS, forbidden attributes, `javascript:` URIs) are blocked client-side by `LocalOutputValidator` and `LocalPatchEngine`.
4. **Q4: How does the Privacy Firewall work?**  
   *Answer*: The Privacy Firewall applies Target Intersection Rules (`packages/redaction/src/firewall.ts`), denying SafeContext extraction if the target element or URL path is classified as sensitive (password, OTP, PIN, payment, or PII).
5. **Q5: Why is explicit abstention necessary?**  
   *Answer*: Abstention (`AMBIGUOUS_ABSTAIN`) prevents the system from executing unsupported or ambiguous DOM mutations on complex SVG subtrees or conflicting ARIA definitions, ensuring zero false-alarm mutations.
6. **Q6: Why does 100% precision on synthetic benchmarks not prove universal generalization?**  
   *Answer*: Synthetic fixtures test documented rules under ideal conditions. Real-world public service portals introduce novel CSS structures, cross-origin frame sandboxes, and dynamic DOM races.
7. **Q7: What does the 33.33% SVG abstention rate mean?**  
   *Answer*: On Holdout SVG Benchmark V3 ($N = 600$), the resolver returned `AMBIGUOUS_ABSTAIN` on 200 cases lacking local `<symbol>` or `<title>` definitions, choosing safety over speculative mutation.
8. **Q8: What is the difference between FPR and false remediation rate?**  
   *Answer*: FPR measures false alarm detections on accessible controls. False remediation rate measures incorrect attribute mutations applied to the live DOM.
9. **Q9: How is TOCTOU prevented?**  
   *Answer*: Before applying a patch, `LocalPatchEngine` verifies node connectivity (`isConnected === true`) and computes a DOM target fingerprint hash (`targetFingerprint`).
10. **Q10: How is DOM clobbering prevented?**  
    *Answer*: Properties are retrieved via `SafeDOMRef` using `Object.prototype` reflection to prevent overridden DOM `id` or `name` global properties from hijacking lookups.
11. **Q11: Why can't you claim complete security?**  
    *Answer*: Complete security is scientifically unprovable; security boundaries are evaluated against a finite adversarial corpus ($N = 1,000$ property instances).
12. **Q12: What is the largest residual security risk?**  
    *Answer*: Novel, un-regexed sensitive field types or browser extension privilege escalation vulnerabilities outside isolated world MV3 boundaries.
13. **Q13: Why was NVDA not actually evaluated?**  
    *Answer*: Evaluated inside a headless macOS/Linux terminal environment without audio dispatcher capabilities. Explicitly documented as `NOT EVALUATED — ENVIRONMENT LIMITATION`.
14. **Q14: Why was human usability not evaluated?**  
    *Answer*: No IRB-approved human participant trial was authorized or conducted. Documented as `NOT EVALUATED — HUMAN-SUBJECT STUDY NOT CONDUCTED`.
15. **Q15: Why are synthetic benchmarks necessary?**  
    *Answer*: Synthetic benchmarks isolate specific structural ARIA edge cases (chains, SVG titles, visually hidden text) under controlled, reproducible conditions.
16. **Q16: What did the real-world .gov.in evaluation add?**  
    *Answer*: Evaluated real-world DOM element distributions ($N_{\text{DOM}} = 1,700$) across 20 Indian government portals, establishing baseline defect counts and latency profiles.
17. **Q17: What happens if a page contains a password field with a missing label?**  
    *Answer*: The Privacy Firewall triggers Target Intersection Denial (`SENSITIVE_FIELD_DENIED`), refusing context extraction and preventing password field transmission.
18. **Q18: What if malicious text itself is proposed as the accessible name?**  
    *Answer*: `LocalOutputValidator` checks text length, control characters, script tags, and prompt injection regexes before approving the proposal.
19. **Q19: What if the provider returns a malicious patch attribute like `href`?**  
    *Answer*: `LocalPatchEngine` rejects any attribute outside the allowlist (`alt`, `aria-label`, `aria-labelledby`, `aria-describedby`, `role`), blocking `href` mutations.
20. **Q20: What if the DOM changes between detection and patch?**  
    *Answer*: TOCTOU fingerprint verification fails and the patch is safely aborted.
21. **Q21: What if an attacker repeatedly modifies the DOM?**  
    *Answer*: `MutationObserver` attribute filtering prevents observer rescan dispatches when Portal Transformer modifies allowlisted attributes.
22. **Q22: What if an SVG references an external sprite sheet?**  
    *Answer*: Remote fetch dispatches are disallowed; `SvgSemanticResolver` returns `AMBIGUOUS_ABSTAIN`.
23. **Q23: What is the security/performance trade-off?**  
    *Answer*: Zero-trust security verification adds $<0.01\text{ ms}$ local latency per candidate while preserving 100% security rejection.
24. **Q24: What would you test next with unlimited resources?**  
    *Answer*: Live Cloud API round-trip latency, real NVDA/TalkBack audio announcement trials, and IRB-approved human usability studies.
25. **Q25: What is the primary thesis contribution?**  
    *Answer*: Demonstrating that client-side AI accessibility remediation can be safely constrained through zero-trust security boundaries without introducing unsafe DOM mutations or privacy leaks.
