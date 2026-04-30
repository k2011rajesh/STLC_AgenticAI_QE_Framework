/**
 * Project Kickoff Orchestrator
 * Coordinates UseCaseAnalysisAgent, RawRequirementAgent, and Jira generation
 * Performs complete project initialization and planning
 * 
 * Complete Workflow:
 * 1. Ingest raw requirements
 * 2. Extract and structure requirements  
 * 3. Perform application discovery
 * 4. Extract use cases
 * 5. Validate and map everything
 * 6. Generate Jira project structure
 * 7. Create use case documentation
 * 8. Generate comprehensive reports
 */

const UseCaseAnalysisAgent = require('./agents/UseCaseAnalysisAgent');
const RawRequirementAgent = require('./agents/RawRequirementAgent');
const ApplicationDiscoveryAgent = require('./agents/ApplicationDiscoveryAgent');
const ProjectKickoffJiraGenerator = require('./integrations/mapping/project_kickoff_jira_generator');
const { getDomainApp } = require('./domains/domain_apps');
const fs = require('fs').promises;
const path = require('path');

class ProjectKickoffOrchestrator {
  constructor(config = {}) {
    this.config = {
      apiKey: process.env.OPENAI_API_KEY,
      jiraUrl: process.env.JIRA_URL || 'https://k2011rajesh.atlassian.net',
      jiraEmail: process.env.JIRA_EMAIL,
      jiraApiToken: process.env.JIRA_API_TOKEN,
      jiraProjectKey: process.env.JIRA_PROJECT_KEY || 'QED',
      useCaseOutputDir: './use_cases',
      domainsOutputDir: './domains_docs',
      ...config
    };

    // Initialize agents
    this.useCaseAgent = new UseCaseAnalysisAgent(this.config.apiKey);
    this.requirementAgent = new RawRequirementAgent(this.config.apiKey);
    this.discoveryAgent = new ApplicationDiscoveryAgent(this.config.apiKey);
    this.jiraGenerator = new ProjectKickoffJiraGenerator({
      jiraUrl: this.config.jiraUrl,
      email: this.config.jiraEmail,
      apiToken: this.config.jiraApiToken,
      projectKey: this.config.jiraProjectKey
    });

    this.results = {
      rawRequirements: [],
      structuredRequirements: [],
      useCases: [],
      actors: [],
      discoveryData: null,
      jiraResult: null,
      documentation: []
    };
  }

  /**
   * Execute complete project kickoff
   */
  async executeProjectKickoff(applicationName, domainId, rawRequirements) {
    console.log('\n' + '='.repeat(100));
    console.log('🚀 PROJECT KICKOFF ORCHESTRATION');
    console.log('='.repeat(100) + '\n');

    console.log(`📱 Application: ${applicationName}`);
    console.log(`🏢 Domain: ${domainId}\n`);

    try {
      // Get domain definition
      const domainApp = getDomainApp(domainId);
      if (!domainApp) {
        throw new Error(`Domain ${domainId} not found`);
      }

      // Step 1: Ingest raw requirements
      console.log('\n📥 STEP 1: INGESTING RAW REQUIREMENTS');
      console.log('-'.repeat(100));
      const allRawRequirements = [
        ...(domainApp.rawRequirements || []),
        ...(rawRequirements || [])
      ];
      await this.requirementAgent.ingestRawRequirements(allRawRequirements);
      this.results.rawRequirements = this.requirementAgent.rawRequirements;

      // Step 2: Parse and structure requirements
      console.log('\n🔄 STEP 2: PARSING & STRUCTURING REQUIREMENTS');
      console.log('-'.repeat(100));
      const structuredRequirements = await this.requirementAgent.parseAndStructureRequirements(
        this.requirementAgent.rawRequirements
      );
      this.results.structuredRequirements = structuredRequirements;

      // Step 3: Validate requirements
      console.log('\n✅ STEP 3: VALIDATING REQUIREMENTS');
      console.log('-'.repeat(100));
      const validationReport = await this.requirementAgent.validateRequirements(
        structuredRequirements
      );
      console.log(`Validation Results:`);
      console.log(`  • Valid Requirements: ${validationReport.completeness.validRequirements}`);
      console.log(`  • Issues Found: ${validationReport.completeness.requirementsWithIssues}`);
      console.log(`  • Completeness: ${validationReport.completeness.completenessPercentage}%`);

      // Step 4: Extract use cases
      console.log('\n🎯 STEP 4: EXTRACTING USE CASES');
      console.log('-'.repeat(100));
      const useCases = await this.useCaseAgent.extractUseCases(
        { 
          components: domainApp.components,
          actors: domainApp.actors,
          criticalPaths: domainApp.criticalPaths
        },
        structuredRequirements,
        applicationName
      );
      this.results.useCases = useCases;

      // Step 5: Generate scenarios
      console.log('\n🔄 STEP 5: GENERATING TEST SCENARIOS');
      console.log('-'.repeat(100));
      await this.useCaseAgent.generateScenarios(useCases);

      // Step 6: Generate acceptance criteria
      console.log('\n📋 STEP 6: GENERATING ACCEPTANCE CRITERIA');
      console.log('-'.repeat(100));
      const useCasesWithCriteria = await this.useCaseAgent.generateAcceptanceCriteria(useCases);
      this.results.useCases = useCasesWithCriteria;

      // Step 7: Identify actors
      console.log('\n👥 STEP 7: IDENTIFYING ACTORS');
      console.log('-'.repeat(100));
      const actors = await this.useCaseAgent.identifyActors(useCasesWithCriteria);
      this.results.actors = actors;
      console.log(`Identified ${actors.length} actors`);

      // Step 8: Perform application discovery (optional)
      console.log('\n🔍 STEP 8: APPLICATION DISCOVERY');
      console.log('-'.repeat(100));
      const discoveryData = {
        components: domainApp.components,
        riskAreas: domainApp.riskAreas
      };
      this.results.discoveryData = discoveryData;

      // Step 9: Save use case documentation
      console.log('\n💾 STEP 9: SAVING USE CASE DOCUMENTATION');
      console.log('-'.repeat(100));
      const docFiles = await this.useCaseAgent.saveUseCaseDocumentation(
        useCasesWithCriteria,
        this.config.useCaseOutputDir
      );
      this.results.documentation = docFiles;

      // Step 10: Save domain app documentation
      console.log('\n💾 STEP 10: SAVING DOMAIN DOCUMENTATION');
      console.log('-'.repeat(100));
      await this.saveDomainDocumentation(domainApp);

      // Step 11: Generate Jira project structure
      console.log('\n🔗 STEP 11: GENERATING JIRA PROJECT STRUCTURE');
      console.log('-'.repeat(100));
      const jiraResult = await this.jiraGenerator.generateProjectKickoff(
        applicationName,
        domainApp,
        useCasesWithCriteria,
        structuredRequirements,
        discoveryData
      );
      this.results.jiraResult = jiraResult;

      // Step 12: Generate final report
      console.log('\n📊 STEP 12: GENERATING FINAL REPORT');
      console.log('-'.repeat(100));
      const finalReport = this.generateFinalReport(
        applicationName,
        domainApp,
        validationReport,
        jiraResult
      );

      console.log('\n' + '='.repeat(100));
      console.log('✅ PROJECT KICKOFF COMPLETE');
      console.log('='.repeat(100) + '\n');

      this.printFinalSummary(finalReport);

      return {
        success: true,
        applicationName,
        domainId,
        results: this.results,
        report: finalReport,
        jiraUrl: jiraResult.jiraUrl
      };

    } catch (error) {
      console.error('\n❌ ERROR IN PROJECT KICKOFF:', error.message);
      throw error;
    }
  }

  /**
   * Save domain documentation
   */
  async saveDomainDocumentation(domainApp) {
    try {
      await fs.mkdir(this.config.domainsOutputDir, { recursive: true });

      const filePath = path.join(
        this.config.domainsOutputDir,
        `${domainApp.id}_domain.md`
      );

      const content = `# ${domainApp.name}

## Overview

**Domain**: ${domainApp.domain}  
**Type**: ${domainApp.type}  
**Description**: ${domainApp.description}

## Raw Requirements

${domainApp.rawRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

## Core Components

${domainApp.components.map(comp => `- ${comp}`).join('\n')}

## Key Actors

${domainApp.actors.map(actor => `- ${actor}`).join('\n')}

## Critical User Paths

${domainApp.criticalPaths.map((path, i) => `${i + 1}. ${path}`).join('\n')}

## Risk Areas

${domainApp.riskAreas.map((risk, i) => `${i + 1}. ${risk}`).join('\n')}

---

*Generated for Project Kickoff*
`;

      await fs.writeFile(filePath, content, 'utf8');
      console.log(`  ✓ Domain documentation saved: ${filePath}`);
    } catch (error) {
      console.error(`  ✗ Error saving domain documentation:`, error.message);
    }
  }

  /**
   * Generate final comprehensive report
   */
  generateFinalReport(applicationName, domainApp, validationReport, jiraResult) {
    const useCaseMetrics = this.useCaseAgent.getQualityMetrics();
    const requirementMetrics = this.requirementAgent.getQualityMetrics();

    return {
      timestamp: new Date().toISOString(),
      project: {
        name: applicationName,
        domain: domainApp.domain,
        type: domainApp.type
      },
      metrics: {
        requirements: {
          total: requirementMetrics.rawRequirementsIngested,
          structured: requirementMetrics.structuredRequirementsGenerated,
          validated: validationReport.completeness.validRequirements,
          completenessPercentage: validationReport.completeness.completenessPercentage
        },
        useCases: {
          identified: useCaseMetrics.useCasesIdentified,
          scenarios: useCaseMetrics.scenariosCreated,
          actors: useCaseMetrics.actorsIdentified,
          acceptanceCriteria: useCaseMetrics.acceptanceCriteriaGenerated
        },
        jira: {
          epicsCreated: jiraResult.state.qualityMetrics.epicsCreated,
          storiesCreated: jiraResult.state.qualityMetrics.storiesCreated,
          tasksCreated: jiraResult.state.qualityMetrics.tasksCreated,
          acceptanceCriteriaCreated: jiraResult.state.qualityMetrics.acceptanceCriteriaCreated
        }
      },
      documentation: {
        useCaseFiles: this.results.documentation.length,
        domainFiles: 1
      },
      jira: {
        projectKey: this.config.jiraProjectKey,
        epicKey: jiraResult.projectEpicKey,
        boardUrl: jiraResult.jiraUrl
      },
      summary: {
        totalRequirements: requirementMetrics.rawRequirementsIngested,
        totalUseCases: useCaseMetrics.useCasesIdentified,
        totalActors: useCaseMetrics.actorsIdentified,
        totalScenarios: useCaseMetrics.scenariosCreated,
        totalJiraItems: jiraResult.state.qualityMetrics.epicsCreated +
                        jiraResult.state.qualityMetrics.storiesCreated +
                        jiraResult.state.qualityMetrics.tasksCreated
      },
      nextSteps: [
        '1. Open Jira board: ' + jiraResult.jiraUrl,
        '2. Review all created epics and stories',
        '3. Refine acceptance criteria and test scenarios',
        '4. Assign stories to team members',
        '5. Set sprint planning and milestones',
        '6. Review use case documentation in ./use_cases',
        '7. Start test automation setup',
        '8. Begin development with Jira tracking'
      ]
    };
  }

  /**
   * Print final summary
   */
  printFinalSummary(report) {
    console.log('📊 FINAL PROJECT KICKOFF REPORT\n');

    console.log('Project Information:');
    console.log(`  Name: ${report.project.name}`);
    console.log(`  Domain: ${report.project.domain}`);
    console.log(`  Type: ${report.project.type}\n`);

    console.log('Requirements Analysis:');
    console.log(`  Total Requirements: ${report.metrics.requirements.total}`);
    console.log(`  Structured: ${report.metrics.requirements.structured}`);
    console.log(`  Validated: ${report.metrics.requirements.validated}`);
    console.log(`  Completeness: ${report.metrics.requirements.completenessPercentage}%\n`);

    console.log('Use Case Analysis:');
    console.log(`  Use Cases Identified: ${report.metrics.useCases.identified}`);
    console.log(`  Test Scenarios: ${report.metrics.useCases.scenarios}`);
    console.log(`  Actors: ${report.metrics.useCases.actors}`);
    console.log(`  Acceptance Criteria: ${report.metrics.useCases.acceptanceCriteria}\n`);

    console.log('Jira Project Structure:');
    console.log(`  Epics: ${report.metrics.jira.epicsCreated}`);
    console.log(`  Stories: ${report.metrics.jira.storiesCreated}`);
    console.log(`  Tasks: ${report.metrics.jira.tasksCreated}`);
    console.log(`  Total Items: ${report.summary.totalJiraItems}\n`);

    console.log('Documentation:');
    console.log(`  Use Case Files: ${report.documentation.useCaseFiles}`);
    console.log(`  Domain Files: ${report.documentation.domainFiles}\n`);

    console.log('Jira Access:');
    console.log(`  Project Key: ${report.jira.projectKey}`);
    console.log(`  Epic Key: ${report.jira.epicKey}`);
    console.log(`  Board URL: ${report.jira.boardUrl}\n`);

    console.log('Next Steps:');
    report.nextSteps.forEach(step => console.log(`  ${step}`));

    console.log('\n' + '='.repeat(100) + '\n');
  }
}

module.exports = ProjectKickoffOrchestrator;
