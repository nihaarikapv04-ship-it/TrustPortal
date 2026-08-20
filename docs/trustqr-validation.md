# TrustQR Deterministic Validation Specification (`docs/trustqr-validation.md`)

> **Notice**: *"TrustQR deterministic validation identifies structural and contextual inconsistencies. It does not establish merchant legitimacy or guarantee payment safety."*

---

## 1. Validation Pipeline Architecture

TrustQR evaluates parsed payment data through a strictly deterministic, non-AI rule pipeline:

```text
ParsedPaymentData (Immutable Read-Only Input)
             ↓
    [ 1. Recipient Check ]      (UPI ID format, non-empty, no dangerous protocols)
             ↓
    [ 2. Amount Check ]         (Numeric, finite, non-negative, <= ₹1 Crore)
             ↓
    [ 3. Currency Check ]       (ISO code: INR, USD, EUR, GBP)
             ↓
 [ 4. Suspicious Content Check] (Blocks HTML/<script>, flags prompt injection & PIN/OTP text)
             ↓
[ 5. Context Consistency Check] (Merchant display name vs. Recipient UPI handle similarity)
             ↓
  [ 6. High-Value Threshold ]   (Amount >= ₹10,000 triggers review warning)
             ↓
PaymentValidationResult (Frozen Output: "valid" | "needs_review" | "invalid")
```

---

## 2. Validation Statuses & Severities

| Status | Trigger Condition | Meaning |
| :--- | :--- | :--- |
| **`valid`** | All deterministic checks pass with zero failures or warnings. | Payload is structurally sound and internally consistent. |
| **`needs_review`** | Warning checks triggered (e.g. high-value transaction, recipient context mismatch, or suspicious instructions). | Structural data parsed, but user inspection is required before paying. |
| **`invalid`** | Any hard check failed (e.g. malformed recipient, invalid amount, unsupported currency, or HTML injection). | Payload violates structural rules; validation fails closed. |

---

## 3. Controlled Risk Indicator IDs

Every risk indicator is triggered by deterministic logic:

| Risk Indicator ID | Description | Default Status Impact |
| :--- | :--- | :---: |
| `invalid-recipient` | Recipient identifier is malformed or invalid syntax | `invalid` |
| `missing-recipient` | Payee handle parameter (`pa`) is absent | `invalid` |
| `invalid-amount` | Amount is negative, non-numeric, NaN, or Infinity | `invalid` |
| `unsupported-currency` | Currency ISO code is not supported | `invalid` |
| `unsafe-metadata` | Merchant name or metadata contains HTML/<script> tags | `invalid` |
| `suspicious-instruction-text` | Metadata contains prompt overrides or requests for PIN/OTP | `needs_review` |
| `recipient-context-mismatch` | Recipient handle does not match merchant display name | `needs_review` |
| `high-value-transaction` | Transaction amount $\ge ₹10,000$ | `needs_review` |
| `malformed-payment-context` | Unparseable or corrupt payload context | `invalid` |

---

## 4. High-Value Transaction Policy

- **Threshold**: $₹10,000$ (`HIGH_VALUE_THRESHOLD_INR`)
- **Behavior**: Amount $\ge ₹10,000$ triggers `high-value-transaction` warning.
- **Rule**: High-value status does **NOT** label the payment as fraud or scam. It requires explicit user review.

---

## 5. Merchant vs. Recipient Context Consistency

- Evaluates string similarity between merchant display name (e.g., `ABC Electronics`) and payee handle username (e.g., `abc`).
- Mismatch between display name (`ABC Electronics`) and payee handle (`random123@upi`) produces a `recipient-context-mismatch` warning.
- **Limitation**: String matching does not verify real-world ownership or corporate registration.

---

## 6. Structural Validation vs. Real-World Fraud Detection

TrustQR deterministic validation verifies **structural and parametric integrity only**. It cannot determine whether a real-world merchant is honest, legitimate, or compromised.
