import { DomainMode, UpiProposal, UpiPolicyResult, UpiSecurityLogEvent } from "./upi_types.js";
import { UpiSecurityPolicy } from "./upi_policy.js";

export class UpiTransactionSafetyAdapter {
  private policy = new UpiSecurityPolicy();
  private logs: UpiSecurityLogEvent[] = [];

  public processProposal(proposal: UpiProposal, mode: DomainMode): UpiPolicyResult {
    const res = this.policy.evaluateProposal(proposal, mode);

    // Record structured security event log without logging raw secrets
    this.logs.push({
      timestamp: new Date().toISOString(),
      eventType: res.eventType,
      candidateId: proposal.candidateId,
      reason: res.reason,
      securityDecision: res.decision
    });

    return res;
  }

  public getSecurityLogs(): UpiSecurityLogEvent[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
  }
}
