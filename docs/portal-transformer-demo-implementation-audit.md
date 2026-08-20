# Demo Implementation Audit (`docs/portal-transformer-demo-implementation-audit.md`)

> **Demo Audit Standard**: Audits existing monorepo demo assets in `apps/demo` and specifies integration of the local deterministic demo provider.

---

## 1. Monorepo Component Audit Table

| Existing Monorepo Subsystem | Current Implementation Path | Current Capability | Required Demo Enhancement | Risk Level |
| :--- | :--- | :--- | :--- | :---: |
| **Demo Web Application** | [`apps/demo/src/main.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/apps/demo/src/main.ts) | Interactive UI & DOM testing | Connect deterministic demo provider | `LOW` |
| **Deterministic Demo Provider** | [`packages/eval/src/demo_provider.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/eval/src/demo_provider.ts) | Local mock runner | Standalone runner for CLI execution | `LOW` |
| **Accessibility Rules Engine** | [`packages/rules/src/detector.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/rules/src/detector.ts) | DOM defect scanning | Connect directly without network dispatches | `ZERO` |
| **Privacy Firewall** | [`packages/redaction/src/firewall.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/redaction/src/firewall.ts) | Sensitive field scrubbing | Display privacy intersection checks in UI | `ZERO` |
| **Patch Engine** | [`apps/extension/src/patcher.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/apps/extension/src/patcher.ts) | Hardened DOM patching | Capability allowlist verification | `ZERO` |
