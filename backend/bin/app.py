# Owner: AZ
# CDK app entry point — instantiates all 4 stacks in dependency order.

import aws_cdk as cdk

from lib.storage_stack import PolicyDiffStorageStack
from lib.compute_stack import PolicyDiffComputeStack
from lib.api_stack import PolicyDiffApiStack
from lib.frontend_stack import PolicyDiffFrontendStack

app = cdk.App()

# TODO: Pass env=cdk.Environment(account=..., region=...) from context or env vars
storage = PolicyDiffStorageStack(app, "PolicyDiffStorageStack")

compute = PolicyDiffComputeStack(app, "PolicyDiffComputeStack", storage_stack=storage)
compute.add_dependency(storage)

api = PolicyDiffApiStack(app, "PolicyDiffApiStack", compute_stack=compute)
api.add_dependency(compute)

frontend = PolicyDiffFrontendStack(app, "PolicyDiffFrontendStack", api_stack=api)
frontend.add_dependency(api)

app.synth()
