# Owner: AZ
# PolicyDiffApiStack — API Gateway REST API with all 21 routes.

import aws_cdk as cdk
from constructs import Construct
from lib.compute_stack import PolicyDiffComputeStack


class PolicyDiffApiStack(cdk.Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        compute_stack: PolicyDiffComputeStack,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # TODO: API Gateway RestApi
        #   - CORS origins from env var (never wildcard)
        #   - deploy to "prod" stage
        #   - access logging to CloudWatch
        self.api = None  # type: ignore

        # TODO: Wire all 21 routes to Lambda integrations:
        #
        # Policies (UploadUrlLambda + PolicyCrudLambda):
        #   POST   /api/policies/upload-url       → upload_url_fn
        #   POST   /api/policies                  → policy_crud_fn
        #   GET    /api/policies/{id}              → policy_crud_fn
        #   GET    /api/policies/{id}/status       → policy_crud_fn
        #   GET    /api/policies/{id}/criteria     → policy_crud_fn
        #   GET    /api/policies                   → policy_crud_fn
        #   DELETE /api/policies/{id}              → policy_crud_fn
        #
        # Query (QueryLambda):
        #   POST   /api/query                      → query_fn
        #   GET    /api/query/{queryId}             → query_fn
        #   GET    /api/queries                     → query_fn
        #
        # Compare (CompareLambda):
        #   GET    /api/compare                     → compare_fn
        #   GET    /api/compare/export              → compare_fn
        #
        # Diffs (DiffLambda):
        #   GET    /api/diffs                       → diff_fn
        #   GET    /api/diffs/{diffId}              → diff_fn
        #   GET    /api/diffs/feed                  → diff_fn
        #
        # Discordance (DiscordanceLambda):
        #   GET    /api/discordance                 → discordance_fn
        #   GET    /api/discordance/{drug}/{payer}  → discordance_fn
        #
        # Approval Path (ApprovalPathLambda):
        #   POST   /api/approval-path               → approval_path_fn
        #   POST   /api/approval-path/{id}/memo     → approval_path_fn
        #
        # Simulator (SimulatorLambda, stretch):
        #   POST   /api/simulate                    → simulator_fn

        # TODO: Export API URL as CfnOutput for frontend env var
        self.api_url = None  # type: ignore
