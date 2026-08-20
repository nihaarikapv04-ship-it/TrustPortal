import { privacyFirewall } from "@trustportal/redaction";
import { tsifRiskGate } from "@trustportal/scoring";
import { idempotencyStore } from "../security/idempotency.js";
import { modelRouter } from "../providers/provider_router.js";
export class ProposalService {
    /**
     * Business orchestration for /v1/proposals.
     * Step 9 integrates TSIFRiskGate and Trust Engine scoring.
     * Pipeline: SafeContext -> ModelRouter -> OutputValidator -> TSIFRiskGate -> Authorized Decision.
     */
    async processProposal(request) {
        // 1. Check Idempotency Store
        const cached = idempotencyStore.get(request.idempotencyKey);
        if (cached) {
            return cached.response;
        }
        // 2. Perform Backend Privacy & Security Firewall Validation (Defense in depth!)
        const firewallResult = privacyFirewall.evaluate({
            issueType: request.issueType,
            ruleId: request.safeContext.ruleId,
            elementRole: request.targetRole,
            rawAttributes: request.safeContext.safeAttributes,
            visibleElementText: request.safeContext.visibleElementText,
            associatedLabel: request.safeContext.associatedLabel,
            nearestHeading: request.safeContext.nearestHeading,
            nearestLandmark: request.safeContext.nearestLandmark,
            nearbySiblingText: request.safeContext.boundedNearbyText,
            url: request.safeContext.urlOrigin,
            language: request.language
        });
        const proposalId = `prop_s9_${Math.random().toString(36).substring(2, 9)}`;
        const expiresAt = new Date(Date.now() + 600000).toISOString(); // 10 min TTL
        // If Privacy Firewall Denied Context $\rightarrow$ Immediate Abstention
        if (firewallResult.decision === "deny") {
            const response = {
                proposalId,
                action: "abstain",
                decision: "reject",
                trustScore: 0,
                evidence: [],
                expiresAt,
                modelMetadata: {
                    provider: "none",
                    modelName: "none",
                    promptVersion: "tsif-label-v1"
                }
            };
            idempotencyStore.set(request.idempotencyKey, response);
            return response;
        }
        // 3. Route to Model Provider for Structured Inference
        const inferenceResult = await modelRouter.routeAndInference(firewallResult.safeContext);
        const proposal = inferenceResult.proposal;
        // 4. Evaluate TSIF Trust Engine & Risk Gate
        const trustDecision = tsifRiskGate.evaluateProposal(proposal.label, proposal.modelConfidence, firewallResult.safeContext);
        // 5. Construct Authorized Patch if Decision is "auto"
        let patch = undefined;
        if (trustDecision.decision === "auto" && proposal.action === "propose") {
            const attr = request.issueType === "img-alt" ? "alt" : "aria-label";
            patch = {
                patchId: `patch_${proposalId}`,
                issueType: request.issueType,
                targetFingerprint: request.safeContext.safeAttributes["id"] || "elem",
                attribute: attr,
                previousValue: null,
                proposedValue: proposal.label,
                evidence: proposal.evidence,
                trustScore: trustDecision.trustScore,
                decision: trustDecision.decision,
                modelVersion: inferenceResult.providerId
            };
        }
        const response = {
            proposalId,
            action: proposal.action,
            decision: trustDecision.decision,
            patch,
            trustScore: trustDecision.trustScore,
            evidence: proposal.evidence,
            expiresAt,
            modelMetadata: {
                provider: inferenceResult.providerId,
                modelName: inferenceResult.providerId,
                promptVersion: inferenceResult.promptVersion
            }
        };
        // Store in Idempotency Store
        idempotencyStore.set(request.idempotencyKey, response);
        return response;
    }
}
export const proposalService = new ProposalService();
