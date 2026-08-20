"""
Privileged CaMeL Controller.
Coordinates the isolated pipeline: Rule Engine -> Context Firewall -> Quarantined Proposer -> CRC Trust Gate.
Control flow is strictly separated from untrusted data flow.
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
import logging
import json

from trustportal_pipeline.detector.rule_engine import DeterministicRuleEngine, Defect
from trustportal_pipeline.security.context_firewall import ContextFirewall, SafeContext, FirewallAbstainResult
from trustportal_pipeline.security.quarantined_proposer import QuarantinedProposer, ProposalResult
from trustportal_pipeline.gate.trust_gate import ConformalTrustGate, GateDecision

logger = logging.getLogger("trustportal.controller")


@dataclass(frozen=True)
class PipelineItemResult:
    defect_id: str
    issue_type: str
    element_fingerprint: str
    selector: str
    tag: str
    role: Optional[str]
    proposed_label: Optional[str]
    confidence: float
    decision: str  # "auto" | "confirm" | "reject" | "abstain"
    reason: str
    firewall_passed: bool
    evidence: List[str]
    threshold_used: float
    model_version: str
    audit_trail: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class CaMeLController:
    """
    Privileged Controller enforcing CaMeL / Dual-LLM structural separation.
    Never inspects raw page text directly — relies strictly on typed outputs from sub-modules.
    """

    def __init__(self,
                 rule_engine: Optional[DeterministicRuleEngine] = None,
                 firewall: Optional[ContextFirewall] = None,
                 proposer: Optional[QuarantinedProposer] = None,
                 trust_gate: Optional[ConformalTrustGate] = None):
        self.rule_engine = rule_engine or DeterministicRuleEngine()
        self.firewall = firewall or ContextFirewall()
        self.proposer = proposer or QuarantinedProposer()
        self.trust_gate = trust_gate or ConformalTrustGate()

    def process_dom(self, elements: List[Dict[str, Any]], url_path: str = "/", dom_map: Optional[Dict[str, Dict[str, Any]]] = None) -> List[PipelineItemResult]:
        """
        Executes full remediation pipeline for input DOM elements.
        """
        # Step 1: Deterministic Defect Scanning
        defects: List[Defect] = self.rule_engine.scan_dom(elements, dom_map=dom_map)
        results: List[PipelineItemResult] = []

        for defect in defects:
            audit: List[str] = [f"Defect detected: {defect.issue_type} on {defect.selector}"]

            # Step 2: Privacy + Injection Firewall Gate
            safe_ctx, firewall_abstain = self.firewall.process(
                defect_id=defect.defect_id,
                issue_type=defect.issue_type,
                element_fingerprint=defect.element_fingerprint,
                tag=defect.tag,
                role=defect.role,
                url_path=url_path,
                context=defect.surrounding_context
            )

            if firewall_abstain:
                audit.extend(firewall_abstain.audit_logs)
                results.append(PipelineItemResult(
                    defect_id=defect.defect_id,
                    issue_type=defect.issue_type,
                    element_fingerprint=defect.element_fingerprint,
                    selector=defect.selector,
                    tag=defect.tag,
                    role=defect.role,
                    proposed_label=None,
                    confidence=0.0,
                    decision="abstain",
                    reason=f"FIREWALL_DENIAL: {firewall_abstain.reason} - {firewall_abstain.details}",
                    firewall_passed=False,
                    evidence=[],
                    threshold_used=self.trust_gate.global_lambda_star,
                    model_version="N/A",
                    audit_trail=audit
                ))
                continue

            audit.extend(safe_ctx.audit_logs)

            # Step 3: Quarantined Proposal Component
            proposal: ProposalResult = self.proposer.propose(safe_ctx)
            audit.append(f"Proposal generated: label='{proposal.proposed_label}', conf={proposal.confidence:.3f}, abstain={proposal.abstain}")

            if proposal.abstain or not proposal.proposed_label:
                results.append(PipelineItemResult(
                    defect_id=defect.defect_id,
                    issue_type=defect.issue_type,
                    element_fingerprint=defect.element_fingerprint,
                    selector=defect.selector,
                    tag=defect.tag,
                    role=defect.role,
                    proposed_label=None,
                    confidence=proposal.confidence,
                    decision="abstain",
                    reason=f"PROPOSER_ABSTAIN: {proposal.reason}",
                    firewall_passed=True,
                    evidence=proposal.evidence,
                    threshold_used=self.trust_gate.global_lambda_star,
                    model_version=proposal.model_version,
                    audit_trail=audit
                ))
                continue

            # Step 4: Conformal Risk Control Trust Gate
            gate_decision: GateDecision = self.trust_gate.evaluate_proposal(
                defect_id=defect.defect_id,
                issue_type=defect.issue_type,
                confidence=proposal.confidence
            )
            audit.append(f"Trust gate evaluated: decision={gate_decision.decision}, threshold={gate_decision.threshold_used:.3f}")

            results.append(PipelineItemResult(
                defect_id=defect.defect_id,
                issue_type=defect.issue_type,
                element_fingerprint=defect.element_fingerprint,
                selector=defect.selector,
                tag=defect.tag,
                role=defect.role,
                proposed_label=proposal.proposed_label,
                confidence=proposal.confidence,
                decision=gate_decision.decision,
                reason=gate_decision.reason,
                firewall_passed=True,
                evidence=proposal.evidence,
                threshold_used=gate_decision.threshold_used,
                model_version=proposal.model_version,
                audit_trail=audit
            ))

        return results
