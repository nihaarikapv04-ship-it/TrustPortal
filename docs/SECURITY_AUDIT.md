# TrustPortal TSIF Security & Architectural Audit Report

## Architectural Principles Enforcement Matrix

| Principle | Requirement | Implementation Module | Verification Mechanism | Status |
| :--- | :--- | :--- | :--- | :--- |
| **1. CaMeL Separation** | Control flow separated from untrusted data flow | `gate/controller.py`, `quarantined_proposer.py` | Quarantined proposer returns ONLY schema-validated `ProposalResult` data object. Structurally impossible to execute commands. | **ENFORCED** |
| **2. Conformal Risk Control** | Bounded risk $\le \alpha$ via $\lambda^*$ threshold | `gate/trust_gate.py`, `exp1_calibration.py` | Empirical calibration of $\lambda^*$ over training set; surfaces held-out risk and tests distribution shift explicitly. | **ENFORCED** |
| **3. Non-Compensable Gate** | Prompt injection/sensitive workflow triggers immediate abstention | `security/context_firewall.py`, `exp2_injection_resistance.py` | Injection flags immediately yield `FirewallAbstainResult`. High model confidence cannot override firewall. | **ENFORCED** |
| **4. Widened Context** | Hidden text (`display:none`) context extraction | `security/context_firewall.py`, `extension/src/content/index.ts` | Captures `display:none` and hidden element text to expose indirect prompt injection payloads. | **ENFORCED** |
| **5. Hardened DOM Patching** | Attribute allowlist & non-malicious yield behavior | `patch_system/src/patcher.ts`, `patch_system/tests/patcher.test.ts` | Runtime & compile-time restriction to `alt`, `aria-label`, `aria-labelledby`, `aria-describedby`, `role`. Yields on live page element reclaim. | **ENFORCED** |
| **6. Privacy Firewall** | Deny-by-default on sensitive URLs & PII redaction | `security/context_firewall.py` | Redacts email, phone, card, SSN/Aadhaar/PAN, tokens. Denies auth, checkout, OTP, tax, health workflows. | **ENFORCED** |
| **7. No Compliance Claims** | Reversible, user-side assistance | Code docs & UI copy | Zero WCAG or DPDPA compliance claims made anywhere in system UI or code comments. | **ENFORCED** |
| **8. Closed Shadow DOM UI** | Resistance to DOM clickjacking & style overrides | `extension/src/ui/verification_ui.ts` | Uses `attachShadow({ mode: "closed" })` per Marek Tóth research on DOM extension clickjacking. | **ENFORCED** |
