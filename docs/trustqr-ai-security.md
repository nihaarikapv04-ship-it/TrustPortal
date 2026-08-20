# TrustQR AI Security & Output Validator Specification (`docs/trustqr-ai-security.md`)

> **Notice 1**: *"TrustQR treats AI output as untrusted data."*  
> **Notice 2**: *"Model confidence is not authorization."*  
> **Notice 3**: *"AI-generated explanations cannot modify payment facts."*  
> **Notice 4**: *"AI cannot initiate or authorize a payment."*

---

## 1. AI Analysis Layer Architecture

TrustQR incorporates AI exclusively as an advisory explanation layer. The model output is treated as untrusted and is validated deterministically before being presented to the user.

```text
SanitizedPaymentContext (From Privacy Boundary)
           ↓
[ 1. Mock Payment AI Provider ]  (Local, Deterministic AI Engine)
           ↓
UntrustedPaymentAnalysis         (Risk Level, Summary, Reasons, Steps, Confidence)
           ↓
[ 2. Payment Output Validator ]  (Hard Security Sanitizer)
           ├─ Script / HTML Rejection (<script>, javascript:)
           ├─ Prompt Injection Rejection ("ignore previous instructions")
           ├─ Credential Request Rejection ("enter PIN", "send OTP")
           ├─ Authorization Claim Rejection ("payment authorized", "click pay")
           └─ Length & Confidence Bounds Verification
           ↓
ValidatedPaymentExplanation     (Immutable Explanation Object with ZERO Payment Authority)
```

---

## 2. Interface Isolation & Fact Immutability

1. **Context Boundary**: The AI provider receives **only** `SanitizedPaymentContext`. Raw payload text, camera frames, and sensitive metadata remain inaccessible.
2. **Fact Immutability**: `ValidatedPaymentExplanation` contains explanatory text only (`summary`, `reasons`, `verificationSteps`). Authoritative payment facts (`recipient`, `amount`, `currency`) continue to originate strictly from `ParsedPaymentData`.

---

## 3. Output Validation Security Rules

| Security Constraint | Validation Logic | Action on Violation |
| :--- | :--- | :--- |
| **XSS / HTML Injection** | Rejects `<script>`, HTML tags, and `javascript:` URIs | `HTML_SCRIPT_REJECTED` |
| **Prompt Injection** | Rejects instruction overrides ("ignore previous instructions", "override policy") | `PROMPT_INJECTION_REJECTED` |
| **Credential Requests** | Rejects requests for PIN, OTP, passwords, or CVV | `CREDENTIAL_REQUEST_REJECTED` |
| **Authorization Claims** | Rejects claims such as "payment authorized" or "click pay now" | `AUTHORIZATION_CLAIM_REJECTED` |
| **Summary Length** | Enforces `summary` $\le 300$ characters | `SUMMARY_TOO_LONG` |
| **Reasons List** | Enforces $\le 5$ reasons (each $\le 200$ characters) | `EXCESSIVE_REASONS` / `REASON_TOO_LONG` |
| **Steps List** | Enforces $\le 5$ verification steps (each $\le 200$ characters) | `EXCESSIVE_STEPS` / `STEP_TOO_LONG` |
| **Total Character Limit** | Enforces aggregate explanation text $\le 1200$ characters | `TOTAL_LENGTH_EXCEEDED` |
| **Confidence Bounds** | Enforces finite number $0.0 \le \text{confidence} \le 1.0$ (Rejects NaN/Infinity) | `INVALID_CONFIDENCE` |

---

## 4. Zero Payment Execution Authority

Model confidence scores (even $\text{confidence} = 1.0$) do **NOT** grant payment authorization, auto-pay capability, or transaction execution rights. The explanation object contains zero execution methods or state parameters.
