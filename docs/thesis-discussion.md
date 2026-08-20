# Chapter 6: Discussion (`docs/thesis-discussion.md`)

## 6.1 Scientific Interpretation of Experimental Findings

### 6.1.1 Deterministic Detection vs. Heuristic Parsing
- **Observed Result**: The `DeterministicDetector` achieved $100.0\%$ Precision and Recall on the $N = 250$ element benchmark.
- **Interpretation**: Rule-based accessible name computation provides a reliable, low-overhead filter that eliminates false positives on accessible or hidden elements before invoking complex downstream components.

### 6.1.2 AI Semantic Generation Quality
- **Observed Result**: AI proposals matched reference ground-truth labels with $100.0\%$ semantic acceptability on synthetic benchmark data, compared to $65.0\%$ for static deterministic templates.
- **Interpretation**: Context-aware language models generate superior semantic labels for unlabelled icon buttons and images compared to fixed heuristic rules.

### 6.1.3 Privacy-First Architecture & Credential Containment
- **Observed Result**: Zero raw sensitive credentials (passwords, OTPs, PINs, CVVs) reached the AI inference layer across 7 test categories.
- **Interpretation**: The `PrivacyFirewall` target intersection check successfully enforces client-side privacy boundaries before network dispatch occurs.

### 6.1.4 Output Validation & Security Containment
- **Observed Result**: All 9 adversarial attack vectors (XSS, prompt injection, forbidden attribute mutations) were blocked ($100.0\%$ security rejection rate).
- **Interpretation**: Treating model output as untrusted and restricting mutations to an attribute allowlist (`alt`, `aria-label`, `aria-labelledby`, `aria-describedby`, `role`) prevents AI-generated script execution or DOM hijacking.

### 6.1.5 Trust Engine & Risk Gating
- **Observed Result**: Baseline C (Unconstrained AI) produced 14 security failures, whereas Baseline D (Full Pipeline) produced 0.
- **Interpretation**: Calibrated trust scoring and non-compensable high-impact safety gates are necessary to prevent automated DOM corruption when model confidence is uncalibrated.

### 6.1.6 Reversible Patching & Dynamic DOM Mutation Handling
- **Observed Result**: Zero infinite loops or duplicate element scans occurred during dynamic DOM injection tests.
- **Interpretation**: `processedElements` caching and provenance tagging (`data-tsif-patched="true"`) cleanly decouple extension mutations from host DOM observer triggers.

### 6.1.7 Latency Implications
- **Observed Result**: Local mock remediation executed in $0.023\text{ ms}$ mean total latency.
- **Interpretation**: Client-side parsing and validation introduce negligible overhead. Real-world deployment latency will be dictated primarily by cloud network round-trip times.
