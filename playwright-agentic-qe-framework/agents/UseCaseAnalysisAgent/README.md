# UseCaseAnalysisAgent

## Overview

The **UseCaseAnalysisAgent** is a specialized agent that extracts, analyzes, and documents use cases from application discovery data and requirements. It serves as the bridge between ApplicationDiscoveryAgent and test design phases.

**Status**: ✅ Fully Integrated  
**STLC Phase**: 0.5 (Between Discovery and Requirements Analysis)

## Purpose & Role

The UseCaseAnalysisAgent:

1. **Extracts Use Cases** - Identifies all primary, secondary, and system use cases
2. **Generates Scenarios** - Creates test scenarios for each use case including happy paths, alternatives, and exceptions
3. **Identifies Actors** - Maps all system actors and their interactions
4. **Generates Acceptance Criteria** - Creates GIVEN-WHEN-THEN criteria for testability
5. **Documents Use Cases** - Generates comprehensive markdown documentation
6. **Validates Completeness** - Ensures all aspects of use cases are covered

## Key Methods

### extractUseCases(discoveryData, requirements, applicationName)
Extracts comprehensive use cases from discovery data and requirements.

**Returns**: Array of use case objects with:
- ID (UC-XXX format)
- Name (verb-noun)
- Description
- Primary actor
- Stakeholders
- Main flow (step-by-step)
- Alternative flows
- Exception flows
- Preconditions/postconditions
- Business rules

### generateScenarios(useCases)
Generates detailed test scenarios for each use case.

**Includes**:
- Happy path scenario
- Alternative flow scenarios
- Exception scenarios
- Test data for each scenario

### identifyActors(useCases)
Extracts and categorizes all actors from use cases.

**Returns**: Array of actors with:
- Name
- Type (User, Admin, System, External)
- Related use cases
- Responsibilities

### generateAcceptanceCriteria(useCases)
Creates testable acceptance criteria for each use case.

**Format**: GIVEN-WHEN-THEN Gherkin format

### saveUseCaseDocumentation(useCases, outputDir)
Saves use cases to individual markdown files with comprehensive documentation.

## Usage Example

```javascript
const UseCaseAnalysisAgent = require('./agents/UseCaseAnalysisAgent');

// Initialize
const agent = new UseCaseAnalysisAgent(apiKey);

// Extract use cases
const useCases = await agent.extractUseCases(
  discoveryData,
  requirements,
  'Banking Application'
);

// Generate scenarios
await agent.generateScenarios(useCases);

// Identify actors
const actors = await agent.identifyActors(useCases);

// Generate acceptance criteria
const updatedUseCases = await agent.generateAcceptanceCriteria(useCases);

// Save documentation
const files = await agent.saveUseCaseDocumentation(updatedUseCases, './use_cases');

// Print summary
agent.printQualitySummary();
```

## Use Case Structure

Each use case includes:

```
Use Case ID: UC-001
Name: User Login
Description: User authenticates with email and password
Primary Actor: User
Stakeholders: Admin, Security Officer
Preconditions:
  - User has registered account
  - User has internet access
Main Flow:
  1. User enters email
  2. User enters password
  3. System validates credentials
  4. System creates session
  5. User redirected to dashboard
Alternative Flows:
  - Alternative: "Remember Me" checkbox selected
Exception Flows:
  - Exception: Invalid credentials entered
  - Exception: Account locked after 3 attempts
Postconditions:
  - User session created
  - Session token generated
Business Rules:
  - Password must be at least 8 characters
  - Account locks after 3 failed attempts
  - Session expires after 24 hours
```

## Generated Documentation

Creates markdown files for:

1. **Individual Use Cases** (UC-XXX-use_case_name.md)
   - Full use case details
   - Scenarios and test cases
   - Acceptance criteria
   - Quality metrics

2. **INDEX.md**
   - All use cases organized by priority/actor
   - Traceability matrix
   - Links to individual documentation

## Quality Metrics

### Tracked Metrics
- Use cases identified
- Scenarios created
- Actors identified
- Acceptance criteria generated
- Business rules extracted

### Quality Thresholds
- Minimum 3 scenarios per use case
- All acceptance criteria in GIVEN-WHEN-THEN format
- At least 1 exception flow per use case
- Clear pre and postconditions

## Integration with Framework

### With ApplicationDiscoveryAgent
Receives:
- Component information
- Architecture details
- Integration points

### With RequirementAgent
Receives:
- Raw requirements
- Business rules
- Acceptance criteria hints

### With DesignAgent
Provides:
- Use case scenarios
- Actor information
- Acceptance criteria
- Test objectives

### With Jira
Enables:
- Use case-based epics
- Story generation from scenarios
- Traceability matrix
- Test coverage tracking

## Output Structure

```
use_cases/
├── INDEX.md                              # Main index
├── UC-001-user_login.md                 # Individual use case
├── UC-002-fund_transfer.md
├── UC-003-payment_processing.md
└── ... more use cases
```

## Quick Start

```bash
# From project root
node -e "
const UseCaseAnalysisAgent = require('./agents/UseCaseAnalysisAgent');
const agent = new UseCaseAnalysisAgent(process.env.OPENAI_API_KEY);
// See usage example above
"
```

## Advanced Features

### Scenario Types
- **Happy Path**: Normal execution
- **Alternative Flow**: Different user paths
- **Exception**: Error conditions
- **Edge Case**: Boundary conditions

### Acceptance Criteria Validation
- GIVEN statement completeness
- WHEN statement clarity
- THEN statement testability
- Proper data/parameters

### Actor Classification
- **User**: End users of system
- **Administrator**: System administrators
- **System**: External systems/services
- **External**: Third-party integrations

## Best Practices

1. **Comprehensive Coverage**: Include all happy paths and alternatives
2. **Clear Flow Steps**: Each step should be atomic and testable
3. **Detailed Scenarios**: Include test data with scenarios
4. **Actor Clarity**: Define actor roles clearly
5. **Exception Handling**: Document all error scenarios
6. **Documentation**: Keep markdown documentation updated

## Troubleshooting

### Issue: Few use cases identified
- **Solution**: Provide more detailed requirements
- Ensure discovery data is comprehensive
- Review raw requirements for completeness

### Issue: Missing scenarios
- **Solution**: Verify each use case has main and alternative flows
- Add more specific requirements about edge cases
- Review acceptance criteria for missing scenarios

### Issue: Vague acceptance criteria
- **Solution**: Ensure GIVEN-WHEN-THEN format is strict
- Add specific test data to criteria
- Include expected results clearly

## Files & Structure

- `agents/UseCaseAnalysisAgent/index.js` - Main implementation
- `agents/UseCaseAnalysisAgent/README.md` - This file
- `agents/UseCaseAnalysisAgent/QUICK_START.md` - Quick start guide
- `use_cases/` - Generated documentation output

## Next Steps

1. Integrate with ProjectKickoffOrchestrator
2. Generate use case documentation
3. Map to Jira epics and stories
4. Design test scenarios
5. Start test automation

## Version

- **Current**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: April 25, 2024

---

*UseCaseAnalysisAgent - Part of Agentic QE Framework*
