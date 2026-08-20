# Chapter 7: Conclusion & Future Work (`docs/thesis-conclusion.md`)

## 7.1 Problem Addressed
Public-service web portals remain plagued by recurring accessibility defects that block vision-impaired citizens from accessing essential government services. Prior attempts to automate remediation using unconstrained AI tools risk executing malicious code or leaking sensitive credentials.

## 7.2 System Developed
This thesis developed **Portal Transformer**, a client-side Manifest V3 extension featuring a deterministic DOM interceptor, a privacy-bounded inference relay, and a hardened semantic patch engine. The system enforces strict attribute allowlisting, zero credential transmission, and 100% reversible DOM mutation.

## 7.3 Primary Experimental Findings
1. **Detection Accuracy**: Achieved $100.0\%$ Precision, Recall, and $F_1$ score on an $N = 250$ synthetic benchmark.
2. **AI Label Quality**: Improved semantic label acceptability from $65.0\%$ (static templates) to $100.0\%$ (contextual AI).
3. **Security Containment**: Successfully blocked $100.0\%$ ($9 / 9$) tested adversarial attack vectors (XSS, prompt injection, forbidden attribute mutations).
4. **Privacy Protection**: Verified zero credential leakage across 7 sensitive input categories.
5. **Interactive Latency**: Achieved a mean client-side remediation latency of $0.023\text{ ms}$ ($P_{95} = 0.030\text{ ms}$) under local mock provider execution.

## 7.4 Key Research Contributions
- A formal three-subsystem architecture for security-constrained web accessibility remediation.
- A Privacy Firewall framework that scrubbing credentials prior to AI model dispatch.
- A hardened patch engine that enforces runtime attribute allowlisting and yields on host DOM reclaim.

## 7.5 Practical Implications
Portal Transformer proves that browser-based AI accessibility tools do not require giving language models unrestricted DOM access or unredacted user context.

## 7.6 Limitations & Future Research
1. **Live Cloud Integration**: Future work will evaluate live Vision and Language API endpoints to measure cloud network latency.
2. **Qualitative Screen-Reader Usability**: Empirical user studies using NVDA (Windows) and TalkBack (Android) are required to quantify task completion speed and spoken audio comprehension.
3. **Multilingual Evaluation**: Future research will expand evaluation to regional language government portals.
4. **Longitudinal Deployment**: Long-term field trials across live public portals will assess real-world durability.
