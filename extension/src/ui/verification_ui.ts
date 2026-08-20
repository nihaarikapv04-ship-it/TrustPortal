/**
 * Human Verification UI (Shadow DOM Panel).
 * Uses a CLOSED Shadow DOM root (mode: "closed") to prevent DOM clickjacking and style hijacking (Marek Tóth research).
 * Fully accessible (keyboard navigable, screen reader compatible).
 */

export interface VerificationPanelProps {
  defectId: string;
  issueType: string;
  targetSelector: string;
  proposedLabel: string;
  confidence: number;
  thresholdUsed: number;
  evidence: string[];
  onAccept: (customLabel?: string) => void;
  onReject: (reason: string) => void;
  onReport: (feedback: string) => void;
}

export class ClosedVerificationUI {
  private hostContainer: HTMLElement | null = null;
  private shadowRoot: ShadowRoot | null = null;

  public render(props: VerificationPanelProps): void {
    this.destroy(); // Clean existing if present

    // Create host element outside normal document flow
    this.hostContainer = document.createElement("tsif-verification-host");
    this.hostContainer.id = "tsif-shadow-host-" + props.defectId;
    this.hostContainer.style.position = "fixed";
    this.hostContainer.style.bottom = "20px";
    this.hostContainer.style.right = "20px";
    this.hostContainer.style.zIndex = "2147483647"; // Max z-index

    // Attach CLOSED Shadow DOM root per Security Principle #7 & #8
    this.shadowRoot = this.hostContainer.attachShadow({ mode: "closed" });

    // Styles isolated inside Shadow DOM
    const style = document.createElement("style");
    style.textContent = `
      :host {
        all: initial;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .tsif-card {
        width: 360px;
        background: #111827;
        color: #f9fafb;
        border: 2px solid #3b82f6;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        padding: 16px;
        box-sizing: border-box;
      }
      .tsif-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        border-bottom: 1px solid #1f2937;
        padding-bottom: 8px;
      }
      .tsif-title {
        font-size: 14px;
        font-weight: 700;
        color: #60a5fa;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .tsif-badge {
        font-size: 11px;
        font-weight: 600;
        background: #f59e0b;
        color: #000;
        padding: 2px 8px;
        border-radius: 9999px;
        text-transform: uppercase;
      }
      .tsif-body {
        font-size: 13px;
        line-height: 1.5;
      }
      .tsif-label-box {
        background: #1f2937;
        border: 1px solid #374151;
        border-radius: 6px;
        padding: 10px;
        margin: 10px 0;
      }
      .tsif-label-input {
        width: 100%;
        background: #111827;
        color: #fff;
        border: 1px solid #4b5563;
        border-radius: 4px;
        padding: 6px 8px;
        font-size: 13px;
        margin-top: 4px;
        box-sizing: border-box;
      }
      .tsif-evidence-list {
        font-size: 11px;
        color: #9ca3af;
        margin: 8px 0;
        padding-left: 16px;
      }
      .tsif-score {
        font-size: 11px;
        color: #fbbf24;
        margin-bottom: 12px;
      }
      .tsif-actions {
        display: flex;
        gap: 8px;
      }
      .tsif-btn {
        flex: 1;
        padding: 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: opacity 0.15s;
      }
      .tsif-btn-accept { background: #2563eb; color: #ffffff; }
      .tsif-btn-reject { background: #dc2626; color: #ffffff; }
      .tsif-btn-report { background: #4b5563; color: #e5e7eb; }
      .tsif-btn:hover { opacity: 0.9; }
      .tsif-btn:focus-visible { outline: 2px solid #60a5fa; outline-offset: 2px; }
    `;

    const card = document.createElement("div");
    card.className = "tsif-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-labelledby", "tsif-dialog-title");
    card.setAttribute("aria-modal", "false");

    card.innerHTML = `
      <div class="tsif-header">
        <div class="tsif-title" id="tsif-dialog-title">
          🛡️ TrustPortal TSIF
        </div>
        <span class="tsif-badge">${this.escapeHtml(props.issueType)}</span>
      </div>
      <div class="tsif-body">
        <div>Human verification required for defect <code>${this.escapeHtml(props.targetSelector)}</code></div>
        
        <div class="tsif-label-box">
          <label for="tsif-proposed-label-input" style="font-weight:600; font-size:12px; color:#d1d5db;">Proposed Accessible Label:</label>
          <input type="text" id="tsif-proposed-label-input" class="tsif-label-input" value="${this.escapeHtml(props.proposedLabel)}" />
        </div>

        <div class="tsif-score">
          CRC Trust Band: Confidence <strong>${(props.confidence * 100).toFixed(1)}%</strong> (Auto Threshold $\\lambda^*$: ${(props.thresholdUsed * 100).toFixed(1)}%)
        </div>

        <div style="font-size:11px; color:#9ca3af; font-weight:600;">Context Evidence:</div>
        <ul class="tsif-evidence-list">
          ${props.evidence.map(e => `<li>${this.escapeHtml(e)}</li>`).join("")}
        </ul>

        <div class="tsif-actions">
          <button id="tsif-btn-accept" class="tsif-btn tsif-btn-accept">Accept & Apply</button>
          <button id="tsif-btn-reject" class="tsif-btn tsif-btn-reject">Reject</button>
          <button id="tsif-btn-report" class="tsif-btn tsif-btn-report">Report</button>
        </div>
      </div>
    `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(card);

    // Event binding inside Shadow DOM
    const inputElem = this.shadowRoot.querySelector("#tsif-proposed-label-input") as HTMLInputElement;
    const acceptBtn = this.shadowRoot.querySelector("#tsif-btn-accept") as HTMLButtonElement;
    const rejectBtn = this.shadowRoot.querySelector("#tsif-btn-reject") as HTMLButtonElement;
    const reportBtn = this.shadowRoot.querySelector("#tsif-btn-report") as HTMLButtonElement;

    acceptBtn.onclick = () => {
      const finalLabel = inputElem ? inputElem.value : props.proposedLabel;
      props.onAccept(finalLabel);
      this.destroy();
    };

    rejectBtn.onclick = () => {
      props.onReject("User rejected proposal in verification UI.");
      this.destroy();
    };

    reportBtn.onclick = () => {
      props.onReport("Reported inaccurate label proposal.");
      alert("Feedback reported to TrustPortal ledger.");
      this.destroy();
    };

    document.body.appendChild(this.hostContainer);
  }

  public destroy(): void {
    if (this.hostContainer && this.hostContainer.parentNode) {
      this.hostContainer.parentNode.removeChild(this.hostContainer);
      this.hostContainer = null;
      this.shadowRoot = null;
    }
  }

  private escapeHtml(str: string): string {
    return str.replace(/[&<>"']/g, (m) => {
      switch (m) {
        case "&": return "&amp;";
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        case "'": return "&#039;";
        default: return m;
      }
    });
  }
}
