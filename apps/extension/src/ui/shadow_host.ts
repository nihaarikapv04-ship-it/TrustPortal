/**
 * Shadow DOM UI Mounting Architecture.
 * Attaches TrustPortal UI using a CLOSED Shadow DOM root (mode: "closed") to prevent host page style leakage
 * and resist DOM-based clickjacking attacks (Marek Tóth research).
 */

export class ShadowHostContainer {
  private hostElement: HTMLElement | null = null;
  private shadowRoot: ShadowRoot | null = null;

  /**
   * Mounts a container in a closed shadow root attached to document body.
   */
  public mount(containerId: string): ShadowRoot {
    this.unmount();

    this.hostElement = document.createElement("trustportal-shadow-host");
    this.hostElement.id = containerId;
    this.hostElement.style.position = "fixed";
    this.hostElement.style.top = "0";
    this.hostElement.style.left = "0";
    this.hostElement.style.width = "0";
    this.hostElement.style.height = "0";
    this.hostElement.style.zIndex = "2147483647"; // Max z-index

    // Attach CLOSED shadow root
    this.shadowRoot = this.hostElement.attachShadow({ mode: "closed" });
    document.body.appendChild(this.hostElement);

    return this.shadowRoot;
  }

  /**
   * Cleans up and removes the shadow host element from document.
   */
  public unmount(): void {
    if (this.hostElement && this.hostElement.parentNode) {
      this.hostElement.parentNode.removeChild(this.hostElement);
      this.hostElement = null;
      this.shadowRoot = null;
    }
  }

  public getShadowRoot(): ShadowRoot | null {
    return this.shadowRoot;
  }
}

export const shadowHost = new ShadowHostContainer();
