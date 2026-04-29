# INVEST & SMART Quality Scoring

## Overview

This document defines quality scoring criteria based on two complementary frameworks:

- **INVEST** - For evaluating user story quality in requirements gathering
- **SMART** - For ensuring quality goals are well-defined and achievable

These criteria are integrated into the Application Discovery Agent and applied throughout the QE Framework STLC.

## INVEST Quality Scoring

### What is INVEST?

INVEST is an acronym for effective user story criteria:

| Criterion | Definition |
|-----------|-----------|
| **I**ndependent | Story can be developed, tested, and deployed independently |
| **N**egotiable | Story details are open to discussion and refinement |
| **V**aluable | Story delivers clear, recognizable business value |
| **E**stimable | Story can be estimated by the development team |
| **S**mall | Story is small enough to complete within one sprint |
| **T**estable | Story has clear acceptance criteria that can be tested |

### Scoring Methodology

Each INVEST criterion is scored on a 0-100 scale:

#### 1. Independence (25 points)

**Definition**: The story can be developed, tested, and released independently without requiring other stories to be completed first.

**Scoring Breakdown**:

| Score Range | Status | Criteria |
|------------|--------|----------|
| 90-100 | ✅ EXCELLENT | Story has no dependencies; can be completed independently |
| 80-89 | ✅ GOOD | Minimal dependencies; can work with parallel development |
| 70-79 | ⚠️ ACCEPTABLE | Some dependencies exist but manageable |
| 60-69 | ⚠️ NEEDS REVIEW | Dependencies create risk; recommend refactoring |
| Below 60 | ❌ POOR | Highly dependent; must combine with other stories |

**Evaluation Checklist**:
- [ ] Can be tested independently
- [ ] No required features from other stories
- [ ] No shared resources that create race conditions
- [ ] Can be deployed without other changes
- [ ] Minimal cross-team dependencies

**Example - GOOD (85 score)**:
```
Story: Add password strength validator to registration form
- UI form has independent validator
- Can be tested without authentication service changes
- Can be deployed separately
- Only minor dependency: existing password field
```

**Example - POOR (45 score)**:
```
Story: Implement payment processing with fraud detection, 
       notification system, and analytics
- Requires payment provider integration
- Depends on notification service
- Depends on analytics pipeline
- Cannot be deployed independently
```

#### 2. Negotiability (20 points)

**Definition**: The story details are open to discussion between stakeholders, developers, and QA. Not fixed requirements.

**Scoring Breakdown**:

| Score Range | Status | Criteria |
|------------|--------|----------|
| 90-100 | ✅ EXCELLENT | Clear direction, flexible implementation; room for discussion |
| 80-89 | ✅ GOOD | Mostly flexible; some fixed requirements |
| 70-79 | ⚠️ ACCEPTABLE | Moderate flexibility; some constraints |
| 60-69 | ⚠️ NEEDS REVIEW | Mostly fixed; limited discussion room |
| Below 60 | ❌ POOR | Rigid specifications; no negotiation possible |

**Evaluation Checklist**:
- [ ] Title states goal, not solution
- [ ] Acceptance criteria focus on "what," not "how"
- [ ] Implementation approach is not predetermined
- [ ] Team can propose alternative solutions
- [ ] Scope can be adjusted through discussion

**Example - GOOD (88 score)**:
```
Story: Users should be able to reset forgotten passwords
- Goal is clear (password reset)
- Implementation approach flexible
  (email link, SMS code, security questions)
- Team can discuss best approach
- Acceptance criteria flexible
```

**Example - POOR (52 score)**:
```
Story: Implement OAuth2 with Google, Facebook, Twitter, 
       GitHub, Microsoft, and Apple using library X with 
       settings Y and configuration Z
- Too prescriptive
- Implementation method fixed
- Technology mandated
- No room for discussion
```

#### 3. Valuable (20 points)

**Definition**: The story delivers clear, measurable business value to customers or users.

**Scoring Breakdown**:

| Score Range | Status | Criteria |
|------------|--------|----------|
| 90-100 | ✅ EXCELLENT | Clear, significant business value; high priority |
| 80-89 | ✅ GOOD | Obvious business value; addresses user need |
| 70-79 | ⚠️ ACCEPTABLE | Some value; serves supporting role |
| 60-69 | ⚠️ NEEDS REVIEW | Unclear value; more analysis needed |
| Below 60 | ❌ POOR | No clear business value; defer or reject |

**Evaluation Checklist**:
- [ ] Addresses specific user need or pain point
- [ ] Delivers measurable business benefit
- [ ] ROI can be quantified (revenue increase, cost savings, etc.)
- [ ] Aligns with product strategy
- [ ] Stakeholders agree on value

**Example - GOOD (92 score)**:
```
Story: Add one-click checkout for returning customers
- Clear value: Increase conversion rate (reduce cart abandonment)
- Measurable benefit: Expect 15% improvement in checkout completion
- Addresses pain point: Users abandon due to lengthy checkout
- ROI: Expected $100K annual increase
```

**Example - POOR (35 score)**:
```
Story: Refactor database connection pooling using library X
- No direct customer benefit
- Technical debt item, not user-facing
- Value unclear to non-technical stakeholders
- Should be categorized as technical task, not user story
```

#### 4. Estimable (20 points)

**Definition**: The team can estimate the effort required (story points, hours) with reasonable confidence.

**Scoring Breakdown**:

| Score Range | Status | Criteria |
|------------|--------|----------|
| 90-100 | ✅ EXCELLENT | Team can estimate with high confidence |
| 80-89 | ✅ GOOD | Team can estimate with reasonable confidence |
| 70-79 | ⚠️ ACCEPTABLE | Some uncertainty; range estimate possible |
| 60-69 | ⚠️ NEEDS REVIEW | High uncertainty; needs clarification |
| Below 60 | ❌ POOR | Cannot be estimated; must split |

**Evaluation Checklist**:
- [ ] Requirements are clear and unambiguous
- [ ] No major unknowns or technical risks
- [ ] Team has similar story experience
- [ ] Acceptance criteria are well-defined
- [ ] Scope is bounded and clear

**Example - GOOD (87 score)**:
```
Story: Add name field validation to user profile form
- Similar stories completed in past
- Requirements clear: "Validate 2-50 characters, A-Z only"
- Known technology stack
- Team consensus: 5 story points (medium confidence)
```

**Example - POOR (42 score)**:
```
Story: Implement machine learning-based fraud detection
- Unknown ML approach
- Unclear data requirements
- No team expertise in ML
- Multiple possible implementations
- Cannot estimate without significant research
```

#### 5. Small (20 points)

**Definition**: The story is small enough to be completed within a single sprint (typically 1-2 weeks).

**Scoring Breakdown**:

| Score Range | Status | Criteria |
|------------|--------|----------|
| 90-100 | ✅ EXCELLENT | Completable in 1-2 days; easily fits in sprint |
| 80-89 | ✅ GOOD | Completable in 2-4 days; fits comfortably |
| 70-79 | ⚠️ ACCEPTABLE | Completable in 1 week; adequate for sprint |
| 60-69 | ⚠️ NEEDS REVIEW | Takes most of sprint; limited buffer |
| Below 60 | ❌ POOR | Exceeds sprint capacity; must split |

**Evaluation Checklist**:
- [ ] Can be completed by 1-2 developers in 1 week
- [ ] Testing can be completed in 1-2 days
- [ ] No external blockers likely to cause delays
- [ ] Scope is focused on single objective
- [ ] Definition of done is achievable

**Example - GOOD (85 score)**:
```
Story: Display user's total policy premium on dashboard
- Clear scope: Add one field to dashboard
- Estimated: 3 days (development + testing)
- No external dependencies
- Well-defined acceptance criteria
```

**Example - POOR (35 score)**:
```
Story: Build complete insurance quote comparison tool 
       with real-time rate updates, advanced filtering,
       export to PDF, email sharing, and premium calculator
- Multiple features
- Estimated: 6+ weeks
- Multiple dependencies
- Should be split into 8-10 stories
```

#### 6. Testable (20 points)

**Definition**: The story has clear, verifiable acceptance criteria that can be tested without ambiguity.

**Scoring Breakdown**:

| Score Range | Status | Criteria |
|------------|--------|----------|
| 90-100 | ✅ EXCELLENT | Clear acceptance criteria; easily testable |
| 80-89 | ✅ GOOD | Testable criteria; minor clarifications possible |
| 70-79 | ⚠️ ACCEPTABLE | Testable; requires assumptions |
| 60-69 | ⚠️ NEEDS REVIEW | Vague criteria; interpretation needed |
| Below 60 | ❌ POOR | Not testable; criteria missing or unclear |

**Evaluation Checklist**:
- [ ] Acceptance criteria use measurable terms
- [ ] No ambiguous language ("user-friendly," "fast," etc.)
- [ ] Clear success and failure conditions
- [ ] Can be automated or manually verified
- [ ] QA can determine pass/fail without developer input

**Example - GOOD (92 score)**:
```
Story: User password validation on registration
Acceptance Criteria:
- Password must be 8-20 characters ✓ (measurable)
- Must contain uppercase, lowercase, number, symbol ✓ (specific)
- Error messages appear within 100ms ✓ (quantified)
- All validations testable via UI automation ✓ (automatable)
```

**Example - POOR (38 score)**:
```
Story: Make the application more secure
Acceptance Criteria:
- "Security is improved" ✗ (unmeasurable)
- "System is less vulnerable" ✗ (vague)
- "Threats are mitigated" ✗ (unclear)
- No clear pass/fail criteria ✗ (untestable)
```

### INVEST Overall Score Calculation

**Formula**:
```
INVEST Score = (I + N + V + E + S + T) / 6
```

Where each criterion is scored 0-100.

**Interpretation**:

| Score Range | Status | Recommendation |
|------------|--------|----------------|
| 90-100 | ✅ EXCELLENT | Ready for development |
| 80-89 | ✅ GOOD | Ready with minor refinements |
| 70-79 | ⚠️ ACCEPTABLE | Address gaps before development |
| 60-69 | ⚠️ NEEDS REWORK | Significant changes needed |
| Below 60 | ❌ POOR | Reject or substantially rewrite |

**Example - GOOD Story (87 score)**:
```
Story: Allow users to download their policy as PDF

Scores:
- Independent (I): 85 - Only depends on existing data layer
- Negotiable (N): 90 - Format and content flexible
- Valuable (V): 88 - Users frequently request this
- Estimable (E): 88 - Similar stories completed before
- Small (S): 85 - 3-4 days estimated effort
- Testable (T): 88 - Clear acceptance criteria

INVEST Score: 87 → READY FOR DEVELOPMENT
```

**Example - POOR Story (52 score)**:
```
Story: Redesign entire customer portal UI/UX with new 
       design system, animations, mobile optimization, 
       and integration with legacy systems

Scores:
- Independent (I): 35 - Depends on design team, backend changes
- Negotiable (N): 45 - Design heavily prescribed
- Valuable (V): 78 - Clear value but scope unclear
- Estimable (E): 38 - High uncertainty
- Small (S): 25 - Exceeds sprint capacity by 3x
- Testable (T): 42 - Acceptance criteria vague

INVEST Score: 44 → NEEDS COMPLETE REWORK
→ Recommendation: Split into 5-10 focused stories
```

---

## SMART Quality Scoring

### What is SMART?

SMART is an acronym for well-defined goals:

| Criterion | Definition |
|-----------|-----------|
| **S**pecific | Goal clearly defines what needs to be achieved |
| **M**easurable | Goal has quantifiable success metrics |
| **A**chievable | Goal is realistic and achievable with available resources |
| **R**elevant | Goal aligns with project objectives and business needs |
| **T**ime-bound | Goal has clear deadlines and milestones |

### Scoring Methodology

Each SMART criterion is scored on a 0-100 scale:

#### 1. Specific (20 points)

**Definition**: The goal clearly defines WHAT needs to be achieved, without ambiguity.

**Scoring Breakdown**:

| Score Range | Status | Criteria |
|------------|--------|----------|
| 90-100 | ✅ EXCELLENT | Crystal clear; no ambiguity possible |
| 80-89 | ✅ GOOD | Clear direction; minor details flexible |
| 70-79 | ⚠️ ACCEPTABLE | Mostly specific; some vagueness |
| 60-69 | ⚠️ NEEDS REVIEW | Somewhat unclear; clarification needed |
| Below 60 | ❌ POOR | Vague; unclear what "done" means |

**Evaluation Checklist**:
- [ ] Goal answers "What?" clearly
- [ ] Specific outcomes are defined
- [ ] No ambiguous terms ("improve," "better," "enhance")
- [ ] Scope boundaries are clear
- [ ] Success state is unambiguous

**Examples**:

**Good (92 score)**:
```
Goal: "Achieve 90% code coverage for UserService module"
- Clear what: "UserService module"
- Clear metric: "90% code coverage"
- Measurable outcome: coverage percentage
```

**Poor (38 score)**:
```
Goal: "Improve testing quality"
- Unclear what "quality" means
- No specific target
- Ambiguous success criteria
```

#### 2. Measurable (20 points)

**Definition**: The goal has specific, quantifiable metrics to track progress and success.

**Scoring Breakdown**:

| Score Range | Status | Criteria |
|------------|--------|----------|
| 90-100 | ✅ EXCELLENT | Multiple clear metrics; tracked automatically |
| 80-89 | ✅ GOOD | Quantifiable metrics; easily tracked |
| 70-79 | ⚠️ ACCEPTABLE | Metrics defined; some manual tracking |
| 60-69 | ⚠️ NEEDS REVIEW | Partially measurable; gaps exist |
| Below 60 | ❌ POOR | Not measurable; no clear metrics |

**Evaluation Checklist**:
- [ ] Success metrics are quantifiable (numbers, percentages)
- [ ] Metrics are trackable and verifiable
- [ ] Baseline or starting point known
- [ ] Target value is specific
- [ ] Progress can be monitored

**Examples**:

**Good (95 score)**:
```
Goal: "Reduce average test execution time from 45 min to 30 min"
- Baseline: 45 minutes (known)
- Target: 30 minutes (specific number)
- Metric: Execution time in minutes (quantifiable)
- Trackable: Automated test run reports show duration
```

**Poor (32 score)**:
```
Goal: "Improve test reliability"
- No metric defined
- "Reliability" is subjective
- No baseline or target
- Unmeasurable
```

#### 3. Achievable (20 points)

**Definition**: The goal is realistic and can be achieved with available resources, constraints, and timeline.

**Scoring Breakdown**:

| Score Range | Status | Criteria |
|------------|--------|----------|
| 90-100 | ✅ EXCELLENT | Definitely achievable; aligned with capacity |
| 80-89 | ✅ GOOD | Achievable with focused effort |
| 70-79 | ⚠️ ACCEPTABLE | Achievable but requires stretch |
| 60-69 | ⚠️ NEEDS REVIEW | Questionable achievability; risks identified |
| Below 60 | ❌ POOR | Unrealistic; unachievable with resources |

**Evaluation Checklist**:
- [ ] Available resources are sufficient
- [ ] Team has necessary skills
- [ ] Timeline is realistic
- [ ] Risks have been identified and mitigated
- [ ] Similar goals have been achieved before

**Examples**:

**Good (88 score)**:
```
Goal: "Increase test coverage from 65% to 80% in Q3"
- Team has capacity (0.5 sprint per week allocated)
- Skills available (team certified in testing tools)
- Timeline realistic (12 weeks for 15% improvement)
- Precedent exists (achieved 70% in Q2)
- Resources secured
→ ACHIEVABLE
```

**Poor (35 score)**:
```
Goal: "Achieve 100% code coverage in 2 weeks"
- Current coverage: 40%
- Team: 1 person part-time
- Skills: QA only (no automation expertise)
- Timeline: 2 weeks for 60% improvement
- Unrealistic: Would require 10x effort
→ UNACHIEVABLE
```

#### 4. Relevant (20 points)

**Definition**: The goal aligns with project objectives, business needs, and strategic priorities.

**Scoring Breakdown**:

| Score Range | Status | Criteria |
|------------|--------|----------|
| 90-100 | ✅ EXCELLENT | Highly relevant; core to strategy |
| 80-89 | ✅ GOOD | Clearly relevant; supports objectives |
| 70-79 | ⚠️ ACCEPTABLE | Somewhat relevant; supporting role |
| 60-69 | ⚠️ NEEDS REVIEW | Questionable relevance; clarify alignment |
| Below 60 | ❌ POOR | Not relevant; misaligned with strategy |

**Evaluation Checklist**:
- [ ] Aligns with product strategy
- [ ] Supports business objectives
- [ ] Addresses real customer pain points
- [ ] Relevant to current priorities
- [ ] Stakeholders agree on relevance

**Examples**:

**Good (92 score)**:
```
Goal: "Reduce production defects by 40%"
- Aligns with: "Quality" strategic pillar
- Supports: Customer satisfaction goals
- Addresses: Customer complaints about bugs
- Priority: High (customer retention risk)
- Stakeholders: Agree (CEO, PM, Support all aligned)
→ HIGHLY RELEVANT
```

**Poor (42 score)**:
```
Goal: "Reorganize test file naming convention"
- Aligns with: Internal process efficiency only
- Supports: Developer convenience
- Addresses: No customer pain point
- Priority: Low (nice-to-have)
- Stakeholders: Only QA interested
→ NOT RELEVANT TO BUSINESS
```

#### 5. Time-bound (20 points)

**Definition**: The goal has specific deadlines and clear milestones.

**Scoring Breakdown**:

| Score Range | Status | Criteria |
|------------|--------|----------|
| 90-100 | ✅ EXCELLENT | Clear deadline; milestones defined |
| 80-89 | ✅ GOOD | Specific end date; checkpoints exist |
| 70-79 | ⚠️ ACCEPTABLE | Target timeframe; some milestones |
| 60-69 | ⚠️ NEEDS REVIEW | Vague timeline; milestones unclear |
| Below 60 | ❌ POOR | No deadline; open-ended |

**Evaluation Checklist**:
- [ ] Clear end date/deadline
- [ ] Interim milestones defined
- [ ] Checkpoints for progress tracking
- [ ] Review dates scheduled
- [ ] Deadline is realistic

**Examples**:

**Good (94 score)**:
```
Goal: "Increase test coverage to 85% by end of Q3"
- Deadline: Clear (Q3 end date)
- Milestones:
  - Week 3: 70% coverage
  - Week 6: 75% coverage
  - Week 9: 80% coverage
  - Week 12: 85% coverage
- Checkpoints: Weekly reviews scheduled
- Tracking: Automated reports every Monday
→ WELL TIME-BOUND
```

**Poor (28 score)**:
```
Goal: "Improve documentation"
- No deadline: Indefinite
- No milestones: "Whenever"
- No checkpoints: Untracked
- Vague timeline: "When done"
→ NOT TIME-BOUND
```

### SMART Overall Score Calculation

**Formula**:
```
SMART Score = (S + M + A + R + T) / 5
```

Where each criterion is scored 0-100.

**Interpretation**:

| Score Range | Status | Recommendation |
|------------|--------|----------------|
| 90-100 | ✅ EXCELLENT | Ready for execution; clearly defined |
| 80-89 | ✅ GOOD | Ready with minor refinements |
| 70-79 | ⚠️ ACCEPTABLE | Address gaps before execution |
| 60-69 | ⚠️ NEEDS REWORK | Significant refinements needed |
| Below 60 | ❌ POOR | Reject or substantially redefine |

**Example - GOOD Goal (92 score)**:
```
Goal: "Reduce average test execution time from 45 to 30 minutes 
      by implementing parallel execution"

Scores:
- Specific (S): 95 - "45 to 30 minutes" is crystal clear
- Measurable (M): 94 - Execution time in minutes, tracked daily
- Achievable (A): 88 - Team has capacity; parallel framework available
- Relevant (R): 90 - Addresses slow feedback loop complaint
- Time-bound (T): 92 - End of Q2; weekly milestones defined

SMART Score: 92 → READY FOR EXECUTION
```

**Example - POOR Goal (48 score)**:
```
Goal: "Make testing better and faster"

Scores:
- Specific (S): 35 - "Better" and "faster" are vague
- Measurable (M): 32 - No metrics defined
- Achievable (A): 60 - Unclear if achievable
- Relevant (R): 75 - Generally relevant but unfocused
- Time-bound (T): 25 - No deadline specified

SMART Score: 45 → NEEDS COMPLETE REWORK
→ Redefine with specific metrics and timeline
```

---

## Integration with Application Discovery Agent

The Application Discovery Agent uses INVEST and SMART scoring to:

### 1. Evaluate User Stories
```javascript
const story = {
  title: "User Registration with Email Verification",
  description: "As a user, I want to register with email verification",
  acceptanceCriteria: [
    "Email format validation passes",
    "Verification email sent within 5 seconds",
    "User can click link in email to verify"
  ]
};

const investScore = agent.evaluateINVESTCriteria(story);
// Returns: {
//   independent: {...},
//   negotiable: {...},
//   valuable: {...},
//   estimable: {...},
//   small: {...},
//   testable: {...},
//   investScore: 87
// }
```

### 2. Validate Quality Goals
```javascript
const goal = {
  description: "Achieve 85% code coverage for critical components",
  target: "85%",
  timeline: "2 sprints",
  metrics: ["Code coverage %", "Lines covered/total lines"]
};

const smartScore = agent.evaluateSMARTGoals(goal);
// Returns: {
//   specific: {...},
//   measurable: {...},
//   achievable: {...},
//   relevant: {...},
//   timeBound: {...},
//   smartScore: 93,
//   recommendations: [...]
// }
```

### 3. Gate Story Creation in JIRA
```javascript
// Only create JIRA stories with INVEST score ≥ 75
if (investScore >= 75) {
  // Create story in JIRA
  jiraClient.createStory(story);
} else {
  // Return for rework
  console.log("Story needs improvement before JIRA creation");
}
```

---

## Best Practices

### For INVEST Story Quality

1. **Start with User Value**: Begin story with value proposition
2. **Negotiate Scope**: Don't fix implementation details
3. **Vertical Slicing**: Include UI, API, and DB changes in one story
4. **Clear Acceptance Criteria**: Use measurable, unambiguous language
5. **Independent Testing**: Each story should have independent test plan
6. **Regular Refinement**: Groom stories to improve INVEST scores

### For SMART Goal Quality

1. **Quantify Everything**: Use numbers, not adjectives
2. **Break into Milestones**: Define interim checkpoints
3. **Reality Check**: Validate achievability with team
4. **Align Vertically**: Ensure goals cascade from strategy
5. **Track Progress**: Monitor metrics weekly
6. **Adjust as Needed**: Adapt goals based on progress

---

## Quality Thresholds

### Recommended Story Thresholds

| Phase | Minimum INVEST Score | Action |
|-------|-------------------|--------|
| Backlog | 60 | Rough ideas; needs refinement |
| Sprint Planning | 75 | Ready for discussion |
| Ready for Dev | 80 | Approved for development |
| QA Review | 85+ | High confidence in story quality |

### Recommended Goal Thresholds

| Phase | Minimum SMART Score | Action |
|-------|-------------------|--------|
| Proposed | 65 | Needs clarification |
| Approved | 80 | Ready for planning |
| Committed | 90+ | Tracking begins |
| Review | 85+ | Reassess mid-way |

---

## Templates

### INVEST Scoring Template

```
Story Title: [Title]
Story ID: [JIRA ID]

INVEST Evaluation:
┌─────────────────────────────────────┐
│ Independence (0-100):        [  ]   │
│ ├─ Can be completed independently?   │
│ └─ Issues/Dependencies: ____________ │
│                                     │
│ Negotiability (0-100):       [  ]   │
│ ├─ Implementation flexible?          │
│ └─ Issues: _________________________ │
│                                     │
│ Valuable (0-100):            [  ]   │
│ ├─ Delivers business value?          │
│ └─ Issues: _________________________ │
│                                     │
│ Estimable (0-100):           [  ]   │
│ ├─ Can be estimated?                 │
│ └─ Issues: _________________________ │
│                                     │
│ Small (0-100):               [  ]   │
│ ├─ Fits in sprint?                   │
│ └─ Issues: _________________________ │
│                                     │
│ Testable (0-100):            [  ]   │
│ ├─ Has clear acceptance criteria?    │
│ └─ Issues: _________________________ │
│                                     │
│ INVEST SCORE (Avg):         [  ]   │
│                                     │
│ Status: [ ] Ready  [ ] Review [ ] Rework│
└─────────────────────────────────────┘
```

### SMART Goal Template

```
Goal: [Goal description]
Goal ID: [Tracking ID]

SMART Evaluation:
┌─────────────────────────────────────┐
│ Specific (0-100):            [  ]   │
│ └─ What exactly? __________________ │
│                                     │
│ Measurable (0-100):          [  ]   │
│ └─ Metric: ______________________ │
│    Baseline: ___________________ │
│    Target: _____________________ │
│                                     │
│ Achievable (0-100):          [  ]   │
│ └─ Resources available?        Yes/No│
│    Risks: ______________________ │
│                                     │
│ Relevant (0-100):            [  ]   │
│ └─ Aligns with strategy?       Yes/No│
│    Strategic pillar: ___________ │
│                                     │
│ Time-bound (0-100):          [  ]   │
│ └─ Deadline: _________________ │
│    Milestones:                   │
│    1. ________________ (Date)   │
│    2. ________________ (Date)   │
│    3. ________________ (Date)   │
│                                     │
│ SMART SCORE (Avg):          [  ]   │
│                                     │
│ Status: [ ] Ready  [ ] Review [ ] Rework│
└─────────────────────────────────────┘
```

---

## Reference Materials

- [Application Discovery Agent](../agents/ApplicationDiscoveryAgent/README.md)
- [Architecture Overview](../Architecture-Agentic-QE.md)
- [Requirements Quality](requirements_quality.md)
- [Design Quality](design_quality.md)

---

## Changelog

### Version 1.0 (Initial Release)
- INVEST scoring framework with 6 criteria
- SMART scoring framework with 5 criteria
- Integration with Application Discovery Agent
- Quality threshold recommendations
- Templates and best practices
