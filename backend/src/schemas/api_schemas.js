import { z } from "zod";
export const DefectPayloadSchema = z.object({
    payload: z.object({
        tag: z.string(),
        role: z.string().nullable().optional(),
        id: z.string().optional(),
        selector: z.string().optional(),
        attributes: z.record(z.string()),
        surrounding_context: z.object({
            nearest_heading: z.string().optional(),
            parent_text: z.string().optional(),
            sibling_text: z.string().optional(),
            hidden_text: z.string().optional(),
            page_title: z.string().optional(),
            url_path: z.string().optional()
        })
    }),
    urlPath: z.string()
});
export const FeedbackSchema = z.object({
    patchId: z.string(),
    feedback: z.string(),
    timestamp: z.string()
});
export const RevertSchema = z.object({
    patchId: z.string(),
    reason: z.string(),
    timestamp: z.string()
});
