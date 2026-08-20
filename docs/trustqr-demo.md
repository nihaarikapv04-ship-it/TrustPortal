# TrustQR Synthetic Demo Scenarios & Pipeline Specification (`docs/trustqr-demo.md`)

> **Notice 1**: *"The TrustQR demo environment utilizes 100% synthetic payment fixtures. No real financial transactions, banking APIs, or payment execution gateways are involved."*  
> **Notice 2**: *"TrustQR provides an advisory verification layer and does not possess authority to execute or authorize payments."*

---

## 1. End-to-End Pipeline Architecture

Every demo scenario executes through the complete `TrustQRPipeline` stage engine in fail-closed order:

```text
Synthetic QR Scenario Selection (14 Catalog Items)
                     ↓
[ 1. QR Decode Stage ]            (SyntheticQRDecoder)
                     ↓
[ 2. UPI URI Parse Stage ]        (PaymentPayloadParser)
                     ↓
[ 3. Deterministic Validation ]  (PaymentValidator — Structural, Amount, Currency, Context)
                     ↓
[ 4. Privacy Firewall Stage ]     (PaymentPrivacyFilter — Hard Denial for OTP/PIN/Password/CVV)
                     ↓
[ 5. AI Analysis Stage ]          (MockPaymentAIProvider — Executed ONLY if Privacy ALLOWS)
                     ↓
[ 6. Output Security Validation ] (PaymentOutputValidator — Rejects XSS, Injection, PIN Requests)
                     ↓
[ 7. Payment Risk Engine ]        (PaymentRiskEngine — Computes TrustQR Score & Non-Compensable Gate)
                     ↓
[ 8. User Verification UI ]       (TrustQRApp — Facts Table, Risk Card, AI Card, Handoff Bar)
```

---

## 2. Demo Scenario Catalog

| ID | Scenario Key | Description | Expected Validation | Expected Privacy | Expected Risk State | AI Executed? |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **01** | `NORMAL_PAYMENT` | ABC Electronics (₹2,500) | `valid` | `allow` | `INFORMATIONAL` | YES |
| **02** | `RECIPIENT_MISMATCH` | ABC Electronics vs random123@upi | `needs_review` | `allow` | `NEEDS_REVIEW` | YES |
| **03** | `HIGH_VALUE_PAYMENT` | High-value payment (₹50,000) | `needs_review` | `allow` | `HIGH_RISK_WARNING` | YES |
| **04** | `MISSING_RECIPIENT` | Malformed payload missing `pa` | `invalid` | `allow` | `BLOCKED` | **NO** |
| **05** | `INVALID_AMOUNT` | Negative amount (`am=-500`) | `invalid` | `allow` | `BLOCKED` | **NO** |
| **06** | `SUSPICIOUS_INSTRUCTION`| Note urges "Enter your UPI PIN" | `needs_review` | `allow` | `NEEDS_REVIEW` | YES |
| **07** | `UNSAFE_METADATA` | HTML `<script>` tag injection | `invalid` | `allow` | `BLOCKED` | **NO** |
| **08** | `PRIVACY_DENIED_OTP` | Metadata contains OTP secret | `valid` | `deny` | `BLOCKED` | **NO (0 calls)** |
| **09** | `PRIVACY_DENIED_PIN` | Metadata contains upiPin secret | `valid` | `deny` | `BLOCKED` | **NO (0 calls)** |
| **10** | `ADVERSARIAL_AI_XSS` | AI outputs `<script>alert('xss')` | `valid` | `allow` | `INFORMATIONAL` | YES (Rejected) |
| **11** | `ADVERSARIAL_AI_PROMPT` | AI outputs prompt override text | `valid` | `allow` | `INFORMATIONAL` | YES (Rejected) |
| **12** | `ADVERSARIAL_AI_AUTH` | AI outputs "Payment authorized" | `valid` | `allow` | `INFORMATIONAL` | YES (Rejected) |
| **13** | `DANGEROUS_URI_SCHEME` | `javascript:alert(1)` scheme | `invalid` | `allow` | `BLOCKED` | **NO** |
| **14** | `MISSING_MERCHANT_NAME` | Optional `pn` absent from payload | `valid` | `allow` | `INFORMATIONAL` | YES |

---

## 3. Key Pipeline Journeys

### 3.1 Golden Path (`NORMAL_PAYMENT`)
- Decodes valid UPI string `upi://pay?pa=abc@upi&pn=ABC%20Electronics&am=2500&cu=INR`.
- Parser extracts payment facts; Privacy Firewall returns `allow`.
- AI analysis generates rationale; Output Security Validator approves output.
- Risk Engine computes TrustQR Score: **95 / 100** (`INFORMATIONAL`).
- UI renders Payment Facts, Risk Card, Advisory AI Explanation, Checklist, and Action Bar (`Continue Manually in Your Payment App`).

### 3.2 Privacy Negative Path (`PRIVACY_DENIED_PIN`)
- Payload metadata contains `upiPin: "123456"`.
- Privacy Firewall issues hard **`DENY`** (`SENSITIVE_PIN_DENIED`).
- **AI Provider call count = 0** (AI stage skipped entirely).
- Risk Engine assigns **`BLOCKED`** decision. PIN string is 100% absent from execution trace and UI DOM.

### 3.3 Adversarial AI Path (`ADVERSARIAL_AI_XSS`)
- AI provider attempts to return `<script>alert('xss')</script>`.
- Payment Output Validator detects HTML script tags and returns `HTML_SCRIPT_REJECTED`.
- Pipeline falls back safely: UI displays *"AI explanation unavailable. Verification checks remain functional."* Zero script execution occurs.

---

## 4. How to Build & Run Demo Tests

```bash
cd /Users/nihaarikapv/.gemini/antigravity/scratch/trustportal

# Build TrustQR package
npm run build --workspace=@trustportal/trustqr

# Run Unit, Integration, & E2E Test Suite
npm test --workspace=@trustportal/trustqr
```
