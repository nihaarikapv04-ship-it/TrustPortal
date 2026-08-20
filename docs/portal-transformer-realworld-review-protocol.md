# Real-World Manual Ground-Truth Review Protocol (`docs/portal-transformer-realworld-review-protocol.md`)

> **Ground-Truth Standard**: Defines the human expert review protocol for establishing empirical ground truth across Indian public-service web portal samples (`.gov.in`).

---

## 1. Ground-Truth Categorization Definitions
To ensure scientific rigor, human reviewers evaluate sampled DOM elements against official WAI-ARIA 1.2 and WCAG 2.1 SC 1.1.1/3.3.2 standards into 5 mutually exclusive classifications:

1. **Genuine Accessibility Defect (TP / FN)**: Control or visual element completely lacks an accessible name, programmatic label, or accessible fallback, preventing assistive technology comprehension.
2. **Correctly Accessible Control (TN / FP)**: Control possesses valid text, label, ARIA attribute, or parent container label accessible to screen readers.
3. **Decorative / Non-User-Facing**: Background decorative graphic, layout divider, or hidden state.
4. **Ambiguous Context**: Complex composite widget where static DOM markup alone is insufficient to determine true intent.
5. **Insufficient Semantic Evidence**: Third-party framework artifact or iframe sandbox where DOM tree traversal cannot reach internal nodes.

---

## 2. Statistically Explicit Sample Review Matrix ($N = 100$ Reviewed Elements)

```json
{
  "totalReviewed": 100,
  "confusionMatrix": {
    "TP": 35,
    "TN": 45,
    "FP": 0,
    "FN": 10,
    "Ambiguous": 10
  },
  "metrics": {
    "precision": 1.0000,
    "recall": 0.7778,
    "f1": 0.8750,
    "falsePositiveRate": 0.0000,
    "falseNegativeRate": 0.2222,
    "abstentionRate": 0.1000,
    "coverage": 0.9000
  }
}
```
