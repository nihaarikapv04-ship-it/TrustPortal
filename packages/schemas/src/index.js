import { z } from "zod";
export const IssueTypeEnum = z.enum([
    "img-alt",
    "button-name",
    "link-name",
    "form-label",
    "svg-name",
    "custom-control"
]);
export const AllowlistedAttributeEnum = z.enum([
    "alt",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "role"
]);
export const EvidenceItemSchema = z.object({
    source: z.enum(["visible_text", "nearby_text", "heading", "role", "image"]),
    quote: z.string()
});
export const DecisionEnum = z.enum(["auto", "confirm", "reject"]);
export const SemanticPatchSchema = z.object({
    patchId: z.string(),
    issueType: IssueTypeEnum,
    targetFingerprint: z.string(),
    attribute: AllowlistedAttributeEnum,
    previousValue: z.string().nullable(),
    proposedValue: z.string(),
    evidence: z.array(EvidenceItemSchema),
    trustScore: z.number().min(0).max(100),
    decision: DecisionEnum,
    modelVersion: z.string().optional()
});
export const SafeContextSchema = z.object({
    issueType: IssueTypeEnum,
    ruleId: z.string(),
    elementRole: z.string().nullable(),
    safeAttributes: z.record(z.string()),
    visibleElementText: z.string(),
    associatedLabel: z.string(),
    nearestHeading: z.string(),
    nearestLandmark: z.string(),
    boundedNearbyText: z.string(),
    urlOrigin: z.string(),
    coarsePageCategory: z.string(),
    language: z.string(),
    redactionFlags: z.array(z.string())
});
export const ProposalRequestSchema = z.object({
    schemaVersion: z.string(),
    origin: z.string(),
    coarsePageCategory: z.string(),
    issueType: IssueTypeEnum,
    targetRole: z.string().nullable(),
    safeContext: SafeContextSchema,
    language: z.string(),
    privacyFlags: z.array(z.string()),
    clientVersion: z.string(),
    idempotencyKey: z.string()
});
export const ProposalResponseSchema = z.object({
    proposalId: z.string(),
    action: z.enum(["propose", "abstain"]),
    decision: DecisionEnum,
    patch: SemanticPatchSchema.optional(),
    trustScore: z.number(),
    evidence: z.array(EvidenceItemSchema),
    expiresAt: z.string(),
    modelMetadata: z.object({
        provider: z.string(),
        modelName: z.string(),
        promptVersion: z.string()
    })
});
export const FeedbackRequestSchema = z.object({
    patchId: z.string(),
    action: z.enum(["accept", "reject", "edit", "revert", "wrong_label"]),
    customLabel: z.string().optional(),
    userComment: z.string().optional(),
    timestamp: z.string()
});
export const PolicyResponseSchema = z.object({
    thresholds: z.object({
        autoApplyMinScore: z.number(),
        confirmMinScore: z.number(),
        roleThresholds: z.record(z.number())
    }),
    disabledIssueTypes: z.array(z.string()),
    providerAvailability: z.record(z.boolean()),
    emergencyDenylist: z.array(z.string())
});
