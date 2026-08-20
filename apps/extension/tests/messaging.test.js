import { describe, test, expect } from "vitest";
import { handleWorkerMessage } from "../src/worker/messaging";
import { createMessage, ExtensionMessageSchema } from "../src/messaging_types";
describe("Extension Shell Messaging Layer Tests", () => {
    test("Validates well-formed ExtensionMessage schema", () => {
        const msg = createMessage("PING");
        const parse = ExtensionMessageSchema.safeParse(msg);
        expect(parse.success).toBe(true);
        expect(msg.type).toBe("PING");
        expect(msg.schemaVersion).toBe(1);
    });
    test("Rejects malformed message schema gracefully", async () => {
        const malformedMsg = { type: "PING", schemaVersion: 99 }; // Wrong version
        const res = await handleWorkerMessage(malformedMsg);
        expect(res.type).toBe("ERROR_RESPONSE");
        expect(res.payload.error).toBe("INVALID_MESSAGE_SCHEMA");
    });
    test("Rejects unknown message types safely", async () => {
        const unknownMsg = {
            type: "UNSUPPORTED_ACTION",
            schemaVersion: 1,
            requestId: "req_test_1"
        };
        const res = await handleWorkerMessage(unknownMsg);
        expect(res.type).toBe("ERROR_RESPONSE");
        expect(res.payload.error).toBe("INVALID_MESSAGE_SCHEMA");
    });
    test("Responds to PING message correctly", async () => {
        const pingMsg = createMessage("PING");
        const res = await handleWorkerMessage(pingMsg);
        expect(res.type).toBe("STATUS_RESPONSE");
        expect(res.payload.status).toBe("active");
    });
    test("Handles GET_STATUS message for origin", async () => {
        const statusMsg = createMessage("GET_STATUS", { origin: "https://example.com" });
        const res = await handleWorkerMessage(statusMsg);
        expect(res.type).toBe("STATUS_RESPONSE");
        expect(res.payload.origin).toBe("https://example.com");
        expect(res.payload.enabled).toBe(true);
    });
    test("Handles SET_SITE_ENABLED toggle", async () => {
        const disableMsg = createMessage("SET_SITE_ENABLED", {
            origin: "https://test.org",
            enabled: false
        });
        const res = await handleWorkerMessage(disableMsg);
        expect(res.type).toBe("STATUS_RESPONSE");
        expect(res.payload.origin).toBe("https://test.org");
        expect(res.payload.enabled).toBe(false);
    });
});
