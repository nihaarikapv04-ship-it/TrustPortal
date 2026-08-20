/**
 * Content Script Messaging Layer.
 * Provides typed message transmission to MV3 Service Worker.
 */
import { StatusResponsePayload } from "../messaging_types";
export declare class ContentMessaging {
    ping(): Promise<boolean>;
    getStatus(origin: string): Promise<StatusResponsePayload | null>;
    setSiteEnabled(origin: string, enabled: boolean): Promise<boolean>;
    private sendMessage;
}
export declare const contentMessaging: ContentMessaging;
//# sourceMappingURL=messaging.d.ts.map