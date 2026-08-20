"""
Experiment 1: Conformal Risk Control Calibration & Distribution Shift Evaluation.
Evaluates CRC threshold selection and empirical risk on held-out test data.
Demonstrates behavior under exchangeability vs. deliberate distribution shift.
"""

from typing import List, Dict, Any
import numpy as np
import random
from trustportal_pipeline.gate.trust_gate import ConformalTrustGate, CalibrationPoint


def generate_synthetic_dataset(num_samples: int = 500, seed: int = 42, error_rate_base: float = 0.15) -> List[CalibrationPoint]:
    random.seed(seed)
    np.random.seed(seed)
    dataset = []

    issue_types = ["img-alt", "button-name", "link-name", "form-label"]

    for i in range(num_samples):
        defect_id = f"def_exp1_{i:04d}"
        issue_type = random.choice(issue_types)

        # Generate confidence score (0.50 to 0.99)
        conf = float(np.random.beta(5, 1.5))
        conf = max(0.50, min(0.99, conf))

        # Higher confidence correlates with higher accuracy, but with noise
        accuracy_prob = 1.0 - (1.0 - conf) * 0.8 - error_rate_base
        accuracy_prob = max(0.1, min(0.99, accuracy_prob))
        is_correct = bool(random.random() < accuracy_prob)

        dataset.append(CalibrationPoint(
            defect_id=defect_id,
            issue_type=issue_type,
            proposed_label=f"Sample label {i}",
            confidence=conf,
            ground_truth_label=f"Ground truth {i}",
            is_correct=is_correct
        ))

    return dataset


def run_experiment_1():
    print("=== Experiment 1: Conformal Risk Control Calibration Evaluation ===")
    target_alpha = 0.05

    # 1. Exchangeable In-Distribution Split Evaluation
    full_dataset = generate_synthetic_dataset(num_samples=800, seed=42)
    random.shuffle(full_dataset)

    train_split = full_dataset[:400]
    heldout_split = full_dataset[400:]

    gate = ConformalTrustGate(target_alpha=target_alpha)
    lambda_star = gate.calibrate(train_split)
    eval_indist = gate.evaluate_heldout_risk(heldout_split)

    print(f"\n1. In-Distribution Evaluation (Exchangeable Split):")
    print(f"   Calibrated Lambda*: {lambda_star:.4f} for target alpha = {target_alpha}")
    print(f"   Held-out Total Samples: {eval_indist['heldout_sample_count']}")
    print(f"   Auto-applied Patches: {eval_indist['auto_applied_count']}")
    print(f"   Incorrect Auto Patches: {eval_indist['error_count']}")
    print(f"   Achieved Risk: {eval_indist['achieved_risk']:.4f} (Target Alpha: {target_alpha})")
    print(f"   Within Conformal Risk Bound: {eval_indist['within_conformal_bound']}")

    # 2. Deliberate Distribution Shift Evaluation (Exchangeability Violation)
    # Train calibrated on clean data (low base error rate), test on noisy/shifted data (high error rate)
    shifted_test = generate_synthetic_dataset(num_samples=400, seed=99, error_rate_base=0.35)
    eval_shifted = gate.evaluate_heldout_risk(shifted_test)

    print(f"\n2. Distribution Shift Evaluation (Exchangeability Violation Test):")
    print(f"   Tested under high-noise distribution shift without recalibration:")
    print(f"   Achieved Risk: {eval_shifted['achieved_risk']:.4f} (Target Alpha: {target_alpha})")
    print(f"   Within Conformal Risk Bound: {eval_shifted['within_conformal_bound']}")
    if not eval_shifted['within_conformal_bound']:
        print("   -> [NOTE] Risk overshoot observed under distribution shift as predicted by Conformal Theory.")
        print("   -> Recalibration is required whenever page distribution shifts!")

    return {
        "indist_eval": eval_indist,
        "shifted_eval": eval_shifted
    }


if __name__ == "__main__":
    run_experiment_1()
