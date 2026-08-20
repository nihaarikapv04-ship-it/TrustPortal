# TrustPortal Privacy Firewall & Minimal Context Extractor (`packages/redaction`)

## 1. Overview & Data Flow Architecture
The Privacy Firewall enforces a local, deny-by-default capability boundary. It ensures that when TrustPortal evaluates accessibility defects, **only bounded, sanitized, non-sensitive context (`SafeContext`) is constructed**.

```
Live DOM Candidate
       ↓
Deterministic Detector
       ↓
Privacy Firewall (evaluate)
  ├── 1. Target Intersection Check (Is target element password/OTP/payment/ID?) ──> [DENY]
  ├── 2. Sensitive URL Check (/login, /checkout, /tax, /health, /banking) ─────────> [DENY]
  ├── 3. Minimal Context Extraction & Attribute Allowlisting ──────────────────────> [SafeContext]
  ├── 4. Deterministic PII Redactor (Email, Phone, Card, SSN/Aadhaar/PAN, Tokens) ─> [REDACTED_*]
  └── 5. Decision Gate (allow | redact | deny)
```

---

## 2. Allowed vs. Forbidden Attribute Allowlist

| Attribute Category | Attributes Allowed | Status | Action |
| :--- | :--- | :--- | :--- |
| **Safe Semantic Attributes** | `tag`, `role`, `alt`, `title` (safe), `aria-label`, `aria-labelledby`, `aria-describedby`, `type` (non-sensitive), `lang` | **ALLOWED** | Extracted & sanitized |
| **Forbidden Sensitive Attributes** | `value`, `password`, `onclick`, `onload`, `onerror`, `style`, `class`, `id`, `cookies`, `tokens`, `query-secrets` | **FORBIDDEN** | Excluded at runtime |

---

## 3. Context Character & Token Budgets (`DEFAULT_CONTEXT_BUDGET`)

To prevent DOM serialization overflow and token exhaustion attacks:

```typescript
export interface ContextBudget {
  maxElementText: 150,        // Max characters for element visible text
  maxAssociatedLabel: 200,    // Max characters for associated label
  maxHeading: 200,            // Max characters for nearest heading
  maxLandmark: 100,           // Max characters for nearest landmark
  maxNearbyText: 300,         // Max characters for nearby sibling text
  maxNearbyNodes: 5,          // Max nearby DOM nodes inspected
  maxTotalCharacters: 800     // Maximum total character footprint across all fields
}
```

---

## 4. Sensitive Workflow Policy & Target Intersection Rule

1. **Target Intersection Rule**: If the target element itself is a sensitive input field (`type="password"`, `name="otp"`, `id="cvv"`, `name="card"`, `autocomplete="one-time-code"`), the firewall issues an immediate **DENY** decision. **No `SafeContext` object is produced.**
2. **URL Path Policy**: If the URL path matches sensitive workflow patterns (`/login`, `/checkout`, `/tax`, `/health`, `/banking`, `/identity`), the firewall issues an immediate **DENY** decision.
3. **URL Query Secret Sanitization**: Query parameter secrets (`https://example.gov/apply?token=SECRET123`) are automatically stripped, preserving only origin and safe path (`https://example.gov/apply`).

---

## 5. PII Redaction Placeholders

Deterministic regex scrubbers replace sensitive data with complete placeholders:
- Email: `[REDACTED_EMAIL]`
- Phone: `[REDACTED_PHONE]`
- Payment Card: `[REDACTED_CARD]`
- National ID (SSN / Aadhaar / PAN): `[REDACTED_ID]`
- Tokens & Keys: `[REDACTED_TOKEN]`
- Query Secrets: `?secret=[REDACTED_SECRET]`

> [!CAUTION]
> **Legal Compliance & Defense-in-Depth Note**: Privacy protection is defense-in-depth, not a guarantee of 100% PII detection. Legal review is required prior to production deployment involving personal-data processing under India's Digital Personal Data Protection (DPDP) Act 2023.
