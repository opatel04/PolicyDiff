# Owner: AZ
# PolicyDiffFrontendStack — AWS Amplify hosting for the React frontend.

import aws_cdk as cdk
from constructs import Construct
from lib.api_stack import PolicyDiffApiStack


class PolicyDiffFrontendStack(cdk.Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        api_stack: PolicyDiffApiStack,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # TODO: Amplify App
        #   - source from GitHub repo (use SSM param for OAuth token)
        #   - build spec: cd frontend && npm install && npm run build
        self.amplify_app = None  # type: ignore

        # TODO: Amplify Branch — "main"
        #   - auto-build on push
        self.main_branch = None  # type: ignore

        # TODO: Amplify environment variables
        #   - VITE_API_BASE_URL = api_stack.api_url
        #   - Any other frontend env vars from SSM / context

        # TODO: CfnOutput — Amplify app URL
