"""
Unit tests for ConformalTrustGate.
"""

import pytest
from trustportal_pipeline.gate.trust_gate import ConformalTrustGate, CalibrationPoint


def test_conformal_gate_calibration():
    gate = ConformalTrustGate(target_alpha=0.05)
    # Generate mock calibration points
    pts = [
        CalibrationPoint("1", "img-alt", "lbl", 0.95, "lbl", True),
        CalibrationPoint("2", "img-alt", "lbl", 0.92, "lbl", True),
        CalibrationPoint("3", "img-alt", "bad", 0.70, "lbl", False),
        CalibrationPoint("4", "img-alt", "bad", 0.60, "lbl", False),
    ]
    lambda_star = gate.calibrate(pts)
    assert 0.50 <= lambda_star <= 0.99
    assert gate.calibrated is True


def test_conformal_gate_decisions():
    gate = ConformalTrustGate(target_alpha=0.05)
    gate.global_lambda_star = 0.85
    gate.confirm_band_delta = 0.15

    dec_auto = gate.evaluate_proposal("d1", "img-alt", 0.90, use_role_stratified=False)
    assert dec_auto.decision == "auto"

    dec_confirm = gate.evaluate_proposal("d2", "img-alt", 0.75, use_role_stratified=False)
    assert dec_confirm.decision == "confirm"

    dec_reject = gate.evaluate_proposal("d3", "img-alt", 0.50, use_role_stratified=False)
    assert dec_reject.decision == "reject"
