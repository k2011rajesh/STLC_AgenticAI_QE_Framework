/**
 * Use Case Analysis Agent
 * Analyzes application discovery and raw requirements to extract and map use cases
 * Creates comprehensive use case documentation with scenarios, actors, and acceptance criteria
 * 
 * STLC Phase: 0.5 (Between Discovery and Requirements Analysis)
 * Purpose: Bridge ApplicationDiscoveryAgent and RequirementAgent outputs to use cases
 */

const BaseAgent = require('../BaseAgent');
const fs = require('fs').promises;
const path = require('path');

class UseCaseAnalysisAgent extends BaseAgent {
  constructor(apiKey) {
    super('UseCaseAnalysisAgent', apiKey);
    this.useCases = [];
    this.useCaseScenarios = {};
    this.actors = new Set();
    this.businessRules = [];
    this.preconditions = [];
    this.postconditions = [];
    this.qualityMetrics = {
      useCasesIdentified: 0,
      scenariosCreated: 0,
      actorsIdentified: 0,
      acceptanceCriteriaGenerated: 0
    };
  }

  /**
   * Extract use cases from application discovery and requirements
   * @param {Object} discoveryData - Data from ApplicationDiscoveryAgent
   * @param {Array} rawRequirements - Raw requirements from users
   * @param {String} applicationName - Name of the application
   * @returns {Array} Array of use cases
   */
  async extractUseCases(discoveryData, rawRequirements, applicationName) {
    const task = `Extract comprehensive use cases for: ${applicationName}

Discovery Data:
${JSON.stringify(discoveryData, null, 2)}

Raw Requirements:
${JSON.stringify(rawRequirements, null, 2)}

Identify and extract:
1. Primary Use Cases (core user workflows)
2. Secondary Use Cases (supporting workflows)
3. System Use Cases (admin/maintenance)

For each use case, provide:
- ID (UC-XXX)
- Name (verb-noun format)
- Description (1-2 sentences)
- Primary Actor (who initiates)
- Stakeholders (who is affected)
- Main Flow (step-by-step)
- Alternative Flows (branches)
- Exception Flows (error handling)
- Preconditions (what must be true)
- Postconditions (what will be true after)
- Business Rules (constraints)

Return as structured JSON array.`;

    const result = await this.performTask(task);
    this.useCases = this.parseUseCases(result);
    this.qualityMetrics.useCasesIdentified = this.useCases.length;
    
    console.log(`✅ Extracted ${this.useCases.length} use cases`);
    return this.useCases;
  }

  /**
   * Generate detailed scenarios for each use case
   * @param {Array} useCases - Use cases to expand
   * @returns {Object} Map of use case ID to scenarios
   */
  async generateScenarios(useCases) {
    console.log(`🔄 Generating scenarios for ${useCases.length} use cases...`);

    for (const useCase of useCases) {
      const task = `Generate detailed test scenarios for use case:
      
Name: ${useCase.name}
Description: ${useCase.description}
Main Flow: ${useCase.mainFlow.join(' → ')}
Alternative Flows: ${JSON.stringify(useCase.alternativeFlows)}
Preconditions: ${useCase.preconditions.join(', ')}

Create scenarios including:
1. Happy Path Scenario
   - Normal execution of main flow
   - Expected outcome
   - Test data

2. Alternative Flow Scenarios
   - Each alternative flow tested
   - Expected branches
   - Outcomes

3. Exception Scenarios
   - Error conditions
   - Error handling
   - Recovery

For each scenario provide:
- Title
- Steps (Given-When-Then format)
- Test Data
- Expected Result
- Acceptance Criteria

Return as structured JSON.`;

      const result = await this.performTask(task);
      this.useCaseScenarios[useCase.id] = this.parseScenarios(result);
      this.qualityMetrics.scenariosCreated += (this.useCaseScenarios[useCase.id]?.length || 0);
    }

    console.log(`✅ Generated ${this.qualityMetrics.scenariosCreated} total scenarios`);
    return this.useCaseScenarios;
  }

  /**
   * Extract and map actors from use cases
   * @param {Array} useCases - Use cases containing actor information
   * @returns {Array} Array of identified actors
   */
  async identifyActors(useCases) {
    console.log(`🔄 Identifying actors from ${useCases.length} use cases...`);

    const actorsMap = {};

    for (const useCase of useCases) {
      // Extract primary actor
      if (useCase.primaryActor) {
        if (!actorsMap[useCase.primaryActor]) {
          actorsMap[useCase.primaryActor] = {
            name: useCase.primaryActor,
            type: this.classifyActor(useCase.primaryActor),
            useCases: [],
            responsibilities: []
          };
        }
        actorsMap[useCase.primaryActor].useCases.push(useCase.id);
      }

      // Extract stakeholders
      if (useCase.stakeholders && Array.isArray(useCase.stakeholders)) {
        for (const stakeholder of useCase.stakeholders) {
          if (!actorsMap[stakeholder]) {
            actorsMap[stakeholder] = {
              name: stakeholder,
              type: this.classifyActor(stakeholder),
              useCases: [],
              responsibilities: []
            };
          }
          if (!actorsMap[stakeholder].useCases.includes(useCase.id)) {
            actorsMap[stakeholder].useCases.push(useCase.id);
          }
        }
      }
    }

    const actors = Object.values(actorsMap);
    this.qualityMetrics.actorsIdentified = actors.length;

    console.log(`✅ Identified ${actors.length} actors`);
    return actors;
  }

  /**
   * Classify actor type (User, Admin, System, etc.)
   */
  classifyActor(actorName) {
    const name = actorName.toLowerCase();
    if (name.includes('admin')) return 'Administrator';
    if (name.includes('system') || name.includes('service')) return 'System';
    if (name.includes('external') || name.includes('third')) return 'External';
    if (name.includes('customer') || name.includes('user') || name.includes('employee')) return 'User';
    return 'Other';
  }

  /**
   * Generate acceptance criteria for use cases
   * @param {Array} useCases - Use cases requiring acceptance criteria
   * @returns {Array} Use cases with acceptance criteria
   */
  async generateAcceptanceCriteria(useCases) {
    console.log(`🔄 Generating acceptance criteria for ${useCases.length} use cases...`);

    const updatedUseCases = [];

    for (const useCase of useCases) {
      const task = `Generate acceptance criteria for use case:
      
ID: ${useCase.id}
Name: ${useCase.name}
Main Flow: ${useCase.mainFlow.join(' → ')}
Postconditions: ${useCase.postconditions.join(', ')}

Create acceptance criteria in GIVEN-WHEN-THEN format:
- Criterion must be testable and measurable
- Should cover main flow and alternatives
- Include both positive and negative scenarios
- Verify preconditions and postconditions

Return as structured JSON with array of criteria.`;

      const result = await this.performTask(task);
      useCase.acceptanceCriteria = this.parseAcceptanceCriteria(result);
      this.qualityMetrics.acceptanceCriteriaGenerated += (useCase.acceptanceCriteria?.length || 0);
      updatedUseCases.push(useCase);
    }

    console.log(`✅ Generated ${this.qualityMetrics.acceptanceCriteriaGenerated} acceptance criteria`);
    return updatedUseCases;
  }

  /**
   * Create business rules from use cases
   * @param {Array} useCases - Use cases containing business rules
   * @returns {Array} Extracted business rules
   */
  extractBusinessRules(useCases) {
    const rulesSet = new Set();

    for (const useCase of useCases) {
      if (useCase.businessRules && Array.isArray(useCase.businessRules)) {
        useCase.businessRules.forEach(rule => rulesSet.add(rule));
      }
    }

    this.businessRules = Array.from(rulesSet);
    return this.businessRules;
  }

  /**
   * Save use case documentation to markdown files
   * @param {Array} useCases - Use cases to document
   * @param {String} outputDir - Directory to save documentation
   * @returns {Array} Paths to created files
   */
  async saveUseCaseDocumentation(useCases, outputDir = './use_cases') {
    console.log(`💾 Saving use case documentation to ${outputDir}...`);

    const createdFiles = [];

    // Create output directory if needed
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error.message);
    }

    for (const useCase of useCases) {
      const markdown = this.generateUseCaseMarkdown(useCase);
      const fileName = `${useCase.id}-${useCase.name.replace(/\s+/g, '_').toLowerCase()}.md`;
      const filePath = path.join(outputDir, fileName);

      try {
        await fs.writeFile(filePath, markdown, 'utf8');
        createdFiles.push(filePath);
        console.log(`  ✓ ${fileName}`);
      } catch (error) {
        console.error(`  ✗ Error saving ${fileName}:`, error.message);
      }
    }

    // Create index file
    const indexPath = path.join(outputDir, 'INDEX.md');
    const indexContent = this.generateUseCaseIndex(useCases);
    try {
      await fs.writeFile(indexPath, indexContent, 'utf8');
      createdFiles.push(indexPath);
      console.log(`  ✓ INDEX.md`);
    } catch (error) {
      console.error(`  ✗ Error saving INDEX.md:`, error.message);
    }

    console.log(`✅ Saved ${createdFiles.length} files`);
    return createdFiles;
  }

  /**
   * Generate markdown documentation for a single use case
   */
  generateUseCaseMarkdown(useCase) {
    const scenarios = this.useCaseScenarios[useCase.id] || [];
    const criteria = useCase.acceptanceCriteria || [];

    return `# Use Case: ${useCase.name}

**ID**: ${useCase.id}  
**Status**: ${useCase.status || 'Identified'}  
**Priority**: ${useCase.priority || 'Medium'}  
**Created**: ${new Date().toISOString()}

## Description

${useCase.description}

## Actors

### Primary Actor
- **Name**: ${useCase.primaryActor}
- **Type**: User/System/Admin
- **Responsibility**: Initiates this use case

### Stakeholders
${(useCase.stakeholders || []).map(s => `- ${s}`).join('\n')}

## Preconditions

${(useCase.preconditions || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}

## Main Flow

${(useCase.mainFlow || []).map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Alternative Flows

${this.formatAlternativeFlows(useCase.alternativeFlows)}

## Exception Flows (Error Handling)

${this.formatExceptionFlows(useCase.exceptionFlows)}

## Postconditions

${(useCase.postconditions || []).map((p, i) => `${i + 1}. ${p}`).join('\n')}

## Business Rules

${(useCase.businessRules || []).map((r, i) => `${i + 1}. ${r}`).join('\n')}

## Test Scenarios

### Scenarios Generated: ${scenarios.length}

${scenarios.map((scenario, i) => `
### Scenario ${i + 1}: ${scenario.title}

**Type**: ${scenario.type}

**Steps**:
${(scenario.steps || []).map(s => `- ${s}`).join('\n')}

**Test Data**: ${JSON.stringify(scenario.testData || {})}

**Expected Result**: ${scenario.expectedResult}
`).join('\n')}

## Acceptance Criteria

${(criteria || []).map((c, i) => `
### Criterion ${i + 1}
- **Given**: ${c.given}
- **When**: ${c.when}
- **Then**: ${c.then}
`).join('\n')}

## Quality Metrics

- **Use Case ID**: ${useCase.id}
- **Scenarios Created**: ${scenarios.length}
- **Acceptance Criteria**: ${criteria.length}
- **Coverage**: ${criteria.length > 0 ? '100%' : '0%'}

## Related Use Cases

${(useCase.relatedUseCases || []).map(id => `- ${id}`).join('\n') || 'None'}

---

*Last Updated: ${new Date().toISOString()}*
*Generated by UseCaseAnalysisAgent*
`;
  }

  /**
   * Format alternative flows for markdown
   */
  formatAlternativeFlows(flows = []) {
    return flows.map((flow, i) => `
### Alternative Flow ${i + 1}: ${flow.name}

**Condition**: ${flow.condition}

**Steps**:
${(flow.steps || []).map(s => `- ${s}`).join('\n')}

**Rejoins at step**: ${flow.rejoinsAtStep || 'Main flow end'}
`).join('\n');
  }

  /**
   * Format exception flows for markdown
   */
  formatExceptionFlows(flows = []) {
    return (flows || []).map((flow, i) => `
### Exception ${i + 1}: ${flow.name}

**Trigger**: ${flow.trigger}

**Error Message**: ${flow.errorMessage}

**Recovery Steps**:
${(flow.recoverySteps || []).map(s => `- ${s}`).join('\n')}
`).join('\n');
  }

  /**
   * Generate index file for all use cases
   */
  generateUseCaseIndex(useCases) {
    const byPriority = {};
    const byActor = {};

    for (const useCase of useCases) {
      const priority = useCase.priority || 'Medium';
      const actor = useCase.primaryActor || 'Unknown';

      if (!byPriority[priority]) byPriority[priority] = [];
      if (!byActor[actor]) byActor[actor] = [];

      byPriority[priority].push(useCase);
      byActor[actor].push(useCase);
    }

    return `# Use Cases Index

**Total Use Cases**: ${useCases.length}  
**Generated**: ${new Date().toISOString()}

## By Priority

${Object.entries(byPriority)
  .map(([priority, cases]) => `
### ${priority}
${cases.map(c => `- [${c.id}: ${c.name}](./${c.id}-${c.name.replace(/\s+/g, '_').toLowerCase()}.md)`).join('\n')}
`).join('\n')}

## By Primary Actor

${Object.entries(byActor)
  .map(([actor, cases]) => `
### ${actor}
${cases.map(c => `- [${c.id}: ${c.name}](./${c.id}-${c.name.replace(/\s+/g, '_').toLowerCase()}.md)`).join('\n')}
`).join('\n')}

## Traceability Matrix

| Use Case ID | Name | Actor | Priority | Scenarios | Criteria |
|---|---|---|---|---|---|
${useCases.map(c => {
  const scenarios = this.useCaseScenarios[c.id]?.length || 0;
  const criteria = c.acceptanceCriteria?.length || 0;
  return `| ${c.id} | ${c.name} | ${c.primaryActor} | ${c.priority || 'Medium'} | ${scenarios} | ${criteria} |`;
}).join('\n')}

---

*Use Cases Documentation*  
*Generated by UseCaseAnalysisAgent*
`;
  }

  /**
   * Parse use cases from task result
   */
  parseUseCases(result) {
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (error) {
      console.error('Error parsing use cases:', error.message);
      return [];
    }
  }

  /**
   * Parse scenarios from task result
   */
  parseScenarios(result) {
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Parse acceptance criteria from task result
   */
  parseAcceptanceCriteria(result) {
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Get quality metrics summary
   */
  getQualityMetrics() {
    return {
      ...this.qualityMetrics,
      actors: this.actors.size,
      businessRules: this.businessRules.length
    };
  }

  /**
   * Print quality summary
   */
  printQualitySummary() {
    const metrics = this.getQualityMetrics();
    console.log('\n' + '='.repeat(70));
    console.log('📊 USE CASE ANALYSIS QUALITY METRICS');
    console.log('='.repeat(70));
    console.log(`Use Cases Identified: ${metrics.useCasesIdentified}`);
    console.log(`Scenarios Created: ${metrics.scenariosCreated}`);
    console.log(`Actors Identified: ${metrics.actorsIdentified}`);
    console.log(`Acceptance Criteria: ${metrics.acceptanceCriteriaGenerated}`);
    console.log(`Business Rules: ${metrics.businessRules}`);
    console.log('='.repeat(70) + '\n');
  }
}

module.exports = UseCaseAnalysisAgent;
