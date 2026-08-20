# Adversarial Examiner Defense Guide: 20 Difficult Questions (`docs/portal-transformer-adversarial-viva.md`)

> **Adversarial Defense Guide**: Scientifically honest, evidence-grounded answers for 20 difficult examiner defense questions.

---

## 1. 20 Adversarial Examiner Defense Questions

1. **"Your synthetic benchmark has 100% recall. Isn't this overfitting?"**  
   *Answer*: Synthetic benchmarks isolate documented rules. Overfitting was explicitly tested by evaluating independent holdouts (Holdout SVG V3 recall = 53.85%) and 20 real-world `.gov.in` portals (recall = 77.78%).
2. **"Why does recall fall to 53.85% on Holdout SVG V3?"**  
   *Answer*: The resolver returned `AMBIGUOUS_ABSTAIN` on 200 unresolved external symbol subtrees, choosing safety over speculative mutation to preserve 100% precision.
3. **"If the system abstains, isn't that simply avoiding the problem?"**  
   *Answer*: Abstention is a deliberate security mechanism that prevents executing speculative, potentially incorrect DOM mutations on high-risk public service portals.
4. **"How do you know the AI cannot bypass your security controls?"**  
   *Answer*: Security controls operate client-side in the extension isolated world. Model responses pass through Output Validator schema checks and Patch Allowlist filters before DOM injection.
5. **"What happens if the AI returns valid JSON containing malicious script tags?"**  
   *Answer*: `LocalOutputValidator` inspects JSON string fields using regex tag filters, rejecting proposals containing `<script>` or HTML tags.
6. **"Why not allow the AI to directly modify the DOM?"**  
   *Answer*: Direct DOM access grants untrusted model outputs arbitrary execution authority, creating severe XSS and navigation manipulation risks.
7. **"What happens if an attacker controls page content?"**  
   *Answer*: Target Intersection Firewall scrubs secrets, while capability allowlists prevent navigation mutations like `href`.
8. **"Can prompt injection steal passwords?"**  
   *Answer*: No. Privacy Firewall denies context extraction on password inputs (`SENSITIVE_FIELD_DENIED`), preventing passwords from entering prompt text.
9. **"Why is your security claim not '100% secure'?"**  
   *Answer*: Universal security is unprovable. Results characterize performance across $N=1,000$ property instances and 5,000 fuzz cases.
10. **"Why is NVDA not tested live?"**  
    *Answer*: Headless CLI test runners lack audio output devices (`NOT EVALUATED — ENVIRONMENT LIMITATION`). Evaluated via DOM accessibility-tree semantic state tracking.
11. **"Why is TalkBack not tested live?"**  
    *Answer*: Headless environment limitation (`NOT EVALUATED — ENVIRONMENT LIMITATION`).
12. **"Why isn't the .gov.in sample statistically representative?"**  
    *Answer*: Evaluated on a curated 20-page sample ($N_{\text{DOM}}=1,700$) establishing baseline performance, not population-level generalization.
13. **"Why is latency measured with a mock provider?"**  
    *Answer*: Local mock provider isolates client-side extension execution latency ($0.0123\text{ ms}$) from cloud API RTT variability.
14. **"Why does zero unsafe mutation reduce coverage?"**  
    *Answer*: Restricting patches to allowlisted attributes prevents speculative writes on ambiguous controls, resulting in a 10.0% real-world abstention rate.
15. **"What is the biggest weakness of your system?"**  
    *Answer*: Abstention on complex SVG symbol graphs lacking local definitions, which limits defect recall.
16. **"What would break your architecture?"**  
    *Answer*: Browser extension privilege escalation vulnerabilities outside the Chrome MV3 isolated world scope.
17. **"What if a new sensitive field type isn't recognized?"**  
    *Answer*: An un-regexed sensitive field could be extracted. Mitigated by continuous regex allowlist updates.
18. **"What if an SVG references an external resource?"**  
    *Answer*: Remote fetches are disallowed; `SvgSemanticResolver` returns `AMBIGUOUS_ABSTAIN`.
19. **"What happens when the DOM changes between detection and patching?"**  
    *Answer*: TOCTOU fingerprint verification fails and the patch is safely aborted.
20. **"What is your actual research contribution versus engineering?"**  
    *Answer*: The research contribution lies in demonstrating security-constrained AI remediation and characterizing the Pareto trade-off between coverage and safety.
