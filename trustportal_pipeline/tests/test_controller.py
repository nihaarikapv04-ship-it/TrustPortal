"""
Integration tests for CaMeLController pipeline execution.
"""

import pytest
from trustportal_pipeline.gate.controller import CaMeLController


def test_controller_end_to_end():
    controller = CaMeLController()
    elements = [
        {
            "tag": "img",
            "id": "hero_img",
            "attributes": {"src": "/company_logo.png"},
            "parent_text": "Acme Logo in header",
            "nearest_heading": "Home"
        }
    ]
    results = controller.process_dom(elements, url_path="/home")

    assert len(results) == 1
    res = results[0]
    assert res.defect_id.startswith("def_")
    assert res.issue_type == "img-alt"
    assert res.firewall_passed is True
    assert res.decision in ("auto", "confirm", "reject")
    assert res.proposed_label is not None


def test_controller_firewall_rejection():
    controller = CaMeLController()
    elements = [
        {
            "tag": "img",
            "id": "login_img",
            "attributes": {"src": "/banner.png"},
        }
    ]
    # Sensitive URL triggers firewall rejection
    results = controller.process_dom(elements, url_path="/auth/login")

    assert len(results) == 1
    res = results[0]
    assert res.firewall_passed is False
    assert res.decision == "abstain"
    assert "FIREWALL_DENIAL" in res.reason
