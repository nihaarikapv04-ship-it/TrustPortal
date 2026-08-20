# TrustPortal TSIF Trust Engine (`packages/scoring`)

> [!IMPORTANT]
> **Independent Authorization Boundary Notice**: The AI model's confidence raw score ($M$) is an untrusted raw signal. The Trust Engine operates as an independent validation subsystem that transforms AI proposals into calibrated, evidence-backed authorization decisions (`auto` | `confirm` | `reject`).

---

## 1. Core Architecture & Signal Components

```
AI Model Proposal (label, modelConfidence)
       ↓
Signal Extractor (R, C, M_calibrated, D, A, V, P, H)
       ├─ R: Rule confidence from deterministic detector (0.95 missing / 0.85 filename)
       ├─ C: Independent Context Agreement (token overlap with heading/text)
       ├─ M: Calibrated Model Confidence (via pluggable CalibrationModel)
       ├─ D: DOM & Role Consistency Validator
       ├─ A: Candidate Agreement (0.80 baseline)
       ├─ V: Visual Confidence (0.0 text baseline)
       ├─ P: Privacy Penalty (0.15 per redaction flag)
       └─ H: High-Impact Risk Penalty (0.50 if sensitive workflow)
       ↓
TAS Trust Score Calculation
       ↓
Non-Compensable Safety Gate (High-impact workflow / DOM mismatch check)
       ↓
TrustDecision { decision: "auto" | "confirm" | "reject", trustScore, signals, blockingReasons }
```

---

## 2. TAS Trust Score Formula

$$\text{TAS} = 100 \times \text{clamp}\left(0.25R + 0.20C + 0.20M + 0.15D + 0.10A + 0.10V - P - H, 0, 1\right)$$

> [!NOTE]
> **Operational Policy Weights**: The initial weights ($0.25R, 0.20C, 0.20M, 0.15D, 0.10A, 0.10V$) are starting operational policy values, not experimentally validated parameters. The score components remain individually inspectable to support research ablation studies.

---

## 3. Decision Thresholds & Hard Safety Gates

| Trust Score (TAS) Range | Default Decision | Hard Safety Gate Overrides |
| :--- | :--- | :--- |
| **90 – 100** | `auto` | Auto-apply ONLY for low-risk issues without high-impact context and with passing DOM consistency. |
| **75 – 89** | `confirm` | Human verification required in Closed Shadow DOM UI panel. |
| **0 – 74** | `reject` | Proposal rejected / abstained. |

### Non-Compensable Safety Gates:
1. **High-Impact Workflow Category**: If `coarsePageCategory` is `authentication`, `payment`, `identity`, `health`, `tax`, `legal`, or `benefits`, decision is **NEVER `auto`** regardless of trust score. Max decision allowed is `confirm` or `reject`.
2. **DOM Consistency Failure**: If $D < 0.50$, decision is forced to `reject`.
3. **Empty Label / Model Abstention**: Forced to `reject`.

---

## 4. Calibration Infrastructure & ECE Metric

```typescript
export interface CalibrationModel {
  readonly status: "uncalibrated" | "fitted";
  calibrate(rawConfidence: number): number;
}
```

- `UncalibratedModel`: Returns raw confidence unmodified, marking status as `"uncalibrated"`.
- `PlattScalingModel`: Implements logistic logit scaling calibration.
- `computeECE(predictions, labels)`: Evaluates Expected Calibration Error across prediction confidence bins.
