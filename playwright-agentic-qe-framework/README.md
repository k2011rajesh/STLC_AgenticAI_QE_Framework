# Agentic Playwright QE Framework

Agent-based QE framework aligned to STLC with Jira, Xray, GitHub Actions, defect logging, and triage.

## Features

- **RequirementAgent**: Analyzes application requirements
- **DesignAgent**: Designs BDD Gherkin test scenarios
- **DataAgent**: Prepares test data
- **ExecutionAgent**: Executes tests (UI, API, DB)
- **DefectAgent**: Logs and triages defects
- **ReportingAgent**: Generates test reports
- **CICDAgent**: Manages CI/CD pipelines
- **RelearningAgent**: Learns from past executions to improve future tests

## Setup

1. Install dependencies: `npm install`
2. Set OpenAI API key: `export OPENAI_API_KEY=your_key` (optional, uses mocks if not set)
3. Run the framework: `node index.js`

## Project Structure

```
playwright/
├── insurance/
│   ├── features/
│   │   ├── insurance_application_ui.feature
│   │   ├── insurance_application_api.feature
│   │   └── insurance_application_db.feature
│   └── insurance_steps.js
├── healthcare/
│   ├── features/
│   │   ├── healthcare_ui.feature
│   │   ├── healthcare_api.feature
│   │   └── healthcare_db.feature
│   └── step_definitions/
│       └── healthcare_steps.js
├── banking/
│   ├── features/
│   │   ├── banking_ui.feature
│   │   ├── banking_api.feature
│   │   └── banking_db.feature
│   └── step_definitions/
│       └── banking_steps.js
├── features/
│   └── regression_suite.feature
├── helpers/
│   ├── UIHelper.js
│   ├── APIHelper.js
│   └── DatabaseHelper.js
├── fixtures/
│   ├── insuranceData.js
│   ├── healthcareData.js
│   └── bankingData.js
└── page_objects/
    ├── InsuranceApplicationPage.js
    └── HealthcareRegistrationPage.js
```

## Testing

- All tests: `npm test`
- Smoke tests: `npm run test:smoke`
- Regression tests: `npm run test:regression`
- Insurance: `npm run test:insurance` | Smoke: `npm run test:insurance:smoke` | Regression: `npm run test:insurance:regression`
- Healthcare: `npm run test:healthcare` | Smoke: `npm run test:healthcare:smoke` | Regression: `npm run test:healthcare:regression`
- Banking: `npm run test:banking` | Smoke: `npm run test:banking:smoke` | Regression: `npm run test:banking:regression`
- UI tests: `npm run test:ui`
- API tests: `npm run test:api`
- DB tests: `npm run test:db`

## Quality Standards

Each agent maintains a quality score (0-100) based on task success. Scores are updated after each execution.

See [Quality Scoring Guidelines](docs/quality_scoring/README.md) for detailed quality criteria across all SDLC phases and BDD implementation.

### BDD Coverage Reports
- [Master BDD Coverage Report](docs/quality_scoring/bdd_master_coverage.md) - Overall quality metrics and test inventory across all domains
- [Insurance BDD Coverage](docs/quality_scoring/insurance_bdd_coverage.md) - Insurance domain regression and smoke test coverage (Quality: 92/100)
- [Healthcare BDD Coverage](docs/quality_scoring/healthcare_bdd_coverage.md) - Healthcare domain HIPAA-compliant testing (Quality: 94/100)
- [Banking BDD Coverage](docs/quality_scoring/banking_bdd_coverage.md) - Banking domain regulatory compliance testing (Quality: 93/100)

## Traceability

Complete end-to-end traceability from requirements to deployment. See [Traceability Documentation](docs/traceability/README.md) for JIRA Xray integration, CI/CD pipeline traceability, and domain-specific matrices.

## Framework Documentation

- [Framework Implementation Summary](FRAMEWORK_SUMMARY.md) - Complete overview of all components, architecture, and capabilities
- [Quality Scoring Guidelines](docs/quality_scoring/README.md) - Detailed scoring criteria for all SDLC phases
- [Traceability Framework](docs/traceability/README.md) - Requirements-to-deployment lineage and JIRA integration
- [Architecture Overview](docs/Architecture-Agentic-QE.md) - Agentic system design and STLC implementation
- [STLC Overview](docs/STLC-Overview.md) - Software testing lifecycle phases and agent responsibilities
