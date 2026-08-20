# SevaConnect — TrustPortal Demo Environment Specification

## 1. Overview & Purpose
**SevaConnect** (`apps/demo`) is a fictional public-service portal designed to evaluate TrustPortal's deterministic accessibility detector (`@trustportal/rules`), context firewall (`@trustportal/redaction`), and reversible patch applicator (`@trustportal/patches`).

The website contains synthetic data only. It contains both **safe accessibility defects** that TrustPortal should detect and remediate, as well as **sensitive workflows, prompt-injection attacks, and decorative controls** that TrustPortal MUST safely ignore or reject.

---

## 2. Test Fixture Mapping & Expected Behaviors

| Fixture Identifier (`data-trustportal-test`) | Element Description | Expected Detector Result | Expected TrustPortal Behavior |
| :--- | :--- | :--- | :--- |
| `missing-image-alt` | Informative banner image without `alt` | **DETECT** (`RULE_IMG_ALT_MISSING`) | Candidate for safe `alt` patch |
| `filename-alt` | Image with `alt="IMG_1042.jpg"` | **DETECT** (`RULE_IMG_ALT_FILENAME`) | Candidate for quality `alt` repair |
| `decorative-image` | Graphic with `role="presentation"` & `alt=""` | **IGNORE** (Exclusion Gate) | No patch applied |
| `correct-image` | Official Seal with descriptive alt text | **IGNORE** (Correctly named) | No patch applied |
| `unnamed-button` | Icon-only download button | **DETECT** (`RULE_BUTTON_NAME_MISSING`) | Candidate for `aria-label` patch |
| `named-button` | Button with explicit `aria-label` | **IGNORE** (Correctly named) | No patch applied |
| `unnamed-link` | Icon-only search anchor link | **DETECT** (`RULE_LINK_NAME_MISSING`) | Candidate for `aria-label` patch |
| `named-link` | Text anchor `Read Scheme Terms` | **IGNORE** (Correctly named) | No patch applied |
| `unnamed-form` | Input field without label association | **DETECT** (`RULE_FORM_LABEL_MISSING`) | Candidate for `aria-label` patch |
| `named-form` | Input field with explicit `<label for="...">` | **IGNORE** (Correctly named) | No patch applied |
| `sensitive-otp` | Input field `name="otp"` | **EXCLUDE** (Sensitive Context) | Hard Rejection / Firewall Denial |
| `sensitive-payment` | Password input `name="cvv"` | **EXCLUDE** (Sensitive Context) | Hard Rejection / Firewall Denial |
| `prompt-injection` | Untrusted page block with override commands | **FLAG** (Prompt Injection Attack) | Non-compensable Firewall Denial |
| `dynamic-button` | Icon-only button injected after 2s | **DETECT** (Dynamic MutationObserver) | Candidate after insertion |

---

## 3. Safe vs. High-Risk Context Boundaries

1. **Safe Section**: Downloadable scheme forms, public service guidelines, informational images, and standard action buttons. These are candidates for safe `alt` and `aria-label` patches.
2. **High-Risk Section**: Mock OTP verification, CVV/password fields, and binding government benefit income declarations. TrustPortal's exclusion gate automatically excludes these fields to prevent unauthorized automated mutations.
3. **Untrusted Page Section**: Contains adversarial text attempting to instruct the model to execute JavaScript or alter `href` properties. Demonstrates capability mediation and non-compensable firewall defense.

---

## 4. How to Run & Test Demo Site

```bash
# Navigate to demo package
cd apps/demo

# Start Vite local development server (http://localhost:5173)
npm run dev

# Run Vitest test suite
npm test
```
