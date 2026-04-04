# PolicyDiff — API Reference

Base URL: `https://{api-id}.execute-api.us-east-1.amazonaws.com/prod`

All responses follow the shape: `{ "statusCode": int, "body": "<JSON string>" }`
Errors return `{ "error": "message" }` in body with appropriate statusCode.

---

## Policies — UploadUrlLambda + PolicyCrudLambda (Owner: AZ)

### POST /api/policies/upload-url
Generate a presigned S3 PUT URL for direct browser upload.

**Request body:**
```json
{ "fileName": "aetna-humira-2024.pdf", "contentType": "application/pdf" }
```
**Response 200:**
```json
{ "uploadUrl": "https://s3.amazonaws.com/...", "policyDocId": "uuid", "s3Key": "policies/uuid/aetna-humira-2024.pdf" }
```

---

### POST /api/policies
Register policy metadata after S3 upload completes.

**Request body:**
```json
{ "policyDocId": "uuid", "payerName": "Aetna", "effectiveDate": "2024-01-01" }
```
**Response 201:**
```json
{ "policyDocId": "uuid", "status": "PENDING" }
```

---

### GET /api/policies/{id}
Get full policy record.

**Response 200:** `PolicyRecord` object
**Response 404:** `{ "error": "Not found" }`

---

### GET /api/policies/{id}/status
Poll extraction status.

**Response 200:**
```json
{ "status": "PENDING" | "PROCESSING" | "COMPLETE" | "FAILED" }
```

---

### GET /api/policies/{id}/criteria
Get extracted drug criteria for a policy.

**Response 200:**
```json
{ "items": [ { "drugName": "Humira", "stepTherapy": [...], "paRequired": true, "quantityLimit": "2 vials/month", "notes": "..." } ] }
```

---

### GET /api/policies
List policies with optional filters.

**Query params:** `payer` (string), `drug` (string), `status` (string)
**Response 200:** `{ "items": [ PolicyRecord, ... ] }`

---

### DELETE /api/policies/{id}
Soft delete (sets status to DELETED).

**Response 200:** `{ "success": true }`

---

## Query — QueryLambda (Owner: Mohith)

### POST /api/query
Submit a natural language query against extracted policy criteria.

**Request body:**
```json
{ "question": "Which payers require step therapy for Humira?", "policyIds": ["uuid1", "uuid2"] }
```
**Response 202:**
```json
{ "queryId": "uuid", "status": "PENDING" }
```

---

### GET /api/query/{queryId}
Poll for query result.

**Response 200:**
```json
{ "queryId": "uuid", "status": "COMPLETE", "answer": "...", "citations": [ { "policyDocId": "uuid", "excerpt": "..." } ] }
```

---

### GET /api/queries
List recent queries (last 50).

**Response 200:** `{ "items": [ QueryResult, ... ] }`

---

## Compare — CompareLambda (Owner: Mohith)

### GET /api/compare
Cross-payer comparison matrix for a drug.

**Query params:** `drug` (required), `policyIds` (optional, comma-separated)
**Response 200:**
```json
{ "drug": "Humira", "matrix": [ { "payer": "Aetna", "criteria": { ... } }, ... ] }
```

---

### GET /api/compare/export
Export comparison matrix as CSV or PDF.

**Query params:** `drug` (required), `format` (`csv` | `pdf`)
**Response 200:** `{ "downloadUrl": "https://s3.amazonaws.com/..." }`

---

## Diffs — DiffLambda (Owner: Mohith)

### GET /api/diffs
List policy diffs with optional filters.

**Query params:** `policyId` (string), `drug` (string)
**Response 200:** `{ "items": [ PolicyDiff, ... ] }`

---

### GET /api/diffs/{diffId}
Get full diff detail.

**Response 200:**
```json
{ "diffId": "uuid", "policyId": "uuid", "drug": "Humira", "timestamp": "ISO8601", "changes": [ { "field": "paRequired", "before": false, "after": true } ] }
```

---

### GET /api/diffs/feed
Chronological change feed across all policies.

**Response 200:** `{ "items": [ PolicyDiff, ... ] }` sorted by timestamp desc

---

## Discordance — DiscordanceLambda (Owner: Mohith)

### GET /api/discordance
List all discordance summaries.

**Response 200:**
```json
{ "items": [ { "drug": "Humira", "payer": "Aetna", "discordanceScore": 0.72, "summary": "..." } ] }
```

---

### GET /api/discordance/{drug}/{payer}
Get discordance detail for a drug+payer pair.

**Response 200:**
```json
{ "drug": "Humira", "payer": "Aetna", "criteria": { ... }, "industryBaseline": { ... }, "gaps": ["Missing step therapy requirement", ...] }
```

---

## Approval Path — ApprovalPathLambda (Owner: Mohith)

### POST /api/approval-path
Score coverage likelihood and generate prior auth paths.

**Request body:**
```json
{ "drug": "Humira", "patientProfile": { "diagnosis": "RA", "priorTreatments": ["methotrexate"] } }
```
**Response 200:**
```json
{ "requestId": "uuid", "paths": [ { "payer": "Aetna", "score": 0.85, "steps": ["Document RA diagnosis", "Show methotrexate failure"] } ] }
```

---

### POST /api/approval-path/{id}/memo
Generate a PA memo for a specific payer.

**Request body:** `{ "payerId": "aetna" }`
**Response 200:** `{ "memoText": "...", "downloadUrl": "https://s3.amazonaws.com/..." }`

---

## Simulator — SimulatorLambda (Owner: Mohith, stretch)

### POST /api/simulate
Simulate policy outcome for a patient + drug + payer.

**Request body:**
```json
{ "drug": "Humira", "payerId": "aetna", "patientProfile": { "diagnosis": "RA", "priorTreatments": ["methotrexate"] } }
```
**Response 200:**
```json
{ "simulationId": "uuid", "outcome": "APPROVED" | "DENIED" | "STEP_THERAPY", "confidence": 0.91, "reasoning": "..." }
```
