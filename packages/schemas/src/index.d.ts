import { z } from "zod";
export declare const IssueTypeEnum: z.ZodEnum<["img-alt", "button-name", "link-name", "form-label", "svg-name", "custom-control"]>;
export type IssueType = z.infer<typeof IssueTypeEnum>;
export declare const AllowlistedAttributeEnum: z.ZodEnum<["alt", "aria-label", "aria-labelledby", "aria-describedby", "role"]>;
export type AllowlistedAttribute = z.infer<typeof AllowlistedAttributeEnum>;
export declare const EvidenceItemSchema: z.ZodObject<{
    source: z.ZodEnum<["visible_text", "nearby_text", "heading", "role", "image"]>;
    quote: z.ZodString;
}, "strip", z.ZodTypeAny, {
    source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
    quote: string;
}, {
    source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
    quote: string;
}>;
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;
export declare const DecisionEnum: z.ZodEnum<["auto", "confirm", "reject"]>;
export type Decision = z.infer<typeof DecisionEnum>;
export declare const SemanticPatchSchema: z.ZodObject<{
    patchId: z.ZodString;
    issueType: z.ZodEnum<["img-alt", "button-name", "link-name", "form-label", "svg-name", "custom-control"]>;
    targetFingerprint: z.ZodString;
    attribute: z.ZodEnum<["alt", "aria-label", "aria-labelledby", "aria-describedby", "role"]>;
    previousValue: z.ZodNullable<z.ZodString>;
    proposedValue: z.ZodString;
    evidence: z.ZodArray<z.ZodObject<{
        source: z.ZodEnum<["visible_text", "nearby_text", "heading", "role", "image"]>;
        quote: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
        quote: string;
    }, {
        source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
        quote: string;
    }>, "many">;
    trustScore: z.ZodNumber;
    decision: z.ZodEnum<["auto", "confirm", "reject"]>;
    modelVersion: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    evidence: {
        source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
        quote: string;
    }[];
    patchId: string;
    issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
    targetFingerprint: string;
    attribute: "role" | "alt" | "aria-label" | "aria-labelledby" | "aria-describedby";
    previousValue: string | null;
    proposedValue: string;
    trustScore: number;
    decision: "reject" | "auto" | "confirm";
    modelVersion?: string | undefined;
}, {
    evidence: {
        source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
        quote: string;
    }[];
    patchId: string;
    issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
    targetFingerprint: string;
    attribute: "role" | "alt" | "aria-label" | "aria-labelledby" | "aria-describedby";
    previousValue: string | null;
    proposedValue: string;
    trustScore: number;
    decision: "reject" | "auto" | "confirm";
    modelVersion?: string | undefined;
}>;
export type SemanticPatch = z.infer<typeof SemanticPatchSchema>;
export declare const SafeContextSchema: z.ZodObject<{
    issueType: z.ZodEnum<["img-alt", "button-name", "link-name", "form-label", "svg-name", "custom-control"]>;
    ruleId: z.ZodString;
    elementRole: z.ZodNullable<z.ZodString>;
    safeAttributes: z.ZodRecord<z.ZodString, z.ZodString>;
    visibleElementText: z.ZodString;
    associatedLabel: z.ZodString;
    nearestHeading: z.ZodString;
    nearestLandmark: z.ZodString;
    boundedNearbyText: z.ZodString;
    urlOrigin: z.ZodString;
    coarsePageCategory: z.ZodString;
    language: z.ZodString;
    redactionFlags: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    language: string;
    redactionFlags: string[];
    issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
    ruleId: string;
    elementRole: string | null;
    safeAttributes: Record<string, string>;
    visibleElementText: string;
    associatedLabel: string;
    nearestHeading: string;
    nearestLandmark: string;
    boundedNearbyText: string;
    urlOrigin: string;
    coarsePageCategory: string;
}, {
    language: string;
    redactionFlags: string[];
    issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
    ruleId: string;
    elementRole: string | null;
    safeAttributes: Record<string, string>;
    visibleElementText: string;
    associatedLabel: string;
    nearestHeading: string;
    nearestLandmark: string;
    boundedNearbyText: string;
    urlOrigin: string;
    coarsePageCategory: string;
}>;
export type SafeContext = z.infer<typeof SafeContextSchema>;
export declare const ProposalRequestSchema: z.ZodObject<{
    schemaVersion: z.ZodString;
    origin: z.ZodString;
    coarsePageCategory: z.ZodString;
    issueType: z.ZodEnum<["img-alt", "button-name", "link-name", "form-label", "svg-name", "custom-control"]>;
    targetRole: z.ZodNullable<z.ZodString>;
    safeContext: z.ZodObject<{
        issueType: z.ZodEnum<["img-alt", "button-name", "link-name", "form-label", "svg-name", "custom-control"]>;
        ruleId: z.ZodString;
        elementRole: z.ZodNullable<z.ZodString>;
        safeAttributes: z.ZodRecord<z.ZodString, z.ZodString>;
        visibleElementText: z.ZodString;
        associatedLabel: z.ZodString;
        nearestHeading: z.ZodString;
        nearestLandmark: z.ZodString;
        boundedNearbyText: z.ZodString;
        urlOrigin: z.ZodString;
        coarsePageCategory: z.ZodString;
        language: z.ZodString;
        redactionFlags: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        language: string;
        redactionFlags: string[];
        issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
        ruleId: string;
        elementRole: string | null;
        safeAttributes: Record<string, string>;
        visibleElementText: string;
        associatedLabel: string;
        nearestHeading: string;
        nearestLandmark: string;
        boundedNearbyText: string;
        urlOrigin: string;
        coarsePageCategory: string;
    }, {
        language: string;
        redactionFlags: string[];
        issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
        ruleId: string;
        elementRole: string | null;
        safeAttributes: Record<string, string>;
        visibleElementText: string;
        associatedLabel: string;
        nearestHeading: string;
        nearestLandmark: string;
        boundedNearbyText: string;
        urlOrigin: string;
        coarsePageCategory: string;
    }>;
    language: z.ZodString;
    privacyFlags: z.ZodArray<z.ZodString, "many">;
    clientVersion: z.ZodString;
    idempotencyKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    origin: string;
    language: string;
    schemaVersion: string;
    safeContext: {
        language: string;
        redactionFlags: string[];
        issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
        ruleId: string;
        elementRole: string | null;
        safeAttributes: Record<string, string>;
        visibleElementText: string;
        associatedLabel: string;
        nearestHeading: string;
        nearestLandmark: string;
        boundedNearbyText: string;
        urlOrigin: string;
        coarsePageCategory: string;
    };
    issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
    coarsePageCategory: string;
    targetRole: string | null;
    privacyFlags: string[];
    clientVersion: string;
    idempotencyKey: string;
}, {
    origin: string;
    language: string;
    schemaVersion: string;
    safeContext: {
        language: string;
        redactionFlags: string[];
        issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
        ruleId: string;
        elementRole: string | null;
        safeAttributes: Record<string, string>;
        visibleElementText: string;
        associatedLabel: string;
        nearestHeading: string;
        nearestLandmark: string;
        boundedNearbyText: string;
        urlOrigin: string;
        coarsePageCategory: string;
    };
    issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
    coarsePageCategory: string;
    targetRole: string | null;
    privacyFlags: string[];
    clientVersion: string;
    idempotencyKey: string;
}>;
export type ProposalRequest = z.infer<typeof ProposalRequestSchema>;
export declare const ProposalResponseSchema: z.ZodObject<{
    proposalId: z.ZodString;
    action: z.ZodEnum<["propose", "abstain"]>;
    decision: z.ZodEnum<["auto", "confirm", "reject"]>;
    patch: z.ZodOptional<z.ZodObject<{
        patchId: z.ZodString;
        issueType: z.ZodEnum<["img-alt", "button-name", "link-name", "form-label", "svg-name", "custom-control"]>;
        targetFingerprint: z.ZodString;
        attribute: z.ZodEnum<["alt", "aria-label", "aria-labelledby", "aria-describedby", "role"]>;
        previousValue: z.ZodNullable<z.ZodString>;
        proposedValue: z.ZodString;
        evidence: z.ZodArray<z.ZodObject<{
            source: z.ZodEnum<["visible_text", "nearby_text", "heading", "role", "image"]>;
            quote: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
            quote: string;
        }, {
            source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
            quote: string;
        }>, "many">;
        trustScore: z.ZodNumber;
        decision: z.ZodEnum<["auto", "confirm", "reject"]>;
        modelVersion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        evidence: {
            source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
            quote: string;
        }[];
        patchId: string;
        issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
        targetFingerprint: string;
        attribute: "role" | "alt" | "aria-label" | "aria-labelledby" | "aria-describedby";
        previousValue: string | null;
        proposedValue: string;
        trustScore: number;
        decision: "reject" | "auto" | "confirm";
        modelVersion?: string | undefined;
    }, {
        evidence: {
            source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
            quote: string;
        }[];
        patchId: string;
        issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
        targetFingerprint: string;
        attribute: "role" | "alt" | "aria-label" | "aria-labelledby" | "aria-describedby";
        previousValue: string | null;
        proposedValue: string;
        trustScore: number;
        decision: "reject" | "auto" | "confirm";
        modelVersion?: string | undefined;
    }>>;
    trustScore: z.ZodNumber;
    evidence: z.ZodArray<z.ZodObject<{
        source: z.ZodEnum<["visible_text", "nearby_text", "heading", "role", "image"]>;
        quote: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
        quote: string;
    }, {
        source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
        quote: string;
    }>, "many">;
    expiresAt: z.ZodString;
    modelMetadata: z.ZodObject<{
        provider: z.ZodString;
        modelName: z.ZodString;
        promptVersion: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        promptVersion: string;
        provider: string;
        modelName: string;
    }, {
        promptVersion: string;
        provider: string;
        modelName: string;
    }>;
}, "strip", z.ZodTypeAny, {
    action: "propose" | "abstain";
    evidence: {
        source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
        quote: string;
    }[];
    trustScore: number;
    decision: "reject" | "auto" | "confirm";
    proposalId: string;
    expiresAt: string;
    modelMetadata: {
        promptVersion: string;
        provider: string;
        modelName: string;
    };
    patch?: {
        evidence: {
            source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
            quote: string;
        }[];
        patchId: string;
        issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
        targetFingerprint: string;
        attribute: "role" | "alt" | "aria-label" | "aria-labelledby" | "aria-describedby";
        previousValue: string | null;
        proposedValue: string;
        trustScore: number;
        decision: "reject" | "auto" | "confirm";
        modelVersion?: string | undefined;
    } | undefined;
}, {
    action: "propose" | "abstain";
    evidence: {
        source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
        quote: string;
    }[];
    trustScore: number;
    decision: "reject" | "auto" | "confirm";
    proposalId: string;
    expiresAt: string;
    modelMetadata: {
        promptVersion: string;
        provider: string;
        modelName: string;
    };
    patch?: {
        evidence: {
            source: "visible_text" | "heading" | "nearby_text" | "image" | "role";
            quote: string;
        }[];
        patchId: string;
        issueType: "button-name" | "img-alt" | "link-name" | "form-label" | "custom-control" | "svg-name";
        targetFingerprint: string;
        attribute: "role" | "alt" | "aria-label" | "aria-labelledby" | "aria-describedby";
        previousValue: string | null;
        proposedValue: string;
        trustScore: number;
        decision: "reject" | "auto" | "confirm";
        modelVersion?: string | undefined;
    } | undefined;
}>;
export type ProposalResponse = z.infer<typeof ProposalResponseSchema>;
export declare const FeedbackRequestSchema: z.ZodObject<{
    patchId: z.ZodString;
    action: z.ZodEnum<["accept", "reject", "edit", "revert", "wrong_label"]>;
    customLabel: z.ZodOptional<z.ZodString>;
    userComment: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    action: "accept" | "reject" | "edit" | "revert" | "wrong_label";
    patchId: string;
    timestamp: string;
    customLabel?: string | undefined;
    userComment?: string | undefined;
}, {
    action: "accept" | "reject" | "edit" | "revert" | "wrong_label";
    patchId: string;
    timestamp: string;
    customLabel?: string | undefined;
    userComment?: string | undefined;
}>;
export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;
export declare const PolicyResponseSchema: z.ZodObject<{
    thresholds: z.ZodObject<{
        autoApplyMinScore: z.ZodNumber;
        confirmMinScore: z.ZodNumber;
        roleThresholds: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        autoApplyMinScore: number;
        confirmMinScore: number;
        roleThresholds: Record<string, number>;
    }, {
        autoApplyMinScore: number;
        confirmMinScore: number;
        roleThresholds: Record<string, number>;
    }>;
    disabledIssueTypes: z.ZodArray<z.ZodString, "many">;
    providerAvailability: z.ZodRecord<z.ZodString, z.ZodBoolean>;
    emergencyDenylist: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    thresholds: {
        autoApplyMinScore: number;
        confirmMinScore: number;
        roleThresholds: Record<string, number>;
    };
    disabledIssueTypes: string[];
    providerAvailability: Record<string, boolean>;
    emergencyDenylist: string[];
}, {
    thresholds: {
        autoApplyMinScore: number;
        confirmMinScore: number;
        roleThresholds: Record<string, number>;
    };
    disabledIssueTypes: string[];
    providerAvailability: Record<string, boolean>;
    emergencyDenylist: string[];
}>;
export type PolicyResponse = z.infer<typeof PolicyResponseSchema>;
//# sourceMappingURL=index.d.ts.map