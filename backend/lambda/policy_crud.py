# Owner: AZ
# PolicyCrudLambda — CRUD operations on PolicyDocuments and DrugPolicyCriteria tables.
#
# Routes handled:
#   POST   /api/policies              → create policy record
#   GET    /api/policies/{id}         → get policy by id
#   GET    /api/policies/{id}/status  → get extraction status
#   GET    /api/policies/{id}/criteria → get extracted drug criteria
#   GET    /api/policies              → list policies (with optional filters)
#   DELETE /api/policies/{id}         → soft delete (set status=DELETED)
#
# DynamoDB key prefix: POLICY#<policyId>

import json
import logging
import os
from typing import Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# TODO: validate env vars at startup (POLICY_DOCUMENTS_TABLE, DRUG_POLICY_CRITERIA_TABLE, CORS_ORIGIN)
# TODO: init boto3 dynamodb resource at module level


def lambda_handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    logger.info(json.dumps({"event": event}))

    cors_origin = os.environ.get("CORS_ORIGIN", "")
    headers = {
        "Access-Control-Allow-Origin": cors_origin,
        "Content-Type": "application/json",
    }

    http_method = event.get("httpMethod", "")
    resource = event.get("resource", "")

    # TODO: implement each route
    if http_method == "POST" and resource == "/api/policies":
        # TODO: validate body, write to PolicyDocuments table
        body = {"message": "createPolicy stub"}

    elif http_method == "GET" and resource == "/api/policies/{id}":
        # TODO: get item from PolicyDocuments table by policyId
        body = {"message": "getPolicy stub"}

    elif http_method == "GET" and resource == "/api/policies/{id}/status":
        # TODO: get extraction status field from PolicyDocuments table
        body = {"message": "getPolicyStatus stub"}

    elif http_method == "GET" and resource == "/api/policies/{id}/criteria":
        # TODO: query DrugPolicyCriteria table by policyId
        body = {"message": "getPolicyCriteria stub"}

    elif http_method == "GET" and resource == "/api/policies":
        # TODO: scan/query PolicyDocuments table with optional filters
        body = {"message": "listPolicies stub", "items": []}

    elif http_method == "DELETE" and resource == "/api/policies/{id}":
        # TODO: soft delete — update status to DELETED
        body = {"message": "deletePolicy stub"}

    else:
        return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}

    return {"statusCode": 200, "headers": headers, "body": json.dumps(body)}
