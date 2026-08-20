# TrustQR User Experience & UI Architecture Specification (`docs/trustqr-ui.md`)

> **Notice 1**: *"TrustQR provides a security-constrained, explainable verification layer that helps users inspect QR-payment information before authorizing a transaction."*  
> **Notice 2**: *"TrustQR does not execute payments or grant automatic transaction authorization."*

---

## 1. User Journey & Interface Pipeline

TrustQR follows a mobile-first, security-constrained advisory journey:

```text
               [ Scan / Select QR Payload ]
                             ↓
              [ Decoded Payment Facts Card ]
            (Recipient, Payee UPI ID, Amount)
                             ↓
                 [ TrustQR Risk Card ]
     (INFORMATIONAL, NEEDS_REVIEW, HIGH_RISK_WARNING, BLOCKED)
                             ↓
             [ Advisory AI Explanation Card ]
         (Summary, Key Reasons, Verification Steps)
                             ↓
                 [ Verification Checklist ]
     ("Before You Pay": Verify payee name, handle, & amount)
                             ↓
              [ Action Handoff Navigation ]
    ("Continue Manually in Your Payment App" — NO Pay Button!)
```

---

## 2. Visual Distinction: Authoritative Facts vs AI Explanation

To prevent user confusion between immutable payload data and advisory AI explanations, the UI maintains strict visual demarcation:

1. **`PAYMENT FACT — Decoded QR`**: Rendered in a grey badge block. Displays authoritative parsed facts (`merchantName`, `recipient`, `amount`, `currency`, `transactionRef`) derived strictly from `ParsedPaymentData`.
2. **`AI EXPLANATION — Advisory Only`**: Rendered in an indigo badge block. Displays advisory summary, reasons, and verification steps derived from `ValidatedPaymentExplanation`.

---

## 3. Risk State Visualizations

| Risk Decision | Badge Style | User Guidance Banner | Action Handoff |
| :--- | :---: | :--- | :--- |
| **`INFORMATIONAL`** | 🟢 Green | Payment information passed structural & consistency checks. | `[ Continue Manually in Your Payment App ]` |
| **`NEEDS_REVIEW`** | 🟡 Yellow | Merchant display name and payee handle do not match. Verify details. | `[ Continue Manually in Your Payment App ]` |
| **`HIGH_RISK_WARNING`** | 🔴 Red | High-value transaction threshold met ($\ge ₹10,000$). Exercise heightened review. | `[ Continue Manually in Your Payment App ]` |
| **`BLOCKED`** | 🔴 Dark Red | Security or privacy policy violation detected. Verification halted. | **Action Button Removed** ("Payment Blocked") |

---

## 4. Accessibility & Security Controls

### 4.1 Accessibility (WCAG 2.1 AA Compliance)
- **ARIA Live Regions**: Status region utilizes `aria-live="polite"` and `role="status"` for screen reader announcements.
- **Semantic HTML**: Utilizes `<header>`, `<main>`, `<section>`, `<select>`, `<table>`, `<footer>`.
- **Keyboard Navigation**: Interactive controls (`select`, `button`) have visible focus outlines (`outline: 2px solid var(--accent)`).

### 4.2 Security Constraints
- **Zero DOM Script Execution**: Uses `escapeHTML()` to sanitize raw QR metadata and AI explanation text before DOM insertion.
- **Zero Credentials / Zero Inputs**: The UI contains **zero** `<input type="password">`, PIN, or OTP input elements.
- **Zero Auto-Pay / Zero Pay Button**: The UI contains **zero** "Pay Now" or "Authorize Transaction" buttons.
