# Owner: AZ
# PolicyDiffComputeStack — Lambda functions, Step Functions, EventBridge, IAM roles.

import aws_cdk as cdk
from constructs import Construct
from lib.storage_stack import PolicyDiffStorageStack


class PolicyDiffComputeStack(cdk.Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        storage_stack: PolicyDiffStorageStack,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # ADR: Dynamic arch detection | Supports Apple Silicon and Intel Macs
        # TODO: import os; detect arm64 vs x86_64 and set lambda_arch accordingly

        # TODO: Lambda — UploadUrlLambda
        #   handler: upload_url.lambda_handler | generates presigned S3 PUT URL
        self.upload_url_fn = None  # type: ignore

        # TODO: Lambda — PolicyCrudLambda
        #   handler: policy_crud.lambda_handler | CRUD on PolicyDocuments table
        self.policy_crud_fn = None  # type: ignore

        # TODO: Lambda — QueryLambda (Owner: Mohith)
        #   handler: query.lambda_handler | NL query via Bedrock/Gemini
        self.query_fn = None  # type: ignore

        # TODO: Lambda — CompareLambda (Owner: Mohith)
        #   handler: compare.lambda_handler | cross-payer comparison matrix
        self.compare_fn = None  # type: ignore

        # TODO: Lambda — DiffLambda (Owner: Mohith)
        #   handler: diff.lambda_handler | temporal policy diffs
        self.diff_fn = None  # type: ignore

        # TODO: Lambda — DiscordanceLambda (Owner: Mohith)
        #   handler: discordance.lambda_handler | detect payer discordances
        self.discordance_fn = None  # type: ignore

        # TODO: Lambda — ApprovalPathLambda (Owner: Mohith)
        #   handler: approval_path.lambda_handler | score coverage + PA paths
        self.approval_path_fn = None  # type: ignore

        # TODO: Lambda — SimulatorLambda (Owner: Mohith, stretch)
        #   handler: simulator.lambda_handler | policy simulation
        self.simulator_fn = None  # type: ignore

        # TODO: Step Functions StateMachine — ExtractionWorkflow
        #   Steps: Textract → Bedrock parse → store DrugPolicyCriteria
        self.extraction_workflow = None  # type: ignore

        # TODO: EventBridge rule — trigger ExtractionWorkflow on S3 upload event
        self.extraction_trigger_rule = None  # type: ignore

        # TODO: IAM roles — use CDK grant methods (grantRead, grantWrite, grantReadWrite)
        #   Grant each Lambda only the tables/buckets it needs
