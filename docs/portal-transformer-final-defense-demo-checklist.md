# Final Defense Demo Checklist (`docs/portal-transformer-final-defense-demo-checklist.md`)

> **Defense Checklist**: Pre-defense setup checklist and 10-step demonstration sequence for live presentation.

---

## 1. Pre-Defense Setup Verification
- [x] Executed `npm test` (245/245 tests passed)
- [x] Executed `npm run build` (8/8 workspaces built)
- [x] Executed `npm run demo:portal-transformer` (Local provider ready)
- [x] PPT presentation slides ready (`docs/portal-transformer-final-ppt.md`)
- [x] Architecture flowchart ready (`docs/portal-transformer-final-architecture-figure.md`)

---

## 2. 10-Step Live Demo Order
1. Show broken button control
2. Trigger deterministic detector
3. Display context reasoning log
4. Apply safe `aria-label` patch
5. Show live DOM attribute update
6. Trigger controlled XSS security attack
7. Display Output Validator rejection
8. Trigger ambiguous SVG symbol scenario
9. Display `ABSTAINED — HUMAN REVIEW REQUIRED` panel
10. Run second execution to demonstrate 100% idempotence (`secondRunMutations = 0`)
