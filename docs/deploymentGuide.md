# PolicyDiff — Deployment Guide

## Prerequisites

- AWS CLI configured (`aws sts get-caller-identity` should succeed)
- Python 3.12+
- Node.js 20+
- AWS CDK CLI: `npm install -g aws-cdk`
- An Auth0 account (optional — skip for dev/demo mode)

---

## 1. AWS Account Setup

```bash
# Verify CLI is configured
aws sts get-caller-identity

# Bootstrap CDK (once per account/region)
cdk bootstrap aws://YOUR_ACCOUNT_ID/us-east-1
```

Make sure the following Bedrock models are enabled in your account (us-east-1):
- **Amazon Nova Pro** (`amazon.nova-pro-v1:0`) — criteria extraction + query synthesis
- **Amazon Titan Embeddings v2** (`amazon.titan-embed-text-v2:0`) — vector embeddings

Enable them at: AWS Console → Bedrock → Model access → Request access.

---

## 2. Backend Deployment

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and fill in environment variables
cp .env.example .env
```

Edit `backend/.env`:

```env
AWS_REGION=us-east-1
CDK_DEFAULT_ACCOUNT=your-12-digit-account-id

# Auth0 — leave blank to run unauthenticated (dev/demo mode)
AUTH0_DOMAIN=
AUTH0_AUDIENCE=

# Nova Pro inference profile ARN (replace YOUR_ACCOUNT_ID)
BEDROCK_MODEL_ARN=arn:aws:bedrock:us-east-1:YOUR_ACCOUNT_ID:inference-profile/us.amazon.nova-pro-v1:0

# CORS — set to your Amplify URL in production
CORS_ORIGIN=*
```

```bash
# Validate (runs cdk-nag security checks)
cdk synth

# Preview changes
cdk diff

# Deploy all stacks (order: Storage → Compute → API)
cdk deploy --all --require-approval never
```

Note the API Gateway URL from the CDK output — it looks like:
```
PolicyDiffApiStack.ApiUrl = https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
```

---

## 3. Frontend — Local Dev

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:

```env
AUTH0_SECRET=                        # run: openssl rand -hex 32
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://api.your-project.com

# Paste the API Gateway URL from CDK output
NEXT_PUBLIC_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
```

```bash
npm run dev
# Open http://localhost:3000
```

---

## 4. Frontend — Amplify Deployment

Amplify auto-deploys on push to `main` once connected to GitHub.

**First-time setup:**

1. Go to AWS Amplify Console → New app → Host web app → GitHub
2. Select the `PolicyDiff` repo, branch `main`
3. Amplify detects the monorepo — set App root to `frontend`
4. Add environment variables (same as `.env.local` but with your production values):
   - `AUTH0_SECRET`, `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_AUDIENCE`
   - `APP_BASE_URL` = `https://main.YOUR_AMPLIFY_APP_ID.amplifyapp.com`
   - `NEXT_PUBLIC_API_URL` = your API Gateway URL
   - `AMPLIFY_MONOREPO_APP_ROOT` = `frontend`
5. Save and deploy

---

## 5. Auth0 Setup (Optional)

Skip this section if running in dev/demo mode (leave `AUTH0_DOMAIN` blank in `.env`).

1. Create an Auth0 application (Regular Web Application)
2. Set Allowed Callback URLs: `http://localhost:3000/api/auth/callback`, `https://your-amplify-url/api/auth/callback`
3. Set Allowed Logout URLs: `http://localhost:3000`, `https://your-amplify-url`
4. Create an Auth0 API with audience `https://api.your-project.com`
5. Fill in the Auth0 values in both `backend/.env` and `frontend/.env.local`

---

## 6. Stack Overview

| Stack | Resources |
|---|---|
| `PolicyDiffStorageStack` | S3 bucket (PDFs + excerpts), DynamoDB tables (5), S3 Vectors bucket |
| `PolicyDiffComputeStack` | All Lambda functions, Step Functions workflow, EventBridge rules |
| `PolicyDiffApiStack` | API Gateway HTTP API v2, routes, Auth0 JWT authorizer |

---

## 7. Wiping Data (Fresh Start)

```bash
# Delete all DynamoDB items and S3 objects
aws dynamodb scan --table-name PolicyDocuments --region us-east-1 \
  --query 'Items[*].policyDocId.S' --output text | \
  xargs -I{} aws dynamodb delete-item --table-name PolicyDocuments \
  --key '{"policyDocId":{"S":"{}"}}'

# Empty S3 bucket
aws s3 rm s3://policydiff-docs-us-east-1 --recursive

# Clear S3 Vectors index
aws s3vectors delete-vectors --vector-bucket-name policydiff-vectors-us-east-1 \
  --index-name policy-criteria-index --all
```

---

## 8. Troubleshooting

**CloudFormation rollback**
```bash
aws cloudformation describe-stack-events \
  --stack-name PolicyDiffComputeStack \
  --query 'StackEvents[?ResourceStatus==`CREATE_FAILED`]'
```

**Lambda errors**
```bash
aws logs tail /aws/lambda/PolicyDiffComputeStack-BedrockExtractLambda --follow --region us-east-1
```

**Step Functions execution failed**
```bash
aws stepfunctions list-executions \
  --state-machine-arn arn:aws:states:us-east-1:ACCOUNT:stateMachine:PolicyDiffExtractionWorkflow \
  --status-filter FAILED
```

**Bedrock access denied**
- Verify Nova Pro and Titan Embeddings v2 are enabled in Bedrock Model Access console
- Check the inference profile ARN in `backend/.env` matches your account ID
