# RawRequirementAgent

## Overview

The **RawRequirementAgent** handles unstructured, raw requirements from stakeholders and converts them into structured, validated, and traceable requirements suitable for test planning and Jira integration.

**Status**: ✅ Fully Integrated  
**STLC Phase**: 0.5 (Requirements Ingestion & Processing)

## Purpose & Role

The RawRequirementAgent:

1. **Ingests Raw Requirements** - Accepts requirements in any format (text, documents, user input)
2. **Parses & Structures** - Converts raw text into structured requirement objects
3. **Validates Requirements** - Ensures completeness and clarity
4. **Identifies Conflicts** - Detects contradictions between requirements
5. **Categorizes Requirements** - Organizes by type (Functional, Non-functional, etc.)
6. **Maps to Use Cases** - Creates traceability links to use cases
7. **Generates Reports** - Produces comprehensive requirement analysis

## Key Methods

### ingestRawRequirements(rawRequirementInput)
Accepts raw requirements from various sources and normalizes them.

**Input**: String, Array, or mixed formats  
**Returns**: Normalized raw requirement objects

### parseAndStructureRequirements(rawRequirements)
Converts raw requirements into structured format with all fields.

**Returns**: Structured requirements with:
- Requirement ID (REQ-XXX)
- Type (Functional, Non-Functional, Security, Performance, Usability, Compliance)
- Priority (Critical, High, Medium, Low)
- Description
- Details
- Stakeholders affected
- Business value
- Success criteria
- Related requirements
- Assumptions
- Constraints
- Acceptance criteria (GIVEN-WHEN-THEN)

### validateRequirements(requirements)
Validates requirements for completeness and clarity.

**Returns**: Validation report with:
- Valid requirements list
- Issues found
- Completeness percentage
- Recommendations

### analyzeConflictsAndDependencies(requirements)
Identifies conflicts and dependencies between requirements.

**Returns**: Analysis including:
- Conflicting requirements
- Dependencies
- Overlaps
- Recommendations for resolution

### categorizeRequirements(requirements)
Organizes requirements by type.

**Returns**: Map of requirements grouped by type

### mapRequirementsToUseCases(requirements, useCases)
Creates traceability between requirements and use cases.

**Returns**: Traceability matrix with:
- Mapped requirements to use cases
- Unmapped requirements
- Unmapped use cases

### generateRequirementReport(requirements)
Creates comprehensive requirement analysis report.

**Returns**: Markdown formatted report

## Usage Example

```javascript
const RawRequirementAgent = require('./agents/RawRequirementAgent');

// Initialize
const agent = new RawRequirementAgent(apiKey);

// Step 1: Ingest raw requirements
const rawReqs = [
  'Users must be able to login with email and password',
  'System should support multi-factor authentication',
  'All transactions must be encrypted',
  // ... more raw requirements
];

await agent.ingestRawRequirements(rawReqs);

// Step 2: Parse and structure
const structured = await agent.parseAndStructureRequirements(agent.rawRequirements);

// Step 3: Validate
const validation = await agent.validateRequirements(structured);
console.log(`Completeness: ${validation.completeness.completenessPercentage}%`);

// Step 4: Analyze conflicts
const analysis = await agent.analyzeConflictsAndDependencies(structured);

// Step 5: Categorize
const categorized = agent.categorizeRequirements(structured);

// Step 6: Generate report
const report = agent.generateRequirementReport(structured);
console.log(report);

// Print summary
agent.printQualitySummary();
```

## Requirement Structure

Each structured requirement includes:

```javascript
{
  id: 'REQ-001',
  type: 'Functional',
  priority: 'Critical',
  description: 'User login with email/password',
  details: 'Users should be able to login using their registered email...',
  stakeholders: ['User', 'Admin'],
  businessValue: 'Enables user access to system',
  successCriteria: [
    'Valid users can login',
    'Invalid users see error',
    'Session token created'
  ],
  relatedRequirements: ['REQ-002'],
  assumptions: ['User has internet access'],
  constraints: ['Must support SSL/TLS'],
  acceptanceCriteria: [
    {
      given: 'User is on login page',
      when: 'User enters valid credentials',
      then: 'User is logged in and redirected to dashboard'
    }
  ],
  rawRequirementId: 'RAW-REQ-1',
  processed: true
}
```

## Requirement Types

- **Functional**: What the system should do
- **Non-Functional**: How the system should perform (speed, scalability, reliability)
- **Security**: Security and data protection requirements
- **Performance**: Performance thresholds and metrics
- **Usability**: User experience and interface requirements
- **Compliance**: Regulatory and compliance requirements

## Priority Levels

- **Critical**: Must have, core functionality, blocks other work
- **High**: Important, impacts multiple users/features
- **Medium**: Should have, nice to have enhancements
- **Low**: Can be deferred, low impact

## Quality Metrics

### Tracked Metrics
- Raw requirements ingested
- Structured requirements generated
- Requirements validated
- Conflicts identified
- Requirements by type
- Requirements by priority

### Validation Criteria
- ✅ Has description
- ✅ Has priority
- ✅ Has type
- ✅ Has acceptance criteria
- ✅ Has stakeholders
- ✅ Clear success criteria

### Completeness Calculation
- Each valid field: +1 point
- Total score: 0-100%
- Minimum 80% for production use

## Integration with Framework

### With UseCaseAnalysisAgent
Provides:
- Structured requirements
- Business rules
- Acceptance criteria
- Stakeholder information

### With ProjectKickoffOrchestrator
Works as:
- Step 2: Parse raw requirements
- Step 3: Validate requirements
- Step 5: Map to use cases

### With Jira Integration
Enables:
- Story creation from requirements
- Acceptance criteria automation
- Traceability tracking
- Priority management

## Generated Reports

### Requirement Analysis Report
Includes:
- Total requirements summary
- Breakdown by type
- Breakdown by priority
- Detailed requirement list
- Quality metrics
- Validation results

## Quick Start

```bash
# Ingest requirements
const agent = new RawRequirementAgent(apiKey);
const raw = ['Requirement 1', 'Requirement 2'];
await agent.ingestRawRequirements(raw);

# Process
const structured = await agent.parseAndStructureRequirements(agent.rawRequirements);

# Validate
const report = await agent.validateRequirements(structured);
console.log(report.completeness.completenessPercentage + '%');
```

## Best Practices

1. **Detailed Raw Requirements**: Provide as much context as possible
2. **Specific Acceptance Criteria**: Use GIVEN-WHEN-THEN format
3. **Clear Priorities**: Mark critical vs. nice-to-have
4. **Stakeholder Input**: Include all affected parties
5. **Assumptions Clear**: Document any assumptions made
6. **Success Metrics**: Define how to measure success

## Troubleshooting

### Issue: Low validation percentage
- **Solution**: Add missing acceptance criteria
- Ensure all requirements have description and priority
- Add specific success criteria
- Clarify any ambiguous language

### Issue: Conflicts identified
- **Solution**: Review conflicting requirements with stakeholders
- Prioritize conflicting requirements
- Document rationale for priorities
- Update requirements to remove contradictions

### Issue: Vague acceptance criteria
- **Solution**: Use strict GIVEN-WHEN-THEN format
- Add specific test data
- Include expected results
- Remove subjective language

## Advanced Features

### Conflict Resolution
- Automatic conflict detection
- Dependency tracking
- Impact analysis
- Resolution recommendations

### Traceability Matrix
- Requirements to use cases
- Requirements to test cases
- Requirements to code
- Change impact analysis

### Quality Scoring
- Completeness scoring
- Clarity scoring
- Testability scoring
- Overall quality metrics

## Files & Structure

- `agents/RawRequirementAgent/index.js` - Main implementation
- `agents/RawRequirementAgent/README.md` - This file

## Integration Example

```javascript
// In ProjectKickoffOrchestrator
const requirementAgent = new RawRequirementAgent(apiKey);
await requirementAgent.ingestRawRequirements(allRequirements);
const structured = await requirementAgent.parseAndStructureRequirements(
  requirementAgent.rawRequirements
);
const validated = await requirementAgent.validateRequirements(structured);
const analysis = await requirementAgent.analyzeConflictsAndDependencies(structured);
```

## Next Steps

1. Ingest raw requirements
2. Structure and validate
3. Identify conflicts
4. Map to use cases
5. Generate Jira stories
6. Track in project

## Version

- **Current**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: April 25, 2024

---

*RawRequirementAgent - Part of Agentic QE Framework*
