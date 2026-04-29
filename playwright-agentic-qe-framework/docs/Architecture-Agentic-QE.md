# Architecture – Agentic QE

## STLC (Software Testing Lifecycle) Phases & Agents

Each STLC phase is represented by a specialized agent:

### Complete Agent Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│        AGENTIC QUALITY ENGINEERING FRAMEWORK (STLC)            │
└─────────────────────────────────────────────────────────────────┘

Phase 0: APPLICATION DISCOVERY
  └─ ApplicationDiscoveryAgent
     ├─ Tech Stack Landscape Discovery
     ├─ Architecture Analysis
     ├─ Codebase Component Mapping
     ├─ JIRA Integration & Mapping
     ├─ INVEST & SMART Quality Scoring
     └─ Downstream Context Preparation
          ↓
Phase 1: REQUIREMENTS ANALYSIS
  └─ RequirementAgent
     ├─ Analyze business requirements
     ├─ Identify test strategies
     └─ Generate acceptance criteria
          ↓
Phase 2: TEST DESIGN
  └─ DesignAgent
     ├─ Design BDD scenarios
     ├─ Create test cases (UI, API, DB)
     └─ Map to discovered components
          ↓
Phase 3: TEST DATA PREPARATION
  └─ DataAgent
     ├─ Prepare realistic test data
     ├─ Create fixtures & profiles
     └─ Align with data models
          ↓
Phase 4: TEST EXECUTION
  └─ ExecutionAgent
     ├─ Orchestrate test runs
     ├─ Execute across domains
     └─ Collect results
          ↓
Phase 5: DEFECT MANAGEMENT
  └─ DefectAgent
     ├─ Analyze test failures
     ├─ Log defects to JIRA
     └─ Suggest fixes
          ↓
Phase 6: REPORTING
  └─ ReportingAgent
     ├─ Generate quality reports
     ├─ Track metrics & KPIs
     └─ Create dashboards
          ↓
Phase 7: CI/CD INTEGRATION
  └─ CICDAgent
     ├─ Manage CI/CD pipelines
     ├─ Coordinate deployments
     └─ Track deployment metrics
          ↓
Phase 8: CONTINUOUS LEARNING
  └─ RelearningAgent
     ├─ Analyze execution patterns
     ├─ Identify improvements
     └─ Optimize future iterations
          ↓
┌─────────────────────────────────────────────────────────────────┐
│ All agents track Quality Scores (0-100) in real-time            │
│ All agents contextualize with discovered application info      │
└─────────────────────────────────────────────────────────────────┘
```

### Agent List

- **ApplicationDiscoveryAgent** (Phase 0) - Application landscape analysis
- **RequirementAgent** (Phase 1) - Requirements analysis
- **DesignAgent** (Phase 2) - Test design
- **DataAgent** (Phase 3) - Test data preparation
- **ExecutionAgent** (Phase 4) - Test execution
- **DefectAgent** (Phase 5) - Defect management
- **ReportingAgent** (Phase 6) - Quality reporting
- **CICDAgent** (Phase 7) - CI/CD integration
- **RelearningAgent** (Phase 8) - Continuous learning

### Quality Scoring Framework

All agents use quality scoring:
- **0-100 Scale**: Real-time quality metrics
- **INVEST Criteria**: Story quality evaluation (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- **SMART Goals**: Quality goal definition (Specific, Measurable, Achievable, Relevant, Time-bound)
- **Dynamic Scoring**: Updated based on task success/failure

### Integration Points

#### Application Discovery ↔ All Downstream Agents

```
Discovery Context:
├─ Tech Stack Information
│  ├─ Frontend technologies
│  ├─ Backend frameworks
│  ├─ Database systems
│  └─ Infrastructure setup
├─ Architecture Details
│  ├─ Component relationships
│  ├─ Communication patterns
│  ├─ Design patterns
│  └─ Security architecture
├─ Component Mapping
│  ├─ Service mappings
│  ├─ API endpoints
│  ├─ Data models
│  └─ Dependencies
└─ JIRA Structures
   ├─ Epic definitions
   ├─ Story templates
   ├─ Component links
   └─ Quality gates
```

Each downstream agent receives tailored context to optimize their specific phase.
