/**
 * Shadow DOM UI Mounting Architecture.
 * Attaches TrustPortal UI using a CLOSED Shadow DOM root (mode: "closed") to prevent host page style leakage
 * and resist DOM-based clickjacking attacks (Marek Tóth research).
 */
export declare class ShadowHostContainer {
    private hostElement;
    private shadowRoot;
    /**
     * Mounts a container in a closed shadow root attached to document body.
     */
    mount(containerId: string): ShadowRoot;
    /**
     * Cleans up and removes the shadow host element from document.
     */
    unmount(): void;
    getShadowRoot(): ShadowRoot | null;
}
export declare const shadowHost: ShadowHostContainer;
//# sourceMappingURL=shadow_host.d.ts.map