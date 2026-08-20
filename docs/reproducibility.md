# TrustPortal Reproducibility Guide

## Evaluation Datasets & Calibration
1. **Conformal Risk Control Benchmark**: Synthetic and annotated calibration split ($N=800$) to evaluate $\lambda^*$ threshold selection and empirical risk under exchangeable vs. distribution shift conditions.
2. **Adversarial Injection Suite**: 5 test scenarios evaluating Gated vs. Ungated unsafe auto-apply rates against GCG-style token strings and `display:none` hidden text attacks.

## Execution Commands
```bash
# Run CRC Calibration Evaluation
python3 -m trustportal_pipeline.experiments.exp1_calibration

# Run Prompt Injection Resistance Suite
python3 -m trustportal_pipeline.experiments.exp2_injection_resistance

# Run Role-Stratified CRC Evaluation
python3 -m trustportal_pipeline.experiments.exp3_role_stratified_crc
```
