# Application Discovery Agent

## Overview

The **Application Discovery Agent** is the foundational agent in the Agentic QE Framework STLC (Software Testing Lifecycle). It performs deep analysis of applications to create a comprehensive knowledge base for downstream testing agents.

**Status**: ✅ Fully integrated with STLC workflow
**Quality Score**: Dynamic (calculated based on discovery completeness)

## Purpose & Role

The Application Discovery Agent serves as the **initial phase of quality engineering**, responsible for:

1. **Tech Stack Discovery** - Identifying and documenting all technologies
2. **Architecture Analysis** - Understanding system design and patterns
3. **Codebase Mapping** - Cataloging components and their relationships
4. **JIRA Integration** - Creating structured data for test coverage tracking
5. **Downstream Contextualization** - Preparing information for all downstream agents
6. **Quality Assessment** - Applying INVEST and SMART criteria

## STLC Integration

The Application Discovery Agent is the **first phase** in the complete testing lifecycle:

```
ApplicationDiscoveryAgent (Phase 0: Discovery)
    ↓ Provides tech stack, architecture, components
RequirementAgent (Phase 1: Requirements Analysis)
    ↓ Analyzes requirements with domain context
DesignAgent (Phase 2: Test Design)
    ↓ Designs BDD scenarios using discovered components
DataAgent (Phase 3: Data Preparation)
    ↓ Prepares test data aligned with discovered models
ExecutionAgent (Phase 4: Test Execution)
    ↓ Executes tests with known infrastructure
DefectAgent (Phase 5: Defect Management)
    ↓ Logs defects with component traceability
ReportingAgent (Phase 6: Reporting)
    ↓ Generates comprehensive reports with quality metrics
CICDAgent (Phase 7: CI/CD Integration)
    ↓ Manages deployment with discovered pipeline
RelearningAgent (Phase 8: Continuous Improvement)
    ↓ Learns from execution to improve discovery
```

## Core Capabilities

### 1. Tech Stack Discovery

**Method**: `discoverTechStack(appDescription, codebasePath)`

Analyzes and documents:
- **Frontend Technologies**
  - Frameworks (React, Angular, Vue, Playwright, etc.)
  - UI Libraries and component frameworks
  - State management solutions
  - Package versions and dependencies

- **Backend Technologies**
  - Runtime environments (Node.js, Python, Java, etc.)
  - Application frameworks (Express, Django, Spring, etc.)
  - API patterns (REST, GraphQL, gRPC)
  - Middleware and authentication mechanisms

- **Database Technologies**
  - Database type (SQL, NoSQL, Graph, etc.)
  - ORM/Query patterns
  - Replication and clustering setup
  - Backup and recovery strategies

- **Infrastructure & DevOps**
  - Containerization (Docker, Kubernetes)
  - Cloud services (AWS, Azure, GCP)
  - Infrastructure as Code (Terraform, CloudFormation)
  - Load balancing and auto-scaling

- **Testing & QA Stack**
  - Test frameworks and runners
  - Assertion libraries
  - Mocking/stubbing frameworks
  - Coverage measurement tools

- **Integration & Security**
  - Authentication mechanisms (OAuth, JWT, SAML)
  - Authorization frameworks (RBAC, ABAC)
  - Encryption methods (TLS, AES)
  - API security patterns (API keys, tokens)

- **Monitoring & Observability**
  - Logging frameworks (ELK, Splunk, etc.)
  - Error tracking (Sentry, New Relic)
  - Performance monitoring (APM tools)
  - Health check endpoints

**Output**:
```json
{
  "frontend": {
    "framework": "React 18.2.0",
    "stateManagement": "Redux Toolkit",
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
    "orm": "Sequelize",
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

### 2. Architecture Analysis

**Method**: `analyzeArchitecture(appDescription, techStack)`

Documents:
- **Architectural Pattern**
  - Monolithic vs Microservices
  - Layered, Hexagonal, Event-Driven, etc.
  - CQRS (Command Query Responsibility Segregation)
  - API Gateway patterns

- **Component Layers**
  - Presentation Layer (UI components, page objects)
  - Business Logic Layer (services, use cases)
  - Data Access Layer (repositories, DAOs)
  - Infrastructure Layer (external services, integrations)

- **Communication Patterns**
  - Synchronous (REST, gRPC)
  - Asynchronous (Events, Message Queues)
  - Real-time (WebSockets, GraphQL subscriptions)
  - Batch processing (Scheduled tasks, ETL)

- **Scalability Architecture**
  - Horizontal vs vertical scaling
  - Database sharding strategy
  - Caching strategy (Redis, Memcached)
  - Rate limiting and throttling

- **Security Architecture**
  - Authentication flow (User registration, login, session)
  - Authorization model (RBAC, ABAC, ACL)
  - Network security (WAF, DDoS protection)
  - Data encryption (at rest, in transit)

- **Design Patterns**
  - Creational (Factory, Singleton, Builder)
  - Structural (Adapter, Proxy, Decorator)
  - Behavioral (Observer, Strategy, Chain of Responsibility)

**Output**:
```json
{
  "pattern": "Microservices with API Gateway",
  "layers": [
    {
      "name": "Presentation",
      "components": ["Web UI", "Mobile App"],
      "technologies": ["React", "React Native"]
    },
    {
      "name": "API Gateway",
      "components": ["Kong", "Authentication Service"],
      "responsibilities": ["Routing", "Rate limiting", "Auth"]
    },
    {
      "name": "Business Logic",
      "services": ["User Service", "Policy Service", "Quote Service"],
      "communicationPattern": "REST + Events"
    }
  ]
}
```

### 3. Codebase Component Mapping

**Method**: `mapCodebaseComponents(codebasePath, architecture)`

Maps all codebase components with:
- **Component ID** - Unique identifier for JIRA linking
- **Name & Description** - Clear component purpose
- **Type** - Service, Model, Utility, Config, etc.
- **File Locations** - Source file paths
- **Dependencies** - Internal and external dependencies
- **Risk Level** - Critical, High, Medium, Low
- **Test Coverage Priority** - Priority for QA focus

**Output**:
```json
[
  {
    "id": "USER_SERVICE",
    "name": "User Management Service",
    "type": "Service",
    "description": "Handles user registration, authentication, profile management",
    "files": ["src/services/UserService.js", "src/models/User.js"],
    "dependencies": ["DatabaseHelper", "AuthenticationService", "EmailService"],
    "externalDependencies": ["Firebase Auth", "SendGrid"],
    "riskLevel": "Critical",
    "testCoveragePriority": 1,
    "complexity": "High",
    "criticality": "High",
    "jiraKey": "QE-USER-001"
  },
  {
    "id": "POLICY_MODEL",
    "name": "Policy Data Model",
    "type": "Model",
    "description": "Represents insurance policy with coverage and terms",
    "files": ["src/models/Policy.js"],
    "dependencies": ["Database"],
    "riskLevel": "High",
    "testCoveragePriority": 2,
    "complexity": "Medium",
    "criticality": "High",
    "jiraKey": "QE-POLICY-001"
  }
]
```

### 4. JIRA Integration & Mapping

**Method**: `createJiraMapping(components, requirements)`

Creates JIRA-ready structure for test coverage:

**Epic**: Test Coverage for [Application]
- Links to all discovered components
- Defined quality metrics and acceptance criteria

**Stories**: One story per major component
- Includes INVEST criteria assessment
- Contains SMART goals for testing
- Links to codebase components
- Has story points based on complexity

**Tasks**: Support test infrastructure
- Test data setup
- Page Object Model creation
- API helper methods
- Database fixtures
- Test environment configuration

**Sub-tasks**: Specific test scenarios
- BDD Gherkin scenarios
- API test cases
- Database test cases
- Performance test cases

**Output**:
```json
{
  "epic": {
    "key": "QE-TC",
    "summary": "Test Coverage - Insurance Application",
    "description": "Comprehensive test coverage for all application components",
    "status": "OPEN"
  },
  "stories": [
    {
      "summary": "QA: User Registration & Authentication Test Coverage",
      "description": "Test coverage for user registration, login, password reset, MFA",
      "componentLink": "USER_SERVICE",
      "storyPoints": 13,
      "labels": ["test-coverage", "ui", "api", "critical"],
      "investCriteria": {
        "independent": "Yes",
        "negotiable": "Yes",
        "valuable": "Yes",
        "estimable": "Yes",
        "small": "No - recommend split",
        "testable": "Yes",
        "investScore": 83
      },
      "smartGoals": {
        "specific": "Achieve 90% code coverage for UserService",
        "measurable": "100% of acceptance criteria met",
        "achievable": "Yes - team has expertise",
        "relevant": "Yes - critical component",
        "timeBound": "2 sprints",
        "smartScore": 95
      },
      "tasks": [
        {
          "summary": "Create User Service Page Objects",
          "description": "Create page object models for all user-facing screens"
        },
        {
          "summary": "Create API Test Helpers",
          "description": "Create test helpers for user API endpoints"
        }
      ]
    }
  ]
}
```

### 5. Downstream Agent Contextualization

**Method**: `contextualizeForDownstreamAgents()`

Prepares tailored context for each downstream agent:

**For RequirementAgent**:
- Complete tech stack information
- Architecture overview
- Integration points
- Testing constraints
- Initial quality metrics

**For DesignAgent**:
- Architecture details
- Design patterns used
- Testability analysis
- Risk map
- Component relationships

**For DataAgent**:
- Data models and entities
- Database schema information
- API integration details
- Test data volume requirements
- Performance constraints

**For ExecutionAgent**:
- Tech stack for tool selection
- Component dependencies
- Environment configurations
- Infrastructure details
- CI/CD pipeline information

**Output**: Structured context passed to each agent

### 6. INVEST Criteria Evaluation

**Method**: `evaluateINVESTCriteria(story)`

Assesses each user story against INVEST principles:

- **I - Independent**: Story can be developed and tested independently
- **N - Negotiable**: Story details are open to discussion
- **V - Valuable**: Story delivers clear business value
- **E - Estimable**: Story can be estimated by the development team
- **S - Small**: Story is small enough to complete in one sprint
- **T - Testable**: Story has clear, testable acceptance criteria

**Output**:
```json
{
  "independent": {
    "score": 85,
    "status": "PASS",
    "issues": ["Depends on external API integration"],
    "recommendation": "Minimize external dependencies with mocking"
  },
  "negotiable": {
    "score": 90,
    "status": "PASS",
    "issues": [],
    "recommendation": "Story details are flexible for team discussion"
  },
  "valuable": {
    "score": 95,
    "status": "PASS",
    "issues": [],
    "recommendation": "Delivers significant business value"
  },
  "estimable": {
    "score": 80,
    "status": "PASS",
    "issues": ["Some uncertainty in scope"],
    "recommendation": "Clarify requirements before estimation"
  },
  "small": {
    "score": 70,
    "status": "WARNING",
    "issues": ["Story covers multiple user flows"],
    "recommendation": "Consider splitting into smaller stories"
  },
  "testable": {
    "score": 92,
    "status": "PASS",
    "issues": [],
    "recommendation": "Clear acceptance criteria - ready for test design"
  },
  "investScore": 85,
  "investStatus": "GOOD - Minor improvements needed"
}
```

### 7. SMART Goals Evaluation

**Method**: `evaluateSMARTGoals(goal)`

Ensures quality goals are SMART:

- **S - Specific**: Goal clearly defines what needs to be achieved
- **M - Measurable**: Goal has quantifiable success metrics
- **A - Achievable**: Goal is realistic and achievable with available resources
- **R - Relevant**: Goal aligns with project objectives and business needs
- **T - Time-bound**: Goal has clear deadlines and milestones

**Output**:
```json
{
  "goal": "Achieve 90% code coverage and fix all critical bugs",
  "specific": {
    "score": 95,
    "status": "PASS",
    "details": "Clearly defines 90% coverage and critical bug fixes"
  },
  "measurable": {
    "score": 98,
    "status": "PASS",
    "details": "Code coverage metrics and bug severity are quantifiable"
  },
  "achievable": {
    "score": 88,
    "status": "PASS",
    "issues": ["Tight timeline"],
    "recommendation": "Allocate sufficient resources for QA"
  },
  "relevant": {
    "score": 92,
    "status": "PASS",
    "details": "Aligns with product quality standards"
  },
  "timeBound": {
    "score": 90,
    "status": "PASS",
    "details": "Clear target date for completion"
  },
  "smartScore": 93,
  "smartStatus": "EXCELLENT - Ready for execution",
  "recommendations": [
    "Establish baseline code coverage metrics",
    "Set up automated coverage reporting",
    "Define critical vs non-critical bug categories",
    "Create daily dashboards for progress tracking",
    "Plan regular review cycles"
  ]
}
```

## Workflow & Methods

### Quick Start: Full Discovery Workflow

```javascript
const ApplicationDiscoveryAgent = require('./agents/ApplicationDiscoveryAgent');
const agent = new ApplicationDiscoveryAgent(process.env.OPENAI_API_KEY);

// Execute full discovery workflow
async function performFullDiscovery() {
  // Step 1: Discover tech stack
  const techStack = await agent.discoverTechStack(
    'Retirement Insurance Quote & Policy Management System',
    '/path/to/codebase'
  );

  // Step 2: Analyze architecture
  const architecture = await agent.analyzeArchitecture(
    'Retirement Insurance Quote & Policy Management System',
    techStack
  );

  // Step 3: Map codebase components
  const components = await agent.mapCodebaseComponents(
    '/path/to/codebase',
    architecture
  );

  // Step 4: Create JIRA mapping
  const jiraMapping = await agent.createJiraMapping(
    components,
    'Business requirements document'
  );

  // Step 5: Prepare downstream context
  const downstreamContext = await agent.contextualizeForDownstreamAgents();

  // Step 6: Get discovery summary
  const summary = agent.getDiscoverySummary();

  return {
    techStack,
    architecture,
    components,
    jiraMapping,
    downstreamContext,
    summary
  };
}
```

### Individual Method Usage

```javascript
// Evaluate INVEST criteria for a user story
const storyInvestEval = agent.evaluateINVESTCriteria({
  title: 'User Registration with Email Verification',
  description: 'As a user, I want to register with email verification'
});

// Evaluate SMART goals
const goalSmartEval = agent.evaluateSMARTGoals({
  goal: 'Achieve 85% code coverage for critical components',
  timeline: '2 sprints',
  metrics: ['Code coverage %', 'Defect density']
});

// Get discovery readiness assessment
const readiness = agent.assessTestingReadiness();

// Get discovery summary
const summary = agent.getDiscoverySummary();
```

## Quality Metrics & Scoring

The Application Discovery Agent maintains quality metrics:

### Discovery Quality Score (0-100)

**Components**:
- **Tech Stack Completeness** (25 points)
  - All major technology categories identified
  - Version information documented
  - Dependencies mapped

- **Architecture Documentation** (25 points)
  - Pattern clearly identified
  - Component relationships documented
  - Communication flows mapped

- **Component Mapping** (25 points)
  - All major components identified
  - Dependencies resolved
  - JIRA mapping complete

- **Downstream Contextualization** (25 points)
  - Context prepared for all agents
  - Quality metrics calculated
  - Readiness assessment complete

### INVEST Score (0-100 per story)

Aggregate of six INVEST criteria:
- 90-100: Excellent INVEST compliance
- 80-89: Good, minor improvements needed
- 70-79: Acceptable, but recommend changes
- Below 70: Significant rework needed

### SMART Score (0-100 per goal)

Aggregate of five SMART criteria:
- 90-100: Excellent SMART goal
- 80-89: Good, actionable goal
- 70-79: Acceptable, may need clarification
- Below 70: Rework required

## Integration Points

### With RequirementAgent
```
ApplicationDiscoveryAgent.discoverTechStack()
       ↓
RequirementAgent.analyzeRequirements(techStackContext)
```

### With DesignAgent
```
ApplicationDiscoveryAgent.analyzeArchitecture()
ApplicationDiscoveryAgent.mapCodebaseComponents()
       ↓
DesignAgent.designTestCases(architectureContext, componentsContext)
```

### With DataAgent
```
ApplicationDiscoveryAgent.extractDataModels()
ApplicationDiscoveryAgent.identifyTestDataRequirements()
       ↓
DataAgent.prepareTestData(dataModelsContext)
```

### With ExecutionAgent
```
ApplicationDiscoveryAgent.discoverTechStack()
ApplicationDiscoveryAgent.mapCodebaseComponents()
       ↓
ExecutionAgent.executeTests(techStackContext, componentsContext)
```

### With ReportingAgent
```
ApplicationDiscoveryAgent.getDiscoverySummary()
       ↓
ReportingAgent.generateReport(discoverySummary)
```

### With JIRA
```
ApplicationDiscoveryAgent.createJiraMapping()
       ↓
JIRA REST API (create epics, stories, tasks)
```

## Quality Scoring Documentation

The Application Discovery Agent is complemented by comprehensive quality scoring documentation:

- [INVEST & SMART Quality Scoring](../quality_scoring/invest_smart_quality.md) - Detailed scoring criteria

## Best Practices

1. **Iterative Discovery**: Start with core components, then progressively refine
2. **Validation**: Have teams validate discovered architecture and components
3. **Documentation**: Keep tech stack and architecture documentation current
4. **JIRA Synchronization**: Sync component mapping with JIRA regularly
5. **Quality Gates**: Use INVEST/SMART scores to gate downstream agent execution
6. **Risk Assessment**: Identify high-risk components for focused testing
7. **Dependency Management**: Track and manage component dependencies
8. **Compliance Alignment**: Ensure discovered architecture meets compliance requirements

## Common Patterns & Examples

### Pattern 1: Monolithic Application
- Single deployment unit
- Layered architecture
- Shared database
- Tightly coupled components

### Pattern 2: Microservices Architecture
- Multiple services (one per domain)
- API Gateway pattern
- Service-to-service communication
- Separate databases per service
- Event-driven integration

### Pattern 3: Hybrid Architecture
- Core monolith with microservices
- Strangler pattern for migration
- Mixed communication patterns
- Gradual decomposition

## Troubleshooting & FAQs

**Q: What if the codebase is very large?**
A: Use iterative discovery - start with core services and progressively map additional components. The agent can handle large codebases by chunking analysis.

**Q: How do we update discovery when architecture changes?**
A: Re-run discovery workflows periodically (quarterly recommended) and track changes in version control.

**Q: How are INVEST/SMART scores calculated?**
A: Each criterion is evaluated with specific heuristics and a final aggregate score is computed. See quality scoring documentation for details.

**Q: Can discovery work with legacy systems?**
A: Yes, the agent can analyze legacy systems and document existing tech stack and architecture for test planning.

## Related Documentation

- [INVEST & SMART Quality Scoring](../quality_scoring/invest_smart_quality.md)
- [Architecture Overview](../Architecture-Agentic-QE.md)
- [JIRA Integration](../integrations/jira/jira_integration.md)
- [Requirement Traceability Matrix](../traceability/requirement_traceability_matrix.md)
- [CI/CD Traceability](../traceability/ci_cd_traceability.md)

## Future Enhancements

- [ ] OpenAPI/Swagger discovery for API analysis
- [ ] Source code pattern recognition
- [ ] Database schema auto-discovery
- [ ] Dependency graph visualization
- [ ] Compliance requirement auto-detection
- [ ] Performance baseline discovery
- [ ] Security vulnerability discovery integration
