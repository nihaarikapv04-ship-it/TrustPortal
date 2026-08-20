# Threats to Validity (`docs/thesis-threats-to-validity.md`)

## 1. Internal Validity
- **Mock Provider Infrastructure**: Latency micro-benchmarks ($0.023\text{ ms}$) reflect local mock provider execution rather than live cloud API endpoints (e.g. Gemini 1.5 Flash Vision / Text API). Real cloud network latency will vary based on regional network conditions.
- **Deterministic Dataset Construction**: Synthetic benchmark fixtures ($N = 250$) were structured deterministically. While reproducible, synthetic elements may not capture all arbitrary DOM complexities present in live commercial portals.

## 2. External Validity
- **English-Language Scope**: Evaluation was conducted on English-language web page contexts. Portal Transformer's semantic remediation quality on non-English (e.g. Hindi, Tamil, regional language) public service portals remains unverified.
- **Browser & Environment Limitations**: Testing was restricted to Chromium Manifest V3 runtime environments. Cross-browser performance on Firefox (MV3) or Safari Web Extensions has not been evaluated.

## 3. Construct Validity
- **Synthetic Semantic Quality vs. Real-World Screen Reader Usability**: High exact-match rates ($100.0\%$) on synthetic reference labels measure benchmark consistency, but do not directly measure qualitative screen-reader spoken output comprehension.

## 4. Statistical Validity
- **Sample Size**: Benchmarks utilized $N = 250$ element representations and $N = 100$ latency runs. Larger real-world web crawls are required for longitudinal statistical confidence.

## 5. Explicit Validity Boundary Statement
> **CRITICAL STATEMENT**: The current experimental results do **NOT** establish human screen-reader usability improvement or user task completion acceleration. Screen-reader spoken output comparison (NVDA/TalkBack) and human-subject usability testing are explicitly classified as `NOT YET EVALUATED — FUTURE EMPIRICAL EVALUATION`.
