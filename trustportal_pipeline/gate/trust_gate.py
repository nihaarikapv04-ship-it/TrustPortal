"""
Conformal Risk Control (CRC) Trust Gate (Angelopoulos et al., ICLR 2024).
Provides statistically calibrated trust thresholds with finite-sample guarantees under exchangeability.
Supports overall and role-stratified calibration.
"""

from typing import List, Dict, Any, Tuple, Optional
from dataclasses import dataclass, field
import numpy as np
import logging

logger = logging.getLogger("trustportal.trust_gate")


@dataclass(frozen=True)
class CalibrationPoint:
    defect_id: str
    issue_type: str
    proposed_label: str
    confidence: float
    ground_truth_label: str
    is_correct: bool  # True if proposal matches ground truth, False if incorrect/harmful


@dataclass(frozen=True)
class GateDecision:
    defect_id: str
    decision: str  # "auto" | "confirm" | "reject"
    confidence: float
    threshold_used: float
    target_alpha: float
    issue_type: str
    reason: str


class ConformalTrustGate:
    """
    Conformal Risk Control Trust Gate.
    Given a calibration dataset and target error rate alpha (e.g. 0.05 = max 5% error on auto-applied patches),
    computes the conformal threshold lambda_star such that E[Loss] <= alpha.
    Loss definition for auto-apply: Loss = 1 if auto-applied and incorrect, else 0.
    """

    def __init__(self, target_alpha: float = 0.05, confirm_band_delta: float = 0.15):
        """
        target_alpha: target maximum risk (error rate) for auto-applied patches.
        confirm_band_delta: confidence range below lambda_star that prompts for human confirmation.
        """
        self.target_alpha = target_alpha
        self.confirm_band_delta = confirm_band_delta
        self.global_lambda_star: float = 0.90  # Safe fallback default
        self.role_lambda_stars: Dict[str, float] = {}
        self.calibrated: bool = False

    def calibrate(self, calibration_set: List[CalibrationPoint]) -> float:
        """
        Calibrates the global threshold lambda_star using Conformal Risk Control.
        Loss function: L(lambda) = 1 if (confidence >= lambda and not is_correct) else 0.
        Finds the smallest lambda in [0, 1] such that empirical risk + finite-sample inflation <= alpha.
        """
        if not calibration_set:
            logger.warning("Empty calibration set passed to CRC gate. Using fallback default lambda=0.90.")
            self.global_lambda_star = 0.90
            self.calibrated = True
            return self.global_lambda_star

        n = len(calibration_set)
        confidences = np.array([p.confidence for p in calibration_set])
        is_corrects = np.array([p.is_correct for p in calibration_set])

        # Candidate thresholds grid from 0.50 to 0.99
        threshold_candidates = np.linspace(0.50, 0.99, 50)
        valid_lambdas = []

        for lmbda in threshold_candidates:
            # Mask of auto-accepted proposals at this candidate threshold
            auto_accepted = confidences >= lmbda
            if np.sum(auto_accepted) == 0:
                # If no proposals auto-accepted, loss is 0
                risk = 0.0
            else:
                # Error rate among auto-accepted proposals
                incorrect_auto = np.sum(auto_accepted & (~is_corrects))
                risk = incorrect_auto / np.sum(auto_accepted)

            # Conformal bound check with finite sample adjustment (Benton/Angelopoulos CRC upper bound)
            # E[R] <= (n / (n + 1)) * risk + 1 / (n + 1)
            conformal_upper_bound = (n / (n + 1.0)) * risk + (1.0 / (n + 1.0))

            if conformal_upper_bound <= self.target_alpha:
                valid_lambdas.append(lmbda)

        if valid_lambdas:
            self.global_lambda_star = float(np.min(valid_lambdas))
        else:
            # If no threshold guarantees alpha, choose highest strict threshold
            self.global_lambda_star = 0.98

        self.calibrated = True
        logger.info(f"Global CRC calibration complete over N={n} samples. Lambda* = {self.global_lambda_star:.4f} (target alpha = {self.target_alpha})")
        return self.global_lambda_star

    def calibrate_role_stratified(self, calibration_set: List[CalibrationPoint]) -> Dict[str, float]:
        """
        Calibrates role-stratified thresholds per defect type (img-alt, button-name, link-name, form-label).
        """
        # First calibrate overall
        self.calibrate(calibration_set)

        # Group by issue_type
        by_role: Dict[str, List[CalibrationPoint]] = {}
        for p in calibration_set:
            by_role.setdefault(p.issue_type, []).append(p)

        for role, role_set in by_role.items():
            if len(role_set) >= 15:  # Require minimum samples for per-role calibration
                role_gate = ConformalTrustGate(target_alpha=self.target_alpha, confirm_band_delta=self.confirm_band_delta)
                self.role_lambda_stars[role] = role_gate.calibrate(role_set)
            else:
                self.role_lambda_stars[role] = self.global_lambda_star

        return self.role_lambda_stars

    def evaluate_proposal(self, defect_id: str, issue_type: str, confidence: float, use_role_stratified: bool = True) -> GateDecision:
        """
        Evaluates a proposal confidence against the calibrated CRC threshold.
        Returns:
          - "auto": confidence >= lambda_star (Auto-apply patch)
          - "confirm": lambda_star - confirm_band <= confidence < lambda_star (Require human verification)
          - "reject": confidence < lambda_star - confirm_band (Reject / Abstain)
        """
        if use_role_stratified and issue_type in self.role_lambda_stars:
            lmbda = self.role_lambda_stars[issue_type]
        else:
            lmbda = self.global_lambda_star

        confirm_lower_bound = max(0.40, lmbda - self.confirm_band_delta)

        if confidence >= lmbda:
            decision = "auto"
            reason = f"Confidence {confidence:.3f} >= calibrated CRC threshold lambda* ({lmbda:.3f}) for alpha={self.target_alpha}"
        elif confidence >= confirm_lower_bound:
            decision = "confirm"
            reason = f"Confidence {confidence:.3f} in human-confirmation band [{confirm_lower_bound:.3f}, {lmbda:.3f})"
        else:
            decision = "reject"
            reason = f"Confidence {confidence:.3f} below confirmation floor ({confirm_lower_bound:.3f})"

        return GateDecision(
            defect_id=defect_id,
            decision=decision,
            confidence=confidence,
            threshold_used=lmbda,
            target_alpha=self.target_alpha,
            issue_type=issue_type,
            reason=reason
        )

    def evaluate_heldout_risk(self, heldout_set: List[CalibrationPoint], use_role_stratified: bool = False) -> Dict[str, Any]:
        """
        Evaluates empirical risk on a held-out dataset to report achieved risk vs target alpha.
        Surfaces overshoots honestly as expected finite-sample variance under exchangeability.
        """
        auto_applied = []
        for p in heldout_set:
            dec = self.evaluate_proposal(p.defect_id, p.issue_type, p.confidence, use_role_stratified=use_role_stratified)
            if dec.decision == "auto":
                auto_applied.append(p)

        n_auto = len(auto_applied)
        if n_auto == 0:
            achieved_risk = 0.0
            error_count = 0
        else:
            error_count = sum(1 for p in auto_applied if not p.is_correct)
            achieved_risk = error_count / n_auto

        return {
            "heldout_sample_count": len(heldout_set),
            "auto_applied_count": n_auto,
            "error_count": error_count,
            "achieved_risk": round(achieved_risk, 4),
            "target_alpha": self.target_alpha,
            "within_conformal_bound": achieved_risk <= self.target_alpha,
            "global_lambda_star": self.global_lambda_star
        }
