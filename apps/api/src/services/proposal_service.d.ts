import { ProposalRequest, ProposalResponse } from "@trustportal/schemas";
export declare class ProposalService {
    /**
     * Business orchestration for /v1/proposals.
     * Step 9 integrates TSIFRiskGate and Trust Engine scoring.
     * Pipeline: SafeContext -> ModelRouter -> OutputValidator -> TSIFRiskGate -> Authorized Decision.
     */
    processProposal(request: ProposalRequest): Promise<ProposalResponse>;
}
export declare const proposalService: ProposalService;
//# sourceMappingURL=proposal_service.d.ts.map