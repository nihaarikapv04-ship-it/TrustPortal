# Confidence State & Abstention Analysis (`docs/portal-transformer-abstention-analysis.md`)

> **Source Evidence**: Extracted empirically from [`reports/evaluation/svg-benchmark-v2-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/svg-benchmark-v2-results.json)

---

## 1. Confidence State Architecture

Deterministic candidate evaluation returns a structured `confidenceState` classification to prevent low-confidence automatic DOM mutations:

| Confidence State | Classification Definition | System Action |
| :--- | :--- | :--- |
| **`HIGH_CONFIDENCE_DEFECT`** | Unlabelled interactive or exposed graphic element with clear missing accessible name | Flagged as candidate for remediation |
| **`HIGH_CONFIDENCE_VALID`** | Element possesses explicit valid label, decorative role, or parent label | Excluded from remediation candidates |
| **`AMBIGUOUS_ABSTAIN`** | Conflicting ARIA attributes, malformed ID references, or unresolved symbol references | Detector abstains; defers to human confirmation panel |

---

## 2. Quantitative Abstention & Coverage Metrics ($N = 500$ Unseen SVG Benchmark V2)

$$\text{Coverage} = \frac{500 - 0}{500} = 1.0000 \quad (100.0\%)$$

$$\text{Abstention Rate} = \frac{0}{500} = 0.0000 \quad (0.0\%)$$

---

## 3. Thesis Narrative Insight
By exposing explicit confidence states (`HIGH_CONFIDENCE_DEFECT`, `HIGH_CONFIDENCE_VALID`, `AMBIGUOUS_ABSTAIN`), Portal Transformer ensures that ambiguous edge cases (such as conflicting ARIA labels or broken `aria-labelledby` chains) do not force automatic incorrect DOM mutations.
