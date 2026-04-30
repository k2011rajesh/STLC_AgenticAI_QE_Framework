# Discovery & Requirement to Jira Mapping

## Overview

This module provides comprehensive integration between the `ApplicationDiscoveryAgent` and `RequirementAgent` with Jira, enabling automated mapping of application discovery data and requirements to a Jira project structure.

**Target Jira Project**: QED (Quality Engineering Dashboard)  
**URL**: https://k2011rajesh.atlassian.net/jira/core/projects/QED/board

## Features

✅ **Discovery Component Mapping** - Maps all discovered application components to Jira Stories  
✅ **Requirement Mapping** - Maps requirements to Jira Stories with acceptance criteria  
✅ **Acceptance Criteria Tracking** - Creates sub-tasks for each acceptance criterion  
✅ **Component-to-Requirement Linking** - Links related components and requirements  
✅ **Test Execution Stories** - Creates stories for test infrastructure and test execution  
✅ **Quality Scoring** - Applies INVEST and SMART scoring to all mapped items  
✅ **Comprehensive Reporting** - Generates detailed mapping reports with metrics  

## Architecture

```
ApplicationDiscoveryAgent (Tech stack, Components, Architecture)
         ↓
DiscoveryRequirementJiraMapper (Normalization & Mapping)
         ↓
RequirementAgent (Requirements, Acceptance Criteria)
         ↓
JiraCloudIntegration (REST API Calls)
         ↓
Jira Project (QED) - Epics, Stories, Sub-tasks, Links
```

## Installation

### 1. Prerequisites

- Node.js 14+
- npm or yarn
- Jira Cloud account with API token
- Access to the QED project

### 2. Environment Setup

Create a `.env` file in the project root:

```bash
JIRA_URL=https://k2011rajesh.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=QED
```

### 3. Install Dependencies

```bash
npm install axios
```

## Usage

### Basic Usage

```javascript
const DiscoveryRequirementJiraMapper = require('./integrations/mapping/discovery_requirement_jira_mapper');
const ApplicationDiscoveryAgent = require('./agents/ApplicationDiscoveryAgent');
const RequirementAgent = require('./agents/RequirementAgent');

// Initialize agents
const discoveryAgent = new ApplicationDiscoveryAgent(apiKey);
const requirementAgent = new RequirementAgent(apiKey);

// Step 1: Run discovery
const techStack = await discoveryAgent.discoverTechStack(appDescription, codebasePath);
const architecture = await discoveryAgent.analyzeArchitecture(appDescription, techStack);
const components = await discoveryAgent.mapCodebaseComponents(codebasePath, architecture);

// Step 2: Analyze requirements
const requirements = await requirementAgent.analyzeRequirements(appDescription);

// Step 3: Map to Jira
const mapper = new DiscoveryRequirementJiraMapper({
  jiraUrl: 'https://k2011rajesh.atlassian.net',
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  projectKey: 'QED'
});

const result = await mapper.mapDiscoveryAndRequirementsToJira(
  { codebaseComponents: components, techStack, architecture },
  requirements,
  'My Application'
);

console.log(`Epic created: ${result.epicKey}`);
console.log(`View in Jira: ${result.jiraUrl}`);
```

### Complete Example

```javascript
const DiscoveryRequirementJiraMapper = require('./integrations/mapping/discovery_requirement_jira_mapper');

// Example discovery data
const discoveryData = {
  techStack: {
    frontend: 'React 18.2',
    backend: 'Node.js/Express',
    database: 'PostgreSQL',
    testing: 'Playwright'
  },
  codebaseComponents: [
    {
      id: 'auth_service',
      name: 'Authentication Service',
      type: 'service',
      description: 'Handles user authentication and JWT tokens',
      riskLevel: 'High',
      testCoveragePriority: 'Critical'
    },
    {
      id: 'payment_service',
      name: 'Payment Service',
      type: 'service',
      description: 'Processes payments and transactions',
      riskLevel: 'Critical',
      testCoveragePriority: 'Critical'
    },
    {
      id: 'user_controller',
      name: 'User Controller',
      type: 'controller',
      description: 'HTTP endpoints for user management',
      riskLevel: 'Medium',
      testCoveragePriority: 'High'
    }
  ]
};

// Example requirements
const requirements = [
  {
    id: 'REQ-001',
    title: 'User Authentication',
    description: 'System should authenticate users with email and password',
    acceptanceCriteria: [
      'Users can login with valid credentials',
      'Users cannot login with invalid credentials',
      'Session tokens are created on successful login',
      'Sessions expire after 24 hours'
    ],
    priority: 'Critical',
    riskLevel: 'High'
  },
  {
    id: 'REQ-002',
    title: 'Payment Processing',
    description: 'System should process payments securely',
    acceptanceCriteria: [
      'Payment requests are validated',
      'Payments are processed via payment gateway',
      'Transaction records are created',
      'Payment confirmations are sent to users'
    ],
    priority: 'Critical',
    riskLevel: 'Critical'
  },
  {
    id: 'REQ-003',
    title: 'User Profile Management',
    description: 'Users should manage their profiles',
    acceptanceCriteria: [
      'Users can view their profile',
      'Users can update their information',
      'Profile changes are saved to database'
    ],
    priority: 'High',
    riskLevel: 'Medium'
  }
];

// Map to Jira
async function mapToJira() {
  const mapper = new DiscoveryRequirementJiraMapper({
    jiraUrl: 'https://k2011rajesh.atlassian.net',
    email: process.env.JIRA_EMAIL,
    apiToken: process.env.JIRA_API_TOKEN,
    projectKey: 'QED'
  });

  try {
    const result = await mapper.mapDiscoveryAndRequirementsToJira(
      discoveryData,
      requirements,
      'Banking Application'
    );

    mapper.printSummary();
    
    console.log('\n📊 Mapping Report:');
    console.log(JSON.stringify(result.report, null, 2));
    
    return result;
  } catch (error) {
    console.error('Mapping failed:', error);
  }
}

// Execute
mapToJira();
```

## Jira Structure Created

### Epic
- **Name**: QE: {Application Name}
- **Description**: Comprehensive test coverage epic containing all discovery and requirement mappings
- **Labels**: test-coverage, e2e, discovered-architecture

### Stories (Components)
- **Name**: QA: {Component Name} Test Coverage
- **Description**: Component information with risk level, dependencies, test priorities
- **Parent**: Main Epic
- **Labels**: component-test, risk-{level}, quality-mapped, invest-ready
- **Sub-tasks**: Acceptance criteria and BDD scenarios

### Stories (Requirements)
- **Name**: Requirement: {Requirement Title}
- **Description**: Requirement details with related components
- **Parent**: Main Epic
- **Links**: Connects to related component stories
- **Sub-tasks**: Acceptance criteria as BDD scenarios

### Stories (Test Execution)
- **Test Infrastructure Setup**
- **API Test Suite**
- **UI Test Suite**
- **Database Test Suite**
- **Integration Test Suite**

### Sub-tasks
- **Acceptance Criteria**: One sub-task per acceptance criterion
- **Format**: BDD Gherkin scenarios
- **Labels**: acceptance-criteria, bdd-scenario, e2e-test

### Links
- **Component → Requirement**: 'relates to'
- **Story → Sub-task**: parent-child relationship
- **Component → Component**: 'depends on'

## Configuration

Edit `discovery_requirement_jira_config.js` to customize:

```javascript
// Project configuration
projectKey: 'QED'
projectName: 'Quality Engineering Dashboard'

// Story naming patterns
epicNamingPattern: 'QE: {appName} - {area}'
componentStoryNamingPattern: 'QA: {componentName} Test Coverage'

// Quality scoring defaults
defaultInvestScore: 85
defaultSmartScore: 90

// Labels and tags
labels: {
  component: ['component-test', 'quality-mapped'],
  requirement: ['requirement-mapping', 'acceptance-criteria'],
  testExecution: ['test-execution', 'qa-ready']
}
```

## Quality Metrics

### INVEST Scoring (0-100)
- **Independent**: Story can be completed independently
- **Negotiable**: Details are open to discussion
- **Valuable**: Delivers business value
- **Estimable**: Team can estimate the effort
- **Small**: Fits within a sprint
- **Testable**: Clear acceptance criteria exist

### SMART Scoring (0-100)
- **Specific**: Goal clearly defined
- **Measurable**: Quantifiable metrics
- **Achievable**: Realistic with available resources
- **Relevant**: Aligns with project objectives
- **Time-bound**: Clear deadlines

## Mapping Report

Generated report includes:

```json
{
  "applicationName": "Banking Application",
  "timestamp": "2024-04-25T10:30:00Z",
  "epicKey": "QED-123",
  "summary": {
    "totalComponents": 15,
    "mappedComponents": 15,
    "componentMappingRate": "100%",
    "totalRequirements": 25,
    "mappedRequirements": 25,
    "requirementMappingRate": "100%",
    "acceptanceCriteriaMapped": 75,
    "totalStoriesCreated": 55
  },
  "stories": [
    {
      "storyKey": "QED-124",
      "componentName": "Authentication Service",
      "type": "component"
    }
  ],
  "jiraUrl": "https://k2011rajesh.atlassian.net/jira/core/projects/QED/board"
}
```

## Error Handling

The mapper includes robust error handling:

```javascript
try {
  const result = await mapper.mapDiscoveryAndRequirementsToJira(...);
} catch (error) {
  console.error('Mapping failed:', error.message);
  // Error details included in response
}
```

## Troubleshooting

### Authentication Issues
- Verify JIRA_EMAIL and JIRA_API_TOKEN in `.env`
- Check API token has correct permissions
- Verify Jira URL is correct

### Project Not Found
- Verify project key 'QED' exists
- Check user has access to the project
- Verify URL: https://k2011rajesh.atlassian.net

### Stories Not Created
- Check field IDs in custom fields configuration
- Verify issue type names match Jira instance
- Review error logs for field validation errors

## API Reference

### DiscoveryRequirementJiraMapper

#### Constructor
```javascript
new DiscoveryRequirementJiraMapper({
  jiraUrl: string,      // Jira instance URL
  email: string,        // Jira user email
  apiToken: string,     // Jira API token
  projectKey: string    // Jira project key
})
```

#### Methods

**mapDiscoveryAndRequirementsToJira(discoveryData, requirements, applicationName)**
- Maps all discovery components and requirements to Jira
- Returns: `{ success, epicKey, mappingState, report, jiraUrl }`

**generateMappingReport(applicationName)**
- Generates comprehensive mapping report
- Returns: Report object with metrics and URLs

**printSummary()**
- Prints formatted mapping summary to console

## Integration with Framework

This mapper integrates seamlessly with the Agentic QE Framework STLC:

```
Phase 0: ApplicationDiscoveryAgent
   ↓ (discovery data)
Phase 1: DiscoveryRequirementJiraMapper
   ↓ (creates Jira structure)
Phase 2: RequirementAgent
   ↓ (analyzes requirements)
Phase 3+: Downstream Agents
   ↓ (use Jira tracking)
```

## Next Steps

1. Set up Jira API token with appropriate permissions
2. Configure environment variables
3. Run discovery agent to collect application data
4. Run mapper to populate Jira project
5. Review created stories and update as needed
6. Begin test design with DesignAgent

## Support

For issues or questions:
1. Check error logs for detailed messages
2. Verify Jira configuration in config file
3. Review Jira instance permissions
4. Check API token expiration

## Version

- **Current**: 1.0.0
- **Last Updated**: April 25, 2024
- **Framework**: Agentic QE Framework STLC Phase 0-1 Integration
