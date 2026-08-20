# Final Threats to Validity (`docs/portal-transformer-final-threats-to-validity.md`)

> **Validity Standard**: Explicitly details internal, external, construct, and statistical validity threats.

---

## 1. Threats to Validity Register

1. **Internal Validity**: Synthetic benchmarks isolate rules, but risk benchmark fitting. Mitigated via independent holdout benchmarks ($N=600$ SVG, $N=500$ security holdout).
2. **External Validity**: Real-world evaluation restricted to 20 curated Indian government portals (`.gov.in`, $N_{\text{DOM}}=1,700$). Cannot establish generalization to all global websites.
3. **Construct Validity**: Screen-reader state measured via DOM accessibility-tree semantic state tracking rather than live audio announcements (`NOT EVALUATED — ENVIRONMENT LIMITATION`).
4. **Statistical Validity**: Sample sizes specified explicitly ($N_{\text{reviewed}}=100$, $N_{\text{sec}}=1,000$, $N_{\text{fuzz}}=5,000$).
