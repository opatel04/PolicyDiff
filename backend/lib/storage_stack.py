# Owner: AZ
# PolicyDiffStorageStack — S3, DynamoDB tables, Secrets Manager.

import aws_cdk as cdk
from constructs import Construct


class PolicyDiffStorageStack(cdk.Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # TODO: S3 bucket for raw policy PDFs
        #   - enforceSSL: True, versioned, encryption at rest
        #   - CORS for presigned URL uploads from frontend
        self.policy_bucket = None  # type: ignore

        # TODO: DynamoDB table — PolicyDocuments
        #   PK: policyId | billing: PAY_PER_REQUEST | PITR enabled
        self.policy_documents_table = None  # type: ignore

        # TODO: DynamoDB table — DrugPolicyCriteria
        #   PK: policyId | SK: drugName | GSI: drugName-index
        self.drug_policy_criteria_table = None  # type: ignore

        # TODO: DynamoDB table — PolicyDiffs
        #   PK: diffId | GSI: policyId-index, timestamp-index
        self.policy_diffs_table = None  # type: ignore

        # TODO: DynamoDB table — QueryLog
        #   PK: queryId | TTL attribute for auto-expiry
        self.query_log_table = None  # type: ignore

        # TODO: DynamoDB table — ApprovalPaths
        #   PK: requestId | SK: payerId
        self.approval_paths_table = None  # type: ignore

        # TODO: Secrets Manager secret for Bedrock / Gemini API keys
        self.ai_api_secret = None  # type: ignore
