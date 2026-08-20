# Quantitative Abstention & Coverage Analysis (`docs/portal-transformer-svg-abstention.md`)

> **Source Evidence**: Extracted empirically from [`reports/evaluation/svg-benchmark-v3-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-benchmark-v3-results.json)  
> **Holdout SVG Benchmark V3 Size**: $N = 600$ Test Cases

---

## 1. Quantitative Coverage & Abstention Metrics

$$\text{Coverage} = \frac{N_{\text{total}} - N_{\text{abstain}}}{N_{\text{total}}} = \frac{600 - 200}{600} = 0.6667 \quad (66.67\%)$$

$$\text{Abstention Rate} = \frac{N_{\text{abstain}}}{N_{\text{total}}} = \frac{200}{600} = 0.3333 \quad (33.33\%)$$

---

## 2. Breakdown of Abstained Case Categories ($N = 200$)

| Abstention Category Reason | Abstained Count | Root Cause / Security Invariant | System Action |
| :--- | :---: | :--- | :--- |
| **`UNRESOLVED_LOCAL_SYMBOL_REFERENCE`** | 75 | `<use href="#missing">` symbol ID absent from local `domMap` | Abstain (Defers to human confirmation) |
| **`EXTERNAL_OR_UNSAFE_REFERENCE`** | 50 | External CDN URL, `data:`, `blob:`, or `javascript:` URI | Abstain (Zero network requests allowed) |
| **`CONFLICTING_ARIA_ATTRIBUTES`** | 50 | Element specifies both `aria-label` and `aria-labelledby` | Abstain (Prevents ambiguous label mutation) |
| **`DUPLICATE_SYMBOL_ID_AMBIGUITY`** | 25 | Duplicate ID attributes in malformed DOM markup | Abstain (Prevents targeting wrong symbol node) |
| **TOTAL ABSTENTIONS** | **200** | **Uncertainty & Security Boundaries Enforced** | **Zero False-Alarm Mutations** |

---

## 3. The Precision / Recall Trade-off Thesis

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   THE PRECISION / RECALL TRADE-OFF                     │
├────────────────────────────────────────────────────────────────────────┤
│  WITHOUT ABSTENTION (Forced Repairs):                                  │
│  - Precision: 83.33% (50 False-Alarm Mutations)                        │
│  - False Positive Rate: 20.0%                                          │
│                                                                        │
│  WITH PRINCIPLED ABSTENTION (Portal Transformer V7):                   │
│  - Precision: 100.0% (0 False-Alarm Mutations)                         │
│  - False Positive Rate: 0.0%                                           │
│  - Abstention Rate: 33.33% (200 Ambiguous Cases Deferred)              │
│  - Coverage: 66.67%                                                    │
└────────────────────────────────────────────────────────────────────────┘
```
