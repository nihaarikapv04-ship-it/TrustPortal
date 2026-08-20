# Final Thesis Discussion (`docs/portal-transformer-final-discussion.md`)

> **Authoritative Thesis Discussion**: Evaluates empirical observations, interpretations, scientific significance, and limitations for each major finding.

---

## 1. Discussion Structure

- **OBSERVATION 1**: Real-world reviewed sample precision = 100.0%, recall = 77.78%, abstention = 10.0%.
  - *INTERPRETATION*: The system strongly favors safe remediation over aggressive, speculative coverage.
  - *SCIENTIFIC SIGNIFICANCE*: Demonstrates that explicit security constraints preserve zero false-alarm remediation on evaluated public service portals.
  - *LIMITATION*: Based on a curated 20-page `.gov.in` sample and cannot establish population-level generalization.

- **OBSERVATION 2**: Holdout SVG V3 recall = 53.85%, abstention = 33.33%.
  - *INTERPRETATION*: `SvgSemanticResolver` defers 200 unresolved external symbol subtrees to human review.
  - *SCIENTIFIC SIGNIFICANCE*: Confirms that explicit abstention provides a measurable safety benefit at the cost of remediation coverage.
  - *LIMITATION*: Requires local symbol definitions to achieve high recall on complex SVG sprites.
