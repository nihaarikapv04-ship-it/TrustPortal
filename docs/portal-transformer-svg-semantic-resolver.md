# SVG Semantic Resolver Architecture (`docs/portal-transformer-svg-semantic-resolver.md`)

> **Source Evidence**: Extracted empirically from [`packages/rules/src/svg_resolver.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/rules/src/svg_resolver.ts) and [`reports/evaluation/svg-benchmark-v3-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-benchmark-v3-results.json)

---

## 1. Architectural Design & Resolver Decision Model

```text
Input SVG Element Representation
              ↓
[1. ARIA Hidden Gate (aria-hidden="true")] ──→ HIGH_CONFIDENCE_VALID
              ↓
[2. Presentation Role Gate (role="presentation")] ──→ HIGH_CONFIDENCE_VALID
              ↓
[3. Parent Interactive Ancestor Gate (button / a)] ──→ HIGH_CONFIDENCE_VALID
              ↓
[4. Safe Reference Policy Gate (<use href="...">)]
      ├── External / Cross-Origin / URI Scheme ──→ AMBIGUOUS_ABSTAIN
      └── Local Symbol Reference (#id)
            ├── Symbol Resolved in DOM Map ──→ Evaluate Symbol Title/Desc
            └── Symbol Missing in DOM Map ──→ AMBIGUOUS_ABSTAIN
              ↓
[5. Conflicting ARIA / Duplicate ID Gate] ──→ AMBIGUOUS_ABSTAIN
              ↓
[6. Accessible Name Resolution (<title>, <desc>, aria-label)]
      ├── Name Present ──→ HIGH_CONFIDENCE_VALID
      └── Name Missing + Independently Exposed ──→ HIGH_CONFIDENCE_DEFECT
```

---

## 2. Structured Evidence Output Schema

Every evaluation returns structured explainable evidence:
```json
{
  "decision": "AMBIGUOUS_ABSTAIN",
  "reason": "EXTERNAL_OR_UNSAFE_REFERENCE",
  "confidence": 0.0,
  "parentAccessibleName": null,
  "svgAccessibleName": null,
  "referenceType": "external_url",
  "referenceResolved": false,
  "externalReference": true,
  "ariaHidden": false,
  "role": "img",
  "hasTitle": false,
  "hasDescription": false
}
```

---

## 3. Safe Reference Policy Rules
1. **Local Fragment References (`#symbol_id`)**: Inspected locally via `domMap` lookup.
2. **External / Remote References (`https://...`, `http://...`)**: Rejected with zero network dispatches.
3. **Disallowed URI Schemes (`javascript:`, `data:`, `blob:`, `file:`)**: Rejected immediately; returns `AMBIGUOUS_ABSTAIN`.
