# ⚡ INVEST Quality Quick Start (5 Minutes)

## Step 1: Set Environment (1 min)

```bash
export JIRA_URL="https://k2011rajesh.atlassian.net"
export JIRA_EMAIL="your-email@example.com"
export JIRA_API_TOKEN="your-api-token"
export JIRA_PROJECT_KEY="QED"
export OPENAI_API_KEY="your-openai-key"
```

## Step 2: Run Example (2 min)

```bash
cd playwright-agentic-qe-framework
node invest_quality_example.js
```

## Step 3: Review in Jira (1 min)

```
https://k2011rajesh.atlassian.net/jira/core/projects/QED/board
```

Look for:
- ✅ New "Functional Requirements" epic
- ✅ New "Non-Functional Requirements" epic
- ✅ 8 stories with INVEST scores
- ✅ Stories labeled with quality rating (e.g., `invest-good`, `invest-85`)

## Step 4: Check Generated Features (1 min)

```bash
ls -la ./playwright/features/functional/
cat ./playwright/features/functional/SCENARIO_MAPPING.md
```

---

## 🎯 INVEST Score Meaning

| Score | Rating | Meaning |
|-------|--------|---------|
| 85-100 | ⭐⭐⭐⭐⭐ Excellent | Ready for sprint |
| 75-84 | ⭐⭐⭐⭐ Good | Minor refinement |
| 65-74 | ⭐⭐⭐ Fair | Needs refinement |
| 50-64 | ⭐⭐ Poor | Significant work |
| <50 | ⭐ Needs Work | Not ready |

---

## 💡 Use Your Own Requirements

```javascript
// invest_quality_example.js or custom file

const InvestQualityOrchestrator = require(
  './integrations/quality/invest_quality_orchestrator'
);

// Define your requirements
const MY_REQUIREMENTS = [
  {
    id: 'FR-001',
    title: 'Your Feature',
    description: 'Full description',
    type: 'Functional',
    acceptanceCriteria: [
      'GIVEN ... WHEN ... THEN ...',
      'GIVEN ... WHEN ... THEN ...'
    ],
    testScenarios: [
      {
        name: 'Scenario 1',
        given: 'precondition',
        when: 'action',
        then: 'result'
      }
    ],
    businessValue: 9,
    complexity: 'low',
    dependencies: [],
    automatable: true,
    isUserFacing: true
  }
  // ... more requirements
];

// Run workflow
const orchestrator = new InvestQualityOrchestrator({
  jiraUrl: process.env.JIRA_URL,
  email: process.env.JIRA_EMAIL,
  apiToken: process.env.JIRA_API_TOKEN,
  projectKey: process.env.JIRA_PROJECT_KEY
});

const result = await orchestrator.executeInvestQualityWorkflow(
  'My Application',
  MY_REQUIREMENTS,
  {}  // discovery data (optional)
);
```

---

## 📊 What You'll See

### Console Output

```
🎯 INVEST QUALITY & BDD ORCHESTRATOR
================================================================================

📋 Step 1: Parsing and validating requirements...
   ✅ Parsed 8 requirements

📊 Step 2: Scoring requirements with INVEST criteria...
   📊 Average INVEST Score: 78.45/100
   ⭐⭐⭐⭐⭐ Excellent (85-100): 3
   ⭐⭐⭐⭐ Good (75-84): 4
   ⭐⭐⭐ Fair (65-74): 1

🔄 Step 3: Connecting to Jira and creating/updating items...
   ✅ Created Functional Epic: QED-50
   ✅ Created Story: QED-51 - INVEST: 85.2
   ...
```

### Jira Board

```
Epic: InvestSmart Banking - Functional Requirements
├── Story: FR-001: User Registration (INVEST: 85/100)
│   Labels: functional, invest-excellent, invest-85
│   Description: Includes INVEST breakdown + recommendations
│   ├── Sub-task: AC: GIVEN user is on registration...
│   └── Sub-task: Scenario: Successful Registration
├── Story: FR-002: User Login (INVEST: 82/100)
│   Labels: functional, invest-good, invest-82
│   ...
└── Story: FR-005: Transaction History (INVEST: 78/100)
    Labels: functional, invest-good, invest-78
    ...

Epic: InvestSmart Banking - Non-Functional Requirements
├── Story: NFR-001: System Performance (INVEST: 72/100)
├── Story: NFR-002: Security (INVEST: 75/100)
└── Story: NFR-003: Availability (INVEST: 70/100)
```

### Generated Files

```
./playwright/features/functional/
├── qed_001_user_registration.feature
├── qed_002_user_login.feature
├── qed_003_view_account_balance.feature
├── qed_004_fund_transfer.feature
├── qed_005_transaction_history.feature
└── SCENARIO_MAPPING.md
```

Example `.feature` file:
```gherkin
Feature: User Registration
  # Jira Key: QED-001
  # INVEST Score: 85.2/100
  
  Users should be able to register with email and password
  
  Scenario: Successful Registration
    Given user is on registration page
    When user enters valid email and password
    Then account is created
    And confirmation email is sent
```

---

## ❓ FAQ

### Q: What if my INVEST score is low (< 65)?

**A**: The system will provide specific recommendations:
- Break into smaller stories
- Add GIVEN-WHEN-THEN acceptance criteria
- Clarify business value
- Reduce scope
- List dependencies

Check the story description in Jira for recommendations!

### Q: Can I score existing stories?

**A**: Yes! Use the scoring engine directly:

```javascript
const engine = new InvestScoringEngine();
const score = engine.scoreFunctionalRequirement(existingStory);
console.log(score.investScore);
```

### Q: How do I improve low-scoring stories?

**A**: Follow recommendations in the story description:

1. **Independent**: Reduce dependencies, combine with related stories
2. **Negotiable**: Add acceptance criteria in GIVEN-WHEN-THEN format
3. **Valuable**: Clearly define user benefit, link to business goals
4. **Estimable**: Add more detail, define scope clearly
5. **Small**: Break into smaller stories or increase sprint capacity
6. **Testable**: Add specific, measurable acceptance criteria

### Q: Where are the Feature files?

**A**: In `./playwright/features/functional/`

Each story gets a `.feature` file with scenarios in Gherkin format.

### Q: Can I integrate with test automation?

**A**: Yes! Use generated feature files with:
- Playwright + Cucumber
- Jest + Gherkin
- Any BDD framework

See `INVEST_QUALITY_GUIDE.md` for integration examples.

### Q: Do I need to manually create Jira stories?

**A**: No! The orchestrator creates everything:
- ✅ Epics
- ✅ Stories
- ✅ Sub-tasks for acceptance criteria
- ✅ Sub-tasks for scenarios
- ✅ Quality scores and labels

---

## 🎯 Sample Scores Explained

### Story 1: User Login (INVEST: 85.2/100) ✅

```
Independent: 95   ✅ No dependencies
Negotiable:  90   ✅ Clear acceptance criteria
Valuable:    90   ✅ MVP feature
Estimable:   85   ✅ Well-defined scope
Small:       90   ✅ 5 story points
Testable:    95   ✅ GIVEN-WHEN-THEN format

Rating: ⭐⭐⭐⭐ Good
Status: READY FOR SPRINT
```

### Story 2: System Improvement (INVEST: 45/100) ❌

```
Independent: 30   ❌ Depends on 5 stories
Negotiable:  40   ❌ Vague criteria
Valuable:    50   ⚠️ Unclear business value
Estimable:   40   ❌ Hard to estimate
Small:       20   ❌ 21 story points (too large)
Testable:    30   ❌ No test criteria

Rating: ⭐ Needs Work
Status: NEEDS SIGNIFICANT REFINEMENT

Recommendations:
- Break into 3-5 smaller stories
- Add GIVEN-WHEN-THEN criteria
- Clarify business value
- Reduce scope to one sprint
```

---

## 🚀 Advanced: Score Individual Story

```javascript
const InvestScoringEngine = require('./integrations/quality/invest_scoring_engine');

const engine = new InvestScoringEngine();

const myStory = {
  title: 'User Login',
  description: 'Users can login with email and password',
  acceptanceCriteria: [
    'GIVEN user has valid account WHEN user enters password THEN authenticated',
    'GIVEN user enters wrong password WHEN trying to login THEN error shown'
  ],
  dependencies: [],
  complexity: 'low',
  testScenarios: [
    { name: 'Happy path' },
    { name: 'Error case' }
  ],
  automatable: true,
  isUserFacing: true
};

const score = engine.scoreFunctionalRequirement(myStory);

console.log(`Score: ${score.investScore}/100`);
console.log(`Rating: ${score.rating}`);
console.log('Breakdown:', score.breakdown);
console.log('Recommendations:', score.recommendations);
```

---

## 📖 Full Documentation

For complete information, see:
- **INVEST_QUALITY_GUIDE.md** - Comprehensive guide
- **INVEST_QUALITY_DELIVERY_SUMMARY.md** - What was delivered
- **invest_quality_example.js** - Full runnable example

---

## ✅ Success Checklist

- ✅ Environment variables set
- ✅ Example runs without errors
- ✅ Jira board shows new epics
- ✅ Stories have INVEST scores
- ✅ Feature files generated
- ✅ Scenario mapping created
- ✅ Quality report visible
- ✅ Ready to use with your requirements

---

## 🎉 You're Ready!

Your INVEST quality system is now:
- ✅ Scoring all stories on 6 quality criteria
- ✅ Creating Jira epics and stories with scores
- ✅ Generating BDD Feature files
- ✅ Mapping scenarios to features
- ✅ Producing comprehensive quality reports

**Next**: Customize with your own requirements!

```bash
# Edit invest_quality_example.js with your requirements
# Then run:
node invest_quality_example.js
```

🚀 Happy quality scoring!
