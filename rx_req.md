# PolicyDiff Feature Audit — 7 Concerns Evaluated

Audit of each concern against the actual frontend (`src/`) and backend (`backend/lambda/`) code.

---

## 1. Document Upload/Ingestion Flow in UI

| Aspect | Status |
|---|---|
| **Verdict** | ✅ **Present — solid end-to-end flow** |

### What exists
- **Upload page**: [upload/page.tsx](file:///Users/mohith/programming/hackathon/PolicyDiff/frontend/src/app/(dashboard)/upload/page.tsx) — full drag-and-drop PDF upload with metadata form (payer, plan type, title, effective date)
- **Upload flow**: Presigned S3 URL → direct S3 PUT → create policy record via `POST /api/policies` → polls extraction status until `COMPLETE`
- **Backend**: [upload_url.py](file:///Users/mohith/programming/hackathon/PolicyDiff/backend/lambda/upload_url.py) generates presigned URLs, creates DynamoDB record, includes duplicate detection
- **Pipeline**: Upload triggers Textract → extraction → criteria normalization → writes to `DrugPolicyCriteria` table
- **Progress tracking**: 3-step progress indicator (uploading → extracting → normalizing) with polling via `usePolicyStatus`
- **Post-upload navigation**: "View extracted criteria" button links to Explorer

### What could be improved
- No batch upload (single file only)
- No re-extraction/re-upload for a specific policy version

> [!TIP]
> This is your **strongest feature** for the completeness score. The upload → extraction → explorer pipeline is complete and wired to real backend APIs.

---

## 2. Site-of-Care Restrictions Display

| Aspect | Status |
|---|---|
| **Verdict** | ❌ **Missing from UI — partially in backend** |

### What exists
- **Backend** [classify_document.py](file:///Users/mohith/programming/hackathon/PolicyDiff/backend/lambda/extraction/classify_document.py#L145-L157): Document classifier detects `site_of_care` documents
- **Backend** [prompts.py](file:///Users/mohith/programming/hackathon/PolicyDiff/backend/lambda/extraction/prompts.py#L1416): `NO_EXTRACTION_CLASSES` explicitly skips `site_of_care` documents — they are indexed but **not extracted**
- The extracted `DrugPolicyCriteria` schema does have `selfAdminAllowed` field but it's always `null`

### What's missing
- **No UI surface** anywhere for site-of-care restrictions
- No extraction prompt handles site-of-care rules (skipped in `NO_EXTRACTION_CLASSES`)
- The comparison matrix prompt asks about `self_admin` dimension, but there's no data to feed it since site-of-care docs aren't extracted
- Explorer, Compare, and Diffs pages have no mention of site-of-care

> [!WARNING]
> The problem statement explicitly calls this out. You need **at minimum** a column in the Explorer view or Compare matrix showing "Infusion center only" / "Home infusion allowed" / "Office only" per payer.

---

## 3. HCPCS/J-Code Surface

| Aspect | Status |
|---|---|
| **Verdict** | ❌ **Missing from UI — exists in backend** |

### What exists in backend
- [prompts.py (Prompt D)](file:///Users/mohith/programming/hackathon/PolicyDiff/backend/lambda/extraction/prompts.py#L434-L476): `PROMPT_D_DOSING` explicitly extracts `hcpcsCode` from Max Dosage documents
- [write_criteria.py](file:///Users/mohith/programming/hackathon/PolicyDiff/backend/lambda/extraction/write_criteria.py#L85-L117): Uses `{hcpcsCode}#{drugName}` as `drugIndicationId` sort key
- [assemble_text.py](file:///Users/mohith/programming/hackathon/PolicyDiff/backend/lambda/extraction/assemble_text.py#L427-L459): Has `_HCPCS_RE` regex to detect HCPCS codes in formulary tables
- Formulary extraction prompt also captures `hcpcsCode` per entry

### What's missing on frontend
- **Zero** references to `hcpcs` anywhere in `frontend/src/`
- Drug search on dashboard uses only drug name + brand name (line 17-26 of [page.tsx](file:///Users/mohith/programming/hackathon/PolicyDiff/frontend/src/app/(dashboard)/page.tsx#L17-L26)) — hardcoded `allDrugs` array with no J-codes
- Explorer criteria view doesn't display `hcpcsCode` even though it's in the API response
- Compare matrix doesn't show HCPCS codes

> [!IMPORTANT]
> Domain experts identify drugs by **J-codes** (e.g., J1745 for infliximab). You're extracting them but never showing them. The fix is straightforward — surface `hcpcsCode` in:
> 1. Explorer criteria cards
> 2. Drug search (allow searching by J-code)
> 3. Compare matrix header

---

## 4. NLQ (Natural Language Query) — Real Substance

| Aspect | Status |
|---|---|
| **Verdict** | ✅ **Real implementation, not just a shell** |

### What exists
- **Frontend** [query/page.tsx](file:///Users/mohith/programming/hackathon/PolicyDiff/frontend/src/app/(dashboard)/query/page.tsx): Full chat interface with:
  - Real `POST /api/query` backend calls (line 88)
  - Markdown-rendered responses via `ReactMarkdown`
  - Expandable citations panel with payer, title, date, and excerpt
  - Data completeness indicator
  - Suggested query chips and recent query history
  - Loading animation and error handling

- **Backend** [query.py](file:///Users/mohith/programming/hackathon/PolicyDiff/backend/lambda/query.py): Fully functional:
  - Query classification (5 types: coverage_check, criteria_lookup, cross_payer_compare, change_tracking, discordance_check)
  - **RAG pipeline**: S3 Vectors semantic search → DynamoDB criteria fetch → Bedrock synthesis
  - Keyword fallback when vector search fails
  - Citation extraction with payer + document title + effective date + excerpt
  - Query logging with response time tracking
  - Recent queries endpoint (`GET /api/queries`)

### What could be improved
- No streaming (synchronous response only — may be slow for complex queries)
- No conversation context (each query is independent)

> [!TIP]
> This is substantially more than a "UX shell." You have real RAG with vector search, Bedrock synthesis, and proper citations. **Make sure this is working in the demo** — it's your strongest creativity differentiator.

---

## 5. Change Detection — Diff-Level Detail

| Aspect | Status |
|---|---|
| **Verdict** | ⚠️ **Partially implemented — needs more detail in UI** |

### What exists
- **Backend** [diff.py](file:///Users/mohith/programming/hackathon/PolicyDiff/backend/lambda/diff.py): Full temporal diff pipeline:
  - Fetches old + new criteria from DynamoDB
  - Sends to Bedrock with `TEMPORAL_DIFF_PROMPT` for change analysis
  - Returns structured changes with: `field`, `severity` (breaking/restrictive/relaxed/neutral), `humanSummary`, `oldValue`, `newValue`
  - Stores diffs in `PolicyDiffs` table
  - Feed endpoint returns flattened change entries

- **Frontend** [diffs/page.tsx](file:///Users/mohith/programming/hackathon/PolicyDiff/frontend/src/app/(dashboard)/diffs/page.tsx):
  - Timeline-based change feed with severity badges
  - **Expandable "View technical diff"** panel (line 126) showing `oldValue → newValue` with red/green highlighting
  - Severity color-coding per change

### What's missing
- **Criterion-level diffing**: The diff shows single `oldValue → newValue` pairs per change, but doesn't render a **full side-by-side criteria comparison** (e.g., complete old criteria block vs new criteria block)
- No link from a diff entry back to the specific policy document or Explorer page
- No indication of *which specific criterion* changed (e.g., "Step therapy criterion #3 for Rheumatoid Arthritis")
- Diff granularity depends entirely on Bedrock's analysis — no deterministic field-level diff logic

> [!NOTE]
> The architecture is there. To make it "diff-level detail," add:
> - Criterion-by-criterion change breakdown in the expandable section
> - Side-by-side rendered columns (old criteria | new criteria) with inline highlights
> - A link back to the source policy in Explorer

---

## 6. PDF Source Linking

| Aspect | Status |
|---|---|
| **Verdict** | ❌ **Not implemented** |

### What exists
- Backend stores `s3Key` (e.g., `raw/{policyDocId}/raw.pdf`) per policy document
- Upload flow uploads PDFs to S3 via presigned URL
- `rawExcerpt` field in criteria records preserves the original text from the document

### What's missing
- **No presigned download URL** API endpoint — there's no `GET /api/policies/{id}/download` route
- **No "View Source PDF" button** anywhere in the frontend
- Explorer doesn't link criteria back to PDF page numbers  
- Query citations show excerpts but no link to the source PDF
- Diff entries don't link to the original documents
- The `s3Key` is stored but never exposed to the client

> [!WARNING]
> Analysts need to verify extracted criteria against the original PDF. You have the data to enable this (s3Key is stored). You just need:
> 1. A backend endpoint that generates a presigned GET URL for the PDF
> 2. A "View PDF" button in Explorer and Citations panels

---

## 7. Export Options Beyond CSV

| Aspect | Status |
|---|---|
| **Verdict** | ⚠️ **CSV only — for Compare matrix only** |

### What exists
- **Compare page** [compare/page.tsx](file:///Users/mohith/programming/hackathon/PolicyDiff/frontend/src/app/(dashboard)/compare/page.tsx#L121-L125): "Export CSV" button calls `GET /api/compare/export`
- **Backend** [compare.py](file:///Users/mohith/programming/hackathon/PolicyDiff/backend/lambda/compare.py#L222-L258): `compare_export()` generates CSV with dimension × payer values + severity annotations
- PA Memo has a "Copy" button for clipboard (not a file export)

### What's missing
- **No PDF export** of the comparison matrix
- **No JSON export** of raw criteria data
- **No Excel/XLSX export** (CSV only)
- Explorer page has **no export at all** — can't export criteria for a specific drug/payer
- Diffs/Change Feed has **no export** — can't export change history
- NLQ answers have **no export** — can't save a query answer as a report
- Only the Compare matrix page has export functionality

> [!NOTE]
> For a hackathon, CSV is fine for the Compare matrix, but consider adding:
> - "Export JSON" on the Explorer page (trivial — just serialize the criteria data)
> - "Export PDF" for the PA Memo (format the memo text as a downloadable PDF)

---

## Summary Matrix

| # | Concern | Status | Risk to Score |
|---|---------|--------|---------------|
| 1 | Document upload/ingestion flow | ✅ Full E2E | Low |
| 2 | Site-of-care restrictions display | ❌ Missing entirely | **High** — explicitly called out |
| 3 | HCPCS/J-code surface | ❌ Backend only, not in UI | **High** — domain experts expect it |
| 4 | NLQ real substance | ✅ Real RAG pipeline | Low |
| 5 | Change detection detail | ⚠️ Partial | Medium — improve diff rendering |
| 6 | PDF source linking | ❌ Not implemented | **High** — verification is core to trust |
| 7 | Export options beyond CSV | ⚠️ CSV only, Compare only | Medium |

### Priority Fixes (impact-to-effort ratio)
1. **HCPCS/J-codes in UI** — Quick win. Data exists in API, just surface it in Explorer + Search
2. **PDF source linking** — Add 1 backend endpoint + 1 button per policy in Explorer
3. **Site-of-care column** — Needs extraction prompt addition + Explorer/Compare UI column
4. **Diff detail** — Enhance the expandable diff section with criterion-level breakdown
5. **Export JSON** on Explorer — Trivial client-side implementation

