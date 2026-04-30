/**
 * Framework Integration - Discovery & Requirement Jira Mapper
 * 
 * This shows how to integrate the Discovery & Requirement Jira Mapper
 * into the main Agentic QE Framework orchestrator.
 * 
 * Integration points:
 * - After Phase 0 (ApplicationDiscoveryAgent)
 * - With Phase 1 (RequirementAgent)
 * - Before Phase 2 (DesignAgent)
 * 
 * @example
 * // In your main orchestrator (index.js):
 * const result = await orchestrator.runSTLC(appDescription, codebasePath, options);
 */

const ApplicationDiscoveryAgent = require('./agents/ApplicationDiscoveryAgent');
const RequirementAgent = require('./agents/RequirementAgent');
const DesignAgent = require('./agents/DesignAgent');
const DiscoveryRequirementJiraMapper = require('./integrations/mapping/discovery_requirement_jira_mapper');

/**
 * Framework Orchestrator with Jira Mapping
 * This is how to integrate the mapper into your STLC workflow
 */
class AgenticQEFrameworkWithJiraMapping {
  constructor(config = {}) {
    this.config = {
      apiKey: process.env.OPENAI_API_KEY,
      jiraUrl: process.env.JIRA_URL || 'https://k2011rajesh.atlassian.net',
      jiraEmail: process.env.JIRA_EMAIL,
      jiraApiToken: process.env.JIRA_API_TOKEN,
      jiraProjectKey: process.env.JIRA_PROJECT_KEY || 'QED',
      enableJiraMapping: true,
      ...config
    };

    // Initialize agents
    this.discoveryAgent = new ApplicationDiscoveryAgent(this.config.apiKey);
    this.requirementAgent = new RequirementAgent(this.config.apiKey);
    this.designAgent = new DesignAgent(this.config.apiKey);

    // Initialize Jira mapper
    if (this.config.enableJiraMapping) {
      this.jiraMapper = new DiscoveryRequirementJiraMapper({
        jiraUrl: this.config.jiraUrl,
        email: this.config.jiraEmail,
        apiToken: this.config.jiraApiToken,
        projectKey: this.config.jiraProjectKey
      });
    }

    this.stlcResults = {};
  }

  /**
   * Main STLC execution with Jira mapping
   * 
   * Workflow:
   * Phase 0: ApplicationDiscoveryAgent
   *   ↓ Discovers tech stack, architecture, components
   * [NEW] Discovery & Requirement Jira Mapper
   *   ↓ Maps components to Jira epic and stories
   * Phase 1: RequirementAgent
   *   ↓ Analyzes requirements with discovery context
   * [NEW] Jira Mapper (Requirements)
   *   ↓ Maps requirements to Jira and links to components
   * Phase 2: DesignAgent
   *   ↓ Designs tests with Jira traceability
   * ... More phases ...
   */
  async runSTLCWithJiraMapping(appDescription, codebasePath, applicationName) {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 AGENTIC QE FRAMEWORK - COMPLETE STLC WITH JIRA MAPPING');
    console.log('='.repeat(80) + '\n');

    try {
      // PHASE 0: APPLICATION DISCOVERY
      console.log('\n📦 PHASE 0: APPLICATION DISCOVERY');
      console.log('-'.repeat(80));
      const discoveryResult = await this.runPhase0Discovery(appDescription, codebasePath);

      // PHASE 1A: MAP DISCOVERY TO JIRA
      if (this.config.enableJiraMapping) {
        console.log('\n🔗 PHASE 1A: MAP DISCOVERY TO JIRA');
        console.log('-'.repeat(80));
        const jiraDiscoveryResult = await this.mapDiscoveryToJira(
          discoveryResult,
          applicationName
        );
        this.stlcResults.jiraDiscoveryMapping = jiraDiscoveryResult;
      }

      // PHASE 1B: REQUIREMENT ANALYSIS
      console.log('\n📋 PHASE 1B: REQUIREMENT ANALYSIS');
      console.log('-'.repeat(80));
      const requirementResult = await this.runPhase1Requirements(appDescription);

      // PHASE 1C: MAP REQUIREMENTS TO JIRA
      if (this.config.enableJiraMapping) {
        console.log('\n🔗 PHASE 1C: MAP REQUIREMENTS TO JIRA');
        console.log('-'.repeat(80));
        const jiraRequirementResult = await this.mapRequirementsToJira(
          requirementResult,
          discoveryResult,
          applicationName
        );
        this.stlcResults.jiraRequirementMapping = jiraRequirementResult;
      }

      // PHASE 2: TEST DESIGN (with Jira context)
      console.log('\n🎨 PHASE 2: TEST DESIGN (WITH JIRA CONTEXT)');
      console.log('-'.repeat(80));
      const designResult = await this.runPhase2Design(
        discoveryResult,
        requirementResult,
        this.stlcResults.jiraDiscoveryMapping
      );

      // Generate comprehensive report
      console.log('\n' + '='.repeat(80));
      console.log('✅ STLC EXECUTION COMPLETE WITH JIRA MAPPING');
      console.log('='.repeat(80) + '\n');

      const report = this.generateComprehensiveReport(
        discoveryResult,
        requirementResult,
        designResult
      );

      this.displayReport(report);

      return {
        success: true,
        stlcResults: this.stlcResults,
        report: report,
        jiraUrl: this.config.jiraUrl,
        jiraProject: this.config.jiraProjectKey
      };

    } catch (error) {
      console.error('❌ Error in STLC execution:', error.message);
      throw error;
    }
  }

  /**
   * PHASE 0: Discovery
   */
  async runPhase0Discovery(appDescription, codebasePath) {
    console.log('Discovering tech stack...');
    const techStack = await this.discoveryAgent.discoverTechStack(appDescription, codebasePath);
    console.log('✅ Tech stack discovered');

    console.log('Analyzing architecture...');
    const architecture = await this.discoveryAgent.analyzeArchitecture(appDescription, techStack);
    console.log('✅ Architecture analyzed');

    console.log('Mapping codebase components...');
    const components = await this.discoveryAgent.mapCodebaseComponents(codebasePath, architecture);
    console.log(`✅ ${components.length} components mapped`);

    this.stlcResults.phase0Discovery = {
      techStack,
      architecture,
      components,
      timestamp: new Date().toISOString()
    };

    return {
      techStack,
      architecture,
      codebaseComponents: components
    };
  }

  /**
   * Map discovery data to Jira
   */
  async mapDiscoveryToJira(discoveryResult, applicationName) {
    if (!this.jiraMapper) {
      console.log('⚠️  Jira mapping disabled');
      return null;
    }

    console.log(`Mapping ${discoveryResult.codebaseComponents.length} components to Jira...`);

    try {
      const result = await this.jiraMapper.mapDiscoveryAndRequirementsToJira(
        discoveryResult,
        [],
        `${applicationName} - Discovery`
      );

      console.log(`✅ Discovery mapped to Jira`);
      console.log(`   Epic Key: ${result.epicKey}`);
      console.log(`   Stories: ${result.mappingState.stories.length}`);
      console.log(`   Links: ${result.mappingState.requirementLinks.length}`);

      return result;
    } catch (error) {
      console.error('⚠️  Jira mapping failed (non-critical):', error.message);
      return null;
    }
  }

  /**
   * PHASE 1B: Requirements
   */
  async runPhase1Requirements(appDescription) {
    console.log('Analyzing requirements...');
    const requirements = await this.requirementAgent.analyzeRequirements(appDescription);
    console.log('✅ Requirements analyzed');

    this.stlcResults.phase1Requirements = {
      requirements,
      timestamp: new Date().toISOString()
    };

    return requirements;
  }

  /**
   * Map requirements to Jira and link to discovery
   */
  async mapRequirementsToJira(requirements, discoveryResult, applicationName) {
    if (!this.jiraMapper) {
      console.log('⚠️  Jira mapping disabled');
      return null;
    }

    console.log(`Mapping ${requirements.length} requirements to Jira...`);

    try {
      // Create new mapper instance for requirements mapping
      const requirementMapper = new DiscoveryRequirementJiraMapper({
        jiraUrl: this.config.jiraUrl,
        email: this.config.jiraEmail,
        apiToken: this.config.jiraApiToken,
        projectKey: this.config.jiraProjectKey
      });

      const result = await requirementMapper.mapDiscoveryAndRequirementsToJira(
        discoveryResult,
        requirements,
        `${applicationName} - Complete Mapping`
      );

      console.log(`✅ Requirements mapped to Jira`);
      console.log(`   Epic Key: ${result.epicKey}`);
      console.log(`   Requirement Stories: ${result.mappingState.stories.filter(s => s.type === 'requirement').length}`);
      console.log(`   Links: ${result.mappingState.requirementLinks.length}`);

      return result;
    } catch (error) {
      console.error('⚠️  Jira mapping failed (non-critical):', error.message);
      return null;
    }
  }

  /**
   * PHASE 2: Design (with Jira context)
   */
  async runPhase2Design(discoveryResult, requirements, jiraMapping) {
    console.log('Designing tests with discovery and Jira context...');

    // Pass Jira mapping as context to design agent
    const designContext = {
      discovery: discoveryResult,
      requirements,
      jiraMapping,
      jiraProject: this.config.jiraProjectKey,
      jiraUrl: `${this.config.jiraUrl}/jira/core/projects/${this.config.jiraProjectKey}/board`
    };

    const designResult = await this.designAgent.designTestScenarios(designContext);
    console.log('✅ Tests designed with Jira traceability');

    this.stlcResults.phase2Design = {
      testScenarios: designResult,
      timestamp: new Date().toISOString()
    };

    return designResult;
  }

  /**
   * Generate comprehensive report
   */
  generateComprehensiveReport(discoveryResult, requirementResult, designResult) {
    return {
      timestamp: new Date().toISOString(),
      phases: {
        phase0: {
          name: 'Application Discovery',
          status: 'complete',
          components: discoveryResult.codebaseComponents.length,
          techAreas: Object.keys(discoveryResult.techStack).length
        },
        phase1a: {
          name: 'Discovery to Jira Mapping',
          status: this.stlcResults.jiraDiscoveryMapping ? 'complete' : 'skipped',
          epicKey: this.stlcResults.jiraDiscoveryMapping?.epicKey,
          storiesMapped: this.stlcResults.jiraDiscoveryMapping?.mappingState.stories.length
        },
        phase1b: {
          name: 'Requirement Analysis',
          status: 'complete',
          requirements: Array.isArray(requirementResult) ? requirementResult.length : 0
        },
        phase1c: {
          name: 'Requirements to Jira Mapping',
          status: this.stlcResults.jiraRequirementMapping ? 'complete' : 'skipped',
          epicKey: this.stlcResults.jiraRequirementMapping?.epicKey
        },
        phase2: {
          name: 'Test Design',
          status: 'complete',
          testScenarios: designResult ? Object.keys(designResult).length : 0
        }
      },
      jiraIntegration: {
        enabled: this.config.enableJiraMapping,
        project: this.config.jiraProjectKey,
        url: `${this.config.jiraUrl}/jira/core/projects/${this.config.jiraProjectKey}/board`,
        epicKey: this.stlcResults.jiraRequirementMapping?.epicKey || this.stlcResults.jiraDiscoveryMapping?.epicKey
      }
    };
  }

  /**
   * Display formatted report
   */
  displayReport(report) {
    console.log('\n📊 STLC EXECUTION REPORT\n');
    console.log(`Timestamp: ${report.timestamp}\n`);

    console.log('Phase Summary:');
    Object.entries(report.phases).forEach(([phaseKey, phase]) => {
      const status = phase.status === 'complete' ? '✅' : '⏭️ ';
      console.log(`  ${status} ${phase.name}`);
      if (phase.epicKey) console.log(`     Epic: ${phase.epicKey}`);
      if (phase.components) console.log(`     Components: ${phase.components}`);
      if (phase.requirements) console.log(`     Requirements: ${phase.requirements}`);
    });

    if (report.jiraIntegration.enabled) {
      console.log('\nJira Integration:');
      console.log(`  Project: ${report.jiraIntegration.project}`);
      console.log(`  URL: ${report.jiraIntegration.url}`);
      if (report.jiraIntegration.epicKey) {
        console.log(`  Epic: ${report.jiraIntegration.epicKey}`);
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');
  }
}

/**
 * Usage Example
 */
async function exampleUsage() {
  // Initialize orchestrator with Jira mapping enabled
  const orchestrator = new AgenticQEFrameworkWithJiraMapping({
    enableJiraMapping: true
  });

  // Run complete STLC with Jira mapping
  try {
    const result = await orchestrator.runSTLCWithJiraMapping(
      'Banking application with payment processing',
      './playwright-agentic-qe-framework',
      'Banking Platform'
    );

    console.log('🎉 STLC Complete!');
    console.log(`\nJira Project: ${result.jiraProject}`);
    console.log(`View Results: ${result.jiraUrl}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = AgenticQEFrameworkWithJiraMapping;

// Run if executed directly
if (require.main === module) {
  exampleUsage();
}
