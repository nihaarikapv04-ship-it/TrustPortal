# TrustQR Payment QR Format & Parsing Specification (`docs/trustqr-qr-format.md`)

> **Notice**: *"TrustQR structural parsing does not establish merchant legitimacy or guarantee payment safety."*

---

## 1. Overview & Supported QR Format

TrustQR implements a deterministic, non-AI payment payload decoder and parser layer designed for UPI digital payment strings (`upi://pay?...`).

### 1.1 Supported Payment URI Scheme
- **URI Scheme**: `upi://pay`
- **Supported Parameters**:
  - `pa` (Payee Address / Recipient UPI ID): **Required** (e.g. `abc@upi`)
  - `pn` (Payee / Merchant Display Name): Optional (e.g. `ABC%20Electronics`)
  - `am` (Transaction Amount): **Required** (Non-negative numeric string, e.g. `2500`)
  - `cu` (Currency ISO Code): Optional (Defaults to `INR`, supported: `INR`, `USD`, `EUR`, `GBP`)
  - `tr` (Transaction Reference Identifier): Optional (e.g. `REF123456`)
  - `tn` (Transaction Note): Optional

---

## 2. Immutability & Security Invariants

### 2.1 Read-Only Payment Facts
Once parsed, `ParsedPaymentData` objects are frozen (`Object.isFrozen(data) === true`). Downstream AI prompt generators, risk engines, and UI rendering modules consume payment facts as immutable read-only values. AI cannot mutate or override recipient, amount, or currency values.

### 2.2 Security Rejection Boundaries
The parser fails closed (`success: false`) for:
1. **Dangerous Protocols**: Payloads attempting `javascript:`, `data:`, `file:`, `http:`, `https:`, `blob:`, or script injection.
2. **Missing Recipient**: Missing `pa` payee address parameter.
3. **Invalid Amount**: Negative, non-numeric, or missing `am` parameter.
4. **Unsupported Currency**: Currency codes outside supported ISO list.
5. **No Execution / No Network**: The parser never executes decoded text as code (`eval` is strictly prohibited) and makes zero external network requests.

---

## 3. Zod Schema Definitions

```typescript
export const ParsedPaymentDataSchema = z.object({
  scheme: z.literal("upi"),
  recipient: z.string().min(1),
  merchantName: z.string().optional(),
  amount: z.number().nonnegative(),
  currency: z.string().length(3),
  transactionRef: z.string().optional(),
  transactionNote: z.string().optional(),
  metadata: z.record(z.string()).default({})
});
```

---

## 4. Synthetic Fixture Format

All fixture data in `apps/trustqr/src/scenarios/fixtures.ts` is explicitly marked `TRUSTQR SYNTHETIC TEST DATA` and contains zero real bank accounts, payment credentials, or real merchant keys.

Examples:
- **Scenario A**: `upi://pay?pa=abc@upi&pn=ABC%20Electronics&am=2500&cu=INR`
- **Scenario B**: `upi://pay?pa=random123@upi&pn=ABC%20Electronics&am=2500&cu=INR`
- **Scenario C**: `upi://pay?pa=random123@upi&am=50000&cu=INR`
