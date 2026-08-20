# NVDA Screen Reader Usability Test Plan — TrustPortal TSIF

## Objective
Verify that the TrustPortal TSIF Human Verification Shadow DOM Interface (`ClosedVerificationUI`) is 100% accessible to screen reader users (NVDA minimum baseline) and adheres to WAI-ARIA 1.2 Modal/Dialog standards.

---

## Test Environment Setup
- **OS**: Windows 11 / macOS (with NVDA via virtual machine or VoiceOver)
- **Screen Reader**: NVDA (latest version)
- **Browser**: Google Chrome
- **Extension**: TrustPortal TSIF MV3 Extension

---

## Test Scenarios & Acceptance Criteria

### 1. Announcement & Initial Focus
- **Action**: Trigger a defect in the `confirm` trust decision band (e.g. image with ambiguous context).
- **NVDA Output Expected**: NVDA announces dialog opening: *"TrustPortal TSIF dialog. Human verification required for defect..."*
- **Acceptance Criteria**: Focus is automatically directed to the dialog container or first focusable input inside the Closed Shadow DOM without getting trapped outside.

### 2. Form Field Accessibility
- **Action**: Navigate using `Tab` key to the **Proposed Accessible Label** input field.
- **NVDA Output Expected**: NVDA reads: *"Proposed Accessible Label, edit text, [proposed value]"*.
- **Acceptance Criteria**: Label `<label for="...">` association is properly bound and announced.

### 3. Trust Score & Evidence Context Announcement
- **Action**: Navigate to the CRC Trust Band and evidence list using Arrow keys or `Tab`.
- **NVDA Output Expected**: NVDA clearly reads: *"CRC Trust Band: Confidence 78%, Auto Threshold 85%. Context Evidence: Heading: Cart"*.
- **Acceptance Criteria**: Context is structured using semantic list `<ul>`/`<li>` elements so NVDA reports list item counts.

### 4. Interactive Button Traversal & Keyboard Traversal
- **Action**: Press `Tab` and `Shift+Tab` across buttons: `[Accept & Apply]`, `[Reject]`, `[Report]`.
- **NVDA Output Expected**: NVDA announces button names clearly: *"Accept and Apply, button"*, *"Reject, button"*, *"Report, button"*.
- **Acceptance Criteria**: Focus ring is visually distinct (2px solid outline) and NVDA announces role and state. Focus stays trapped inside dialog while modal is active.

### 5. Dialog Close & Focus Restoration
- **Action**: Press `Enter` on `[Accept & Apply]` or `[Reject]`.
- **NVDA Output Expected**: Dialog closes, NVDA announces patch application, and focus restores seamlessly to the trigger element on the web page.
- **Acceptance Criteria**: Zero focus leaks or orphaned focus state.
