# Runtime Execution Flow (`docs/portal-transformer-runtime-flow.md`)

> **Runtime Execution Sitemap**: Traces the end-to-end execution path from page load to DOM mutation, mapping every step to source files, functions, inputs, outputs, and security boundaries.

---

## 1. 9-Step Runtime Execution Path

| Step | Operation Description | Source Implementation File | Primary Function | Input Data | Output Data | Enforced Security Boundary |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **DOM Candidate Scanning** | [`packages/rules/src/detector.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/rules/src/detector.ts) | `scan(elements)` | Live DOM Nodes | Array of Defects | Rule-based local scan |
| **2** | **Accessible Name Computer** | [`packages/rules/src/acc_name.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/rules/src/acc_name.ts) | `computeAccessibleName(node)`| Element Node | Text string / `""` | Standard WAI-ARIA 1.2 rules |
| **3** | **SVG Context Reasoning** | [`packages/rules/src/svg_resolver.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/rules/src/svg_resolver.ts) | `resolveSvg(svgNode)` | SVG Subtree | `Defect` / `ABSTAIN` | Local symbol graph check |
| **4** | **Privacy Firewall Check** | [`packages/redaction/src/firewall.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/redaction/src/firewall.ts) | `evaluate(extraction)` | Extraction Input | `allow` / `deny` | Target Intersection Rule |
| **5** | **SafeContext Extraction** | [`packages/redaction/src/extractor.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/redaction/src/extractor.ts) | `extractContext(node)` | DOM Element | Redacted Context | Bounded attributes allowlist |
| **6** | **AI Proposal Generation** | Local Mock / LLM Provider | `generateProposal(ctx)` | SafeContext JSON | Proposal Object | Untrusted AI Provider |
| **7** | **Output Validation Check** | [`apps/api/src/services/validator.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/apps/api/src/services/validator.ts) | `validate(proposal)` | Raw AI Proposal | `{ valid: boolean }` | XSS & script tag regex filter |
| **8** | **TSIF Risk Gate Scoring** | [`packages/scoring/src/risk_gate.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/packages/scoring/src/risk_gate.ts) | `evaluateProposal(proposal)`| Proposal & Risk | `{ decision: "approve" }`| Non-compensable risk gate |
| **9** | **Patch Capability & TOCTOU**| [`apps/extension/src/patcher.ts`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/apps/extension/src/patcher.ts) | `applyPatch(node, patch)`| DOM Node & Patch | `{ success: boolean }`| Attribute allowlist & TOCTOU |
