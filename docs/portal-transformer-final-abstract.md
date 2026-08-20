# Portal Transformer Final Abstract (`docs/portal-transformer-final-abstract.md`)

> **Thesis Abstract**: Concise 250-word authoritative summary of the problem, gap, security architecture, empirical findings, and primary contributions of Portal Transformer.

---

## Abstract

Web accessibility remediation is critical for digital inclusion, yet traditional client-side automation relies on static WAI-ARIA rules that cannot resolve context-dependent visual or icon controls. While Large Language Models (LLMs) offer natural language comprehension to repair missing accessible names, introducing AI into the browser DOM creates a severe security boundary challenge: untrusted page content can trigger prompt injection, credential exfiltration, XSS payload execution, or unauthorized DOM navigation mutations. 

This thesis presents **Portal Transformer**, a zero-trust, security-constrained client-side accessibility remediation architecture. Portal Transformer treats both web page DOM subtrees and AI model outputs as untrusted inputs. Remediation is governed by a multi-layered security pipeline comprising a Privacy Firewall for sensitive data isolation, a context-aware Accessible-Name Resolver, an explicit confidence-based abstention mechanism (`AMBIGUOUS_ABSTAIN`), an Output Validator for script containment, a non-compensable Risk Gate, a capability-limited Patch Engine (restricting mutations exclusively to `alt`, `aria-label`, and `role`), and TOCTOU fingerprint verification.

Evaluated across synthetic benchmarks ($N=930$), holdout SVG subtrees ($N=600$), and 20 real-world Indian government portals (`.gov.in`, $N_{\text{DOM}}=1,700$), Portal Transformer achieved 100.0% precision ($FP=0$) and 77.78% defect recall with a 10.0% explicit abstention rate on real-world sample elements. Adversarial cybersecurity testing across 1,000 property-based attack instances, 500 independent holdout payloads, 5,000 fuzzing cases, and compromised AI provider simulations produced 0.0% attack success and zero unsafe DOM mutations. By establishing that client-side AI accessibility repairs can be strictly capability-constrained, this work provides a defensible framework for secure, privacy-preserving digital accessibility automation.
