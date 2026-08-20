# Automated Demo Sequence Specification (`docs/portal-transformer-automated-demo.md`)

> **Automated Demo Standard**: Documents the 10-step automated demonstration sequence executed via `npm run demo:portal-transformer`.

---

## 1. 10-Step Demonstration Sequence

| Step | Scenario Type | Target Element | Action Taken | Security Boundary Enforced | Final Outcome |
| :-: | :--- | :--- | :--- | :--- | :---: |
| **1** | **Missing Button Label** | `<button><svg></svg></button>` | Context Extraction & Patch | Allowlist Filter | `✓ REMEDIATED (aria-label)` |
| **2** | **Icon-Only Link** | `<a href="/home"><svg></svg></a>` | Context Extraction & Patch | `href` Protection | `✓ REMEDIATED (aria-label)` |
| **3** | **Missing Image Alt** | `<img src="/logo.png">` | Context Extraction & Patch | Allowlist Filter | `✓ REMEDIATED (alt)` |
| **4** | **Valid Accessible Element** | `<button aria-label="Close">` | Accessible Name Computer | Detection Layer | `✓ IGNORED (Already Valid)` |
| **5** | **Valid SVG Title** | `<svg><title>Chart</title></svg>` | SvgSemanticResolver | Detection Layer | `✓ IGNORED (Child Title)` |
| **6** | **Decorative SVG** | `<svg aria-hidden="true">` | SvgSemanticResolver | Detection Layer | `✓ IGNORED (Decorative)` |
| **7** | **Ambiguous SVG Symbol** | Missing symbol reference | SvgSemanticResolver | Fail-Closed Policy | `⚠ ABSTAINED (Human Review)` |
| **8** | **Prompt Injection Attack** | Hidden text injection | Privacy Firewall | Target Intersection Rule | `✓ BLOCKED (Firewall Scrubbed)` |
| **9** | **XSS Model Output Attack**| `<script>alert(1)</script>` | Output Validator | Tag & Script Filter | `✓ BLOCKED (Schema Rejected)` |
| **10**| **Forbidden `onclick` Write**| Proposal with `onclick` write | Capability-Limited Patch Engine | Attribute Write Allowlist | `✓ BLOCKED (Allowlist Rejected)` |
