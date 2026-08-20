# Experiment 5: Privacy Firewall Evaluation Results (`docs/portal-transformer-privacy-results.md`)

> **Source Data**: Generated empirically via `npm run evaluate:portal-transformer` -> [`reports/evaluation/privacy-results.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/evaluation/privacy-results.json)  
> **Evaluated Sensitive Input Types**: Password, OTP, UPI PIN, CVV, Card Number, Email, Phone Number

---

## 1. Privacy Bounding Metrics

| Privacy Metric Dimension | Value | Target Requirement | Verification Status |
| :--- | :---: | :---: | :---: |
| **Sensitive Contexts Detected** | **7** | N/A | `VERIFIED` |
| **Sensitive Contexts Denied** | **7** | 7 | `VERIFIED` |
| **Raw Credentials Reaching AI** | **0** | **0** | **`VERIFIED ZERO LEAKAGE`** |
| **Raw Sensitive Credentials Leaked**| **0** | **0** | **`VERIFIED ZERO LEAKAGE`** |
| **PII Redaction Rate** | **100.0%** | 100.0% | `VERIFIED` |
| **Zero-Leakage State** | **TRUE** | TRUE | `VERIFIED` |

---

## 2. Key Findings
1. **Target Intersection Enforcement**: Input fields with `type="password"`, `name="otp"`, `id="cvv"`, or sensitive attributes were immediately denied by the `PrivacyFirewall` before any context extraction occurred.
2. **Zero Leakage**: Zero raw credentials or authentication secrets were transmitted to the AI inference provider.
