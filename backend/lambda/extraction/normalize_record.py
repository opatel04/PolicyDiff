# Owner: Mohith
# normalize_record.py — Post-extraction schema normalizer
#
# Guarantees every DrugPolicyCriteriaRecord has ALL fields the frontend
# expects, regardless of which payer-specific prompt (A–H) produced it.
#
# Called from bedrock_extract.py after JSON parse, before confidence scoring.
#
# Design decisions:
#   - Never removes fields Bedrock returns — only adds missing ones with safe defaults
#   - Normalizes type mismatches (e.g. indicationICD10 as string → list)
#   - Validates criterionType and logicOperator enums
#   - Injects pipeline metadata (policyNumber, planType, extractionPromptVersion)

import logging
import re
from typing import Any

logger = logging.getLogger()

# ── Known enum values ─────────────────────────────────────────────────────────

VALID_CRITERION_TYPES = frozenset({
    "diagnosis",
    "step_therapy",
    "lab_value",
    "prescriber_requirement",
    "dosing",
    "combination_restriction",
    "age",
    "severity",
    "other",
})

VALID_LOGIC_OPERATORS = frozenset({"AND", "OR"})

VALID_COVERED_STATUSES = frozenset({
    "covered",
    "excluded",
    "experimental",
    "unproven",
    "not_covered",
})

VALID_APPROVAL_PHASES = frozenset({
    "initial",
    "continuation_1",
    "continuation_2plus",
    "continuation",
})

VALID_BENEFIT_TYPES = frozenset({"medical", "pharmacy", "both"})


# ── Field default schema ─────────────────────────────────────────────────────

_DEFAULT_FIELDS: dict[str, Any] = {
    # Drug identity
    "drugName": None,
    "brandNames": [],
    "productName": None,
    "productGroup": None,
    # Indication
    "indicationName": None,
    "indicationICD10": [],
    # Payer / policy
    "payerName": None,
    "policyNumber": None,
    "planType": None,
    "effectiveDate": None,
    # Benefit
    "benefitType": "medical",
    "coveredStatus": "covered",
    # Approval phase (Cigna 3-phase only; null for standard 2-branch prompts)
    "approvalPhase": None,
    "approvalDurationMonths": None,
    "initialAuthDurationMonths": None,
    # Criteria arrays
    "universalCriteria": [],
    "initialAuthCriteria": [],
    "reauthorizationCriteria": [],
    # Dosing
    "dosingPerIndication": [],
    "dosingLimits": None,
    # Products
    "preferredProducts": [],
    # Restrictions
    "combinationRestrictions": [],
    "quantityLimits": None,
    # Plan tier (Cigna Pathwell)
    "planTierRestriction": None,
    # Self-admin
    "selfAdminAllowed": None,
    # Confidence (overwritten by confidence_score.py)
    "confidence": 0.8,
    "needsReview": False,
    "reviewReasons": [],
    # Excerpt
    "rawExcerpt": None,
    # Extraction metadata (injected by bedrock_extract.py)
    "policyDocId": None,
    "drugIndicationId": None,
    "extractionPromptVersion": None,
    "extractedAt": None,
}


# ── Normalizer ────────────────────────────────────────────────────────────────

def normalize_record(
    record: dict,
    event_metadata: dict | None = None,
) -> dict:
    """Normalize a single raw Bedrock extraction record.

    Ensures every required field is present with appropriate defaults.
    Normalizes type mismatches and validates enum values.

    Args:
        record: Raw dict from Bedrock JSON parse.
        event_metadata: Pipeline event dict (payerName, policyNumber, etc.)
            used to inject metadata fields the model may not return.

    Returns:
        The same dict (mutated in place) with all required fields guaranteed.
    """
    if not isinstance(record, dict):
        logger.warning(f"normalize_record: expected dict, got {type(record).__name__}")
        return record

    meta = event_metadata or {}

    # 1. Ensure all default fields exist
    for field, default in _DEFAULT_FIELDS.items():
        if field not in record or record[field] is None:
            # Don't overwrite with None default if record already has a value
            if field not in record:
                if isinstance(default, (list, dict)):
                    record[field] = type(default)()  # fresh copy
                else:
                    record[field] = default

    # 2. Inject pipeline metadata (event fields override only if record is empty)
    _inject_metadata(record, meta)

    # 3. Normalize types
    _normalize_icd10(record)
    _normalize_brand_names(record)
    _normalize_criteria_arrays(record)
    _normalize_dosing(record)
    _normalize_preferred_products(record)
    _normalize_enums(record)

    # 4. Sync initialAuthDurationMonths ↔ approvalDurationMonths
    _sync_auth_duration(record)

    # 5. Build rawExcerpt if absent
    if not record.get("rawExcerpt"):
        record["rawExcerpt"] = _build_raw_excerpt(record)

    return record


# ── Internal helpers ──────────────────────────────────────────────────────────

def _inject_metadata(record: dict, meta: dict) -> None:
    """Inject pipeline metadata fields from the Step Functions event."""
    inject_fields = {
        "payerName": "payerName",
        "policyNumber": "policyNumber",
        "planType": "planType",
        "effectiveDate": "effectiveDate",
    }
    for record_key, meta_key in inject_fields.items():
        if not record.get(record_key) and meta.get(meta_key):
            record[record_key] = meta[meta_key]


def _normalize_icd10(record: dict) -> None:
    """Ensure indicationICD10 is always a list of strings."""
    icd10 = record.get("indicationICD10")
    if icd10 is None:
        record["indicationICD10"] = []
    elif isinstance(icd10, str):
        # Single code as string → wrap in list
        if icd10.strip():
            record["indicationICD10"] = [c.strip() for c in icd10.split(",")]
        else:
            record["indicationICD10"] = []
    elif isinstance(icd10, list):
        # Filter out empty strings and non-strings
        record["indicationICD10"] = [
            str(c).strip() for c in icd10 if c and str(c).strip()
        ]


def _normalize_brand_names(record: dict) -> None:
    """Ensure brandNames is always a list of strings."""
    bn = record.get("brandNames")
    if bn is None:
        record["brandNames"] = []
    elif isinstance(bn, str):
        record["brandNames"] = [b.strip() for b in bn.split(",") if b.strip()]
    elif isinstance(bn, list):
        record["brandNames"] = [str(b).strip() for b in bn if b and str(b).strip()]


def _normalize_criteria_arrays(record: dict) -> None:
    """Validate and normalize criteria items in all criteria arrays."""
    for key in ("universalCriteria", "initialAuthCriteria", "reauthorizationCriteria"):
        raw = record.get(key)
        if raw is None:
            record[key] = []
            continue
        if isinstance(raw, str):
            # Some prompts return criteria as comma-separated strings
            record[key] = [{"criterionText": raw, "criterionType": "diagnosis", "logicOperator": "AND"}]
            continue
        if not isinstance(raw, list):
            record[key] = []
            continue

        normalized: list[dict] = []
        for item in raw:
            if isinstance(item, str):
                # String item → wrap in criterion dict
                normalized.append({
                    "criterionText": item,
                    "criterionType": "diagnosis",
                    "logicOperator": "AND",
                })
            elif isinstance(item, dict):
                # Ensure required sub-fields
                if not item.get("criterionText"):
                    # Try rawExcerpt as fallback
                    item.setdefault("criterionText", item.get("rawExcerpt", ""))
                item.setdefault("criterionType", "diagnosis")
                item.setdefault("logicOperator", "AND")

                # Validate criterionType
                ct = item.get("criterionType", "").lower().strip()
                if ct not in VALID_CRITERION_TYPES:
                    item["criterionType"] = "other"
                else:
                    item["criterionType"] = ct

                # Validate logicOperator
                lo = item.get("logicOperator", "AND").upper().strip()
                if lo not in VALID_LOGIC_OPERATORS:
                    item["logicOperator"] = "AND"
                else:
                    item["logicOperator"] = lo

                # Ensure requiredDrugsTriedFirst is a list
                rdtf = item.get("requiredDrugsTriedFirst")
                if rdtf is not None and not isinstance(rdtf, list):
                    item["requiredDrugsTriedFirst"] = [str(rdtf)]

                normalized.append(item)
            # else: skip non-dict, non-string items

        record[key] = normalized


def _normalize_dosing(record: dict) -> None:
    """Normalize dosingLimits and dosingPerIndication."""
    # dosingLimits
    dl = record.get("dosingLimits")
    if dl is not None and isinstance(dl, dict):
        dl.setdefault("perFDALabel", False)
        dl.setdefault("weightBased", False)
        dl.setdefault("maxDoseMg", None)
        dl.setdefault("maxFrequency", None)
        dl.setdefault("maxDoseMgPerKg", None)
    elif dl is not None and not isinstance(dl, dict):
        record["dosingLimits"] = None

    # dosingPerIndication
    dpi = record.get("dosingPerIndication")
    if dpi is None:
        record["dosingPerIndication"] = []
    elif isinstance(dpi, str):
        record["dosingPerIndication"] = [{"indicationContext": "", "regimen": dpi, "maxDoseMg": None}]
    elif isinstance(dpi, list):
        normalized = []
        for item in dpi:
            if isinstance(item, str):
                normalized.append({"indicationContext": "", "regimen": item, "maxDoseMg": None})
            elif isinstance(item, dict):
                item.setdefault("indicationContext", "")
                item.setdefault("regimen", "")
                item.setdefault("maxDoseMg", None)
                normalized.append(item)
        record["dosingPerIndication"] = normalized


def _normalize_preferred_products(record: dict) -> None:
    """Ensure preferredProducts have productName and sequential rank."""
    pp = record.get("preferredProducts")
    if pp is None:
        record["preferredProducts"] = []
        return
    if not isinstance(pp, list):
        record["preferredProducts"] = []
        return

    normalized: list[dict] = []
    for i, item in enumerate(pp):
        if isinstance(item, str):
            normalized.append({"productName": item, "rank": i + 1})
        elif isinstance(item, dict):
            item.setdefault("productName", "Unknown")
            if not item.get("rank"):
                item["rank"] = i + 1
            normalized.append(item)
    record["preferredProducts"] = normalized


def _normalize_enums(record: dict) -> None:
    """Validate enum-type fields."""
    # coveredStatus
    cs = record.get("coveredStatus", "covered")
    if isinstance(cs, str):
        cs_lower = cs.lower().strip()
        if cs_lower not in VALID_COVERED_STATUSES:
            record["coveredStatus"] = "covered"
        else:
            record["coveredStatus"] = cs_lower
    else:
        record["coveredStatus"] = "covered"

    # approvalPhase
    ap = record.get("approvalPhase")
    if ap is not None:
        ap_lower = str(ap).lower().strip()
        if ap_lower not in VALID_APPROVAL_PHASES:
            record["approvalPhase"] = None
        else:
            record["approvalPhase"] = ap_lower

    # benefitType
    bt = record.get("benefitType", "medical")
    if isinstance(bt, str):
        bt_lower = bt.lower().strip()
        if bt_lower not in VALID_BENEFIT_TYPES:
            record["benefitType"] = "medical"
        else:
            record["benefitType"] = bt_lower
    else:
        record["benefitType"] = "medical"


def _sync_auth_duration(record: dict) -> None:
    """Sync initialAuthDurationMonths and approvalDurationMonths.

    Both are used by different prompts for the same concept.
    Frontend reads both — ensure they're consistent.
    """
    iadm = record.get("initialAuthDurationMonths")
    adm = record.get("approvalDurationMonths")

    if iadm is not None and adm is None:
        record["approvalDurationMonths"] = iadm
    elif adm is not None and iadm is None:
        record["initialAuthDurationMonths"] = adm


def _build_raw_excerpt(record: dict) -> str:
    """Build a text excerpt from criteria for embedding when rawExcerpt is absent."""
    parts: list[str] = []

    drug = record.get("drugName", "")
    indication = record.get("indicationName", "")
    payer = record.get("payerName", "")
    phase = record.get("approvalPhase", "")

    header = f"{drug} — {indication}"
    if payer:
        header += f" ({payer})"
    if phase:
        header += f" [{phase}]"
    parts.append(header)

    for criteria_key in ("universalCriteria", "initialAuthCriteria", "reauthorizationCriteria"):
        criteria = record.get(criteria_key, []) or []
        for c in criteria:
            if isinstance(c, dict) and c.get("criterionText"):
                parts.append(c["criterionText"])
            elif isinstance(c, str) and c.strip():
                parts.append(c)

    dosing = record.get("dosingPerIndication", []) or []
    for d in dosing:
        if isinstance(d, dict) and d.get("regimen"):
            parts.append(f"Dosing: {d['regimen']}")

    preferred = record.get("preferredProducts", []) or []
    if preferred:
        prods = ", ".join(
            p.get("productName", "") for p in preferred if isinstance(p, dict)
        )
        if prods:
            parts.append(f"Preferred products: {prods}")

    return "\n".join(p for p in parts if p)


# ── Batch normalizer (convenience) ───────────────────────────────────────────

def normalize_records(
    records: list[dict],
    event_metadata: dict | None = None,
) -> list[dict]:
    """Normalize a list of raw Bedrock extraction records.

    Args:
        records: List of raw dicts from Bedrock JSON parse.
        event_metadata: Pipeline event dict.

    Returns:
        The same list (records mutated in place) with all fields guaranteed.
    """
    for record in records:
        normalize_record(record, event_metadata)
    return records
