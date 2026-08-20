# Android TalkBack Test Protocol (`docs/portal-transformer-talkback-test-protocol.md`)

> **Execution Status**: `NOT EXECUTED — ENVIRONMENT LIMITATION`  
> **Environment Context**: Evaluated inside a headless terminal environment without Android physical device or Android Emulator TalkBack audio dispatchers.

---

## 1. Test Protocol Specification
This protocol specifies mobile screen-reader announcement evaluation procedures for Android TalkBack 14.1+ on Chrome Mobile.

| ID | Control Category | Expected TalkBack Announcement (Before) | Expected TalkBack Announcement (After) |
| :-: | :--- | :--- | :--- |
| **TB-1** | **Unlabelled Button** | *"Unlabelled button, double tap to activate"* | *"Search Portal, button, double tap to activate"* |
| **TB-2** | **Icon Link** | *"Link"* | *"Download PDF Guidelines, link"* |
| **TB-3** | **Form Input** | *"Edit box"* | *"Enter Application ID, edit box"* |
