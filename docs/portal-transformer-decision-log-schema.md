# Decision Log & Structured Evidence Schema (`docs/portal-transformer-decision-log-schema.md`)

> **Decision Log Schema**: Defines the structured JSON schema used to log remediation decisions for developer inspection.

---

## 1. Schema Specification

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "RemediationDecisionLog",
  "type": "object",
  "properties": {
    "candidateId": { "type": "string" },
    "ruleId": { "type": "string" },
    "issueType": { "type": "string" },
    "decision": { "type": "string", "enum": ["REMEDIATE", "ABSTAIN", "IGNORE", "REJECT"] },
    "confidence": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
    "reason": { "type": "string" },
    "securityChecks": {
      "type": "object",
      "properties": {
        "privacy": { "type": "string", "enum": ["PASS", "FAIL", "DENIED"] },
        "outputValidation": { "type": "string", "enum": ["PASS", "FAIL"] },
        "riskGate": { "type": "string", "enum": ["PASS", "FAIL"] },
        "capabilityAllowlist": { "type": "string", "enum": ["PASS", "FAIL"] },
        "toctou": { "type": "string", "enum": ["PASS", "FAIL"] }
      },
      "required": ["privacy", "outputValidation", "riskGate", "capabilityAllowlist", "toctou"]
    }
  },
  "required": ["candidateId", "ruleId", "issueType", "decision", "confidence", "reason", "securityChecks"]
}
```
