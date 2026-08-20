# TrustPortal axe-core Accessibility Baseline Audit (`docs/axe-baseline.md`)

## 1. Overview & Tooling
- **Engine**: `@axe-core/playwright` / `axe-core`
- **Browser Environment**: Chromium 122+ / Headless Chrome
- **Target Pages**:
  1. **SevaConnect Demo Portal (`apps/demo`)**: Fictional government portal containing intentional accessibility defects for testing purposes.
  2. **TrustPortal Shadow DOM Confirmation Panel (`apps/extension/src/ui`)**: User-facing assistive remediation panel.

---

## 2. SevaConnect Demo Portal Baseline (Intentional Defects)

> [!NOTE]
> **Expected Intentional Defects**: The SevaConnect demo page intentionally contains standard WCAG 2.1 AA accessibility defects to evaluate TrustPortal's deterministic detector (`@trustportal/rules`).

| Fixture | WCAG Success Criteria | Expected axe Finding | Detection Rule ID |
| :--- | :--- | :--- | :--- |
| `missing-image-alt` | 1.1.1 Non-Text Content | `image-alt` (Images must have alt text) | `RULE_IMG_ALT_MISSING` |
| `filename-alt` | 1.1.1 Non-Text Content | `image-alt` (Quality alt text warning) | `RULE_IMG_ALT_FILENAME` |
| `unnamed-button` | 4.1.2 Name, Role, Value | `button-name` (Buttons must have accessible name) | `RULE_BUTTON_NAME_MISSING` |
| `unnamed-link` | 2.4.4 Link Purpose | `link-name` (Links must have discernible text) | `RULE_LINK_NAME_MISSING` |
| `unnamed-form` | 1.3.1 Info and Relationships | `label` (Form elements must have labels) | `RULE_FORM_LABEL_MISSING` |

---

## 3. TrustPortal Confirmation Panel Baseline (Shadow DOM)

- **Target Score**: **ZERO Critical or Serious axe-core Violations**.
- **Shadow DOM Inspection**: Scanned directly via ShadowRoot locators (`trustportal-host shadow-root`).
- **Verified Properties**:
  - `button-name`: All action buttons (`Accept`, `Edit`, `Reject`, `Undo`, `Dismiss`) have explicit text or `aria-label`.
  - `color-contrast`: High contrast ratios ($\ge 4.5:1$) for text and interactive controls.
  - `region`: Landmarked within `<div role="dialog" aria-labelledby="...">`.
  - `aria-allowed-attr`: Valid ARIA states (`aria-live="polite"`, `aria-label`).
