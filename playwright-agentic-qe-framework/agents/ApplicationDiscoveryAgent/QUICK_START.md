# Application Discovery Agent - Quick Usage Guide

## Overview

The Application Discovery Agent is the first phase of the Agentic QE Framework. It provides comprehensive analysis of applications to support all downstream testing agents.

## Quick Start

### Basic Discovery Workflow

```javascript
const ApplicationDiscoveryAgent = require('./agents/ApplicationDiscoveryAgent');

// Initialize agent
const apiKey = process.env.OPENAI_API_KEY;
const discoveryAgent = new ApplicationDiscoveryAgent(apiKey);

// Run full discovery
async function discoverApplication() {
  // Step 1: Tech Stack Discovery
  const techStack = await discoveryAgent.discoverTechStack(
    'Retirement Insurance Application',
    './codebase'
  );
  console.log('Tech Stack:', techStack);

  // Step 2: Architecture Analysis
  const architecture = await discoveryAgent.analyzeArchitecture(
    'Retirement Insurance Application',
    techStack
  );
  console.log('Architecture:', architecture);

  // Step 3: Component Mapping
  const components = await discoveryAgent.mapCodebaseComponents(
    './codebase',
    architecture
  );
  console.log('Components:', components);

  // Step 4: JIRA Mapping
  const jiraMapping = await discoveryAgent.createJiraMapping(
    components,
    'Business Requirements Document'
  );
  console.log('JIRA Mapping:', jiraMapping);

  // Step 5: Get Discovery Summary
  const summary = discoveryAgent.getDiscoverySummary();
  console.log('Discovery Summary:', summary);
}

discoverApplication();
```

## Common Use Cases

### Use Case 1: Discover Tech Stack Only

```javascript
const techStack = await discoveryAgent.discoverTechStack(
  'Insurance application with React UI, Node.js API, PostgreSQL DB',
  './src'
);

// Output example:
// {
//   frontend: { framework: "React 18", stateManagement: "Redux" },
//   backend: { runtime: "Node.js 18", framework: "Express" },
//   database: { type: "PostgreSQL 14", orm: "Sequelize" }
// }
```

### Use Case 2: Evaluate User Story Quality

```javascript
const story = {
  title: "User Registration with Email Verification",
  description: "Users can register with email verification",
  acceptanceCriteria: [
    "Valid email format accepted",
    "Verification email sent within 5 seconds",
    "User can verify via email link"
  ]
};

const investScore = discoveryAgent.evaluateINVESTCriteria(story);

console.log(`
INVEST Evaluation:
- Independent: ${investScore.independent.score}/100
- Negotiable: ${investScore.negotiable.score}/100
- Valuable: ${investScore.valuable.score}/100
- Estimable: ${investScore.estimable.score}/100
- Small: ${investScore.small.score}/100
- Testable: ${investScore.testable.score}/100
- Overall: ${investScore.investScore}/100 (${investScore.investScore >= 80 ? 'READY' : 'NEEDS WORK'})
`);
```

### Use Case 3: Evaluate Quality Goals

```javascript
const goal = {
  description: "Reduce test execution time from 45 to 30 minutes",
  target: "30 minutes",
  timeline: "Q3 2024",
  metrics: ["Execution time in minutes", "Tests per minute"]
};

const smartScore = discoveryAgent.evaluateSMARTGoals(goal);

console.log(`
SMART Evaluation:
- Specific: ${smartScore.specific.score}/100
- Measurable: ${smartScore.measurable.score}/100
- Achievable: ${smartScore.achievable.score}/100
- Relevant: ${smartScore.relevant.score}/100
- Time-bound: ${smartScore.timeBound.score}/100
- Overall: ${smartScore.smartScore}/100 (${smartScore.smartScore >= 80 ? 'READY' : 'NEEDS WORK'})

Recommendations:
${smartScore.recommendations.map(r => `- ${r}`).join('\n')}
`);
```

### Use Case 4: Get Downstream Context

```javascript
const downstreamContext = await discoveryAgent.contextualizeForDownstreamAgents();

// Use with RequirementAgent
const requirements = await requirementAgent.analyzeRequirements(
  appDescription,
  downstreamContext.forRequirementAgent
);

// Use with DesignAgent
const scenarios = await designAgent.designTestCases(
  requirements,
  downstreamContext.forDesignAgent
);

// Use with DataAgent
const testData = await dataAgent.prepareTestData(
  scenarios,
  downstreamContext.forDataAgent
);

// Use with ExecutionAgent
const results = await executionAgent.executeTests(
  testData,
  downstreamContext.forExecutionAgent
);
```

## Quality Scoring Reference

### INVEST Criteria

| Criterion | Description | Good Score |
|-----------|-------------|-----------|
| **I**ndependent | Can be completed independently | 85+ |
| **N**egotiable | Details open to discussion | 85+ |
| **V**aluable | Delivers business value | 85+ |
| **E**stimable | Can be estimated by team | 85+ |
| **S**mall | Fits in sprint | 85+ |
| **T**estable | Clear acceptance criteria | 85+ |

**Overall INVEST Score**: Average of 6 criteria
- 90-100: Ready for development ✅
- 80-89: Ready with minor refinements ✅
- 70-79: Address gaps before development
- Below 70: Significant rework needed

### SMART Criteria

| Criterion | Description | Good Score |
|-----------|-------------|-----------|
| **S**pecific | Clear definition of what | 85+ |
| **M**easurable | Quantifiable metrics | 85+ |
| **A**chievable | Realistic with resources | 85+ |
| **R**elevant | Aligns with objectives | 85+ |
| **T**ime-bound | Clear deadlines | 85+ |

**Overall SMART Score**: Average of 5 criteria
- 90-100: Ready for execution ✅
- 80-89: Ready with minor refinements ✅
- 70-79: Address gaps before execution
- Below 70: Significant rework needed

## Integration with Framework

### Phase 0: Application Discovery (ApplicationDiscoveryAgent)
```
Input: Application description, codebase path
Output: Tech stack, architecture, components, JIRA mapping, downstream context
```

### Phase 1: Requirements (RequirementAgent)
```
Input: Application description + Discovery context
Output: Requirements, test strategies
```

### Phase 2: Design (DesignAgent)
```
Input: Requirements + Architecture context
Output: BDD scenarios, test cases
```

### ... and so on for all 9 agents

## Output Examples

### Tech Stack Discovery Output

```json
{
  "frontend": {
    "framework": "React 18.2.0",
    "stateManagement": "Redux Toolkit 1.9.0",
    "uiLibrary": "Material-UI 5.0",
    "testingTools": ["Playwright", "Jest"]
  },
  "backend": {
    "runtime": "Node.js 18",
    "framework": "Express 4.18",
    "apiPattern": "REST",
    "authentication": "JWT with OAuth2"
  },
  "database": {
    "type": "PostgreSQL 14",
    "orm": "Sequelize 6.35",
    "replication": "Primary-Replica",
    "backupStrategy": "Daily incremental"
  },
  "infrastructure": {
    "containerization": "Docker",
    "orchestration": "Kubernetes",
    "cloud": "AWS (ECS/EKS)",
    "loadBalancer": "Application Load Balancer"
  }
}
```

### JIRA Mapping Output

```json
{
  "epic": {
    "key": "QE-TC",
    "summary": "Test Coverage - Insurance Application",
    "description": "Comprehensive test coverage for all application components"
  },
  "stories": [
    {
      "summary": "QA: User Registration & Authentication Test Coverage",
      "storyPoints": 13,
      "investScore": 83,
      "smartScore": 95,
      "componentLink": "USER_SERVICE"
    },
    {
      "summary": "QA: Policy Management Test Coverage",
      "storyPoints": 8,
      "investScore": 87,
      "smartScore": 92,
      "componentLink": "POLICY_SERVICE"
    }
  ]
}
```

## Best Practices

1. **Run Discovery First**
   - Always execute ApplicationDiscoveryAgent as Phase 0
   - Ensures all downstream agents have proper context

2. **Validate Scores**
   - INVEST Score ≥ 80 before creating JIRA stories
   - SMART Score ≥ 80 before committing to goals
   - Lower scores indicate need for refinement

3. **Update Regularly**
   - Re-run discovery quarterly for architecture changes
   - Update JIRA mappings when components change
   - Refresh context for major system updates

4. **Use Quality Gates**
   - Don't move to Phase 1 if discovery incomplete
   - Don't create JIRA stories with INVEST < 75
   - Don't commit to goals with SMART < 75

5. **Document Findings**
   - Save discovery reports for audit trail
   - Track tech stack changes over time
   - Maintain component dependency graph

## Troubleshooting

### Issue: Low INVEST Score

**Cause**: Story has dependencies, too large, or unclear requirements

**Solution**:
```javascript
// If story has multiple independent features, split it
const largeStory = {
  title: "User Management with Profile, Settings, and Notifications"
};
// Split into 3 stories:
const story1 = { title: "User Profile Management" };
const story2 = { title: "User Settings Configuration" };
const story3 = { title: "User Notification Preferences" };

// Re-evaluate each story
story1.invest = await discoveryAgent.evaluateINVESTCriteria(story1);
```

### Issue: Low SMART Score

**Cause**: Goal lacks specificity, measurement, or timeline

**Solution**:
```javascript
// Bad goal
const poorGoal = { description: "Improve test coverage" };

// Good goal
const goodGoal = {
  description: "Increase code coverage from 65% to 80%",
  target: "80%",
  timeline: "Q3 2024",
  metrics: ["Code coverage %", "Lines covered"]
};

const score = await discoveryAgent.evaluateSMARTGoals(goodGoal);
```

## Performance Tips

1. **Cache Discovery Results**
   ```javascript
   const cache = {};
   const discoveryData = cache['app-v1'] || 
     await discoveryAgent.discoverTechStack(...);
   cache['app-v1'] = discoveryData;
   ```

2. **Batch JIRA Mapping**
   - Process 100+ components in batches
   - Reduces API calls to JIRA

3. **Parallel Downstream Execution**
   ```javascript
   // After discovery, run downstream agents in parallel
   const [requirements, data, cicd] = await Promise.all([
     requirementAgent.analyze(..., downstreamContext),
     dataAgent.prepare(..., downstreamContext),
     cicdAgent.setup(..., downstreamContext)
   ]);
   ```

## Additional Resources

- **Full Documentation**: [ApplicationDiscoveryAgent README](../agents/ApplicationDiscoveryAgent/README.md)
- **Quality Scoring**: [INVEST & SMART Scoring Guide](../docs/quality_scoring/invest_smart_quality.md)
- **Architecture**: [Architecture Overview](../docs/Architecture-Agentic-QE.md)
- **Framework**: [FRAMEWORK_SUMMARY.md](../FRAMEWORK_SUMMARY.md)

## Next Steps

1. ✅ Run discovery on your application
2. ✅ Review INVEST/SMART scores
3. ✅ Create JIRA stories from mapping
4. ✅ Pass context to Phase 1 (RequirementAgent)
5. Continue through full STLC workflow

---

**Last Updated**: 2024
**Version**: 1.0.0
