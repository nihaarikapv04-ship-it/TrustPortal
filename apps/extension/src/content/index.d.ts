/**
 * TrustPortal Content Script Entry Point.
 * Initializes the TrustPortal client runtime, establishes messaging connection with MV3 Service Worker,
 * and sets up lifecycle handlers.
 */
export declare class TrustPortalClientRuntime {
    private initialized;
    private currentOrigin;
    init(): Promise<void>;
    isInitialized(): boolean;
    destroy(): void;
}
//# sourceMappingURL=index.d.ts.map