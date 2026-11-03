# devsecops-playground
creating this repo for my reference for SAST, SCA, DAST, container scanning, etc.


## Stage 1- Design and architecture
| _Before Developement - Identify security risks before code is written_


| What we implement| What we use |
| ---------------------------------------------------- | ---------------- |
|Threat modelling	|STRIDE |
|Architecture diagram	|Mermaid|
|Attack surface identification	|Manual analysis|
|Security requirements	|Security checklist|
|Trust boundaries|	Data flow diagram|
|API security requirements	|OWASP API Top 10|

Contents in (/Docs)[/docs]

## Stage 2  - Development and Local Security
| _Developer Workstation - Catch security issues before code reaches GitHub_


| Security Control | Tools | Files|
|-----|---- | --- |
| IDE Security Analysis| Semgrep|src/ |
| Secret Detection| Git Leaks |src/ |
| Pre-commit hooks	| pre-commit|.pre-commit-config.yaml |
|Dependency checks|	npm audit|package.json |
|Secure coding|	ESLint security rules|.eslintrc.json|
|Unit tests |	Jest|tests/|



## Stage 3 - PRs & Source Control Security
| _Github - Prevent insecure code from being merged into the main branch_

| Control | Tools |
|-----|---- | 
| SAST| CodeQL|
| Secret Scanning| Git Leaks / Secret Scanning|
| SCA	| depandabot|
|PR checks|	Github Actions|
|Branch Protection|	GIthub Repository Ruleset|
|Code Review|	CODEOWNERS |



## Stage 4 - Build and artifact security
| _CI build environment : Ensure the application and its build artifacts are secure_


|Security control |	Tool|
|-------|-------|
|Docker image scanning |	Trivy|
|IaC scanning |	Checkov|
|Dockerfile security |	Hadolint|
|SBOM generation |	Syft|
|Vulnerability scanning |	Trivy|
|Image signing |	Cosign|


## Stage 5 - Testing and Manual Security Validation
| _Staging Env: Find vulnerabilities that static analysis and build-time checks cannot identify_


|Security control	|Tool  
|----|-----|
|DAST	|OWASP ZAP|
|API security testing|	Postman / custom tests|
|API vulnerability scanning	|OWASP ZAP|
|Dynamic application testing|	Nuclei|
|Authentication testing|	Custom security tests|
|Authorization testing	|Custom security tests|



## Stage 6 - Release, Deployment, Operations
| _Prod & Runtime: Secure the deployment process and continuously monitor the application_


|Security control	|Implementation|
|-----|---|
Deployment approvals	|GitHub Environments|
|Artifact integrity	|Cosign|
|Deployment identity	|OIDC|
|Least privilege	|GitHub Actions permissions|
|Runtime monitoring	|Logs and alerts|
|Vulnerability monitoring	|Trivy / Dependabot|
|Secret management|	GitHub Secrets / external vault|
|Continuous assessment|	Scheduled scans|




### Running the App with docker

```bash
cd devsecops-playground
docker compose up --build
```

After its running
- App: http://localhost:3000
- Postgres: localhost:5432

How to register
```bash
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"username":"alice","password":"password123"}'
```


How to login
```bash
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"username":"alice","password":"password123"}'
```

