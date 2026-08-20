# TrustPortal Monorepo Architecture

```
trustportal/
├── apps/
│   ├── extension/         # Chrome MV3 Extension (TypeScript, Vite, Content Script, Worker, Popup, Closed Shadow DOM)
│   └── api/               # Fastify Backend API (Node 22 LTS, TypeScript, Zod, Fastify, Provider Router)
├── packages/
│   ├── schemas/           # Shared Zod schemas (proposals, feedback, policy, patches, context)
│   ├── rules/             # Deterministic accessibility rule engine & WAI-ARIA accessible name computation
│   ├── scoring/           # Calibrated Trust Engine (TAS score formula & Conformal Risk Control gate)
│   ├── redaction/         # Deny-by-default Privacy Firewall & PII Redactor
│   └── eval/              # Evaluation benchmark, annotator, baselines, & analysis
├── docs/                  # Architectural & security documentation
└── tests/                 # End-to-end and integration test suites
```
