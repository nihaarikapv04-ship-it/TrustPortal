# Screen-Reader Accessibility Evaluation Plan (`docs/portal-transformer-screen-reader-evaluation-plan.md`)

> **Authoritative Specification**: Defines the research questions, page selection criteria, and metrics for evaluating screen-reader-relevant accessibility state changes performed by Portal Transformer V7.

---

## 1. Research Questions
- **RQ7**: "Does Portal Transformer's semantic DOM remediation improve the screen-reader-relevant accessibility state of previously inaccessible controls?"
- **RQ7.1**: Does remediation increase the proportion of interactive elements with computable accessible names?
- **RQ7.2**: Does remediation reduce unnamed controls?
- **RQ7.3**: Does remediation preserve already-correct accessible semantics?
- **RQ7.4**: Does the system's abstention mechanism prevent incorrect semantic modifications?
- **RQ7.5**: Do screen-reader users receive more meaningful output after remediation?

---

## 2. Target Page Subset Selection
From the 20 `.gov.in` public-service portals evaluated in Phase 8, a representative subset of 5 pages was selected:
1. `GOV-IN-01` (`https://www.india.gov.in`): National Portal of India (Navigation & Service Search)
2. `GOV-IN-03` (`https://passportindia.gov.in`): Passport Seva (Form Controls & Login Buttons)
3. `GOV-IN-04` (`https://eportal.incometax.gov.in`): Income Tax e-Filing (SVG Icons & Help Buttons)
4. `GOV-IN-05` (`https://parivahan.gov.in`): Parivahan Sewa (Transport Service Selection Grid)
5. `GOV-IN-07` (`https://mygov.in`): MyGov Dashboard (Social SVG Links & Poll Buttons)
