import { z } from "zod";

export const ExtensionMessageSchema = z.object({
  type: z.string(),
  payload: z.any().optional(),
  requestId: z.string().optional()
});

export const SetSiteEnabledPayloadSchema = z.object({
  origin: z.string(),
  enabled: z.boolean()
});

export function createMessage(type, payload, requestId) {
  return {
    type,
    payload,
    requestId: requestId || `req_${Math.random().toString(36).substring(2, 9)}`
  };
}
