# JIRA Xray Integration Guide

## Overview
JIRA Xray provides comprehensive test management capabilities integrated with JIRA. This guide covers the integration setup and usage within the agentic QE framework.

## Setup and Configuration

### Xray Installation
1. Install Xray for JIRA from Atlassian Marketplace
2. Configure project settings for test management
3. Set up test repositories and test sets

### API Configuration
```javascript
// config/jira-xray-config.js
module.exports = {
  jira: {
    baseUrl: 'https://your-instance.atlassian.net',
    username: process.env.JIRA_USERNAME,
    password: process.env.JIRA_PASSWORD,
    projectKey: 'PROJ'
  },
  xray: {
    clientId: process.env.XRAY_CLIENT_ID,
    clientSecret: process.env.XRAY_CLIENT_SECRET
  }
};
```

### Authentication Setup
```yaml
# GitHub Secrets Configuration
JIRA_USERNAME: your-jira-username
JIRA_PASSWORD: your-jira-password
XRAY_CLIENT_ID: xray-client-id
XRAY_CLIENT_SECRET: xray-client-secret
```

## Requirement Management

### Importing Requirements from Xray
```javascript
// scripts/import-requirements.js
const JIRAXrayIntegration = require('./jira-xray-integration');

async function importRequirements() {
  const xray = new JIRAXrayIntegration();
  const requirements = await xray.getRequirements();

  // Transform to framework format
  const transformed = requirements.map(req => ({
    id: req.key,
    title: req.summary,
    description: req.description,
    type: req.issuetype.name,
    status: req.status.name,
    labels: req.labels
  }));

  fs.writeFileSync('requirements.json', JSON.stringify(transformed, null, 2));
  console.log(`Imported ${transformed.length} requirements`);
}

importRequirements();
```

### Requirement Status Mapping
| JIRA Status | Framework Status | Description |
|-------------|------------------|-------------|
| Open | Draft | Initial requirement |
| In Progress | In Development | Being worked on |
| Resolved | Ready for Test | Implementation complete |
| Closed | Accepted | Fully tested and accepted |

## Test Case Management

### Creating Test Cases in Xray
```gherkin
# Example Xray test case
@REQ-PROJ-123
Feature: User Registration
  Scenario: Successful user registration
    Given the user is on registration page
    When user fills valid details
    Then registration is successful
```

### Test Execution and Reporting
```javascript
// scripts/update-xray-results.js
const JIRAXrayIntegration = require('./jira-xray-integration');

async function updateTestResults(cucumberResults) {
  const xray = new JIRAXrayIntegration();

  // Transform Cucumber results to Xray format
  const xrayResults = {
    testExecutionKey: 'PROJ-456',
    tests: cucumberResults.map(result => ({
      testKey: result.testKey,
      status: result.passed ? 'PASSED' : 'FAILED',
      duration: result.duration,
      defects: result.defects || []
    }))
  };

  await xray.updateTestResults(xrayResults);
  console.log('Test results updated in Xray');
}
```

## Test Plan Management

### Creating Test Plans
```javascript
// scripts/create-test-plan.js
async function createTestPlan(name, testCases) {
  const xray = new JIRAXrayIntegration();

  const testPlan = {
    fields: {
      project: { key: 'PROJ' },
      summary: name,
      description: 'Automated regression test plan',
      issuetype: { name: 'Test Plan' }
    }
  };

  const created = await xray.createTestPlan(testPlan);

  // Add test cases to plan
  await xray.addTestsToPlan(created.key, testCases);

  return created.key;
}
```

### Test Execution Tracking
- **Test Plans**: Group related test cases
- **Test Executions**: Track individual test runs
- **Test Environments**: Associate tests with environments
- **Test Sets**: Organize tests by category

## Coverage and Reporting

### Requirement Coverage Report
```javascript
// scripts/generate-coverage-report.js
async function generateCoverageReport() {
  const xray = new JIRAXrayIntegration();

  const coverage = await xray.getCoverageReport();

  const report = {
    totalRequirements: coverage.total,
    coveredRequirements: coverage.covered,
    coveragePercentage: (coverage.covered / coverage.total) * 100,
    uncoveredRequirements: coverage.uncovered.map(req => ({
      key: req.key,
      summary: req.summary,
      priority: req.priority
    }))
  };

  fs.writeFileSync('coverage-report.json', JSON.stringify(report, null, 2));
  console.log(`Coverage: ${report.coveragePercentage.toFixed(1)}%`);
}
```

### Automated Coverage Checks
```yaml
# .github/workflows/coverage-check.yml
name: Coverage Check
on: [push, pull_request]

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check Coverage
        run: |
          node scripts/generate-coverage-report.js
          coverage=$(jq '.coveragePercentage' coverage-report.json)
          if (( $(echo "$coverage < 80" | bc -l) )); then
            echo "Coverage too low: $coverage%"
            exit 1
          fi
```

## Defect Management

### Linking Defects to Tests
```javascript
// scripts/link-defect.js
async function linkDefect(testKey, defectKey) {
  const xray = new JIRAXrayIntegration();

  await xray.linkDefect(testKey, defectKey, {
    type: 'Defect',
    comment: 'Test failure linked to defect'
  });

  console.log(`Linked defect ${defectKey} to test ${testKey}`);
}
```

### Automated Defect Creation
```javascript
// scripts/create-defect.js
async function createDefect(testResult) {
  const xray = new JIRAXrayIntegration();

  const defect = {
    fields: {
      project: { key: 'PROJ' },
      summary: `Test Failure: ${testResult.scenario}`,
      description: testResult.error,
      issuetype: { name: 'Bug' },
      priority: { name: 'High' },
      labels: ['automated-test', 'regression-failure']
    }
  };

  const created = await xray.createIssue(defect);
  await xray.linkDefect(testResult.testKey, created.key);

  return created.key;
}
```

## CI/CD Integration

### Pipeline Integration
```yaml
# .github/workflows/xray-integration.yml
name: Xray Integration
on:
  workflow_run:
    workflows: ["CI/CD Pipeline"]
    types: [completed]

jobs:
  xray-update:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Download Test Results
        uses: actions/download-artifact@v3
        with:
          name: test-results
      - name: Update Xray
        run: |
          node scripts/update-xray-results.js
      - name: Generate Coverage Report
        run: |
          node scripts/generate-coverage-report.js
```

## Best Practices

### Test Organization
1. Use consistent naming conventions
2. Organize tests by component/feature
3. Maintain test case relationships
4. Regular cleanup of obsolete tests

### Automation Guidelines
1. Automate repetitive tasks
2. Use webhooks for real-time updates
3. Implement proper error handling
4. Monitor API rate limits

### Reporting Standards
1. Generate regular coverage reports
2. Track test execution trends
3. Monitor defect leakage
4. Provide stakeholder dashboards

## Troubleshooting

### Common Issues
- **Authentication Errors**: Verify API credentials
- **Rate Limiting**: Implement retry logic
- **Data Synchronization**: Regular sync schedules
- **Test Case Mapping**: Maintain clear mapping between systems

### Monitoring and Alerts
```yaml
# .github/workflows/xray-health-check.yml
name: Xray Health Check
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Health Check
        run: |
          node scripts/xray-health-check.js
      - name: Alert on Failure
        if: failure()
        run: |
          # Send alert to Slack/Teams
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -H 'Content-type: application/json' \
            -d '{"text":"Xray integration health check failed"}'
```