# Owner: Mohith
# CompareLambda — cross-payer comparison matrix for a given drug.
#
# Routes handled:
#   GET /api/compare        → returns comparison matrix (drug × payer grid)
#   GET /api/compare/export → returns CSV/PDF download URL
#
# Expected query params: drug (required), policyIds (optional, comma-separated)
# Expected output: { "drug": str, "matrix": [ { "payer": str, "criteria": {...} } ] }

import json
import logging
import os
from typing import Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# TODO: validate env vars at startup (DRUG_POLICY_CRITERIA_TABLE, POLICY_BUCKET_NAME, CORS_ORIGIN)
# TODO: init boto3 dynamodb + s3 clients at module level


def lambda_handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    logger.info(json.dumps({"event": event}))

    cors_origin = os.environ.get("CORS_ORIGIN", "")
    headers = {
        "Access-Control-Allow-Origin": cors_origin,
        "Content-Type": "application/json",
    }

    # TODO: route on resource (/api/compare vs /api/compare/export)
    # TODO: query DrugPolicyCriteria GSI by drugName across all policyIds
    # TODO: build matrix structure grouping by payer
    # TODO: for export — generate CSV, upload to S3, return presigned GET URL

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"message": "CompareLambda stub — implement AI logic here"}),
    }
