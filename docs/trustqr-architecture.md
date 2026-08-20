# TrustQR Architecture & Security Specification

> **Subtitle**: Security-Constrained AI-Assisted QR Payment Verification  
> **Core Principle**: *"AI may advise, but it never controls the transaction."*

---

## 1. Executive Summary & Research Positioning

### 1.1 Research Claim
> *"TrustQR provides a security-constrained, explainable verification layer that helps users inspect QR-payment information and detectable risk indicators before authorizing a transaction."*

### 1.2 Primary Research Question
> *"Can a security-constrained AI layer assist users in verifying QR-based digital payments without acquiring authority to execute, modify, or authorize the transaction?"*

### 1.3 Framing & Terminology Guardrails
- **NOT a "Fraud Detector" or "Scam Detector"**: TrustQR evaluates structural validity and detectable context consistency. It does not issue absolute assertions regarding real-world merchant legitimacy.
- **Wording Invariant 1**: *"Payment information passed available structural and consistency checks"* (NEVER *"This payment is safe"*).
- **Wording Invariant 2**: *"This payment contains risk indicators that require verification"* (NEVER *"This QR is a scam"*).
- **Wording Invariant 3**: *"AI provided an explanation based on sanitized payment context"* (NEVER *"AI verified the payment"*).

---

## 2. Strict Negative Rules & Authority Boundaries

TrustQR enforces non-negotiable security boundaries that guarantee zero transaction execution authority:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TRUSTQR SECURITY BOUNDARY                       │
├────────────────────────────────────────────────────────────────────────┤
│  [X] NEVER initiate a payment transaction                              │
│  [X] NEVER click a "Pay" or "Authorize" button                         │
│  [X] NEVER authorize a financial transaction                           │
│  [X] NEVER modify payment amount or currency                           │
│  [X] NEVER modify recipient name or UPI ID                             │
│  [X] NEVER generate replacement payment destination URIs              │
│  [X] NEVER access, prompt for, or log OTP                              │
│  [X] NEVER access, prompt for, or log UPI PIN                          │
│  [X] NEVER access, prompt for, or log banking passwords               │
│  [X] NEVER access, prompt for, or log credit/debit card CVV            │
│  [X] NEVER submit banking or card credentials                          │
│  [X] NEVER attempt to bypass PhonePe, Google Pay, Paytm, or UPI security│
└────────────────────────────────────────────────────────────────────────┘
```

The user **always** makes the final payment decision in their existing native payment application.

---

## 3. TSIF Conceptual Reuse & Architecture Alignment

TrustQR adapts foundational security concepts established in the 14-step TSIF research prototype while maintaining complete codebase isolation:

```text
TrustPortal / TSIF Core Invariants         TrustQR Payment Application Adaptation
─────────────┬─────────────────────        ──────────────┬─────────────────────────
             │                                           │
  Deterministic Detector                   QR Payload Parser & Validator
  (Static WCAG Rule Evaluation)  ───────►  (UPI Scheme & Field Consistency)
             │                                           │
  Privacy Firewall                         Payment Privacy Boundary
  (Target Intersection Denial)   ───────►  (Zero Credentials / Zero Frames to AI)
             │                                           │
  SafeContext Extractor                    Sanitized Payment Context
  (Minimal Public Attributes)    ───────►  (Recipient, Amount, Structural Indicators)
             │                                           │
  Non-Compensable Risk Gate                Payment High-Impact Risk Gate
  (High-Impact Workflow Penalty) ───────►  (Mandatory Review; ZERO Auto-Pay)
             │                                           │
  Shadow DOM UI                            Payment Verification UI
  (Reversible & Human-in-Loop)   ───────►  (Explainable Summary & Payment Handoff)
```

### 3.1 Untouched TSIF Infrastructure
- `packages/schemas`: Shared Zod validation primitives.
- `packages/redaction`: Core PII regex patterns and firewall decision states.
- `packages/scoring`: Baseline Non-Compensable Risk Gate mechanics.
- `apps/api`, `apps/extension`, `apps/demo`, `packages/eval`: **100% Frozen & Untouched**.

---

## 4. TrustQR End-to-End Pipeline Workflow

```text
Synthetic QR Data / String
           ↓
    [ 1. QR Decoder ]            (Deterministic, Non-AI)
           ↓
 [ 2. Payment Payload Parser ]   (UPI Schema Validation: Scheme, Payee, Amount, Ref)
           ↓
[ 3. Deterministic Validator ]   (Structural & Parametric Integrity Checks)
           ↓
 [ 4. Payment Privacy Filter ]   (Strips Credentials, OTP, PIN; Constructs Sanitized Context)
           ↓
   [ 5. Mock AI Provider ]       (Generates Structured Rationale & Verification Steps)
           ↓
 [ 6. AI Output Validator ]      (Rejects HTML, Script, Injection, & Authority Claims)
           ↓
 [ 7. Payment Risk Engine ]      (Computes TrustQR Score & Enforces High-Impact Gate)
           ↓
   [ 8. Decision Policy ]        (Assigns LOW_RISK_REVIEW, VERIFY, or HIGH_RISK_WARNING)
           ↓
 [ 9. Verification UI Panel ]    (Renders Summary, Checklist, AI Rationale, & Handoff)
           ↓
[ 10. Human Payment Handoff ]    ("Continue to Payment Application" — NO Auto-Pay!)
```

---

## 5. TrustQR Component Architecture (`apps/trustqr/`)

TrustQR is organized as an independent application inside `apps/trustqr/`:

```text
apps/trustqr/
├── src/
│   ├── qr/
│   │   ├── decoder.ts             # QRDecoder interface & synthetic payload reader
│   │   ├── parser.ts              # UPI URI scheme & key-value pair parser
│   │   ├── payment_schema.ts      # Zod schema for parsed payment payload
│   │   └── qr_validator.ts        # Deterministic structural checks
│   │
│   ├── privacy/
│   │   └── payment_privacy.ts     # Privacy boundary & context sanitizer
│   │
│   ├── risk/
│   │   ├── payment_signals.ts     # Q, C, M, D, A, V, P, H payment signals
│   │   ├── payment_risk.ts        # TrustQR Risk Score calculator
│   │   └── risk_policy.ts         # LOW_RISK_REVIEW | VERIFY | HIGH_RISK_WARNING policy
│   │
│   ├── ai/
│   │   ├── payment_prompt.ts      # Structured prompt template
│   │   ├── payment_provider.ts    # Abstract PaymentAnalysisProvider & local mock
│   │   └── output_validator.ts    # Security sanitizer for AI responses
│   │
│   ├── ui/
│   │   ├── payment_summary.ts     # Render payment details card
│   │   ├── risk_panel.ts          # Render risk state & status badge
│   │   ├── verification_checklist.ts # Render deterministic checklist
│   │   └── styles.css             # Clean, modern, accessible fintech styling
│   │
│   ├── scenarios/
│   │   ├── normal_payment.ts      # Scenario A: ABC Electronics (₹2,500)
│   │   ├── suspicious_recipient.ts# Scenario B: Recipient Mismatch (₹2,500)
│   │   └── high_value_payment.ts  # Scenario C: High-Value Unknown (₹50,000)
│   │
│   └── main.ts                    # Application initialization & demo controller
│
├── tests/                         # Unit, security, and Playwright E2E suites
├── package.json                   # Workspace package declaration
├── tsconfig.json                  # TypeScript configuration
└── vite.config.ts                 # Vite bundle configuration
```

---

## 6. Payment Signals & TrustQR Risk Score Formula

The TrustQR Risk Score adapts TSIF signal weighting for payment contexts:

$$\text{TrustQR Risk Score} = 100 \times \text{clamp}(0.25 Q + 0.20 C + 0.15 M + 0.20 D + 0.10 A + 0.10 V - P - H, 0, 1)$$

Where:
- $Q$: QR Structural Validity Score ($1.0$ if valid UPI scheme and required fields present)
- $C$: Context Consistency Score ($1.0$ if recipient name matches expected merchant context)
- $M$: Model Confidence Score ($0.0 - 1.0$)
- $D$: Data Consistency Score ($1.0$ if amount representation is unambiguous)
- $A$: Verifier Agreement Score ($1.0$ if deterministic checks pass)
- $V$: Visual Display Score ($1.0$ if payload parameters match displayed UI text)
- $P$: Privacy Penalty ($0.50$ if sensitive input fields detected)
- $H$: Financial High-Impact Penalty ($0.50$ hard penalty applied to ALL payment workflows)

### 6.1 Non-Compensable High-Impact Payment Gate
Because **all financial transactions are high-impact workflows**, the Non-Compensable Gate enforces:
- Even if $Q=1, C=1, M=1, D=1, A=1, V=1$ yielding a raw score of $100$:
- **Maximum State**: `LOW_RISK_REVIEW`
- **Auto-Authorize Decision**: **`NEVER`** (`autoAuthorizeCount = 0`).

---

## 7. Decision Policy States

| State | Badge Color | User Guidance | Action Handoff |
| :--- | :---: | :--- | :--- |
| **`LOW_RISK_REVIEW`** | 🟢 Green | Payment information passed structural & consistency checks. Review details before paying. | `[ Continue to Payment Application ]` |
| **`VERIFY`** | 🟡 Yellow | Recipient or context mismatch detected. Verify recipient name in your app before confirming. | `[ Verify & Continue ]` |
| **`HIGH_RISK_WARNING`**| 🔴 Red | High-value transaction or structural anomalies detected. Proceed with extreme caution. | `[ Inspect Risk Details ]` |

---

## 8. Verification Strategy

1. **Unit & Security Tests (`apps/trustqr/tests/`)**:
   - QR scheme & UPI payload parsing tests.
   - Deterministic structural validator tests.
   - Privacy filter & credential denial tests (OTP/PIN/CVV/Password).
   - AI output security & prompt injection rejection tests.
   - Non-compensable High-Impact Gate ($H=0$ auto-pay) tests.
2. **Playwright E2E Suite (`apps/trustqr/tests/e2e/`)**:
   - Scenario A: Normal Payment flow.
   - Scenario B: Suspicious Recipient Mismatch flow.
   - Scenario C: High-Value Payment flow.
   - Adversarial prompt injection & PIN request rejection flows.
3. **Synthetic Evaluation Benchmark**:
   - $N=40$ dataset (10 normal, 10 suspicious, 10 high-value, 10 adversarial).
   - Metrics: Parsing Accuracy, Validation Accuracy, High-Impact Auto-Authorize Count ($=0$).

---

## 9. Verification & Phase A Sign-Off

Phase A architecture inspection is complete. All architectural boundaries, reusable TSIF interfaces, and TrustQR component structures have been established in `docs/trustqr-architecture.md`.
