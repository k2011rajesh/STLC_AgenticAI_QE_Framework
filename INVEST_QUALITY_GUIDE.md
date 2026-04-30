# INVEST Quality Scoring & Jira Integration Guide

## Overview

The INVEST Quality system provides:

✅ **INVEST Scoring Engine** - Scores user stories on 6 criteria (0-100)  
✅ **Jira Integration** - Creates/updates epics and stories with quality scores  
✅ **BDD Feature Generation** - Generates Gherkin feature files from scenarios  
✅ **Quality Reporting** - Comprehensive quality metrics and recommendations  

---

## What is INVEST?

INVEST is a mnemonic for quality criteria for user stories:

- **I**ndependent: Story doesn't depend on other stories
- **N**egotiable: Story can be discussed and refined with team
- **V**aluable: Story delivers clear value to user
- **E**stimable: Team can estimate the story
- **S**mall: Story can be completed in one sprint
- **T**estable: Story has clear acceptance criteria and can be tested

Each criterion is scored 0-100, with an overall score calculated as weighted average.

---

## Quality Score Interpretation

| Score | Rating | Status |
|-------|--------|--------|
| 85-100 | ⭐⭐⭐⭐⭐ Excellent | Ready for sprint |
| 75-84 | ⭐⭐⭐⭐ Good | Ready with minor refinement |
| 65-74 | ⭐⭐⭐ Fair | Needs refinement |
| 50-64 | ⭐⭐ Poor | Requires significant work |
| <50 | ⭐ Needs Work | Not ready for development |

---

## INVEST Scoring Criteria Details

### 1. Independent (0-100)

**Measures**: How much does this story depend on other stories?

**Scoring**:
- No dependencies: +40 points
- 1 dependency: +20 points
- 2-3 dependencies: +10 points
- 4+ dependencies: 0 points
- Clear scope: +10 points

**Improvements**:
- Break down story into smaller pieces
- Combine with dependent stories
- Document dependencies clearly

### 2. Negotiable (0-100)

**Measures**: Can this story be discussed and refined?

**Scoring**:
- Has 1+ acceptance criteria: +30 points
- Has 2+ acceptance criteria: +40 points
- Marked as negotiable: +15 points
- Not locked/frozen: +15 points

**Improvements**:
- Add GIVEN-WHEN-THEN acceptance criteria
- Add discussion notes
- Allow flexibility in implementation

### 3. Valuable (0-100)

**Measures**: Does this story deliver clear user value?

**Scoring**:
- Clear business value assigned: +20 points (scaled by value)
- User-facing functionality: +25 points
- Part of critical path: +20 points
- MVP feature: +15 points

**Improvements**:
- Clearly define user benefit
- Link to business goals
- Explain value to stakeholders

### 4. Estimable (0-100)

**Measures**: Can the team estimate this story?

**Scoring**:
- Story points assigned: +25 points
- 3+ acceptance criteria: +20 points
- Small/medium scope: +15 points

**Improvements**:
- Add more detail to story
- Break into smaller pieces
- Add specific acceptance criteria

### 5. Small (0-100)

**Measures**: Can this story be completed in one sprint?

**Scoring**:
- ≤5 story points: +40 points
- ≤8 story points: +20 points
- ≤13 story points: +10 points
- Small scope: +20 points
- Low complexity: +20 points

**Improvements**:
- Break into smaller stories
- Combine related small stories
- Reduce scope

### 6. Testable (0-100)

**Measures**: Can this story be tested?

**Scoring**:
- 1+ acceptance criteria: +25 points
- GIVEN-WHEN-THEN format: +25 points
- Test scenarios included: +15 points
- Automatable criteria: +5 points

**Improvements**:
- Add specific, measurable criteria
- Use GIVEN-WHEN-THEN format
- Include test scenarios

---

## Quick Start (5 Minutes)

### 1. Set Environment

```bash
export JIRA_URL="https://k2011rajesh.atlassian.net"
export JIRA_EMAIL="your-email@example.com"
export JIRA_API_TOKEN="your-api-token"
export JIRA_PROJECT_KEY="QED"
```

### 2. Create Requirements

```javascript
const requirements = [
  {
    id: 'FR-001',
    title: 'User Login',
    description: 'Users can login with email/password',
    type: 'Functional',
    acceptanceCriteria: [
      'GIVEN user has valid account WHEN user logs in THEN user is authenticated',
      'GIVEN user enters wrong password WHEN trying to login THEN error is shown'
    ],
    testScenarios: [
      { name: 'Successful login', ... },
      { name: 'Failed login', ... }
    ],
    businessValue: 10,
    complexity: 'low',
    dependencies: [],
    automatable: true,
    isUserFacing: true
  }
  // ... more requirements
];
```

### 3. Run INVEST Quality Workflow

```javascript
const InvestQualityOrchestrator = require('./integrations/quality/invest_quality_orchestrator');

const orchestrator = new InvestQualityOrchestrator({
  jiraUrl: process.env.JIRA_URL,
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  projectKey: process.env.JIRA_PROJECT_KEY
});

const result = await orchestrator.executeInvestQualityWorkflow(
  'My Application',
  requirements,
  discoveryData
);
```

### 4. Review Results

- ✅ Jira project updated with INVEST-scored stories
- ✅ Feature files generated in `./playwright/features/functional/`
- ✅ Quality report printed to console
- ✅ Scenario mapping saved as markdown

---

## Complete Requirements Structure

```javascript
{
  id: 'FR-001',                    // Unique ID
  title: 'Feature Name',           // Short title
  description: 'Full description', // Detailed description
  type: 'Functional',              // Functional or Non-Functional
  priority: 'High',                // High/Medium/Low
  
  // Acceptance Criteria (GIVEN-WHEN-THEN format)
  acceptanceCriteria: [
    'GIVEN ... WHEN ... THEN ...',
    'GIVEN ... WHEN ... THEN ...'
  ],
  
  // Test Scenarios
  testScenarios: [
    {
      name: 'Scenario name',
      given: 'precondition',
      when: 'action',
      then: 'expected outcome'
    }
  ],
  
  // INVEST Properties
  businessValue: 8,           // 1-10 scale
  complexity: 'low',          // low/medium/high
  dependencies: ['FR-002'],   // Related story IDs
  automatable: true,          // Can be automated?
  isUserFacing: true,         // User-visible feature?
  
  // Optional
  metric: 'Response time < 2s',  // For NFR
  type: 'Performance'            // For NFR specifics
}
```

---

## Output Structure

### Generated Jira Items

**Functional Epic**
```
Epic: {App} - Functional Requirements
├── Story: FR-001: User Login (INVEST: 82/100)
│   ├── Sub-task: AC: GIVEN user has valid account...
│   ├── Sub-task: Scenario: Successful login
│   └── Sub-task: Scenario: Failed login
├── Story: FR-002: View Dashboard (INVEST: 85/100)
└── ... more stories
```

**Non-Functional Epic**
```
Epic: {App} - Non-Functional Requirements
├── Story: NFR-001: System Performance (INVEST: 72/100)
├── Story: NFR-002: Security - PCI-DSS (INVEST: 75/100)
└── ... more stories
```

### Generated Feature Files

```
./playwright/features/functional/
├── qed-001_user_login.feature
├── qed-002_view_dashboard.feature
├── SCENARIO_MAPPING.md
└── ...
```

**Example Feature File**:
```gherkin
Feature: User Login
  # Jira Key: QED-001
  # INVEST Score: 82/100
  
  Users can login to the application
  
  Scenario: Successful login
    Given user has valid credentials
    When user submits login form
    Then user is authenticated
    And user is redirected to dashboard
    
  Scenario: Failed login
    Given user enters wrong password
    When user submits login form
    Then error message is displayed
    And user remains on login page
```

---

## INVEST Scoring Examples

### Example 1: Well-Written Story (Score: 88/100)

```
✅ Story: User Registration

Independent (95): No external dependencies
Negotiable (90): Clear acceptance criteria, can discuss
Valuable (90): Direct user value, MVP feature
Estimable (85): Well-defined scope, 5 story points
Small (90): Can complete in one sprint
Testable (95): GIVEN-WHEN-THEN criteria, automatable

Recommendation: ✅ READY FOR SPRINT
```

### Example 2: Poorly-Written Story (Score: 45/100)

```
❌ Story: System Improvement

Independent (30): Depends on 5 other stories
Negotiable (40): Vague acceptance criteria
Valuable (50): Unclear business value
Estimable (40): Hard to estimate, 21 story points
Small (20): Too large for one sprint
Testable (30): No clear test criteria

Recommendations:
- Break into 3-5 smaller stories
- Add GIVEN-WHEN-THEN acceptance criteria
- Clarify business value
- Reduce scope to fit one sprint
- Define specific test scenarios
```

---

## Command Reference

### Score a Single Requirement

```javascript
const engine = new InvestScoringEngine();

// Functional requirement
const score = engine.scoreFunctionalRequirement(requirement);
console.log(score.investScore);     // 82.5
console.log(score.rating);           // ⭐⭐⭐⭐ Good
console.log(score.recommendations);  // Improvements

// Non-functional requirement
const nfrScore = engine.scoreNonFunctionalRequirement(requirement);
```

### Execute Full Workflow

```javascript
const orchestrator = new InvestQualityOrchestrator(config);

const result = await orchestrator.executeInvestQualityWorkflow(
  'Application Name',
  requirements,
  discoveryData
);

// Access results
result.report.summary.averageInvestScore;  // 82.3
result.state.storiesCreated;               // 15
result.state.featuresGenerated;            // 12
```

### Manual Jira Update

```javascript
const updater = new JiraInvestUpdater(config);

const result = await updater.executeInvestUpdate(
  requirements,
  discoveryData,
  'Application Name'
);

// Access created items
result.functionalStories;      // Array of created stories
result.nonFunctionalStories;   // Array of created NFR stories
result.state.epicsCreated;     // 2
```

---

## Best Practices

### 1. Comprehensive Requirements

✅ Include all acceptance criteria  
✅ Provide specific test scenarios  
✅ Define business value  
✅ List dependencies  

❌ Don't leave fields empty  
❌ Don't mix multiple features in one story  
❌ Don't forget edge cases  

### 2. Clear Acceptance Criteria

✅ Use GIVEN-WHEN-THEN format  
✅ Make each criterion independent  
✅ Include both positive and negative cases  
✅ Specify exact test data  

❌ Don't use vague language  
❌ Don't combine multiple criteria  
❌ Don't forget edge cases  

### 3. Realistic Scoring

✅ Consider team capacity  
✅ Account for complexity  
✅ Include dependencies  
✅ Validate with team  

❌ Don't overestimate capability  
❌ Don't ignore hidden complexity  
❌ Don't forget integration work  

### 4. Feature File Organization

✅ One feature file per story  
✅ Use clear scenario names  
✅ Include test data  
✅ Reference Jira keys  

❌ Don't combine multiple features  
❌ Don't use vague scenario names  
❌ Don't forget step definitions  

---

## Troubleshooting

### Issue: Low INVEST Scores (< 50)

**Cause**: Story lacks detail or is too large

**Solutions**:
1. Break into smaller stories
2. Add acceptance criteria
3. Clarify business value
4. Reduce scope
5. List dependencies

### Issue: Jira Connection Error

**Cause**: Invalid credentials or project doesn't exist

**Solutions**:
1. Verify JIRA_EMAIL and JIRA_API_TOKEN
2. Check project exists (QED)
3. Verify user has project access
4. Check API token hasn't expired
5. Regenerate API token

### Issue: Feature Files Not Generated

**Cause**: No test scenarios provided

**Solutions**:
1. Add testScenarios to requirements
2. Use GIVEN-WHEN-THEN format
3. Provide specific scenario steps
4. Check file permissions
5. Verify output directory exists

### Issue: Stories Not Created

**Cause**: Missing required fields

**Solutions**:
1. Add title for each requirement
2. Provide description
3. Specify requirement type
4. Add acceptance criteria
5. Check field names are correct

---

## Integration Points

### With ApplicationDiscoveryAgent

```javascript
const discovery = await discoveryAgent.performTask(config);
const requirements = mapDiscoveryToRequirements(discovery);

// Then run INVEST workflow
const result = await orchestrator.executeInvestQualityWorkflow(
  discovery.applicationName,
  requirements,
  discovery
);
```

### With UseCaseAnalysisAgent

```javascript
const useCases = await useCaseAgent.extractUseCases(...);
const requirements = convertUseCasesToRequirements(useCases);

// Then run INVEST workflow
const result = await orchestrator.executeInvestQualityWorkflow(
  applicationName,
  requirements,
  discoveryData
);
```

### With ExecutionAgent

```javascript
// After INVEST quality workflow creates stories
const stories = result.jiraResult.functionalStories;

// Use feature files for test automation
const features = fs.readdirSync('./playwright/features/functional/');

// Generate step definitions
for (const feature of features) {
  await executionAgent.generateStepDefinitions(feature);
}
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `integrations/quality/invest_scoring_engine.js` | INVEST scoring logic |
| `integrations/quality/jira_invest_updater.js` | Jira integration and updates |
| `integrations/quality/invest_quality_orchestrator.js` | Main orchestrator |
| `invest_quality_example.js` | Working example |
| `INVEST_QUALITY_GUIDE.md` | This guide |

---

## Sample Output

```
================================================================================
  🎯 INVEST QUALITY & BDD ORCHESTRATOR
================================================================================

📋 Step 1: Parsing and validating requirements...
   ✅ Parsed 8 requirements

📊 Step 2: Scoring requirements with INVEST criteria...
   📊 Average INVEST Score: 78.45/100
   ⭐⭐⭐⭐⭐ Excellent (85-100): 3
   ⭐⭐⭐⭐ Good (75-84): 4
   ⭐⭐⭐ Fair (65-74): 1
   ⭐⭐ Poor (<65): 0

🔄 Step 3: Connecting to Jira and creating/updating items...
   ✅ Created Functional Epic: QED-50
   ✅ Created Story: QED-51 - INVEST: 85.2
   ✅ Created Story: QED-52 - INVEST: 82.1
   ...
   ✅ Generated Feature: qed_051_user_login.feature
   ✅ Generated Scenario Mapping: SCENARIO_MAPPING.md

================================================================================
  ✅ EXECUTION SUMMARY
================================================================================

📱 Application: InvestSmart Banking
📅 Timestamp: 2026-04-26T10:30:00Z

📊 Quality Metrics:
   • Total Stories: 8
   • Functional Stories: 5
   • Non-Functional Stories: 3
   • Average INVEST Score: 78.45/100
   • Functional Average: 82.30/100
   • NFR Average: 72.15/100

📦 Jira Artifacts:
   • Epics Created: 2
   • Stories Created: 8
   • Features Generated: 5
   • Scenarios Mapped: 15

================================================================================
```

---

## Version

- **Version**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: April 26, 2026
- **Framework**: Agentic QE Framework v1.0+

---

**Ready to improve your story quality?**

```bash
node invest_quality_example.js
```

Then review scores in Jira QED project! 🚀
