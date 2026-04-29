$root = "playwright-agentic-qe-framework"

New-Item -ItemType Directory -Force -Path $root, `
"$root/docs", `
"$root/agents/RequirementAgent", `
"$root/agents/DesignAgent", `
"$root/agents/DataAgent", `
"$root/agents/ExecutionAgent", `
"$root/agents/ReportingAgent", `
"$root/agents/DefectAgent", `
"$root/agents/CICDAgent", `
"$root/playwright/tests/smoke", `
"$root/playwright/tests/regression", `
"$root/playwright/tests/api", `
"$root/playwright/fixtures", `
"$root/playwright/helpers", `
"$root/playwright/reports", `
"$root/integrations/jira", `
"$root/integrations/xray", `
"$root/integrations/reporting", `
"$root/.github/workflows" | Out-Null

# Root README
@"
# Agentic Playwright QE Framework

Agent-based QE framework aligned to STLC with Jira, Xray, GitHub Actions, defect logging, and triage.
"@ | Set-Content "$root/README.md"

# --- docs ---
@"
# STLC Overview for Agentic Playwright QE

1. Requirement Analysis → RequirementAgent
2. Test Planning & Design → DesignAgent
3. Test Data Preparation → DataAgent
4. Test Execution → ExecutionAgent
5. Defect Logging & Triage → DefectAgent + Jira
6. Test Reporting & Closure → ReportingAgent
7. Continuous Quality in CI/CD → CICDAgent
"@ | Set-Content "$root/docs/STLC-Overview.md"

@"
# Architecture – Agentic QE

Each STLC phase is represented by an agent:
- RequirementAgent
- DesignAgent
- DataAgent
- ExecutionAgent
- ReportingAgent
- DefectAgent
- CICDAgent
"@ | Set-Content "$root/docs/Architecture-Agentic-QE.md"

@"
# Jira and Xray Integration

Covers:
- Requirement sync from Jira
- Xray Test/Test Execution management
- Result publishing
- Defect linking
"@ | Set-Content "$root/docs/Jira-Xray-Integration.md"

@"
# Defect Logging and Triage

DefectAgent:
- Decides when to log defects
- Uses Jira Bug/Task templates
- Groups failures by root cause
- Supports triage workflow and metrics
"@ | Set-Content "$root/docs/Defect-Logging-and-Triage.md"

@"
# Reporting Strategy

- Playwright HTML report
- Optional Allure
- Xray/Jira dashboards
- CI summary in GitHub Actions
"@ | Set-Content "$root/docs/Reporting-Strategy.md"

@"
# GitHub Actions CI/CD

Workflows:
- ci-playwright.yml (PR smoke)
- nightly-regression.yml (scheduled full run)
Includes quality gates and optional defect logging hook.
"@ | Set-Content "$root/docs/GitHub-Actions-CI-CD.md"

@"
# Conventions and Standards

- Naming, tags (@smoke, @regression, @critical)
- Folder layout
- Coding and review rules
"@ | Set-Content "$root/docs/Conventions-and-Standards.md"

# --- agents READMEs (short stubs you can extend) ---
@"
# RequirementAgent

Owns Requirement Analysis:
- Pulls Jira stories
- Extracts acceptance criteria
- Produces requirement catalog and test objectives
"@ | Set-Content "$root/agents/RequirementAgent/README.md"

@"
# DesignAgent

Owns Test Planning & Design:
- Scenarios and test cases
- Xray Test/Test Set definitions
- Mapping to Playwright tests
"@ | Set-Content "$root/agents/DesignAgent/README.md"

@"
# DataAgent

Owns Test Data:
- Static and dynamic data
- Env-specific data
- Fixtures contracts
"@ | Set-Content "$root/agents/DataAgent/README.md"

@"
# ExecutionAgent

Owns Test Execution:
- Local and CI runs
- Suite selection by tags
- Retry and parallelism strategy
"@ | Set-Content "$root/agents/ExecutionAgent/README.md"

@"
# ReportingAgent

Owns Reporting:
- Aggregates Playwright/Allure
- Publishes Xray executions
- Produces release readiness views
"@ | Set-Content "$root/agents/ReportingAgent/README.md"

@"
# DefectAgent

Owns Defect Logging & Triage:
- Analyzes failures
- Creates/updates Jira Bugs/Tasks
- Links tests, Xray, requirements, and defects
"@ | Set-Content "$root/agents/DefectAgent/README.md"

@"
# CICDAgent

Owns CI/CD Quality:
- GitHub Actions workflows
- Quality gates
- Branch policies and test enforcement
"@ | Set-Content "$root/agents/CICDAgent/README.md"

# --- integrations docs ---
@"
# Jira Integration

- Auth via API token
- Issue creation (Bug/Task)
- Linking to requirements and Xray entities
"@ | Set-Content "$root/integrations/jira/jira_integration.md"

@"
# Xray Integration

- Test/Test Set/Test Plan management
- Test Execution import
- Result mapping from Playwright
"@ | Set-Content "$root/integrations/xray/xray_integration.md"

@"
# Reporting Integration

- Custom reporter for Playwright
- Optional Allure configuration
"@ | Set-Content "$root/integrations/reporting/allure_config.md"

# --- GitHub Actions workflows (stubs) ---
@"
name: CI - Playwright

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        working-directory: ./playwright
        run: npm ci
      - name: Run smoke tests
        working-directory: ./playwright
        run: npx playwright test --grep @smoke
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright/playwright-report
"@ | Set-Content "$root/.github/workflows/ci-playwright.yml"

@"
name: Nightly Regression

on:
  schedule:
    - cron: '0 2 * * *'

jobs:
  regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        working-directory: ./playwright
        run: npm ci
      - name: Run full regression
        working-directory: ./playwright
        run: npx playwright test --grep @regression
"@ | Set-Content "$root/.github/workflows/nightly-regression.yml"

Write-Host "Scaffold created under $root"