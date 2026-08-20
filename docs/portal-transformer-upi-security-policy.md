# UPI Transaction Safety Policy Specification (`docs/portal-transformer-upi-security-policy.md`)

> **Security Policy Standard**: Formally defines the critical fields, critical attributes, allowed attributes, and security evaluation rules of `UpiSecurityPolicy`.

---

## 1. Critical Field & Attribute Registers

- **Critical Fields**: `amount`, `currency`, `recipient`, `recipientUpiId`, `senderAccount`, `bankAccount`, `transactionId`, `paymentUrl`, `deepLink`, `paymentStatus`, `authorizationState`, `otp`, `pin`, `cvv`, `authenticationToken`, `sessionToken`.
- **Critical Attributes**: `href`, `src`, `action`, `formaction`, `onclick`, `onchange`, `oninput`, `style`, `innerHTML`, `outerHTML`.
- **Allowed Patch Attributes**: `alt`, `aria-label`, `aria-labelledby`, `aria-describedby`, `role`.

---

## 2. Invariant Rules
1. `AUTHORIZED_AI_TRANSACTION_MUTATIONS = 0`
2. `UNSAFE_TRANSACTION_MUTATIONS = 0`
3. AI model proposals may NEVER alter financial amounts or recipient UPI IDs in accessible labels.
