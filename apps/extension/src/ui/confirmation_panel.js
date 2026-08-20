import { createEvidenceView } from "./evidence_view.js";
import { createEditControl } from "./edit_control.js";
import { createStatusView } from "./status_view.js";
export class TrustPortalConfirmationPanel {
    host;
    shadow;
    viewModel = null;
    actions = null;
    statusAnnouncer = () => { };
    constructor(shadowMode = "open") {
        this.host = document.createElement("trustportal-host");
        this.shadow = this.host.attachShadow({ mode: shadowMode });
    }
    mount(targetContainer = document.body) {
        if (!targetContainer.contains(this.host)) {
            targetContainer.appendChild(this.host);
        }
    }
    unmount() {
        if (this.host.parentNode) {
            this.host.parentNode.removeChild(this.host);
        }
    }
    render(viewModel, actions, mode = "confirming") {
        this.viewModel = viewModel;
        this.actions = actions;
        this.shadow.innerHTML = ""; // Clear shadow DOM
        // Inject Stylesheet
        const style = document.createElement("style");
        style.textContent = `
      :host {
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #1e293b;
        z-index: 2147483647;
        position: fixed;
        bottom: 24px;
        right: 24px;
      }
      .tp-card { width: 380px; background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); overflow: hidden; }
      .tp-header { background: #0f172a; color: #fff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
      .tp-title { font-weight: 700; font-size: 15px; display: flex; align-items: center; gap: 8px; }
      .tp-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
      .tp-section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 2px; }
      .tp-issue-text { font-size: 13px; color: #334155; background: #f8fafc; padding: 8px 12px; border-radius: 6px; border-left: 3px solid #0284c7; }
      .tp-diff-box { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
      .tp-diff-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
      .tp-diff-val { font-family: monospace; font-weight: 600; }
      .tp-diff-val.new { color: #16a34a; }
      .tp-score-badge { display: inline-flex; align-items: center; gap: 6px; background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 13px; }
      .tp-actions { display: flex; gap: 8px; margin-top: 8px; }
      .tp-btn { flex: 1; padding: 8px 12px; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer; border: 1px solid transparent; display: inline-flex; justify-content: center; align-items: center; }
      .tp-btn:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
      .tp-btn-primary { background-color: #2563eb; color: #ffffff; }
      .tp-btn-secondary { background-color: #f1f5f9; color: #334155; border-color: #cbd5e1; }
      .tp-btn-danger { background-color: #ef4444; color: #ffffff; }
      .tp-edit-input { width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; box-sizing: border-box; }
      .tp-notice { font-size: 11px; color: #64748b; font-style: italic; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
    `;
        this.shadow.appendChild(style);
        // Create Live Region Status Announcer
        const { element: statusElem, announce } = createStatusView();
        this.statusAnnouncer = announce;
        this.shadow.appendChild(statusElem);
        // Card Container
        const card = document.createElement("div");
        card.className = "tp-card";
        card.setAttribute("role", "dialog");
        card.setAttribute("aria-labelledby", "tp-card-header-title");
        // Header
        const header = document.createElement("div");
        header.className = "tp-header";
        const title = document.createElement("div");
        title.id = "tp-card-header-title";
        title.className = "tp-title";
        title.textContent = "🛡️ TrustPortal — Accessibility Repair";
        const dismissBtn = document.createElement("button");
        dismissBtn.type = "button";
        dismissBtn.className = "tp-btn tp-btn-secondary";
        dismissBtn.style.padding = "2px 8px";
        dismissBtn.textContent = "✕";
        dismissBtn.setAttribute("aria-label", "Close confirmation panel");
        dismissBtn.addEventListener("click", () => actions.onDismiss());
        header.appendChild(title);
        header.appendChild(dismissBtn);
        card.appendChild(header);
        // Body
        const body = document.createElement("div");
        body.className = "tp-body";
        // Issue Description
        const issueSec = document.createElement("div");
        const issueLbl = document.createElement("div");
        issueLbl.className = "tp-section-label";
        issueLbl.textContent = "DETECTED ISSUE";
        const issueText = document.createElement("div");
        issueText.className = "tp-issue-text";
        issueText.textContent = viewModel.issue.description;
        issueSec.appendChild(issueLbl);
        issueSec.appendChild(issueText);
        body.appendChild(issueSec);
        if (mode === "editing") {
            // Render Edit Control
            const editControl = createEditControl(viewModel.proposedValue, {
                onApply: (newVal) => actions.onEdit(newVal),
                onCancel: () => this.render(viewModel, actions, "confirming")
            });
            body.appendChild(editControl);
        }
        else if (mode === "applied") {
            // Render Applied Status with Undo
            const appliedNotice = document.createElement("div");
            appliedNotice.className = "tp-issue-text";
            appliedNotice.style.borderLeftColor = "#16a34a";
            appliedNotice.textContent = `✓ Accessible repair applied: "${viewModel.proposedValue}"`;
            body.appendChild(appliedNotice);
            const undoActions = document.createElement("div");
            undoActions.className = "tp-actions";
            const undoBtn = document.createElement("button");
            undoBtn.className = "tp-btn tp-btn-secondary";
            undoBtn.textContent = "Undo Change";
            undoBtn.addEventListener("click", () => actions.onUndo());
            undoActions.appendChild(undoBtn);
            body.appendChild(undoActions);
            this.statusAnnouncer("Accessibility label applied successfully.");
        }
        else if (mode === "conflict") {
            const conflictNotice = document.createElement("div");
            conflictNotice.className = "tp-issue-text";
            conflictNotice.style.borderLeftColor = "#dc2626";
            conflictNotice.textContent = "⚠️ Conflict: Page DOM was modified externally after patch application.";
            body.appendChild(conflictNotice);
            this.statusAnnouncer("Conflict detected: Page DOM changed externally.");
        }
        else {
            // Render Default Confirming Mode
            // Diff Box
            const diffBox = document.createElement("div");
            diffBox.className = "tp-diff-box";
            const attrRow = document.createElement("div");
            attrRow.className = "tp-diff-row";
            attrRow.innerHTML = `<span>Attribute:</span><span class="tp-diff-val">${viewModel.target.attribute}</span>`;
            const prevRow = document.createElement("div");
            prevRow.className = "tp-diff-row";
            prevRow.innerHTML = `<span>Previous:</span><span class="tp-diff-val">${viewModel.target.previousValue || "None"}</span>`;
            const newRow = document.createElement("div");
            newRow.className = "tp-diff-row";
            const newLabel = document.createElement("span");
            newLabel.textContent = "Proposed:";
            const newVal = document.createElement("span");
            newVal.className = "tp-diff-val new";
            newVal.textContent = viewModel.proposedValue; // Safe text node!
            newRow.appendChild(newLabel);
            newRow.appendChild(newVal);
            diffBox.appendChild(attrRow);
            diffBox.appendChild(prevRow);
            diffBox.appendChild(newRow);
            body.appendChild(diffBox);
            // Evidence View
            body.appendChild(createEvidenceView(viewModel.evidence));
            // Trust Score Badge
            const scoreSec = document.createElement("div");
            const scoreBadge = document.createElement("div");
            scoreBadge.className = "tp-score-badge";
            scoreBadge.textContent = `Trust Score: ${viewModel.trustScore} / 100`;
            scoreSec.appendChild(scoreBadge);
            const notice = document.createElement("div");
            notice.className = "tp-notice";
            notice.style.marginTop = "4px";
            notice.textContent = `Model confidence (${viewModel.rawModelConfidence}) is an uncalibrated signal. Human confirmation required.`;
            scoreSec.appendChild(notice);
            body.appendChild(scoreSec);
            // Action Buttons
            const actionRow = document.createElement("div");
            actionRow.className = "tp-actions";
            const acceptBtn = document.createElement("button");
            acceptBtn.type = "button";
            acceptBtn.className = "tp-btn tp-btn-primary";
            acceptBtn.textContent = "Accept";
            acceptBtn.addEventListener("click", () => actions.onAccept());
            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.className = "tp-btn tp-btn-secondary";
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", () => this.render(viewModel, actions, "editing"));
            const rejectBtn = document.createElement("button");
            rejectBtn.type = "button";
            rejectBtn.className = "tp-btn tp-btn-danger";
            rejectBtn.textContent = "Reject";
            rejectBtn.addEventListener("click", () => actions.onReject());
            actionRow.appendChild(acceptBtn);
            actionRow.appendChild(editBtn);
            actionRow.appendChild(rejectBtn);
            body.appendChild(actionRow);
        }
        card.appendChild(body);
        this.shadow.appendChild(card);
        // Trap Escape key for dismissal
        this.host.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                actions.onDismiss();
            }
        });
    }
}
