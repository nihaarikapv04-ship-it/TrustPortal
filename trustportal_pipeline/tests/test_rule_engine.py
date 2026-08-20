"""
Unit tests for DeterministicRuleEngine and AccessibleNameComputer.
"""

import pytest
from trustportal_pipeline.detector.rule_engine import DeterministicRuleEngine
from trustportal_pipeline.detector.acc_name_comp import AccessibleNameComputer


def test_accessible_name_aria_label():
    comp = AccessibleNameComputer()
    elem = {"tag": "button", "attributes": {"aria-label": "Close Modal"}}
    assert comp.compute_name(elem) == "Close Modal"


def test_accessible_name_aria_labelledby():
    dom_map = {"heading_1": {"text_content": "Billing Information"}}
    comp = AccessibleNameComputer(dom_map=dom_map)
    elem = {"tag": "section", "attributes": {"aria-labelledby": "heading_1"}}
    assert comp.compute_name(elem) == "Billing Information"


def test_rule_engine_img_alt_defect():
    engine = DeterministicRuleEngine()
    elements = [
        {"tag": "img", "id": "img1", "attributes": {"src": "/pic.png"}},  # Defect!
        {"tag": "img", "id": "img2", "attributes": {"src": "/logo.png", "alt": "Acme Logo"}},  # OK
        {"tag": "img", "id": "img3", "attributes": {"src": "/bg.png", "alt": ""}},  # Decorative OK
    ]
    defects = engine.scan_dom(elements)
    assert len(defects) == 1
    assert defects[0].issue_type == "img-alt"
    assert defects[0].tag == "img"


def test_rule_engine_button_name_defect():
    engine = DeterministicRuleEngine()
    elements = [
        {"tag": "button", "id": "btn1", "attributes": {}, "text_content": ""},  # Defect!
        {"tag": "button", "id": "btn2", "attributes": {}, "text_content": "Submit"},  # OK
    ]
    defects = engine.scan_dom(elements)
    assert len(defects) == 1
    assert defects[0].issue_type == "button-name"


def test_rule_engine_form_label_defect():
    engine = DeterministicRuleEngine()
    elements = [
        {"tag": "input", "id": "inp1", "attributes": {"type": "text"}},  # Defect!
        {"tag": "input", "id": "inp2", "attributes": {"type": "text"}, "labels": ["Your Name"]},  # OK
    ]
    defects = engine.scan_dom(elements)
    assert len(defects) == 1
    assert defects[0].issue_type == "form-label"
