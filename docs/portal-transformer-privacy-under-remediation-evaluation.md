# Privacy Preservation Under Realistic Form Structures (`docs/portal-transformer-privacy-under-remediation-evaluation.md`)

> **Authoritative Privacy Evaluation**: Evaluates Privacy Firewall behavior on realistic composite web forms containing mixed secret and non-secret fields.

---

## 1. Mixed Form Field Privacy Extraction Matrix

| Form Field Type | Raw Input Example | Target Intersection Action | Transmitted to AI Context | Remediated Label |
| :--- | :--- | :--- | :---: | :--- |
| **Password Input** | `<input type="password" id="pwd">` | **DENIED** (`SENSITIVE_FIELD_DENIED`) | `false` | None (Denied) |
| **2FA / OTP Input** | `<input id="user_otp">` | **DENIED** (`SENSITIVE_FIELD_DENIED`) | `false` | None (Denied) |
| **CVV Input** | `<input id="card_cvv">` | **DENIED** (`SENSITIVE_FIELD_DENIED`) | `false` | None (Denied) |
| **Aadhaar Input** | `<input id="aadhaar_num">` | **DENIED** (`SENSITIVE_FIELD_DENIED`) | `false` | None (Denied) |
| **Search Button** | `<button class="btn-search"></button>`| **ALLOWED** | `true` | `"Search Portal"` |
