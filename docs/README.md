# PolicyDiff

**Hackathon Track:** Anton RX — Medical Benefit Drug Policy Tracker

PolicyDiff is a purpose-built medical benefit drug policy intelligence engine. It ingests payer PDFs, extracts structured criteria via Textract + Bedrock, and enables cross-payer comparison, temporal diffs, discordance detection, and approval path generation.

## Team Ownership

| Member | Role | Owns |
|---|---|---|
| Atharva (AZ) | Backend + Cloud Infrastructure | CDK stacks, UploadUrlLambda, PolicyCrudLambda |
| Mohith | AI/ML Core | QueryLambda, CompareLambda, DiffLambda, DiscordanceLambda, ApprovalPathLambda, SimulatorLambda |
| Om | Frontend Lead | Dashboard, ComparisonMatrix, DiffFeed, ApprovalPathGenerator |
| Dominic | Frontend Support | PolicyUpload, PolicyList, PolicyDetail, QueryInterface, DiscordanceView |

## Prerequisites

- Node 18+
- Python 3.12
- AWS CLI configured (`aws sts get-caller-identity` should succeed)
- CDK bootstrapped in your target account/region

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cdk bootstrap                    # first time only
cdk synth                        # validate + run cdk-nag
cdk deploy --all
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local       # fill in VITE_API_BASE_URL from CDK output
npm run dev
```

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `frontend/.env.local` | API Gateway base URL (from CDK output) |
| `CORS_ORIGIN` | Lambda env (set in CDK) | Allowed frontend origin |
| `POLICY_BUCKET_NAME` | Lambda env (set in CDK) | S3 bucket for policy PDFs |
| `POLICY_DOCUMENTS_TABLE` | Lambda env (set in CDK) | DynamoDB table name |
| `DRUG_POLICY_CRITERIA_TABLE` | Lambda env (set in CDK) | DynamoDB table name |
| `POLICY_DIFFS_TABLE` | Lambda env (set in CDK) | DynamoDB table name |
| `QUERY_LOG_TABLE` | Lambda env (set in CDK) | DynamoDB table name |
| `APPROVAL_PATHS_TABLE` | Lambda env (set in CDK) | DynamoDB table name |
| `AI_SECRET_ARN` | Lambda env (set in CDK) | Secrets Manager ARN for Bedrock/Gemini keys |

## Architecture

See [architectureDeepDive.md](./architectureDeepDive.md) for full architecture details.

## API Reference

See [APIDoc.md](./APIDoc.md) for all 21 endpoints.

## Deployment

See [deploymentGuide.md](./deploymentGuide.md) for step-by-step deployment instructions.
