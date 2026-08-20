# Final Claim Boundaries & Scope Limitations (`docs/portal-transformer-claim-boundaries.md`)

> **Scientific Boundary Guide**: Explicitly specifies what Portal Transformer can empirically claim versus what is unestablished.

---

## 1. What Portal Transformer CAN Empirically Claim (`CAN CLAIM`)
1. **Safe Capability-Limited Remediation**: Restricting DOM writes to allowlisted attributes (`alt`, `aria-label`, `role`) prevents navigation hijacking (`href`, `src`, `action`).
2. **0.0% Attack Success Rate**: 100% security rejection observed across 1,000 property cases, 500 holdouts, 5,000 fuzz runs, and 14 compromised AI outputs.
3. **Zero Credential Transmission**: Privacy Firewall scrubbed passwords, PINs, OTPs, and PII from AI context.
4. **Real-World High Precision**: 100.0% precision ($FP=0$) and 77.78% recall ($TP=35, FN=10$) observed on 20 `.gov.in` public portal baselines ($N=100$ reviewed sample).
5. **Pareto Optimal Frontier**: Achieving 90.0% remediation coverage under a zero-unsafe-mutation security constraint requires accepting a 10.0% explicit abstention rate.

---

## 2. What Portal Transformer CANNOT Claim (`CANNOT CLAIM`)
1. **Universal Security**: Complete security is unclaimable; boundaries are evaluated against a finite adversarial corpus.
2. **Population-Level `.gov.in` Generalization**: Results characterize the evaluated 20-page sample and cannot establish generalization to all government portals.
3. **Screen-Reader Spoken Output Quality**: NVDA / TalkBack audio announcement quality was not evaluated live (`NOT EVALUATED — ENVIRONMENT LIMITATION`).
4. **Human Usability**: No IRB-approved human participant usability study was conducted (`NOT EVALUATED — HUMAN-SUBJECT STUDY NOT CONDUCTED`).
5. **Live Cloud API RTT Latency**: Evaluated using local mock provider; cloud network latency remains unevaluated.
