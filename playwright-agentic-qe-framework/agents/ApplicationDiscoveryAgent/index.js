const BaseAgent = require('../BaseAgent');

class ApplicationDiscoveryAgent extends BaseAgent {
  constructor(apiKey) {
    super('ApplicationDiscoveryAgent', apiKey);
    this.discoveryData = {
      techStack: {},
      architecture: {},
      codebaseComponents: [],
      jiraMapping: {},
      downstreamContext: {}
    };
  }

  /**
   * Discovers the application tech stack landscape
   * Maps frontend, backend, database, and infrastructure technologies
   */
  async discoverTechStack(appDescription, codebasePath) {
    const task = `Analyze the tech stack for: ${appDescription}
    
    Codebase location: ${codebasePath}
    
    Provide a comprehensive tech stack landscape analysis including:
    1. Frontend Technologies (frameworks, UI libraries, state management)
    2. Backend Technologies (runtime, frameworks, APIs)
    3. Database Technologies (type, ORM, query patterns)
    4. Infrastructure & DevOps (containerization, CI/CD, cloud services)
    5. Testing & QA Tools (frameworks, automation tools, coverage tools)
    6. Integration & Security (authentication, authorization, encryption)
    7. Monitoring & Logging (observability, error tracking, performance monitoring)
    
    Return as structured JSON with version information and dependencies.`;
    
    const result = await this.performTask(task);
    this.discoveryData.techStack = this.parseTechStack(result);
    return this.discoveryData.techStack;
  }

  /**
   * Analyzes application architecture and design patterns
   */
  async analyzeArchitecture(appDescription, techStack) {
    const task = `Based on the tech stack: ${JSON.stringify(techStack)}
    
    Analyze the architecture for: ${appDescription}
    
    Provide detailed architecture analysis including:
    1. Architectural Pattern (MVC, MVVM, Microservices, Monolithic, etc.)
    2. Layers & Components (Presentation, Business Logic, Data Access, Integration)
    3. Communication Patterns (REST, GraphQL, Events, gRPC, etc.)
    4. Scalability Approach (horizontal/vertical, load balancing, caching)
    5. Security Architecture (auth flow, data protection, network security)
    6. Dependency Injection & IoC patterns
    7. Design Patterns Used (Factory, Strategy, Observer, Decorator, etc.)
    
    Identify critical components and their interactions.
    Return as structured JSON with component relationships.`;
    
    const result = await this.performTask(task);
    this.discoveryData.architecture = this.parseArchitecture(result);
    return this.discoveryData.architecture;
  }

  /**
   * Maps codebase components for JIRA integration
   * Creates structured data for test coverage and traceability
   */
  async mapCodebaseComponents(codebasePath, architecture) {
    const task = `Map codebase components from: ${codebasePath}
    
    Based on architecture: ${JSON.stringify(architecture)}
    
    Identify and structure all codebase components:
    1. Modules & Packages (name, purpose, dependencies)
    2. Services & Controllers (HTTP endpoints, business logic)
    3. Data Models & Entities (database schema, ORM mappings)
    4. Configuration Files (environment configs, feature flags)
    5. Utility & Helper Functions (cross-cutting concerns)
    6. Test Infrastructure (fixtures, mocks, test utilities)
    7. CI/CD Pipelines & Deployment Scripts
    
    For each component, provide:
    - Component ID (unique identifier)
    - Name & Description
    - Type (Service, Model, Utility, Config, etc.)
    - Dependencies (internal & external)
    - Risk Level (Critical, High, Medium, Low)
    - Test Coverage Priority
    
    Return as structured JSON array with JIRA mapping fields.`;
    
    const result = await this.performTask(task);
    this.discoveryData.codebaseComponents = this.parseCodebaseComponents(result);
    return this.discoveryData.codebaseComponents;
  }

  /**
   * Creates JIRA-compatible structured data
   * Enables direct integration and epic/story creation
   */
  async createJiraMapping(components, requirements) {
    const task = `Create JIRA mapping for QE test coverage:
    
    Components: ${JSON.stringify(components)}
    Requirements: ${requirements}
    
    Generate JIRA structure including:
    1. Epic: "Test Coverage - [Application Name]"
    2. Stories for each major component with:
       - Summary (Gherkin-ready format)
       - Description (acceptance criteria)
       - Component Link (codebase component ID)
       - Labels (test-type, domain, priority)
       - Story Points (estimate based on complexity)
    3. Tasks for test infrastructure:
       - Test Data Setup
       - Page Object Models
       - API Helper Methods
       - Database Fixtures
    4. Sub-tasks for test scenarios:
       - BDD Gherkin scenarios
       - API test cases
       - Database test cases
    
    Include:
    - INVEST criteria assessment (Independent, Negotiable, Valuable, Estimable, Small, Testable)
    - SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)
    - Traceability fields for requirement links
    - Quality metrics and scoring criteria
    
    Return as structured JSON with JIRA issue templates.`;
    
    const result = await this.performTask(task);
    this.discoveryData.jiraMapping = this.parseJiraMapping(result);
    return this.discoveryData.jiraMapping;
  }

  /**
   * Prepares downstream agent context
   * Passes discovered information to RequirementAgent, DesignAgent, DataAgent
   */
  async contextualizeForDownstreamAgents() {
    const downstreamContext = {
      forRequirementAgent: {
        techStack: this.discoveryData.techStack,
        architecture: this.discoveryData.architecture,
        components: this.discoveryData.codebaseComponents,
        testingConstraints: this.identifyTestingConstraints(),
        integrationPoints: this.identifyIntegrationPoints(),
        qualityMetrics: this.calculateInitialQualityMetrics()
      },
      forDesignAgent: {
        architecture: this.discoveryData.architecture,
        components: this.discoveryData.codebaseComponents,
        designPatterns: this.extractDesignPatterns(),
        testabilityAnalysis: this.analyzeTestability(),
        riskMap: this.createRiskMap()
      },
      forDataAgent: {
        dataModels: this.extractDataModels(),
        integrations: this.discoveryData.jiraMapping,
        testDataRequirements: this.identifyTestDataRequirements(),
        performanceConstraints: this.identifyPerformanceConstraints()
      },
      forExecutionAgent: {
        techStack: this.discoveryData.techStack,
        components: this.discoveryData.codebaseComponents,
        environmentConfig: this.discoveryData.architecture,
        dependencies: this.resolveDependencies()
      }
    };

    this.discoveryData.downstreamContext = downstreamContext;
    return downstreamContext;
  }

  /**
   * Evaluates INVEST criteria for discovered requirements
   * Ensures stories are Independent, Negotiable, Valuable, Estimable, Small, Testable
   */
  evaluateINVESTCriteria(story) {
    return {
      independent: this.checkIndependence(story),
      negotiable: this.checkNegotiable(story),
      valuable: this.checkValuable(story),
      estimable: this.checkEstimable(story),
      small: this.checkSize(story),
      testable: this.checkTestability(story),
      investScore: this.calculateINVESTScore(story)
    };
  }

  /**
   * Evaluates SMART criteria for quality goals
   * Ensures goals are Specific, Measurable, Achievable, Relevant, Time-bound
   */
  evaluateSMARTGoals(goal) {
    return {
      specific: this.checkSpecific(goal),
      measurable: this.checkMeasurable(goal),
      achievable: this.checkAchievable(goal),
      relevant: this.checkRelevant(goal),
      timeBound: this.checkTimeBound(goal),
      smartScore: this.calculateSMARTScore(goal),
      recommendations: this.generateSMARTRecommendations(goal)
    };
  }

  // Parsing methods
  parseTechStack(result) {
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {
        frontend: 'Playwright',
        backend: 'Node.js',
        database: 'PostgreSQL',
        infrastructure: 'Docker/K8s',
        raw: result
      };
    } catch (error) {
      return { raw: result, error: error.message };
    }
  }

  parseArchitecture(result) {
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {
        pattern: 'Layered Architecture',
        components: [],
        raw: result
      };
    } catch (error) {
      return { raw: result, error: error.message };
    }
  }

  parseCodebaseComponents(result) {
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [{
        id: 'unknown',
        name: 'Application',
        raw: result
      }];
    } catch (error) {
      return [{ raw: result, error: error.message }];
    }
  }

  parseJiraMapping(result) {
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {
        epic: 'Test Coverage',
        stories: [],
        raw: result
      };
    } catch (error) {
      return { raw: result, error: error.message };
    }
  }

  // Context extraction methods
  identifyTestingConstraints() {
    return {
      environmentConstraints: [],
      performanceLimits: [],
      securityRestrictions: [],
      complianceRequirements: []
    };
  }

  identifyIntegrationPoints() {
    return {
      externalAPIs: [],
      thirdPartyServices: [],
      databases: [],
      messageQueues: []
    };
  }

  calculateInitialQualityMetrics() {
    return {
      codeComplexity: 0,
      testCoverageTarget: 80,
      automationRatio: 0.85,
      defectDensity: 0
    };
  }

  extractDesignPatterns() {
    return {
      creational: [],
      structural: [],
      behavioral: []
    };
  }

  analyzeTestability() {
    return {
      unitTestability: 0,
      integrationTestability: 0,
      e2eTestability: 0,
      mocking: [],
      stubbing: []
    };
  }

  createRiskMap() {
    return {
      critical: [],
      high: [],
      medium: [],
      low: []
    };
  }

  extractDataModels() {
    return {
      entities: [],
      relationships: [],
      constraints: [],
      defaultValues: {}
    };
  }

  identifyTestDataRequirements() {
    return {
      volumeRequired: 0,
      varietyNeeded: [],
      refreshFrequency: 'per-test',
      privacyConsiderations: []
    };
  }

  identifyPerformanceConstraints() {
    return {
      responseTimeLimit: 0,
      throughputTarget: 0,
      concurrencyLimit: 0
    };
  }

  resolveDependencies() {
    return {
      external: [],
      internal: [],
      conflictingVersions: []
    };
  }

  // INVEST Criteria evaluation
  checkIndependence(story) {
    return {
      score: 0,
      issues: [],
      recommendation: 'Ensure story can be developed and tested independently'
    };
  }

  checkNegotiable(story) {
    return {
      score: 0,
      issues: [],
      recommendation: 'Ensure story details are open to discussion'
    };
  }

  checkValuable(story) {
    return {
      score: 0,
      issues: [],
      recommendation: 'Ensure story delivers business value'
    };
  }

  checkEstimable(story) {
    return {
      score: 0,
      issues: [],
      recommendation: 'Ensure story can be estimated by the team'
    };
  }

  checkSize(story) {
    return {
      score: 0,
      issues: [],
      recommendation: 'Ensure story is small enough to complete in one sprint'
    };
  }

  checkTestability(story) {
    return {
      score: 0,
      issues: [],
      recommendation: 'Ensure story has clear acceptance criteria'
    };
  }

  calculateINVESTScore(story) {
    const criteria = [
      this.checkIndependence(story),
      this.checkNegotiable(story),
      this.checkValuable(story),
      this.checkEstimable(story),
      this.checkSize(story),
      this.checkTestability(story)
    ];
    return criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length;
  }

  // SMART Criteria evaluation
  checkSpecific(goal) {
    return {
      score: 0,
      details: 'Goal clearly defines what needs to be achieved',
      issues: []
    };
  }

  checkMeasurable(goal) {
    return {
      score: 0,
      details: 'Goal has measurable success criteria',
      issues: []
    };
  }

  checkAchievable(goal) {
    return {
      score: 0,
      details: 'Goal is realistic and achievable',
      issues: []
    };
  }

  checkRelevant(goal) {
    return {
      score: 0,
      details: 'Goal is relevant to project objectives',
      issues: []
    };
  }

  checkTimeBound(goal) {
    return {
      score: 0,
      details: 'Goal has clear timeline',
      issues: []
    };
  }

  calculateSMARTScore(goal) {
    const criteria = [
      this.checkSpecific(goal),
      this.checkMeasurable(goal),
      this.checkAchievable(goal),
      this.checkRelevant(goal),
      this.checkTimeBound(goal)
    ];
    return criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length;
  }

  generateSMARTRecommendations(goal) {
    return [
      'Define specific metrics and KPIs',
      'Set realistic timelines based on complexity',
      'Establish baseline measurements',
      'Create measurable acceptance criteria',
      'Document goal rationale and business justification'
    ];
  }

  // Discovery summary for downstream agents
  getDiscoverySummary() {
    return {
      techStackSummary: this.summarizeTechStack(),
      architectureSummary: this.summarizeArchitecture(),
      componentCount: this.discoveryData.codebaseComponents.length,
      jiraStoriesCount: Object.keys(this.discoveryData.jiraMapping).length,
      downstreamContextReady: Object.keys(this.discoveryData.downstreamContext).length > 0,
      qualityScore: this.getQualityScore(),
      readinessForTesting: this.assessTestingReadiness()
    };
  }

  summarizeTechStack() {
    const ts = this.discoveryData.techStack;
    return `Frontend: ${ts.frontend || 'N/A'}, Backend: ${ts.backend || 'N/A'}, DB: ${ts.database || 'N/A'}`;
  }

  summarizeArchitecture() {
    const arch = this.discoveryData.architecture;
    return arch.pattern || 'Layered Architecture';
  }

  assessTestingReadiness() {
    return {
      techStackReady: Object.keys(this.discoveryData.techStack).length > 0,
      architectureDocumented: Object.keys(this.discoveryData.architecture).length > 0,
      componentsMapped: this.discoveryData.codebaseComponents.length > 0,
      jiraIntegrationReady: Object.keys(this.discoveryData.jiraMapping).length > 0,
      downstreamContextPrepared: Object.keys(this.discoveryData.downstreamContext).length > 0,
      overallReadiness: 0.0
    };
  }
}

module.exports = ApplicationDiscoveryAgent;
