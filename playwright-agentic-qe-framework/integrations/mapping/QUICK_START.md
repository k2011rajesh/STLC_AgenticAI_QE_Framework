# Discovery & Requirement to Jira Mapping - Quick Start Guide

## Quick Start

### 1. Prerequisites

Before you begin, ensure you have:
- ✅ Jira Cloud account with QED project access
- ✅ Jira API token (generate at https://id.atlassian.com/manage-profile/security/api-tokens)
- ✅ Node.js 14+ installed
- ✅ npm packages installed (axios)

### 2. Setup Environment

Create `.env` file in project root:

```bash
JIRA_URL=https://k2011rajesh.atlassian.net
JIRA_EMAIL=your-email@atlassian.net
JIRA_API_TOKEN=your-api-token-here
JIRA_PROJECT_KEY=QED
```

**How to get Jira API Token:**
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Copy the token
4. Paste in `.env` file

### 3. Basic Usage (5 minutes)

**Option A: Using the Example (Fastest)**

```bash
# Run the example with sample data
node integrations/mapping/discovery_requirement_jira_mapper_example.js
```

**Option B: Integrate with Your Agents**

```javascript
const DiscoveryRequirementJiraMapper = require('./integrations/mapping/discovery_requirement_jira_mapper');
const ApplicationDiscoveryAgent = require('./agents/ApplicationDiscoveryAgent');
const RequirementAgent = require('./agents/RequirementAgent');

// 1. Get discovery data
const discoveryAgent = new ApplicationDiscoveryAgent(apiKey);
const discoveryData = await discoveryAgent.mapCodebaseComponents(codebasePath, architecture);

// 2. Get requirements
const requirementAgent = new RequirementAgent(apiKey);
const requirements = await requirementAgent.analyzeRequirements(appDescription);

// 3. Map to Jira
const mapper = new DiscoveryRequirementJiraMapper({
  jiraUrl: 'https://k2011rajesh.atlassian.net',
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  projectKey: 'QED'
});

const result = await mapper.mapDiscoveryAndRequirementsToJira(
  { codebaseComponents: discoveryData },
  requirements,
  'My Application'
);

console.log(`Epic: ${result.epicKey}`);
console.log(`View: ${result.jiraUrl}`);
```

### 4. Verify Mapping in Jira

After running the mapper:

1. Open Jira: https://k2011rajesh.atlassian.net/jira/core/projects/QED/board
2. Look for epic: "QE: {Application Name}"
3. Click epic to see all mapped stories
4. Verify components and requirements are there

### 5. What Gets Created

#### Epic (1)
- **QE: {Application Name}**
  - Contains all component and requirement stories
  - Links to tech stack and architecture info

#### Stories
- **Component Stories**: One per discovered component (e.g., Authentication Service)
- **Requirement Stories**: One per requirement (e.g., User Registration)
- **Test Stories**: Infrastructure, API, UI, Database, Integration testing

#### Sub-tasks
- **Acceptance Criteria**: One sub-task per acceptance criterion
- **Format**: BDD Gherkin scenarios

#### Links
- Components linked to related requirements
- Stories linked to sub-tasks

### 6. Customization

**Edit Configuration** (`discovery_requirement_jira_config.js`):

```javascript
// Change project
projectKey: 'YOUR-PROJECT-KEY'

// Customize story names
epicNamingPattern: 'Custom: {appName}'

// Adjust quality scores
defaultInvestScore: 80
defaultSmartScore: 85

// Add custom labels
labels: {
  component: ['custom-label', 'my-tag']
}
```

### 7. Troubleshooting

**Error: "Cannot read property 'post' of undefined"**
- Ensure axios is installed: `npm install axios`

**Error: "401 Unauthorized"**
- Check JIRA_EMAIL and JIRA_API_TOKEN in .env
- Verify API token hasn't expired

**Error: "Project QED not found"**
- Verify project key is correct
- Check user has access to project

**No stories created**
- Check Jira error logs in console output
- Verify custom field IDs match your Jira instance
- Check issue type names (Epic, Story, Sub-task)

### 8. Integration with Framework

This mapper works with the Agentic QE Framework:

```
STLC Phase 0: ApplicationDiscoveryAgent
    ↓ (discovers tech stack, components, architecture)
    
STLC Phase 1: DiscoveryRequirementJiraMapper
    ↓ (maps to Jira QED project)
    
STLC Phase 1: RequirementAgent
    ↓ (analyzes requirements in context)
    
STLC Phase 2-8: Other Agents
    ↓ (use Jira as central hub for tracking)
```

### 9. File Structure

```
integrations/mapping/
├── discovery_requirement_jira_mapper.js          # Main mapper class
├── discovery_requirement_jira_mapper_example.js  # Usage example
├── discovery_requirement_jira_config.js          # Configuration
└── DISCOVERY_REQUIREMENT_JIRA_MAPPING.md         # Full documentation
```

### 10. Next Steps

1. ✅ Run the mapper to populate Jira
2. ✅ Review created epics and stories
3. ✅ Update story details in Jira as needed
4. ✅ Run DesignAgent to create BDD scenarios
5. ✅ Run DataAgent to create test data
6. ✅ Run ExecutionAgent to execute tests

---

## Advanced Usage

### Custom Discovery Data

```javascript
const customDiscoveryData = {
  codebaseComponents: [
    {
      id: 'my_service',
      name: 'My Service',
      type: 'service',
      description: 'My service description',
      riskLevel: 'High',
      investScore: 85
    }
  ]
};

const result = await mapper.mapDiscoveryAndRequirementsToJira(
  customDiscoveryData,
  requirements,
  'Custom App'
);
```

### Batch Processing Multiple Applications

```javascript
const apps = [
  { name: 'Banking App', discovery: bankingDiscovery, requirements: bankingReqs },
  { name: 'Insurance App', discovery: insuranceDiscovery, requirements: insuranceReqs }
];

for (const app of apps) {
  await mapper.mapDiscoveryAndRequirementsToJira(
    app.discovery,
    app.requirements,
    app.name
  );
}
```

### Generate Report Only

```javascript
const report = mapper.generateMappingReport('My Application');
console.log(JSON.stringify(report, null, 2));

// Access report URLs
console.log(report.documentation.boardUrl);
console.log(report.documentation.backlogUrl);
```

---

## Support & Resources

- **Jira URL**: https://k2011rajesh.atlassian.net
- **Project**: QED (Quality Engineering Dashboard)
- **Documentation**: See [DISCOVERY_REQUIREMENT_JIRA_MAPPING.md](./DISCOVERY_REQUIREMENT_JIRA_MAPPING.md)
- **Example Code**: See [discovery_requirement_jira_mapper_example.js](./discovery_requirement_jira_mapper_example.js)

---

## Key Features

✅ **Automated Mapping** - Components and requirements map automatically  
✅ **Quality Scoring** - INVEST and SMART scores on all items  
✅ **Linkage** - Automatic linking between related items  
✅ **Traceability** - Full traceability from discovery to test execution  
✅ **Customizable** - Easily adjust naming, labels, and scoring  
✅ **Error Handling** - Robust error handling with detailed messages  
✅ **Reporting** - Comprehensive mapping reports generated  

---

**Last Updated**: April 25, 2024  
**Framework**: Agentic QE Framework v1.0  
**Version**: 1.0.0
