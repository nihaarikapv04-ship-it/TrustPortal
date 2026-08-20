import { z } from "zod";

export const IssueTypeEnum = z.enum([
  "img-alt",
  "button-name",
  "link-name",
  "form-label",
  "svg-name",
  "custom-control"
]);
export type IssueType = z.infer<typeof IssueTypeEnum>;

export type PageCategory =
  | "public-information"
  | "authentication"
  | "payment"
  | "identity"
  | "health"
  | "tax"
  | "legal"
  | "benefits"
  | string;

export const AllowlistedAttributeEnum = z.enum([
  "alt",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "role"
]);
export type AllowlistedAttribute = z.infer<typeof AllowlistedAttributeEnum>;

export const EvidenceItemSchema = z.object({
  source: z.enum(["visible_text", "nearby_text", "heading", "role", "image"]),
  quote: z.string()
});
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export const DecisionEnum = z.enum(["auto", "confirm", "reject"]);
export type Decision = z.infer<typeof DecisionEnum>;

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
export type SemanticPatch = z.infer<typeof SemanticPatchSchema>;

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
export type SafeContext = z.infer<typeof SafeContextSchema>;

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
export type ProposalRequest = z.infer<typeof ProposalRequestSchema>;

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
export type ProposalResponse = z.infer<typeof ProposalResponseSchema>;

export const FeedbackRequestSchema = z.object({
  proposalId: z.string().optional(),
  patchId: z.string(),
  action: z.enum(["accept", "reject", "edit", "revert", "wrong_label", "accepted", "rejected", "edited"]).optional(),
  actionTaken: z.string().optional(),
  customLabel: z.string().optional(),
  finalLabelUsed: z.string().optional(),
  userEdited: z.boolean().optional(),
  userComment: z.string().optional(),
  timestamp: z.string().optional()
});
export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;

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
export type PolicyResponse = z.infer<typeof PolicyResponseSchema>;
