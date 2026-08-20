# Authoritative Final Limitations Slide Content (`docs/portal-transformer-final-limitations-slide.md`)

> **Limitations Slide Standard**: Explicitly details all 10 acknowledged scientific and environmental scope limitations.

---

## 1. 10 Explicit System Limitations

1. **No Live NVDA Spoken Audio Testing**: Evaluated via DOM accessibility-tree semantic state tracking (`NOT EVALUATED — ENVIRONMENT LIMITATION`).
2. **No Live TalkBack Spoken Audio Testing**: Evaluated via DOM accessibility-tree semantic state tracking (`NOT EVALUATED — ENVIRONMENT LIMITATION`).
3. **No Human-Subject Usability Study**: No IRB-approved human participant trial conducted (`NOT EVALUATED — HUMAN-SUBJECT STUDY NOT CONDUCTED`).
4. **Curated Real-World Sample Scope**: Evaluated on 20 Indian government portals (`.gov.in`, $N_{\text{DOM}}=1,700$); cannot establish population-level generalization.
5. **Local Mock Provider Latency**: Latency microbenchmarks executed with local mock provider ($0.0\text{ ms}$); live cloud RTT remains unevaluated.
6. **Residual Sensitive-Field Classification Risk**: Un-regexed custom sensitive input formats could evade Target Intersection Firewall scrubbing.
7. **External SVG Symbol References**: SVG subtrees referencing remote sprite sheets trigger explicit `AMBIGUOUS_ABSTAIN`, reducing recall.
8. **No Universal Security Guarantee**: Security boundaries characterized across $N=1,000$ property instances; complete security is unclaimable.
9. **No Browser Sandbox Escape Testing**: OS or V8 memory corruption exploits are outside isolated world extension scope.
10. **No Production-Scale DoS Resistance**: Evaluated under 100,000 DOM element trees; live production DoS resistance is unclaimable.
