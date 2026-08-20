/**
 * SevaConnect Demo Site Controller & Dynamic Scenario Engine.
 */

import { DeterministicDetector, ElementRepresentation } from "@trustportal/rules";

class SevaConnectDemoController {
  private detector: DeterministicDetector;

  constructor() {
    this.detector = new DeterministicDetector();
  }

  public init(): void {
    console.log("🛡️ SevaConnect Demo Environment Loaded.");
    this.setupDynamicTimer();
    this.setupScenarioControls();
    this.updateDebugLedger();
  }

  private setupDynamicTimer(): void {
    const indicator = document.getElementById("dynamic-status-indicator");
    const container = document.getElementById("dynamic-container");

    setTimeout(() => {
      if (container) {
        const dynamicBtn = document.createElement("button");
        dynamicBtn.className = "icon-btn";
        dynamicBtn.setAttribute("data-trustportal-test", "dynamic-button");
        dynamicBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`;
        container.appendChild(dynamicBtn);
      }

      if (indicator) {
        indicator.textContent = "⚡ Dynamic content loaded (Icon-only button injected after 2s).";
        indicator.style.borderColor = "#22c55e";
        indicator.style.color = "#22c55e";
      }

      this.updateDebugLedger();
    }, 2000);
  }

  private setupScenarioControls(): void {
    document.getElementById("ctrl-add-button")?.addEventListener("click", () => {
      const container = document.getElementById("dynamic-container");
      if (!container) return;
      const btn = document.createElement("button");
      btn.className = "icon-btn";
      btn.setAttribute("data-trustportal-test", "dynamic-unnamed-button");
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`;
      container.appendChild(btn);
      this.updateDebugLedger();
    });

    document.getElementById("ctrl-add-img")?.addEventListener("click", () => {
      const container = document.getElementById("dynamic-container");
      if (!container) return;
      const img = document.createElement("img");
      img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='40'><rect width='100%' height='100%' fill='%23ef4444'/></svg>";
      img.className = "fixture-img-small";
      img.setAttribute("data-trustportal-test", "dynamic-missing-alt");
      container.appendChild(img);
      this.updateDebugLedger();
    });

    document.getElementById("ctrl-add-link")?.addEventListener("click", () => {
      const container = document.getElementById("dynamic-container");
      if (!container) return;
      const link = document.createElement("a");
      link.href = "#dynamic-link";
      link.className = "icon-link";
      link.setAttribute("data-trustportal-test", "dynamic-unnamed-link");
      link.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/></svg>`;
      container.appendChild(link);
      this.updateDebugLedger();
    });

    document.getElementById("ctrl-add-input")?.addEventListener("click", () => {
      const container = document.getElementById("dynamic-container");
      if (!container) return;
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Dynamic Unlabeled Input";
      input.className = "input-field";
      input.setAttribute("data-trustportal-test", "dynamic-unlabeled-input");
      container.appendChild(input);
      this.updateDebugLedger();
    });

    document.getElementById("ctrl-toggle-sensitive")?.addEventListener("click", () => {
      const sec = document.getElementById("sensitive-workflow");
      if (sec) sec.style.display = sec.style.display === "none" ? "block" : "none";
      this.updateDebugLedger();
    });

    document.getElementById("ctrl-toggle-injection")?.addEventListener("click", () => {
      const sec = document.getElementById("security-test");
      if (sec) sec.style.display = sec.style.display === "none" ? "block" : "none";
      this.updateDebugLedger();
    });

    document.getElementById("ctrl-reset")?.addEventListener("click", () => {
      window.location.reload();
    });
  }

  public updateDebugLedger(): void {
    const rawElements = Array.from(
      document.querySelectorAll("img, button, a, input, select, textarea, svg")
    );

    const representations: ElementRepresentation[] = rawElements.map((el) => {
      const attrs: Record<string, string> = {};
      for (let i = 0; i < el.attributes.length; i++) {
        const a = el.attributes[i];
        attrs[a.name] = a.value;
      }
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        role: el.getAttribute("role"),
        attributes: attrs,
        textContent: el.textContent,
        title: el.getAttribute("title")
      };
    });

    const candidates = this.detector.scan(representations);

    const detectedElem = document.getElementById("dbg-detected");
    if (detectedElem) detectedElem.textContent = String(candidates.length);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const controller = new SevaConnectDemoController();
  controller.init();
});
