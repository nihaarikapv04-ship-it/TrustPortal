# TrustPortal Fastify Backend API Specification (`apps/api`)

> [!NOTE]
> **Step 7 Prototype Notice**: Step 7 implements Fastify API gateway contracts, validation guards, and security layers. **No AI model provider is invoked in Step 7.** All proposal requests deterministically return `decision: "abstain"` and `modelMetadata.provider: "none"`.

---

## 1. Environment Configuration

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | Fastify server port |
| `HOST` | `0.0.0.0` | Fastify server host |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Allowed origins allowlist |
| `REQUEST_BODY_LIMIT` | `102400` (100 KB) | Maximum HTTP request payload ceiling |
| `RATE_LIMIT_MAX` | `100` | Maximum requests per client origin per minute |
| `IDEMPOTENCY_TTL_SECONDS` | `300` | Idempotency record expiration time |

---

## 2. API Endpoints

### 2.1 Health Check
- **Endpoint**: `GET /health`
- **Response**: `HTTP 200 OK`
```json
{
  "status": "ok",
  "service": "trustportal-api",
  "version": "1.0.0"
}
```

---

### 2.2 Submit Defect Candidate for Proposal
- **Endpoint**: `POST /v1/proposals`
- **Headers**:
  - `Content-Type: application/json`
  - `Origin: <extension-or-demo-origin>`
  - `x-request-id: <uuid-or-req-id>`
- **Request Body** (Conforms to `@trustportal/schemas` `ProposalRequestSchema`):
```json
{
  "schemaVersion": "1.0.0",
  "origin": "https://seva.gov.in",
  "coarsePageCategory": "public-information",
  "issueType": "img-alt",
  "targetRole": "img",
  "safeContext": {
    "issueType": "img-alt",
    "ruleId": "RULE_IMG_ALT_MISSING",
    "elementRole": "img",
    "safeAttributes": { "src": "/hero.png" },
    "visibleElementText": "",
    "associatedLabel": "",
    "nearestHeading": "Rural Housing Scheme",
    "nearestLandmark": "main",
    "boundedNearbyText": "Download guidelines",
    "urlOrigin": "https://seva.gov.in/housing",
    "coarsePageCategory": "public-information",
    "language": "en",
    "redactionFlags": []
  },
  "language": "en",
  "privacyFlags": [],
  "clientVersion": "1.0.0",
  "idempotencyKey": "idemp_abc123"
}
```

- **Response** (`HTTP 200 OK` Stub Response):
```json
{
  "proposalId": "prop_stub_981a2f",
  "action": "abstain",
  "decision": "reject",
  "trustScore": 0,
  "evidence": [],
  "expiresAt": "2026-08-18T20:55:00.000Z",
  "modelMetadata": {
    "provider": "none",
    "modelName": "none",
    "promptVersion": "backend-stub"
  }
}
```

---

### 2.3 Submit User Feedback
- **Endpoint**: `POST /v1/feedback`
- **Request Body** (`FeedbackRequestSchema`):
```json
{
  "patchId": "p_demo_101",
  "action": "accept",
  "customLabel": "Download Form",
  "userComment": "Label accurate",
  "timestamp": "2026-08-18T20:41:00.000Z"
}
```

---

### 2.4 Query Active Policy & Availability
- **Endpoint**: `GET /v1/policy`
- **Response**: `HTTP 200 OK`
```json
{
  "thresholds": {
    "autoApplyMinScore": 90,
    "confirmMinScore": 75,
    "roleThresholds": {
      "img-alt": 85,
      "button-name": 90,
      "link-name": 82,
      "form-label": 88
    }
  },
  "disabledIssueTypes": [
    "authentication",
    "payment",
    "identity",
    "health",
    "tax",
    "legal",
    "benefits"
  ],
  "providerAvailability": {
    "anthropic": false,
    "openai": false,
    "local": false
  },
  "emergencyDenylist": []
}
```

---

## 3. Error Response Contract

All errors return structured JSON objects:
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Proposal request schema validation failed",
    "requestId": "req_102"
  }
}
```

| HTTP Code | Error Code | Description |
| :--- | :--- | :--- |
| `400` | `INVALID_REQUEST` | Zod schema validation failed |
| `403` | `FORBIDDEN_ORIGIN` | Origin guard rejected dangerous protocol or untrusted origin |
| `429` | `RATE_LIMIT_EXCEEDED` | Client origin exceeded rate limit window |
| `500` | `INTERNAL_SERVER_ERROR` | Server runtime error |

---

## 4. How to Run & Test API

```bash
# Navigate to API package
cd apps/api

# Start Fastify development server (http://localhost:3000)
npm run dev

# Run Vitest test suite
npm test
```
