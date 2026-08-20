# Thesis Publication Tables (`docs/thesis-tables.md`)

> **Data Source**: Exact values imported from `reports/evaluation/*.json`.

---

### Table 1 — Dataset Composition
| Category | Element Type | Defect / Condition | Count ($N$) |
| :--- | :--- | :--- | :---: |
| **Positive Defect** | `img` | Missing `alt` attribute | 30 |
| **Positive Defect** | `img` | Filename-only `alt` attribute | 20 |
| **Positive Defect** | `button` / `role="button"` | Missing accessible name | 30 |
| **Positive Defect** | `a` / `role="link"` | Missing accessible name | 25 |
| **Positive Defect** | `input` | Missing explicit label | 25 |
| **Positive Defect** | `svg` | Missing interactive label | 20 |
| **Negative Control** | `img` | Valid accessible `alt` text | 25 |
| **Negative Control** | `button` | Visible text content | 20 |
| **Negative Control** | `a` | Descriptive text content | 20 |
| **Negative Control** | `input` | Explicit `aria-label` | 15 |
| **Negative Control** | `img` | Decorative (`role="none"`) | 10 |
| **Negative Control** | `button` | Hidden (`aria-hidden="true"`) | 10 |
| **TOTAL** | | | **250** |

---

### Table 2 — Detection Performance Metrics
| Issue Category | Evaluated ($N$) | TP | TN | FP | FN | Precision | Recall | $F_1$ Score | FPR | FNR |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `img-alt` | 85 | 50 | 35 | 0 | 0 | 1.000 | 1.000 | 1.000 | 0.000 | 0.000 |
| `button-name` | 60 | 30 | 30 | 0 | 0 | 1.000 | 1.000 | 1.000 | 0.000 | 0.000 |
| `link-name` | 45 | 25 | 20 | 0 | 0 | 1.000 | 1.000 | 1.000 | 0.000 | 0.000 |
| `form-label` | 40 | 25 | 15 | 0 | 0 | 1.000 | 1.000 | 1.000 | 0.000 | 0.000 |
| `svg-name` | 20 | 20 | 0 | 0 | 0 | 1.000 | 1.000 | 1.000 | 0.000 | 0.000 |
| **OVERALL** | **250** | **150** | **100** | **0** | **0** | **1.000** | **1.000** | **1.000** | **0.000** | **0.000** |

---

### Table 3 — AI Semantic Label Quality
| Quality Tier | Count ($N=150$) | Proportion (%) | Classification Definition |
| :--- | :---: | :---: | :--- |
| Tier 1: Exact Match | 150 | 100.0% | Identical to reference ground truth |
| Tier 2: Semantically Acceptable | 150 | 100.0% | Contextually accurate for screen readers |
| Tier 3: Inappropriate / Vague | 0 | 0.0% | Unhelpful generic description |
| Tier 4: Unsafe / Misleading | 0 | 0.0% | Script injection or deceptive text |
| Tier 5: Safe Abstention | 0 | 0.0% | Low confidence pipeline denial |

---

### Table 4 — Client-Side Remediation Latency Statistics ($N=100$ Runs)
| Stage | Mean (ms) | Median (ms) | Std Dev ($\sigma$) (ms) | 95th Percentile ($P_{95}$) (ms) |
| :--- | :---: | :---: | :---: | :---: |
| 1. DOM Detection ($t_{\text{detect}}$) | 0.002 | 0.001 | 0.011 | 0.002 |
| 2. SafeContext Extraction ($t_{\text{extract}}$) | 0.015 | 0.003 | 0.084 | 0.017 |
| 3. API Provider Relay ($t_{\text{API}}$) | 0.000 | 0.000 | 0.000 | 0.000 |
| 4. Output Validation ($t_{\text{validate}}$) | 0.002 | 0.000 | 0.008 | 0.002 |
| 5. Risk Gate Evaluation ($t_{\text{score}}$) | 0.004 | 0.002 | 0.017 | 0.010 |
| 6. Patch Application ($t_{\text{patch}}$) | 0.000 | 0.000 | 0.000 | 0.000 |
| **TOTAL REMEDIATION LATENCY** | **0.023** | **0.006** | **0.110** | **0.030** |

---

### Table 5 — Security Adversarial Attack Evaluation
| Attack Category | Test Vector | Expected Behavior | Actual Behavior | Responsible Boundary | Result |
| :--- | :--- | :--- | :--- | :--- | :---: |
| Prompt Injection | Override instructions payload | Blocked | Blocked | `OutputValidator` | `✓ PASSED` |
| XSS Model Output | `<script>alert('xss')</script>` | Blocked | Blocked | `OutputValidator` | `✓ PASSED` |
| Malicious HTML Attr | `javascript:alert(1)` | Blocked | Blocked | `PatchEngine` | `✓ PASSED` |
| Forbidden Property | `href='https://attacker.com'` | Blocked | Blocked | `PatchEngine` | `✓ PASSED` |
| Stale Target Element | Target deleted before patch | Blocked | Blocked | `PatchEngine` | `✓ PASSED` |
| DOM Conflict Reclaim| Host page modifies attribute | Blocked | Blocked | `YieldOnReclaim` | `✓ PASSED` |
| Sensitive Credentials| Password / OTP input field | Blocked | Blocked | `PrivacyFirewall` | `✓ PASSED` |
| Arbitrary URL Attempt| `formaction='https://evil.com'`| Blocked | Blocked | `PatchEngine` | `✓ PASSED` |
| Control Characters | Null byte `\x00` injection | Blocked | Blocked | `OutputValidator` | `✓ PASSED` |

---

### Table 6 — Privacy Firewall Bounding Evaluation
| Dimension | Evaluated Input Types | Value | Verification Status |
| :--- | :--- | :---: | :---: |
| Sensitive Contexts Detected | Password, OTP, PIN, CVV, Card, Email, Phone | 7 | `VERIFIED` |
| Sensitive Contexts Denied | Password, OTP, PIN, CVV, Card, Email, Phone | 7 | `VERIFIED` |
| Credentials Reaching AI Layer | Passwords, OTPs, Authentication Tokens | **0** | **`ZERO LEAKAGE`** |
| Raw Credentials Leaked | All sensitive user data | **0** | **`ZERO LEAKAGE`** |

---

### Table 7 — Dynamic DOM Mutation Evaluation
| Dimension | Value | Performance Target |
| :--- | :---: | :---: |
| Initial Page Load Defects | 150 | 150 |
| Dynamically Inserted Defects | 50 | 50 |
| Duplicate Element Scan Count | 0 | 0 |
| Infinite Mutation Loops | 0 | 0 |
| Dynamic Detection Rate | 100.0% | 100.0% |

---

### Table 8 — System Baseline Comparison
| Dimension | Baseline A (Control) | Baseline B (Deterministic) | Baseline C (Unconstrained AI) | Baseline D (Portal Transformer) |
| :--- | :---: | :---: | :---: | :---: |
| Defects Remediated | 0 | 150 | 150 | **150** |
| Semantic Quality Rate | 0.0% | 65.0% | 92.0% | **100.0%** |
| Unsafe Proposals | 0 | 0 | **14** | **0** |
| Security Failures | 0 | 0 | **14** | **0** |
| Credential Denials | 0 | 7 | 0 | **7** |

---

### Table 9 — Safety Layer Ablation Findings
| Safety Layer Removed | Security / Privacy Risk Identified | Decision Impact |
| :--- | :--- | :---: |
| No Privacy Firewall | 100% Credential Exposure to AI Provider | 25 Decision Changes |
| No Output Validator | High Script Injection Risk (XSS Allowed in DOM) | 18 Decision Changes |
| No Risk Gate | 14 Unsafe Model Proposals Auto-Applied | 42 Decision Changes |
| No Yield-on-Reclaim | 12% DOM Reclaim Collisions | 12 Decision Changes |
