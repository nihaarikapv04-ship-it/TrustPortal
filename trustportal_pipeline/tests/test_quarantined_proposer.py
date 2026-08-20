"""
Unit tests for QuarantinedProposer (Dual-LLM / CaMeL Quarantined Stage & Schema Validation).
"""

import pytest
from trustportal_pipeline.security.quarantined_proposer import QuarantinedProposer, ProposalResult
from trustportal_pipeline.security.context_firewall import SafeContext


def test_quarantined_proposer_mock():
    proposer = QuarantinedProposer(provider="mock")
    safe_ctx = SafeContext(
        defect_id="def_100",
        issue_type="button-name",
        element_fingerprint="fp100",
        tag="button",
        role="button",
        clean_surrounding_context={"parent_text": "Click here to search products"},
        pii_redacted_count=0,
        audit_logs=[]
    )
    result = proposer.propose(safe_ctx)

    assert isinstance(result, ProposalResult)
    assert result.defect_id == "def_100"
    assert result.proposed_label == "Search"
    assert result.confidence > 0.80
    assert result.abstain is False


def test_quarantined_proposer_schema_validation_failure():
    proposer = QuarantinedProposer(provider="mock")
    # Test strict validation on invalid raw output string
    invalid_raw_json = "{ malformed_json: true "
    result = proposer._parse_and_validate("def_err", invalid_raw_json, "test-model")

    assert result.defect_id == "def_err"
    assert result.abstain is True
    assert "SCHEMA_VALIDATION_FAILED" in result.reason
