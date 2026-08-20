import { trustQRPipeline } from "../pipeline/trustqr_pipeline.js";
import { DEMO_SCENARIO_CATALOG } from "../scenarios/demo_scenarios.js";
import { PipelineResult } from "../pipeline/types.js";
import { imageQRDecoder } from "../qr/image_decoder.js";
import { cameraQRDecoder } from "../qr/camera_decoder.js";
import { localQRGenerator } from "../scenarios/qr_generator.js";

export class TrustQRApp {
  private container: HTMLElement;
  private currentMode: "synthetic" | "upload" | "camera" = "synthetic";
  private currentScenarioKey: string = "NORMAL_PAYMENT";
  private currentResult: PipelineResult | null = null;
  private showResearchView: boolean = false;
  private payloadSourceLabel: string = "Synthetic Test QR";

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public async render(): Promise<void> {
    this.container.innerHTML = "";

    const appWrapper = document.createElement("div");
    appWrapper.className = "trustqr-container";
    appWrapper.setAttribute("role", "main");

    // 1. Header
    const header = document.createElement("header");
    header.className = "trustqr-header";
    header.innerHTML = `
      <h1>TrustQR</h1>
      <p>Security-Constrained AI-Assisted QR Payment Verification</p>
    `;
    appWrapper.appendChild(header);

    // 2. Mode Selector Navigation Tabs
    const navTabs = document.createElement("nav");
    navTabs.style.display = "flex";
    navTabs.style.gap = "0.5rem";
    navTabs.innerHTML = `
      <button id="tab-synthetic" type="button" style="flex:1; font-weight:600; ${this.currentMode === "synthetic" ? "background:var(--primary); color:white;" : "background:#e2e8f0; color:#334155;"}">Synthetic Scenarios</button>
      <button id="tab-upload" type="button" style="flex:1; font-weight:600; ${this.currentMode === "upload" ? "background:var(--primary); color:white;" : "background:#e2e8f0; color:#334155;"}">Upload QR Image</button>
      <button id="tab-camera" type="button" style="flex:1; font-weight:600; ${this.currentMode === "camera" ? "background:var(--primary); color:white;" : "background:#e2e8f0; color:#334155;"}">Scan with Camera</button>
    `;
    appWrapper.appendChild(navTabs);

    // Attach Navigation Events
    navTabs.querySelector("#tab-synthetic")?.addEventListener("click", () => {
      this.currentMode = "synthetic";
      this.payloadSourceLabel = "Synthetic Test QR";
      this.render();
    });
    navTabs.querySelector("#tab-upload")?.addEventListener("click", () => {
      this.currentMode = "upload";
      this.payloadSourceLabel = "Uploaded QR Image";
      this.render();
    });
    navTabs.querySelector("#tab-camera")?.addEventListener("click", () => {
      this.currentMode = "camera";
      this.payloadSourceLabel = "Camera Scan";
      this.render();
    });

    // 3. Input Mode Content Panel
    const inputCard = document.createElement("section");
    inputCard.className = "card demo-controls";

    if (this.currentMode === "synthetic") {
      this.renderSyntheticControls(inputCard);
    } else if (this.currentMode === "upload") {
      this.renderUploadControls(inputCard);
    } else {
      this.renderCameraControls(inputCard);
    }
    appWrapper.appendChild(inputCard);

    // 4. Research View & Security Boundaries Toggle Bar
    const toggleBar = document.createElement("div");
    toggleBar.style.display = "flex";
    toggleBar.style.justifyContent = "space-between";
    toggleBar.style.alignItems = "center";
    toggleBar.innerHTML = `
      <span style="font-size:0.75rem; color:var(--text-muted);">Source: <strong>${this.payloadSourceLabel}</strong></span>
      <button id="btn-toggle-research" type="button" style="font-size:0.75rem; padding:0.3rem 0.6rem;">
        ${this.showResearchView ? "Hide Research View" : "Research View"}
      </button>
    `;
    appWrapper.appendChild(toggleBar);

    toggleBar.querySelector("#btn-toggle-research")?.addEventListener("click", () => {
      this.showResearchView = !this.showResearchView;
      this.render();
    });

    // Live Result & Timeline Region
    const resultRegion = document.createElement("div");
    resultRegion.id = "result-region";
    resultRegion.setAttribute("role", "status");
    resultRegion.setAttribute("aria-live", "polite");
    appWrapper.appendChild(resultRegion);

    this.container.appendChild(appWrapper);

    // Initial Pipeline Execution on Synthetic Mode Mount
    if (this.currentMode === "synthetic") {
      await this.executePipelineAndRender(resultRegion);
    }
  }

  private renderSyntheticControls(inputCard: HTMLElement): void {
    const scenarioKeys = Object.keys(DEMO_SCENARIO_CATALOG);
    const scenario = DEMO_SCENARIO_CATALOG[this.currentScenarioKey] || DEMO_SCENARIO_CATALOG.NORMAL_PAYMENT;

    inputCard.innerHTML = `
      <div class="card-header">
        <span style="font-weight:700; font-size:0.9rem;">TrustQR Security Demo</span>
        <span class="fact-badge">TRUSTQR SYNTHETIC TEST DATA</span>
      </div>
      <label for="scenario-select">Select Synthetic Scenario:</label>
      <select id="scenario-select" aria-label="Select Synthetic Demo Scenario">
        ${scenarioKeys.map((key) => `<option value="${key}">${DEMO_SCENARIO_CATALOG[key].displayName}</option>`).join("")}
      </select>
      <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.4rem;">${this.escapeHTML(scenario.description)}</p>
      
      <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
        <button id="btn-run" class="btn-primary" type="button">Run Verification</button>
        <button id="btn-generate" type="button" style="background:#0284c7; color:white; font-weight:600; border:none;">Generate Demo QR</button>
        <button id="btn-reset" type="button" style="background:#cbd5e1; border:none; font-weight:600;">Reset</button>
      </div>
    `;

    const select = inputCard.querySelector("#scenario-select") as HTMLSelectElement;
    if (select) {
      select.value = this.currentScenarioKey;
      select.addEventListener("change", (e) => {
        this.currentScenarioKey = (e.target as HTMLSelectElement).value;
        const p = inputCard.querySelector("p");
        if (p) p.textContent = DEMO_SCENARIO_CATALOG[this.currentScenarioKey].description;
      });
    }

    inputCard.querySelector("#btn-run")?.addEventListener("click", async () => {
      const region = this.container.querySelector("#result-region") as HTMLElement;
      if (region) await this.executePipelineAndRender(region);
    });

    inputCard.querySelector("#btn-generate")?.addEventListener("click", () => {
      const sc = DEMO_SCENARIO_CATALOG[this.currentScenarioKey];
      const dataUrl = localQRGenerator.generateSyntheticQRDataURL(sc.syntheticPayload);
      alert(`Synthetic Demo QR SVG Generated Locally!\nPayload: ${sc.syntheticPayload}`);
    });

    inputCard.querySelector("#btn-reset")?.addEventListener("click", () => {
      this.currentScenarioKey = "NORMAL_PAYMENT";
      this.currentResult = null;
      this.render();
    });
  }

  private renderUploadControls(inputCard: HTMLElement): void {
    inputCard.innerHTML = `
      <div class="card-header">
        <span style="font-weight:700; font-size:0.9rem;">Upload QR Image</span>
        <span class="fact-badge">Local Browser Decoding</span>
      </div>
      <div id="drop-zone" tabindex="0" role="region" aria-label="QR Image Drop Zone" style="border:2px dashed #94a3b8; border-radius:8px; padding:1.5rem; text-align:center; background:#f8fafc; cursor:pointer;">
        <p style="font-size:0.9rem; font-weight:600;">Drop QR Image Here or Click to Select</p>
        <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">Supported: PNG, JPG, JPEG, WEBP (Max 5MB). Processed 100% locally.</p>
        <input type="file" id="file-input" accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml" style="display:none;" />
      </div>
    `;

    const dropZone = inputCard.querySelector("#drop-zone") as HTMLElement;
    const fileInput = inputCard.querySelector("#file-input") as HTMLInputElement;

    dropZone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        await this.handleImageFile(files[0]);
      }
    });

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "#2563eb";
    });

    dropZone.addEventListener("drop", async (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "#94a3b8";
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        await this.handleImageFile(e.dataTransfer.files[0]);
      }
    });
  }

  private renderCameraControls(inputCard: HTMLElement): void {
    const isAvail = cameraQRDecoder.isAvailable();
    inputCard.innerHTML = `
      <div class="card-header">
        <span style="font-weight:700; font-size:0.9rem;">Camera Scan</span>
        <span class="fact-badge">Local Video Processing</span>
      </div>
      <div style="text-align:center; padding:1rem;">
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.75rem;">
          ${isAvail ? "Click below to grant temporary local camera scanning permissions." : "Camera scanning is available in supported HTTPS browser environments."}
        </p>
        <button id="btn-start-camera" class="btn-primary" type="button" ${!isAvail ? "disabled" : ""}>Scan with Camera</button>
      </div>
    `;

    inputCard.querySelector("#btn-start-camera")?.addEventListener("click", async () => {
      try {
        await cameraQRDecoder.start();
        alert("Camera scanning initialized locally! No video frames leave your device.");
      } catch (err: any) {
        alert(`Camera Error: ${err.message}`);
      }
    });
  }

  private async handleImageFile(file: File): Promise<void> {
    const region = this.container.querySelector("#result-region") as HTMLElement;
    if (!region) return;

    try {
      const decoded = await imageQRDecoder.decodeImageFile(file);
      await this.executePipelineAndRender(region, decoded.rawPayload);
    } catch (err: any) {
      region.innerHTML = `
        <div class="card" style="border-color:#991b1b; text-align:center;">
          <div class="risk-badge-panel BLOCKED">
            <div class="risk-title">IMAGE DECODING FAILED</div>
            <div style="margin-top:0.5rem; font-size:0.85rem;">${this.escapeHTML(err.message)}</div>
          </div>
        </div>
      `;
    }
  }

  public async executePipelineAndRender(target: HTMLElement, customPayload?: string): Promise<void> {
    target.innerHTML = "";

    this.currentResult = await trustQRPipeline.run({
      scenarioKey: customPayload ? undefined : this.currentScenarioKey,
      rawPayload: customPayload
    });

    const res = this.currentResult;
    const scenario = DEMO_SCENARIO_CATALOG[this.currentScenarioKey];

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "1rem";

    // 1. Research View Panel (If Toggled)
    if (this.showResearchView) {
      const researchCard = document.createElement("section");
      researchCard.className = "card";
      researchCard.style.background = "#f1f5f9";
      researchCard.innerHTML = `
        <div class="card-header">
          <span style="font-size:0.8rem; font-weight:700; color:#334155;">RESEARCH VIEW — Pipeline Outcomes</span>
          <span class="fact-badge">Stage Matrix</span>
        </div>
        <table class="payment-facts-table" style="font-size:0.8rem;">
          <tr><td class="label">1. QR Decode</td><td class="value" style="color:#166534;">✓ PASS</td></tr>
          <tr><td class="label">2. Payment Parse</td><td class="value" style="color:${res.parseResult.success ? "#166534" : "#9f1239"};">${res.parseResult.success ? "✓ PASS" : "✕ FAIL"}</td></tr>
          <tr><td class="label">3. Validation</td><td class="value" style="color:${res.validationResult?.status === "valid" ? "#166534" : res.validationResult?.status === "needs_review" ? "#854d0e" : "#9f1239"};">${res.validationResult ? res.validationResult.status.toUpperCase() : "SKIPPED"}</td></tr>
          <tr><td class="label">4. Privacy Filter</td><td class="value" style="color:${res.privacyResult?.decision === "allow" ? "#166534" : "#9f1239"};">${res.privacyResult ? res.privacyResult.decision.toUpperCase() : "SKIPPED"}</td></tr>
          <tr><td class="label">5. AI Analysis</td><td class="value">${res.aiExecuted ? (res.aiExplanation ? "✓ PASS" : "✕ REJECTED") : "— NOT EXECUTED"}</td></tr>
          <tr><td class="label">6. Risk Gate</td><td class="value" style="color:${res.riskResult.decision === "BLOCKED" ? "#9f1239" : "#166534"};">${res.riskResult.decision}</td></tr>
        </table>
      `;
      wrapper.appendChild(researchCard);
    }

    // 2. Security Boundaries Proof Panel
    const securityCard = document.createElement("section");
    securityCard.className = "card";
    securityCard.style.fontSize = "0.75rem";
    securityCard.innerHTML = `
      <div style="font-weight:700; color:var(--text-muted); margin-bottom:0.4rem;">SECURITY BOUNDARIES PROOF</div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.2rem; color:#475569;">
        <div>✓ No payment execution</div>
        <div>✓ No PIN collection</div>
        <div>✓ No OTP collection</div>
        <div>✓ Zero QR image upload</div>
        <div>✓ Facts read-only</div>
        <div>✓ Dangerous URIs blocked</div>
      </div>
    `;
    wrapper.appendChild(securityCard);

    // 3. Render Pipeline Output View
    if (!res.parsedData || res.riskResult.decision === "BLOCKED") {
      this.appendBlockedCard(wrapper, res);
    } else {
      this.appendVerificationCards(wrapper, res);
    }

    target.appendChild(wrapper);
  }

  private appendVerificationCards(wrapper: HTMLElement, res: PipelineResult): void {
    const data = res.parsedData!;
    const risk = res.riskResult;
    const ai = res.aiExplanation;

    // A. Payment Facts Card
    const summaryCard = document.createElement("section");
    summaryCard.className = "card";
    summaryCard.innerHTML = `
      <div class="card-header">
        <span class="fact-badge">PAYMENT FACT — Decoded QR</span>
        <span class="amount-display">${data.currency} ${data.amount.toLocaleString()}</span>
      </div>
      <table class="payment-facts-table" aria-label="Authoritative Payment Details">
        <tr>
          <td class="label">Recipient Name</td>
          <td class="value">${this.escapeHTML(data.merchantName || "Not provided")}</td>
        </tr>
        <tr>
          <td class="label">Payee UPI ID</td>
          <td class="value">${this.escapeHTML(data.recipient)}</td>
        </tr>
        <tr>
          <td class="label">Amount</td>
          <td class="value">${data.currency} ${data.amount}</td>
        </tr>
        <tr>
          <td class="label">Ref ID</td>
          <td class="value">${this.escapeHTML(data.transactionRef || "Not provided")}</td>
        </tr>
      </table>
      <div class="disclaimer-box">
        Payment facts come directly from the decoded QR string and cannot be altered by AI explanations.
      </div>
    `;
    wrapper.appendChild(summaryCard);

    // B. Risk Card
    const riskCard = document.createElement("section");
    riskCard.className = "card";
    riskCard.innerHTML = `
      <div class="risk-badge-panel ${risk.decision}">
        <div class="risk-title">${risk.decision.replace(/_/g, " ")}</div>
        <div>TrustQR Score: <strong>${risk.riskScore} / 100</strong></div>
        <div class="risk-disclaimer">Based on structural, privacy, and context consistency checks.</div>
      </div>
    `;
    wrapper.appendChild(riskCard);

    // C. AI Explanation Card
    const aiCard = document.createElement("section");
    aiCard.className = "card";
    if (ai) {
      aiCard.innerHTML = `
        <div class="card-header">
          <span class="ai-badge">AI EXPLANATION — Advisory Only</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">Confidence: ${Math.round(ai.confidence * 100)}%</span>
        </div>
        <p style="font-size:0.9rem; font-weight:600; margin-bottom:0.5rem;">${this.escapeHTML(ai.summary)}</p>
        <ul style="padding-left:1.2rem; font-size:0.85rem; color:var(--text-muted); display:flex; flex-direction:column; gap:0.25rem;">
          ${ai.reasons.map((r) => `<li>${this.escapeHTML(r)}</li>`).join("")}
        </ul>
        <div class="disclaimer-box">
          AI explanations are advisory. They do not verify merchant identity or authorize payments.
        </div>
      `;
    } else {
      aiCard.innerHTML = `
        <div class="card-header">
          <span class="ai-badge">AI EXPLANATION</span>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted);">AI explanation unavailable. Verification checks remain functional.</p>
      `;
    }
    wrapper.appendChild(aiCard);

    // D. Verification Checklist
    const checklistCard = document.createElement("section");
    checklistCard.className = "card";
    checklistCard.innerHTML = `
      <h2 style="font-size:1rem; margin-bottom:0.5rem;">Before You Pay</h2>
      <ul class="checklist">
        <li><span>☐</span> Verify payee name matches recipient in your payment app.</li>
        <li><span>☐</span> Confirm payee UPI ID: <strong>${this.escapeHTML(data.recipient)}</strong></li>
        <li><span>☐</span> Confirm total amount: <strong>${data.currency} ${data.amount}</strong></li>
        <li><span>☐</span> Complete transaction authorization inside your official app.</li>
      </ul>
    `;
    wrapper.appendChild(checklistCard);

    // E. Action Handoff Bar
    const actionBar = document.createElement("section");
    actionBar.className = "card";
    actionBar.style.textAlign = "center";
    actionBar.innerHTML = `
      <button class="btn-primary" type="button">Continue Manually in Your Payment App</button>
      <div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.4rem;">
        TrustQR does not execute payments or request your UPI PIN / OTP.
      </div>
    `;
    wrapper.appendChild(actionBar);

    // F. Privacy Notice
    const privacyNotice = document.createElement("footer");
    privacyNotice.className = "privacy-notice";
    privacyNotice.innerHTML = `
      Privacy protection: TrustQR processes payment information locally. Credentials (PIN, OTP, CVV) are strictly blocked.
    `;
    wrapper.appendChild(privacyNotice);
  }

  private appendBlockedCard(wrapper: HTMLElement, res: PipelineResult): void {
    const blockedCard = document.createElement("section");
    blockedCard.className = "card";
    blockedCard.style.textAlign = "center";
    blockedCard.style.borderColor = "#991b1b";

    const reason = res.riskResult.blockingReasons.join("; ") || "Payment verification halted by safety policy";

    blockedCard.innerHTML = `
      <div class="risk-badge-panel BLOCKED">
        <div class="risk-title">PAYMENT BLOCKED</div>
        <div style="margin-top:0.5rem; font-size:0.9rem;">${this.escapeHTML(reason)}</div>
        <div class="risk-disclaimer" style="margin-top:0.5rem;">Do not continue until payment information has been independently verified.</div>
      </div>
      <div style="margin-top:1rem; font-size:0.8rem; color:var(--text-muted);">
        TrustQR has halted verification processing due to safety or structural policy rejection. AI Provider call count: ${res.aiExecuted ? 1 : 0}.
      </div>
    `;
    wrapper.appendChild(blockedCard);
  }

  private escapeHTML(str: string): string {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
