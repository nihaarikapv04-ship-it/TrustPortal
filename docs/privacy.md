# TrustPortal Privacy Framework

## Local-First Privacy Mandate
1. **Deterministic Local Detection**: All accessibility defect detection occurs locally within the browser client.
2. **Deny-by-Default Sensitive Workflow Gate**: Automatic network abstention on login, registration, payment, tax, banking, health, and legal URL paths.
3. **PII Redaction Engine**: Before any context payload is constructed, text is scrubbed for:
   - Email addresses
   - Phone numbers
   - Credit card numbers
   - Social Security / Aadhaar / PAN numbers
   - Authentication tokens & cookies

## Data Transport & Telemetry
- **Bounded Context**: Context extraction is capped to nearby headings, parent text, and bounded sibling text (maximum token budget enforced).
- **No HTML Serialization**: Full page HTML and full raw screenshots are never transmitted.
- **Audit Logs**: Research telemetry stores only redacted metadata (rule ID, issue type, trust score, decision, latency).
