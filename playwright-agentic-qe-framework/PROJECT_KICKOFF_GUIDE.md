# 🚀 PROJECT KICKOFF GUIDE

Complete guide for using the Agentic QE Framework to generate comprehensive project plans with use cases, requirements, and Jira integration for project kickoff.

## Overview

The Project Kickoff system provides:

✅ **UseCase_AnalysisAgent** - Extract and document use cases  
✅ **RawRequirementAgent** - Parse and structure raw requirements  
✅ **Domain App Templates** - Banking, Healthcare, Insurance, E-commerce, Project Management  
✅ **ProjectKickoffOrchestrator** - Orchestrate complete project setup  
✅ **Comprehensive Jira Integration** - Create epics, stories, and tasks  
✅ **Automated Documentation** - Generate markdown use case files  

## Quick Start (5 Minutes)

### 1. Set Environment Variables

```bash
export JIRA_URL="https://k2011rajesh.atlassian.net"
export JIRA_EMAIL="your-email@example.com"
export JIRA_API_TOKEN="your-api-token"
export JIRA_PROJECT_KEY="QED"
export OPENAI_API_KEY="your-openai-api-key"
```

### 2. Run Project Kickoff

```bash
# Banking application
node project_kickoff_example.js

# Or programmatically
const ProjectKickoffOrchestrator = require('./agents/ProjectKickoffOrchestrator');
const orchestrator = new ProjectKickoffOrchestrator();

const result = await orchestrator.executeProjectKickoff(
  'My Banking App',
  'banking',
  []  // additional requirements
);

console.log(`Jira Board: ${result.jiraUrl}`);
```

### 3. Review in Jira

Access your project board at: `https://k2011rajesh.atlassian.net/jira/core/projects/QED/board`

## Complete Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROJECT KICKOFF WORKFLOW                      │
└─────────────────────────────────────────────────────────────────┘

1. SELECT DOMAIN
   ↓
   Banking / Healthcare / Insurance / E-Commerce / Project Management
   
2. RAW REQUIREMENTS
   ↓
   RawRequirementAgent.ingestRawRequirements()
   - Accepts any format
   - Normalizes data
   
3. STRUCTURE REQUIREMENTS
   ↓
   RawRequirementAgent.parseAndStructureRequirements()
   - Creates REQ-XXX format
   - Adds acceptance criteria
   - Categorizes by type
   
4. VALIDATE REQUIREMENTS
   ↓
   RawRequirementAgent.validateRequirements()
   - Checks completeness
   - Identifies issues
   - Recommends fixes
   
5. EXTRACT USE CASES
   ↓
   UseCaseAnalysisAgent.extractUseCases()
   - Identifies all use cases
   - Extracts actors
   - Documents business rules
   
6. GENERATE SCENARIOS
   ↓
   UseCaseAnalysisAgent.generateScenarios()
   - Happy path scenarios
   - Alternative flows
   - Exception handling
   
7. GENERATE ACCEPTANCE CRITERIA
   ↓
   UseCaseAnalysisAgent.generateAcceptanceCriteria()
   - GIVEN-WHEN-THEN format
   - Testable criteria
   - Measurable outcomes
   
8. SAVE DOCUMENTATION
   ↓
   UseCaseAnalysisAgent.saveUseCaseDocumentation()
   - Markdown files per use case
   - INDEX.md for navigation
   - Traceability matrix
   
9. CREATE JIRA PROJECT
   ↓
   ProjectKickoffJiraGenerator.generateProjectKickoff()
   - Main epic
   - Domain-specific epics
   - Use case stories
   - Infrastructure tasks
   - QA stories
   
10. GENERATE REPORTS
    ↓
    Comprehensive project kickoff report
    - Metrics
    - Documentation links
    - Next steps
    - Jira URLs
```

## Available Domains

### 1. Banking (`banking`)

**Use Cases**: User login, fund transfers, payment processing, account management, transaction history  
**Actors**: Customer, Admin, Bank Officer, Compliance Officer  
**Risk Areas**: Payment processing, Security, Data integrity, PCI DSS compliance  
**Raw Requirements**: 10+ predefined requirements  

```javascript
await orchestrator.executeProjectKickoff(
  'InvestSmart Banking',
  'banking',
  ['Support multiple currencies', 'Fraud detection']
);
```

### 2. Healthcare (`healthcare`)

**Use Cases**: Appointment scheduling, medical records, prescription management, telemedicine, billing  
**Actors**: Patient, Doctor, Nurse, Administrator  
**Risk Areas**: HIPAA compliance, Data security, Telemedicine  
**Raw Requirements**: 10+ predefined requirements  

```javascript
await orchestrator.executeProjectKickoff(
  'MediCare Health',
  'healthcare',
  ['HIPAA compliance', 'Telemedicine integration']
);
```

### 3. Insurance (`insurance`)

**Use Cases**: Policy browsing, policy purchase, claim filing, claim approval, renewals  
**Actors**: Customer, Insurance Agent, Claims Officer, Underwriter  
**Risk Areas**: Fraud detection, Premium accuracy, Regulatory compliance  
**Raw Requirements**: 10+ predefined requirements  

```javascript
await orchestrator.executeProjectKickoff(
  'InsureMax Insurance',
  'insurance',
  ['Automated underwriting', 'Fraud detection']
);
```

### 4. E-Commerce (`ecommerce`)

**Use Cases**: Browse catalog, add to cart, checkout, track orders, reviews  
**Actors**: Customer, Seller, Admin, Warehouse Manager  
**Risk Areas**: Payment security, Inventory accuracy, Order fulfillment  
**Raw Requirements**: 10+ predefined requirements  

### 5. Project Management (`project_management`)

**Use Cases**: Create projects, assign tasks, collaboration, reporting, time tracking  
**Actors**: Project Manager, Team Member, Admin, Stakeholder  
**Risk Areas**: Data security, Concurrency, Performance  
**Raw Requirements**: 10+ predefined requirements  

## Key Components

### 1. UseCaseAnalysisAgent (`agents/UseCaseAnalysisAgent/`)

**Methods**:
- `extractUseCases(discoveryData, requirements, appName)` - Extract use cases
- `generateScenarios(useCases)` - Generate test scenarios
- `identifyActors(useCases)` - Identify system actors
- `generateAcceptanceCriteria(useCases)` - Generate testable criteria
- `saveUseCaseDocumentation(useCases, outputDir)` - Save markdown docs

**Output**: Use case files with scenarios and acceptance criteria

### 2. RawRequirementAgent (`agents/RawRequirementAgent/`)

**Methods**:
- `ingestRawRequirements(input)` - Accept raw requirements
- `parseAndStructureRequirements(rawReqs)` - Structure requirements
- `validateRequirements(requirements)` - Validate completeness
- `analyzeConflictsAndDependencies(requirements)` - Find conflicts
- `categorizeRequirements(requirements)` - Organize by type
- `mapRequirementsToUseCases(requirements, useCases)` - Create traceability

**Output**: Structured requirements with acceptance criteria

### 3. Domain Apps (`domains/domain_apps.js`)

**Functions**:
- `getDomainApp(domainId)` - Get domain configuration
- `getAvailableDomains()` - List all domains
- `generateDomainMarkdown(domainId)` - Generate documentation

**Includes**: Banking, Healthcare, Insurance, E-Commerce, Project Management

### 4. ProjectKickoffJiraGenerator (`integrations/mapping/project_kickoff_jira_generator.js`)

**Methods**:
- `generateProjectKickoff(appName, domainApp, useCases, requirements, discovery)` - Create Jira structure
- `createMainProjectEpic()` - Main epic
- `createDomainEpics()` - Domain-specific epics
- `createUseCaseStories()` - Stories per use case
- `createRequirementStories()` - Stories per requirement
- `createInfrastructureTasks()` - Setup and infra tasks
- `createQAStories()` - QA and testing stories

**Output**: Complete Jira project structure

### 5. ProjectKickoffOrchestrator (`agents/ProjectKickoffOrchestrator.js`)

**Main Method**:
- `executeProjectKickoff(appName, domainId, rawRequirements)` - Complete orchestration

**Executes**:
1. Requirement ingestion
2. Requirement parsing
3. Requirement validation
4. Use case extraction
5. Scenario generation
6. Acceptance criteria
7. Actor identification
8. Documentation generation
9. Jira project creation
10. Comprehensive reporting

## File Structure

```
playwright-agentic-qe-framework/
├── agents/
│   ├── UseCaseAnalysisAgent/
│   │   ├── index.js              # Main agent implementation
│   │   └── README.md             # Documentation
│   ├── RawRequirementAgent/
│   │   ├── index.js              # Main agent implementation
│   │   └── README.md             # Documentation
│   └── ProjectKickoffOrchestrator.js  # Main orchestrator
├── domains/
│   └── domain_apps.js            # Domain configurations
├── integrations/mapping/
│   └── project_kickoff_jira_generator.js  # Jira integration
├── use_cases/                    # Generated documentation
│   ├── banking/
│   ├── healthcare/
│   ├── insurance/
│   └── ... more domains
├── domains_docs/                 # Domain documentation
│   ├── banking_domain.md
│   ├── healthcare_domain.md
│   └── ... more domains
└── project_kickoff_example.js    # Complete example
```

## Generated Jira Structure

For each project, creates:

```
QED Project (Jira Board)
├── EPIC: {ApplicationName} - Project Kickoff
│   ├── EPIC: Core Features
│   │   ├── Story: Use Case 1 → Acceptance Criteria → Sub-tasks
│   │   ├── Story: Use Case 2 → Acceptance Criteria → Sub-tasks
│   │   └── ... more stories
│   ├── EPIC: Security & Compliance
│   │   ├── Story: Security Requirements
│   │   └── Story: Compliance Requirements
│   ├── EPIC: Performance & Optimization
│   ├── EPIC: Integration & APIs
│   ├── EPIC: User Experience
│   ├── TASK: Environment Setup
│   │   ├── Sub-task: Development environment
│   │   ├── Sub-task: Staging environment
│   │   └── Sub-task: Production environment
│   ├── TASK: Database Setup
│   ├── TASK: API & Integration Setup
│   ├── TASK: Security Setup
│   ├── TASK: Monitoring & Logging
│   └── QA Stories
│       ├── Test Automation Framework
│       ├── Security Testing
│       ├── Performance Testing
│       └── ... more QA stories
```

## Generated Documentation

Creates markdown documentation:

```
use_cases/
├── INDEX.md                          # Navigation and traceability
├── UC-001-user_authentication.md     # Full use case details
├── UC-002-payment_processing.md
├── UC-003-account_management.md
└── ... more use cases

domains_docs/
├── banking_domain.md                 # Domain summary
├── healthcare_domain.md
└── ... more domains
```

Each use case file includes:
- Full description
- Actors and stakeholders
- Pre/postconditions
- Main flow (step-by-step)
- Alternative flows
- Exception flows
- Business rules
- Test scenarios
- Acceptance criteria
- Quality metrics

## Usage Examples

### Basic Usage

```javascript
const orchestrator = new ProjectKickoffOrchestrator();

const result = await orchestrator.executeProjectKickoff(
  'InvestSmart Banking',
  'banking',
  []  // no additional requirements
);

console.log(`Project Epic: ${result.results.jiraResult.projectEpicKey}`);
console.log(`Jira Board: ${result.jiraUrl}`);
console.log(`Use Cases: ${result.results.useCases.length}`);
```

### Advanced Usage with Custom Requirements

```javascript
const customRequirements = [
  'Support multiple banking channels',
  'Real-time fraud detection',
  'Bill payment to utilities',
  'Investment portfolio management',
  'Recurring payment setup',
  'Financial advisory features'
];

const result = await orchestrator.executeProjectKickoff(
  'InvestSmart Banking',
  'banking',
  customRequirements
);
```

### Just Use Cases (No Jira)

```javascript
const useCaseAgent = new UseCaseAnalysisAgent(apiKey);
const useCases = await useCaseAgent.extractUseCases(
  discoveryData,
  requirements,
  'My App'
);
await useCaseAgent.generateScenarios(useCases);
const docs = await useCaseAgent.saveUseCaseDocumentation(useCases);
```

### Just Requirements (No Jira)

```javascript
const reqAgent = new RawRequirementAgent(apiKey);
await reqAgent.ingestRawRequirements(rawReqs);
const structured = await reqAgent.parseAndStructureRequirements(
  reqAgent.rawRequirements
);
const validation = await reqAgent.validateRequirements(structured);
```

## Output Reports

### Requirements Report
- Total requirements
- By type breakdown
- By priority breakdown
- Validation completeness
- Issues found
- Recommendations

### Use Cases Report
- Use cases identified
- Scenarios generated
- Actors identified
- Acceptance criteria count
- Quality metrics
- Traceability matrix

### Project Kickoff Report
- Project metrics summary
- Requirements analysis
- Use case analysis
- Jira structure created
- Documentation generated
- Next steps
- Links to all resources

## Best Practices

### 1. Comprehensive Raw Requirements
- Include all stakeholder input
- Document business rules
- Specify success criteria
- Include edge cases

### 2. Clear Use Cases
- Use verb-noun format for names
- Include all flows (happy, alternative, exception)
- Define clear preconditions/postconditions
- Document business rules

### 3. Acceptance Criteria
- Use GIVEN-WHEN-THEN format consistently
- Make criteria testable and measurable
- Include specific test data
- Verify both positive and negative scenarios

### 4. Jira Organization
- Review created epics and stories
- Refine acceptance criteria
- Assign to team members
- Set sprint planning
- Track progress

### 5. Documentation
- Keep markdown files updated
- Maintain traceability matrix
- Link related documents
- Review before handoff

## Troubleshooting

### Issue: Empty use cases
- **Solution**: Provide more detailed raw requirements
- Add specific business flows
- Include acceptance criteria hints

### Issue: Low requirement validation
- **Solution**: Add missing acceptance criteria
- Clarify ambiguous requirements
- Include success metrics

### Issue: Jira authentication error
- **Solution**: Verify JIRA_EMAIL and JIRA_API_TOKEN
- Check token hasn't expired
- Verify project access

### Issue: AI responses too brief
- **Solution**: Provide more context in raw requirements
- Add examples
- Specify expected format

## Integration with Other Agents

```
ApplicationDiscoveryAgent (Phase 0)
         ↓
UseCaseAnalysisAgent (Phase 0.5)
RawRequirementAgent (Phase 0.5)
         ↓
RequirementAgent (Phase 1)
         ↓
DesignAgent (Phase 2) - Uses use cases and requirements
         ↓
DataAgent (Phase 3)
         ↓
ExecutionAgent (Phase 4)
         ↓
... more phases
```

## Next Steps After Kickoff

1. ✅ Review all created epics and stories in Jira
2. ✅ Refine acceptance criteria with team
3. ✅ Read use case documentation
4. ✅ Assign stories to developers
5. ✅ Set sprint goals and milestones
6. ✅ Start test automation setup
7. ✅ Begin development with Jira tracking

## Files to Review

- 📖 [UseCaseAnalysisAgent README](./agents/UseCaseAnalysisAgent/README.md)
- 📖 [RawRequirementAgent README](./agents/RawRequirementAgent/README.md)
- 📖 [ProjectKickoffOrchestrator Code](./agents/ProjectKickoffOrchestrator.js)
- 📖 [Jira Generator Code](./integrations/mapping/project_kickoff_jira_generator.js)
- 🎯 [Example Code](./project_kickoff_example.js)

## Support

For issues or questions:
1. Check individual agent READMEs
2. Review example code
3. Check error logs for details
4. Verify environment configuration

## Version

- **Framework**: Agentic QE Framework v1.0+
- **Project Kickoff**: v1.0.0
- **Status**: Production Ready
- **Last Updated**: April 25, 2024

---

**Ready to kickoff your project?**

```bash
node project_kickoff_example.js
```

Then open your Jira board and start building! 🚀
