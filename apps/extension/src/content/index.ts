/**
 * TrustPortal Content Script Runtime & Visual Inspector.
 * Scans page elements, performs accessibility repairs, enforces security boundaries,
 * and renders an interactive floating status badge and element inspector.
 */

import { contentMessaging } from "./messaging.js";

export interface RepairedElement {
  id: string;
  tag: string;
  previousLabel: string;
  remediatedLabel: string;
  elementRef: HTMLElement;
}

export class TrustPortalClientRuntime {
  private initialized: boolean = false;
  private currentOrigin: string = window.location.origin;
  private repairedElements: RepairedElement[] = [];
  private highlightsActive: boolean = false;
  private badgeElement: HTMLElement | null = null;
  private inspectorCard: HTMLElement | null = null;

  public async init(): Promise<void> {
    if (this.initialized) return;

    console.log(`🛡️ TrustPortal Runtime Initializing on [${this.currentOrigin}]...`);

    const pingSuccess = await contentMessaging.ping();
    if (pingSuccess) {
      console.log("✅ TrustPortal Service Worker connection established.");
    } else {
      console.warn("⚠️ TrustPortal Service Worker pending connection.");
    }

    // Perform live DOM scanning and safe remediation
    this.scanAndRemediate();

    // Render interactive visual badge on page
    this.renderFloatingBadge();

    // Set up dynamic MutationObserver for new elements
    this.observeDynamicDOM();

    this.initialized = true;
  }

  private scanAndRemediate(): void {
    const interactiveElements = document.querySelectorAll<HTMLElement>("button, a, input, [role='button'], svg");
    
    interactiveElements.forEach((el, index) => {
      // Ignore if element is inside our own extension UI badge
      if (el.closest("#trustportal-floating-badge-root")) return;

      const currentLabel = el.getAttribute("aria-label") || el.getAttribute("alt") || el.innerText.trim();

      // Check if control is missing accessible name or unlabelled
      if (!currentLabel || currentLabel === "null" || currentLabel === "undefined") {
        let inferredLabel = "";

        // Infer contextual label from parent or sibling text
        const parentText = el.parentElement?.innerText.trim();
        const placeholder = el.getAttribute("placeholder");
        const title = el.getAttribute("title");

        if (title) {
          inferredLabel = title;
        } else if (placeholder) {
          inferredLabel = placeholder;
        } else if (parentText && parentText.length < 50 && parentText.length > 2) {
          inferredLabel = parentText;
        } else if (el.tagName.toLowerCase() === "button" || el.getAttribute("role") === "button") {
          inferredLabel = "Interactive Action Control";
        } else {
          inferredLabel = "Accessible Page Element";
        }

        // Apply safe remediation patch
        const elId = el.id || `tp_el_${index}`;
        el.setAttribute("aria-label", inferredLabel);

        this.repairedElements.push({
          id: elId,
          tag: el.tagName.toLowerCase(),
          previousLabel: currentLabel || "(Missing Name)",
          remediatedLabel: inferredLabel,
          elementRef: el
        });
      }
    });

    console.log(`🛡️ TrustPortal remediated ${this.repairedElements.length} accessibility defects on [${this.currentOrigin}]`);
  }

  private renderFloatingBadge(): void {
    if (document.getElementById("trustportal-floating-badge-root")) return;

    const root = document.createElement("div");
    root.id = "trustportal-floating-badge-root";
    root.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 13px;
    `;

    const badge = document.createElement("div");
    badge.id = "trustportal-badge";
    badge.style.cssText = `
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(12px);
      color: #f8fafc;
      padding: 10px 16px;
      border-radius: 30px;
      border: 1px solid rgba(56, 189, 248, 0.4);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.2);
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
    `;

    const statusDot = `<span style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #22c55e;"></span>`;
    const count = this.repairedElements.length;

    badge.innerHTML = `
      🛡️ <strong>TrustPortal Active</strong> ${statusDot}
      <span style="color: #38bdf8; font-weight: 600;">${count} Repairs</span>
    `;

    badge.addEventListener("mouseenter", () => {
      badge.style.transform = "translateY(-2px) scale(1.02)";
      badge.style.borderColor = "#38bdf8";
    });
    badge.addEventListener("mouseleave", () => {
      badge.style.transform = "none";
      badge.style.borderColor = "rgba(56, 189, 248, 0.4)";
    });

    badge.addEventListener("click", () => this.toggleInspectorCard(root));

    root.appendChild(badge);
    document.body.appendChild(root);
    this.badgeElement = root;
  }

  private toggleInspectorCard(root: HTMLElement): void {
    if (this.inspectorCard) {
      this.inspectorCard.remove();
      this.inspectorCard = null;
      return;
    }

    const card = document.createElement("div");
    card.id = "trustportal-inspector-card";
    card.style.cssText = `
      position: absolute;
      bottom: 50px;
      right: 0;
      width: 340px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 20px 30px rgba(0, 0, 0, 0.6);
      color: #f8fafc;
      font-size: 12px;
      max-height: 420px;
      overflow-y: auto;
    `;

    const listHtml = this.repairedElements.length > 0
      ? this.repairedElements.map(item => `
          <div style="background: #1e293b; padding: 8px 10px; border-radius: 6px; margin-bottom: 6px; border-left: 3px solid #38bdf8;">
            <div style="font-weight: bold; color: #94a3b8; text-transform: uppercase; font-size: 10px;">&lt;${item.tag}&gt;</div>
            <div style="color: #22c55e; margin-top: 2px;">+ aria-label="${item.remediatedLabel}"</div>
          </div>
        `).join("")
      : `<div style="color: #94a3b8; padding: 12px; text-align: center;">No accessibility defects detected on this page view.</div>`;

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #334155; padding-bottom: 8px;">
        <strong style="font-size: 13px; color: #38bdf8;">🛡️ TrustPortal Live Inspector</strong>
        <span id="tp-close-card" style="cursor: pointer; color: #94a3b8; font-weight: bold; padding: 2px 6px;">✕</span>
      </div>
      <div style="margin-bottom: 10px; color: #cbd5e1; font-size: 11px;">
        Origin: <span style="color: #38bdf8; font-family: monospace;">${this.currentOrigin}</span>
      </div>
      <button id="tp-toggle-highlights" style="width: 100%; padding: 8px; background: #0284c7; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; margin-bottom: 12px;">
        ${this.highlightsActive ? "Hide Visual Highlights" : "✨ Toggle Visual Highlights"}
      </button>
      <div style="font-weight: 600; margin-bottom: 8px; color: #f1f5f9;">Applied Accessibility Patches (${this.repairedElements.length}):</div>
      <div>${listHtml}</div>
    `;

    root.appendChild(card);
    this.inspectorCard = card;

    document.getElementById("tp-close-card")?.addEventListener("click", () => {
      this.inspectorCard?.remove();
      this.inspectorCard = null;
    });

    document.getElementById("tp-toggle-highlights")?.addEventListener("click", () => {
      this.toggleVisualHighlights();
      const btn = document.getElementById("tp-toggle-highlights");
      if (btn) btn.innerText = this.highlightsActive ? "Hide Visual Highlights" : "✨ Toggle Visual Highlights";
    });
  }

  private toggleVisualHighlights(): void {
    this.highlightsActive = !this.highlightsActive;

    this.repairedElements.forEach(item => {
      if (this.highlightsActive) {
        item.elementRef.style.outline = "2px dashed #06b6d4";
        item.elementRef.style.outlineOffset = "3px";
        item.elementRef.setAttribute("title", `🛡️ TrustPortal Patched: aria-label="${item.remediatedLabel}"`);
      } else {
        item.elementRef.style.outline = "";
        item.elementRef.style.outlineOffset = "";
      }
    });
  }

  private observeDynamicDOM(): void {
    const observer = new MutationObserver(() => {
      this.scanAndRemediate();
      if (this.badgeElement) {
        const badgeCount = this.badgeElement.querySelector("span:last-child");
        if (badgeCount) badgeCount.textContent = `${this.repairedElements.length} Repairs`;
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public destroy(): void {
    this.initialized = false;
  }
}

const runtime = new TrustPortalClientRuntime();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => runtime.init());
} else {
  runtime.init();
}
