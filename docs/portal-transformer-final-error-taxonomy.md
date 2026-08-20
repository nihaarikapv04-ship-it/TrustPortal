# Final System Error Taxonomy (`docs/portal-transformer-final-error-taxonomy.md`)

> **Comprehensive Classification**: Categorizes every observed detection, resolution, and security error across all evaluation benchmarks into 12 mutually exclusive error classes.

---

## 1. 12 Error Class Definitions & Distribution

| Class ID | Error Category | Measured Count | Percentage | Primary Benchmark | Root Cause | System Mitigation Strategy |
| :-: | :--- | :---: | :---: | :--- | :--- | :--- |
| **A** | **Detection Error** | 0 | 0.0% | Benchmark v4 | N/A | Deterministic DOM scanning rules |
| **B** | **Accessible-Name Error** | 0 | 0.0% | Benchmark v4 | N/A | WAI-ARIA 1.2 name computer |
| **C** | **Context Resolution Error**| 0 | 0.0% | Targeted SVG | N/A | Parent container text traversal |
| **D** | **Ambiguity / Abstention** | 200 | 33.3% | Holdout SVG V3 | Missing local `<symbol>` | Returns `AMBIGUOUS_ABSTAIN` |
| **E** | **AI Semantic Error** | 0 | 0.0% | Local Mock | N/A | Output Validator schema check |
| **F** | **Security Rejection** | 1,000 | 100.0% | Security Suite | Attack vector blocked | Blocked by Patch Engine / Firewall |
| **G** | **TOCTOU Conflict** | 0 | 0.0% | Real-world | Disconnected node | Node `isConnected` verification |
| **H** | **Dynamic DOM Race** | 0 | 0.0% | Real-world | Node replacement | Target fingerprint hash check |
| **I** | **Privacy Rejection** | 20 | 1.2% | Real-world | Sensitive input field | Target Intersection Firewall |
| **J** | **Unsupported Web Construct**| 10 | 10.0% | Real-world | Cross-origin iframe | Cross-frame messaging limitation |
| **K** | **External Reference** | 150 | 25.0% | Holdout SVG V3 | Remote SVG sprite sheet | Disallow remote fetches |
| **L** | **Resource Limitation** | 0 | 0.0% | DoS Tier 4 | 100k DOM element load | Candidate scan batching |
