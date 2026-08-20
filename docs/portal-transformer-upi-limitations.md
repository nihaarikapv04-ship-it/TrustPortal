# UPI Safety Adapter Limitations & Non-Claims (`docs/portal-transformer-upi-limitations.md`)

> **Scientific Non-Claims**: Explicitly specifies limitations of the UPI Transaction Safety Adapter.

---

## 1. Explicit Non-Claims & Scope Boundaries

> [!CAUTION]
> - **DO NOT CLAIM**: "UPI is completely secure" or "Financial transactions are guaranteed safe."
> - **DO NOT CLAIM**: Universal security across all payment applications or mobile banking apps.
> - **SCOPED SCIENTIFIC CLAIM**: *"The UPI-domain safety policy was empirically evaluated against the defined 1,500-case adversarial benchmark, demonstrating zero unsafe transaction mutations under the tested conditions."*

---

## 2. Technical Limitations
1. **Domain Scope**: Operates strictly within browser web DOM structures; native mobile Android/iOS banking apps are out of scope.
2. **Regex Field Matching**: Input field classification relies on attribute regex rules (`amount|recipient|otp|pin`). Custom obfuscated field names could evade classification.
3. **Local Mock AI**: Evaluated using local deterministic mock provider; live production API latency remains unevaluated.
