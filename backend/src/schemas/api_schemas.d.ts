import { z } from "zod";
export declare const DefectPayloadSchema: z.ZodObject<{
    payload: z.ZodObject<{
        tag: z.ZodString;
        role: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodOptional<z.ZodString>;
        selector: z.ZodOptional<z.ZodString>;
        attributes: z.ZodRecord<z.ZodString, z.ZodString>;
        surrounding_context: z.ZodObject<{
            nearest_heading: z.ZodOptional<z.ZodString>;
            parent_text: z.ZodOptional<z.ZodString>;
            sibling_text: z.ZodOptional<z.ZodString>;
            hidden_text: z.ZodOptional<z.ZodString>;
            page_title: z.ZodOptional<z.ZodString>;
            url_path: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            nearest_heading?: string | undefined;
            parent_text?: string | undefined;
            sibling_text?: string | undefined;
            hidden_text?: string | undefined;
            page_title?: string | undefined;
            url_path?: string | undefined;
        }, {
            nearest_heading?: string | undefined;
            parent_text?: string | undefined;
            sibling_text?: string | undefined;
            hidden_text?: string | undefined;
            page_title?: string | undefined;
            url_path?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        tag: string;
        attributes: Record<string, string>;
        surrounding_context: {
            nearest_heading?: string | undefined;
            parent_text?: string | undefined;
            sibling_text?: string | undefined;
            hidden_text?: string | undefined;
            page_title?: string | undefined;
            url_path?: string | undefined;
        };
        role?: string | null | undefined;
        id?: string | undefined;
        selector?: string | undefined;
    }, {
        tag: string;
        attributes: Record<string, string>;
        surrounding_context: {
            nearest_heading?: string | undefined;
            parent_text?: string | undefined;
            sibling_text?: string | undefined;
            hidden_text?: string | undefined;
            page_title?: string | undefined;
            url_path?: string | undefined;
        };
        role?: string | null | undefined;
        id?: string | undefined;
        selector?: string | undefined;
    }>;
    urlPath: z.ZodString;
}, "strip", z.ZodTypeAny, {
    payload: {
        tag: string;
        attributes: Record<string, string>;
        surrounding_context: {
            nearest_heading?: string | undefined;
            parent_text?: string | undefined;
            sibling_text?: string | undefined;
            hidden_text?: string | undefined;
            page_title?: string | undefined;
            url_path?: string | undefined;
        };
        role?: string | null | undefined;
        id?: string | undefined;
        selector?: string | undefined;
    };
    urlPath: string;
}, {
    payload: {
        tag: string;
        attributes: Record<string, string>;
        surrounding_context: {
            nearest_heading?: string | undefined;
            parent_text?: string | undefined;
            sibling_text?: string | undefined;
            hidden_text?: string | undefined;
            page_title?: string | undefined;
            url_path?: string | undefined;
        };
        role?: string | null | undefined;
        id?: string | undefined;
        selector?: string | undefined;
    };
    urlPath: string;
}>;
export declare const FeedbackSchema: z.ZodObject<{
    patchId: z.ZodString;
    feedback: z.ZodString;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    patchId: string;
    timestamp: string;
    feedback: string;
}, {
    patchId: string;
    timestamp: string;
    feedback: string;
}>;
export declare const RevertSchema: z.ZodObject<{
    patchId: z.ZodString;
    reason: z.ZodString;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    patchId: string;
    timestamp: string;
    reason: string;
}, {
    patchId: string;
    timestamp: string;
    reason: string;
}>;
//# sourceMappingURL=api_schemas.d.ts.map