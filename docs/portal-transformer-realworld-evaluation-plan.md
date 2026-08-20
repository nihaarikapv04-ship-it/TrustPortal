# Real-World Public Portal Evaluation Plan (`docs/portal-transformer-realworld-evaluation-plan.md`)

> **Authoritative Specification**: Defines the empirical real-world evaluation framework for Portal Transformer V7 against Indian public-service web portals (`.gov.in`).

---

## 1. Objective & Invariants
The objective of this phase is to measure how the **FROZEN** Portal Transformer V7 prototype behaves on realistic Indian government web portal structures.

### **Invariants**
- The Portal Transformer V7 engine is **FROZEN**.
- No detector rules, SVG semantic resolvers, TSIF scoring formulas, or security boundaries shall be modified during this evaluation.
- No network dispatches or live attacks shall be launched against external government web servers.
- No user credentials, passwords, OTPs, PINs, bank details, or PII shall be collected or processed.

---

## 2. Target Web Portal Sampling Strategy
A curated manifest of 20 representative public-service webpages across diverse Indian government domains (`.gov.in` / public services) representing 10 distinct UI structural archetypes:
1. Citizen Service Portals (e.g., National Portal of India, Digital India)
2. Application & Registration Forms (e.g., Passport Seva, Income Tax e-Filing)
3. Information & Grievance Portals (e.g., CPGRAMS, MyGov)
4. Transport & Mobility Services (e.g., Parivahan Sewa, IRCTC)
5. Utility & Local Services (e.g., Jal Jeevan Mission, PM-Kisan)

---

## 3. Evaluation Pipeline & Metrics Breakdown
1. **Baseline Snapshot Extraction**: Automated scan of DOM elements, controls, images, inputs, and SVG subtrees before remediation.
2. **Detection & Semantic Resolution**: Automated scan by frozen `DeterministicDetector` and `SvgSemanticResolver`. Measure proposal decisions, abstentions, and confidence.
3. **Manual Ground-Truth Protocol**: Expert human accessibility review of $N = 100$ sampled elements to establish empirical ground truth (TP, TN, FP, FN, Precision, Recall, $F_1$, FPR, FNR, Ambiguous).
4. **Local Cybersecurity Corpus**: Local DOM injection of 25 adversarial attack payload categories against representative real-world portal structures.
5. **Latency & Performance Profiling**: Microsecond-resolution timing of pipeline stages using `performance.now()`.
