# NVDA Manual Empirical Test Protocol (`docs/portal-transformer-nvda-test-protocol.md`)

> **Execution Status**: `NOT EXECUTED — ENVIRONMENT LIMITATION`  
> **Environment Context**: Evaluated inside a headless Linux/macOS terminal environment without NVDA / Windows audio dispatcher capabilities.

---

## 1. Test Protocol Specification
This protocol defines the manual verification procedure for evaluating spoken audio announcement changes using NVDA (NonVisual Desktop Access) v2024.1+ on Windows 11 with Firefox/Chrome.

### **Test Categories & Expected Spoken Announcements**

| ID | Control Category | Sample Markup | Expected NVDA Announcement (Before) | Expected NVDA Announcement (After) |
| :-: | :--- | :--- | :--- | :--- |
| **NV-1** | **Unlabelled Button** | `<button class="btn-search"></button>` | *"button"* | *"Search Portal, button"* |
| **NV-2** | **Icon-Only Link** | `<a href="/pdf"><svg></svg></a>` | *"link"* | *"Download PDF Guidelines, link"* |
| **NV-3** | **Unlabelled Form Input** | `<input placeholder="Enter ID">` | *"edit, blank"* | *"Enter Application ID, edit"* |
| **NV-4** | **Unlabelled Image** | `<img src="/seal.png">` | *"graphic, seal.png"* | *"National Emblem, graphic"* |
| **NV-5** | **Standalone SVG Image** | `<svg role="img"></svg>` | *"graphic"* | *"Citizen Analytics Chart, graphic"* |
| **NV-6** | **SVG inside Labelled Button**| `<button aria-label="Save"><svg></svg></button>` | *"Save, button"* | *"Save, button"* (Preserved) |
