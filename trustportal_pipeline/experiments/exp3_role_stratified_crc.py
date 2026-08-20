"""
Experiment 3: Role-Stratified Conformal Risk Control Evaluation (arXiv 2607.24343).
Evaluates separate risk thresholds calibrated per defect type (img-alt, button-name, link-name, form-label).
"""

from typing import List, Dict, Any
from trustportal_pipeline.gate.trust_gate import ConformalTrustGate, CalibrationPoint
from trustportal_pipeline.experiments.exp1_calibration import generate_synthetic_dataset


def run_experiment_3():
    print("=== Experiment 3: Role-Stratified Conformal Risk Control Evaluation ===")
    target_alpha = 0.05
    dataset = generate_synthetic_dataset(num_samples=1000, seed=123)

    train_data = dataset[:600]
    test_data = dataset[600:]

    gate = ConformalTrustGate(target_alpha=target_alpha)
    role_lambdas = gate.calibrate_role_stratified(train_data)

    print(f"\nRole-Stratified Calibrated Thresholds (Target Alpha = {target_alpha}):")
    print(f" Global Fallback Lambda*: {gate.global_lambda_star:.4f}")
    for role, lmbda in role_lambdas.items():
        print(f"  - Role '{role:<12}': Lambda* = {lmbda:.4f}")

    # Evaluate heldout performance per role vs overall
    by_role_test: Dict[str, List[CalibrationPoint]] = {}
    for p in test_data:
        by_role_test.setdefault(p.issue_type, []).append(p)

    print("\nHeld-out Test Performance per Role:")
    for role, role_pts in by_role_test.items():
        role_gate = ConformalTrustGate(target_alpha=target_alpha)
        role_gate.global_lambda_star = role_lambdas.get(role, gate.global_lambda_star)
        eval_res = role_gate.evaluate_heldout_risk(role_pts)

        print(f" - [{role:<12}] N={eval_res['heldout_sample_count']:<3} Auto={eval_res['auto_applied_count']:<3} Errors={eval_res['error_count']:<2} Risk={eval_res['achieved_risk']:.4f} (Bound OK: {eval_res['within_conformal_bound']})")

    return role_lambdas


if __name__ == "__main__":
    run_experiment_3()
