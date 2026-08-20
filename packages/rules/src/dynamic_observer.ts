/**
 * Dynamic DOM Observer for Scanning Dynamically Inserted Candidates.
 * Includes debouncing and MutationObserver loop prevention.
 */

import { DeterministicDetector, DetectedCandidate } from "./detector.js";
import { ElementRepresentation } from "./acc_name.js";

export class DynamicDOMObserver {
  private detector: DeterministicDetector;
  private observer: MutationObserver | null = null;
  private onCandidatesDetected: (candidates: DetectedCandidate[]) => void;
  private debounceTimer: any = null;

  constructor(onCandidatesDetected: (candidates: DetectedCandidate[]) => void) {
    this.detector = new DeterministicDetector();
    this.onCandidatesDetected = onCandidatesDetected;
  }

  /**
   * Starts observing dynamic DOM mutations.
   */
  public start(root: Node = document.body): void {
    if (typeof MutationObserver === "undefined") return;

    this.observer = new MutationObserver((mutations) => {
      // MutationObserver Loop Prevention: Ignore mutations caused by TSIF itself!
      const isSelfMutation = mutations.every((m) => {
        const target = m.target as HTMLElement;
        return (
          target.hasAttribute?.("data-tsif-patched") ||
          target.closest?.("trustportal-shadow-host") !== null
        );
      });

      if (isSelfMutation) return;

      if (this.debounceTimer) clearTimeout(this.debounceTimer);

      // Debounce batch processing using requestIdleCallback if available
      if (typeof requestIdleCallback !== "undefined") {
        this.debounceTimer = requestIdleCallback(() => {
          this.scanDOM(root as HTMLElement);
        }, { timeout: 100 });
      } else {
        this.debounceTimer = setTimeout(() => {
          this.scanDOM(root as HTMLElement);
        }, 100);
      }
    });

    this.observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["alt", "aria-label", "role", "disabled", "hidden"]
    });
  }

  public stop(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  public scanDOM(root: HTMLElement): void {
    const selector = "img, button, a, input, select, textarea, svg, [role='button'], [role='link']";
    const rawElements = Array.from(root.querySelectorAll(selector));

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
    if (candidates.length > 0) {
      this.onCandidatesDetected(candidates);
    }
  }
}
