# Live Demo Test Scenarios (`docs/portal-transformer-demo-scenarios.md`)

> **Demo Scenario Matrix**: Defines 10 live demo scenarios covering missing labels, image alts, broken ARIA, prompt injections, and TOCTOU target replacements.

---

## 1. 10 Live Demo Scenarios

1. **Missing Button Label**: Unlabelled `<button><svg></svg></button>` remediated to `aria-label="Search Portal"`.
2. **Icon-Only Link**: Unlabelled `<a href="/print"><svg></svg></a>` remediated to `aria-label="Print Document"`.
3. **Missing Image Alt**: `<img src="/logo.png">` remediated to `alt="National Portal Logo"`.
4. **Invalid Alt Sentinel**: `<img src="/photo.png" alt="undefined">` remediated to `alt="Official Photo"`.
5. **Broken `aria-labelledby`**: Missing target ID chain remediated to `aria-label="User Account Settings"`.
6. **Valid Labelled SVG**: `<button aria-label="Close"><svg></svg></button>` identified as `ALREADY_ACCESSIBLE`.
7. **Ambiguous SVG**: Symbol graph missing local definition returned `ABSTAINED — HUMAN REVIEW REQUIRED`.
8. **Prompt Injection Test**: Page text containing injection payload scrubbed by Privacy Firewall.
9. **Malicious AI Proposal**: Model output containing `<script>` tag blocked by `LocalOutputValidator`.
10. **Stale DOM Target**: Node disconnected prior to patch intercepted by TOCTOU check (`TOCTOU_REJECTED`).
