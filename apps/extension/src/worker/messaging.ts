/**
 * Service Worker Message Handler.
 * Validates incoming messages using Zod schemas and processes PING, GET_STATUS, SET_SITE_ENABLED.
 */

import {
  ExtensionMessage,
  ExtensionMessageSchema,
  createMessage,
  SetSiteEnabledPayloadSchema
} from "../messaging_types.js";
import { policyStorage } from "../policy/storage.js";

const VALID_MESSAGE_TYPES = new Set([
  "PING",
  "GET_STATUS",
  "SET_SITE_ENABLED",
  "POLICY_QUERY",
  "SCAN_REQUEST",
  "PROPOSAL_REQUEST",
  "PROPOSAL_ACCEPT",
  "PROPOSAL_EDIT",
  "PROPOSAL_REJECT"
]);

export async function handleWorkerMessage(rawMessage: any): Promise<ExtensionMessage> {
  const parseResult = ExtensionMessageSchema.safeParse(rawMessage);

  if (!parseResult.success || !VALID_MESSAGE_TYPES.has(rawMessage?.type)) {
    return createMessage("ERROR_RESPONSE", {
      error: "INVALID_MESSAGE_SCHEMA"
    });
  }

  const message = parseResult.data as ExtensionMessage;

  switch (message.type) {
    case "PING":
      return createMessage("STATUS_RESPONSE", {
        status: "active",
        timestamp: new Date().toISOString()
      });

    case "GET_STATUS":
    case "POLICY_QUERY": {
      const origin = message.payload?.origin || "unknown";
      const siteStatus = await policyStorage.getSiteStatus(origin);
      return createMessage("STATUS_RESPONSE", siteStatus);
    }

    case "SET_SITE_ENABLED": {
      const payloadParse = SetSiteEnabledPayloadSchema.safeParse(message.payload);
      if (!payloadParse.success) {
        return createMessage("ERROR_RESPONSE", {
          error: "INVALID_MESSAGE_SCHEMA"
        });
      }

      const { origin, enabled } = payloadParse.data;
      await policyStorage.setSiteEnabled(origin, enabled);
      const updatedStatus = await policyStorage.getSiteStatus(origin);
      return createMessage("STATUS_RESPONSE", updatedStatus);
    }

    default:
      return createMessage("ERROR_RESPONSE", {
        error: "INVALID_MESSAGE_SCHEMA"
      });
  }
}
