# TrustPortal Human Confirmation UI & Workflow (`apps/extension/src/ui`)

## 1. Overview & UI State Machine Architecture
The Human Confirmation UI exposes a polished, accessible decision interface inside an **isolated Open/Closed Shadow DOM container (`<trustportal-host>`)**. It ensures that page CSS cannot break extension styling while preserving ARIA screen-reader announcements and Playwright testability.

```
                  [proposal_available]
                           ↓
┌────────────────────────────────────────────────────────┐
│ UI State Machine: hidden → proposed → confirming       │
└──────────────────────────┬─────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ↓                 ↓                 ↓
      [Accept]          [Edit]           [Reject]
         ↓                 ↓                 ↓
PatchApplicator     EditControl     DOM Unchanged
   .applyPatch       (max 200 chars) Proposal Rejected
         ↓                 ↓                 ↓
     [applied]         [applied]          [hidden]
   (Shows Undo)      (Shows Undo)
         ↓
      [Undo] ──> PatchApplicator.revertPatch ──> [conflict] (If modified externally)
```

---

## 2. Information Display Hierarchy

1. **Header**: `🛡️ TrustPortal — Accessibility Repair` + Dismiss (`✕`) button.
2. **Detected Issue**: Rule metadata description (e.g. `This button has no accessible name.`).
3. **Proposed Attribute Diff**: Attribute name (`aria-label`), previous value (`None`), proposed value (`Download Application Form`).
4. **Verifiable Evidence View**: Lists extracted context evidence (`✓ Visible text: "Download form"`, `✓ Role: button`, `✓ Nearby heading: "Applications"`).
5. **Trust Score Badge & Calibration Notice**:
   - `Trust Score: 87 / 100` (Policy-level score)
   - `Model confidence (0.91) is an uncalibrated signal. Human confirmation required.`
6. **Action Buttons**:
   - `[Accept]`: Revalidates DOM & fingerprint, applies patch via Step 4 applicator.
   - `[Edit]`: Displays accessible text input bounded to 200 chars for manual label adjustments.
   - `[Reject]`: Dismisses panel without modifying page DOM.

---

## 3. Action Workflows & Safety Policy

- **Accept Workflow**: Calls `PatchApplicator.applyPatch()`. Updates live DOM attribute (`aria-label` / `alt`). Records `injected` in `PatchLedger`. Renders `applied` state with `[Undo]` button.
- **Edit Workflow**: User modifies proposed label text. Label string is revalidated through `outputValidator` rules (no HTML, no control characters, no prompt injection).
- **Undo Workflow**: Calls `PatchApplicator.revertPatch()`. If target attribute was modified by an external script, triggers conflict protection (`PATCH_CONFLICT`) and **does not overwrite the live DOM!**

---

## 4. Accessibility & Screen-Reader Support

- Semantic `<button>`, `<input>`, and `<article>` tags with explicit visible focus indicators (`:focus-visible`).
- Keyboard trap handling (Tab, Enter, Space, Escape to dismiss).
- Screen-Reader Live Region (`aria-live="polite"`): Announces state updates ("Accessibility label applied successfully", "Change rejected", "Conflict detected").
