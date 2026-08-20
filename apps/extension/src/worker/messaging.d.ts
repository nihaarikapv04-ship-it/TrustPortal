/**
 * Service Worker Message Handler.
 * Validates incoming messages using Zod schemas and processes PING, GET_STATUS, SET_SITE_ENABLED.
 */
import { ExtensionMessage } from "../messaging_types";
export declare function handleWorkerMessage(rawMessage: any): Promise<ExtensionMessage>;
//# sourceMappingURL=messaging.d.ts.map