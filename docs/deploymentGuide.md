# PolicyDiff — Deployment Guide

## Prerequisites

- AWS CLI configured (`aws sts get-caller-identity`)
- Python 3.12+
- Node.js 20+
- AWS CDK CLI: `npm install -g aws-cdk`

## First-Time Setup

```bash
# Bootstrap CDK (once per account/region)
cdk bootstrap aws://ACCOUNT_ID/us-east-1
```

## Backend Deployment

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Validate (runs cdk-nag)
cdk synth

# Preview changes
cdk diff

# Deploy all stacks
cdk deploy --all
```

### Stack Deployment Order

1. `PolicyDiffStorageStack` — S3, DynamoDB, Secrets Manager
2. `PolicyDiffComputeStack` — Lambdas, Step Functions, EventBridge
3. `PolicyDiffApiStack` — API Gateway
4. `PolicyDiffFrontendStack` — Amplify

## Frontend Deployment

After backend deploys, copy the API URL from CDK outputs:

```bash
cd frontend
npm install
# Set VITE_API_BASE_URL from CDK output
npm run build
```

Amplify auto-deploys on push to main (after GitHub connection configured).

## Secrets

After first deploy, update the Gemini API key:

```bash
aws secretsmanager put-secret-value \
  --secret-id policydiff/gemini-api-key \
  --secret-string '{"key":"YOUR_GEMINI_KEY"}'
```

## Troubleshooting

- **CloudFormation rollback** → Check Events tab in AWS Console
- **Lambda errors** → `aws logs tail /aws/lambda/FUNCTION_NAME --follow`
- **Missing permissions** → Review IAM policies in CloudFormation outputs
