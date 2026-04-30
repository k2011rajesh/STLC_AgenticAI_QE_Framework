/**
 * Jira INVEST Quality Updater
 * 
 * Connects to Jira QED project and:
 * - Creates/updates epics with INVEST quality scores
 * - Creates/updates functional user stories
 * - Creates/updates non-functional user stories
 * - Links stories to scenarios
 * - Updates custom fields with quality metrics
 * 
 * Features:
 * - Reads from requirement MD files
 * - Reads from application discovery data
 * - Scores all items using INVEST criteria
 * - Creates BDD Feature files for functional stories
 * - Maps scenarios to feature files
 */

const JiraCloudIntegration = require('../jira/jira_cloud_integration');
const InvestScoringEngine = require('./invest_scoring_engine');
const fs = require('fs').promises;
const path = require('path');

class JiraInvestUpdater {
  constructor(config) {
    this.jiraUrl = config.jiraUrl;
    this.email = config.email;
    this.apiToken = config.apiToken;
    this.projectKey = config.projectKey || 'QED';

    this.jira = new JiraCloudIntegration(
      this.jiraUrl,
      this.email,
      this.apiToken,
      this.projectKey
    );

    this.investEngine = new InvestScoringEngine();

    this.state = {
      epicsCreated: 0,
      storiesCreated: 0,
      storiesUpdated: 0,
      qualityScoresUpdated: 0,
      featuresGenerated: 0,
      scenariosMapped: 0,
      errors: []
    };

    this.outputDirs = {
      features: './playwright/features',
      functional: './playwright/features/functional',
      nonFunctional: './playwright/features/non-functional',
      stepDefs: './playwright/step_definitions'
    };
  }

  /**
   * Execute complete INVEST quality update
   */
  async executeInvestUpdate(requirements, discoveryData, applicationName) {
    console.log(`\n🎯 INVEST QUALITY UPDATE - ${applicationName}`);
    console.log('='.repeat(80) + '\n');

    try {
      // Step 1: Create output directories
      console.log('Step 1: Creating output directories...');
      await this.createOutputDirectories();

      // Step 2: Create functional requirements epic
      console.log('Step 2: Creating functional requirements epic...');
      const functionalEpicKey = await this.createFunctionalEpic(applicationName);

      // Step 3: Create functional user stories with INVEST scores
      console.log('Step 3: Creating functional user stories...');
      const functionalStories = await this.createFunctionalStories(
        functionalEpicKey,
        requirements.filter(r => r.type === 'Functional' || !r.type)
      );

      // Step 4: Create non-functional requirements epic
      console.log('Step 4: Creating non-functional requirements epic...');
      const nonFunctionalEpicKey = await this.createNonFunctionalEpic(applicationName);

      // Step 5: Create non-functional user stories with INVEST scores
      console.log('Step 5: Creating non-functional user stories...');
      const nonFunctionalStories = await this.createNonFunctionalStories(
        nonFunctionalEpicKey,
        requirements.filter(r => r.type === 'Non-Functional' || r.type === 'Performance' || r.type === 'Security')
      );

      // Step 6: Generate BDD Feature files for functional stories
      console.log('Step 6: Generating BDD Feature files...');
      await this.generateBddFeatures(functionalStories);

      // Step 7: Map scenarios to features
      console.log('Step 7: Mapping scenarios to features...');
      await this.mapScenariesToFeatures(functionalStories);

      // Step 8: Generate quality report
      console.log('Step 8: Generating quality report...');
      const report = this.generateQualityReport(
        applicationName,
        functionalStories,
        nonFunctionalStories
      );

      console.log('\n✅ INVEST Quality Update Complete!\n');
      return {
        success: true,
        functionalEpicKey,
        nonFunctionalEpicKey,
        functionalStories,
        nonFunctionalStories,
        state: this.state,
        report
      };
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      this.state.errors.push(error.message);
      throw error;
    }
  }

  /**
   * Create output directories for Feature files
   */
  async createOutputDirectories() {
    const dirs = [
      this.outputDirs.features,
      this.outputDirs.functional,
      this.outputDirs.nonFunctional,
      this.outputDirs.stepDefs
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`  ✅ Created: ${dir}`);
      } catch (error) {
        console.warn(`  ⚠️ Directory exists: ${dir}`);
      }
    }
  }

  /**
   * Create functional requirements epic
   */
  async createFunctionalEpic(applicationName) {
    const epicData = {
      fields: {
        project: { key: this.projectKey },
        issuetype: { name: 'Epic' },
        summary: `${applicationName} - Functional Requirements`,
        description: `All functional requirements and user stories for ${applicationName}`,
        labels: ['functional', 'requirements', 'invest-quality']
      }
    };

    try {
      const epic = await this.jira.createIssue(epicData);
      console.log(`  ✅ Created Functional Epic: ${epic.key}`);
      this.state.epicsCreated++;
      return epic.key;
    } catch (error) {
      console.error(`  ❌ Failed to create functional epic: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create non-functional requirements epic
   */
  async createNonFunctionalEpic(applicationName) {
    const epicData = {
      fields: {
        project: { key: this.projectKey },
        issuetype: { name: 'Epic' },
        summary: `${applicationName} - Non-Functional Requirements`,
        description: `All non-functional requirements (performance, security, compliance) for ${applicationName}`,
        labels: ['non-functional', 'requirements', 'invest-quality', 'nfr']
      }
    };

    try {
      const epic = await this.jira.createIssue(epicData);
      console.log(`  ✅ Created Non-Functional Epic: ${epic.key}`);
      this.state.epicsCreated++;
      return epic.key;
    } catch (error) {
      console.error(`  ❌ Failed to create non-functional epic: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create functional user stories with INVEST scores
   */
  async createFunctionalStories(epicKey, requirements) {
    const stories = [];

    for (const requirement of requirements) {
      try {
        // Score the requirement
        const investScore = this.investEngine.scoreFunctionalRequirement(requirement);

        const storyData = {
          fields: {
            project: { key: this.projectKey },
            issuetype: { name: 'Story' },
            parent: { key: epicKey },
            summary: requirement.title || requirement.name || `Functional Requirement: ${requirement.id}`,
            description: this.buildStoryDescription(requirement, investScore),
            labels: [
              'functional',
              this.investEngine.generateInvestLabel(investScore.investScore),
              `invest-${investScore.investScore.toFixed(0)}`
            ],
            customfield_10001: JSON.stringify(investScore.scores) // Custom field for INVEST scores
          }
        };

        const story = await this.jira.createIssue(storyData);
        console.log(`  ✅ Created Story: ${story.key} - INVEST: ${investScore.investScore.toFixed(1)}`);

        // Add acceptance criteria as sub-tasks
        if (requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0) {
          await this.createAcceptanceCriteriaSubtasks(story.key, requirement.acceptanceCriteria);
        }

        // Add test scenarios as sub-tasks
        if (requirement.testScenarios && requirement.testScenarios.length > 0) {
          await this.createScenarioSubtasks(story.key, requirement.testScenarios);
        }

        stories.push({
          jiraKey: story.key,
          summary: storyData.fields.summary,
          investScore: investScore.investScore,
          requirement,
          scenarios: requirement.testScenarios || [],
          acceptanceCriteria: requirement.acceptanceCriteria || []
        });

        this.state.storiesCreated++;
      } catch (error) {
        console.error(`  ❌ Failed to create story: ${error.message}`);
        this.state.errors.push(error.message);
      }
    }

    return stories;
  }

  /**
   * Create non-functional user stories with INVEST scores
   */
  async createNonFunctionalStories(epicKey, requirements) {
    const stories = [];

    for (const requirement of requirements) {
      try {
        // Score the requirement
        const investScore = this.investEngine.scoreNonFunctionalRequirement(requirement);

        const storyData = {
          fields: {
            project: { key: this.projectKey },
            issuetype: { name: 'Story' },
            parent: { key: epicKey },
            summary: requirement.title || requirement.name || `Non-Functional Requirement: ${requirement.id}`,
            description: this.buildNFRDescription(requirement, investScore),
            labels: [
              'non-functional',
              requirement.type ? requirement.type.toLowerCase() : 'nfr',
              this.investEngine.generateInvestLabel(investScore.investScore),
              `invest-${investScore.investScore.toFixed(0)}`
            ],
            customfield_10001: JSON.stringify(investScore.scores)
          }
        };

        const story = await this.jira.createIssue(storyData);
        console.log(`  ✅ Created NFR Story: ${story.key} - INVEST: ${investScore.investScore.toFixed(1)}`);

        // Add acceptance criteria as sub-tasks
        if (requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0) {
          await this.createAcceptanceCriteriaSubtasks(story.key, requirement.acceptanceCriteria);
        }

        stories.push({
          jiraKey: story.key,
          summary: storyData.fields.summary,
          investScore: investScore.investScore,
          requirement,
          type: requirement.type || 'Non-Functional',
          acceptanceCriteria: requirement.acceptanceCriteria || []
        });

        this.state.storiesCreated++;
      } catch (error) {
        console.error(`  ❌ Failed to create NFR story: ${error.message}`);
        this.state.errors.push(error.message);
      }
    }

    return stories;
  }

  /**
   * Create acceptance criteria sub-tasks
   */
  async createAcceptanceCriteriaSubtasks(storyKey, criteria) {
    for (const criterion of criteria) {
      try {
        const subtaskData = {
          fields: {
            project: { key: this.projectKey },
            issuetype: { name: 'Sub-task' },
            parent: { key: storyKey },
            summary: `AC: ${criterion.substring(0, 100)}`,
            description: criterion,
            labels: ['acceptance-criteria']
          }
        };

        const subtask = await this.jira.createIssue(subtaskData);
        this.state.qualityScoresUpdated++;
      } catch (error) {
        console.warn(`  ⚠️ Failed to create AC sub-task: ${error.message}`);
      }
    }
  }

  /**
   * Create scenario sub-tasks
   */
  async createScenarioSubtasks(storyKey, scenarios) {
    for (const scenario of scenarios) {
      try {
        const subtaskData = {
          fields: {
            project: { key: this.projectKey },
            issuetype: { name: 'Sub-task' },
            parent: { key: storyKey },
            summary: `Scenario: ${scenario.name || scenario.substring(0, 100)}`,
            description: scenario.description || scenario,
            labels: ['test-scenario', 'bdd']
          }
        };

        const subtask = await this.jira.createIssue(subtaskData);
        this.state.scenariosMapped++;
      } catch (error) {
        console.warn(`  ⚠️ Failed to create scenario sub-task: ${error.message}`);
      }
    }
  }

  /**
   * Generate BDD Feature files for functional stories
   */
  async generateBddFeatures(stories) {
    for (const story of stories) {
      try {
        if (!story.scenarios || story.scenarios.length === 0) {
          continue;
        }

        const featureContent = this.buildFeatureFile(story);
        const fileName = `${story.jiraKey.toLowerCase()}_${this.slugify(story.summary)}.feature`;
        const filePath = path.join(this.outputDirs.functional, fileName);

        await fs.writeFile(filePath, featureContent);
        console.log(`  ✅ Generated Feature: ${fileName}`);
        this.state.featuresGenerated++;
      } catch (error) {
        console.error(`  ❌ Failed to generate feature file: ${error.message}`);
        this.state.errors.push(error.message);
      }
    }
  }

  /**
   * Build Gherkin feature file content
   */
  buildFeatureFile(story) {
    const lines = [];

    lines.push(`Feature: ${story.summary}`);
    lines.push(`  # Jira Key: ${story.jiraKey}`);
    lines.push(`  # INVEST Score: ${story.investScore.toFixed(1)}/100`);
    lines.push('');

    if (story.requirement && story.requirement.description) {
      lines.push(`  ${story.requirement.description}`);
      lines.push('');
    }

    for (const scenario of story.scenarios) {
      if (typeof scenario === 'object') {
        lines.push(`  Scenario: ${scenario.name}`);
        if (scenario.givenWhenThen) {
          lines.push(`    ${scenario.givenWhenThen}`);
        } else {
          lines.push(`    Given ${scenario.given || 'some precondition'}`);
          lines.push(`    When ${scenario.when || 'some action is performed'}`);
          lines.push(`    Then ${scenario.then || 'some outcome is verified'}`);
        }
        lines.push('');
      } else if (typeof scenario === 'string') {
        // Parse as GIVEN-WHEN-THEN
        if (scenario.includes('GIVEN') && scenario.includes('WHEN') && scenario.includes('THEN')) {
          lines.push('  Scenario: ' + scenario.split('GIVEN')[0].trim());
          lines.push('    ' + scenario);
          lines.push('');
        }
      }
    }

    return lines.join('\n');
  }

  /**
   * Map scenarios to feature files
   */
  async mapScenariesToFeatures(stories) {
    const mappingContent = [];
    mappingContent.push('# Scenario to Feature Mapping\n');

    for (const story of stories) {
      mappingContent.push(`## ${story.jiraKey}: ${story.summary}`);
      mappingContent.push(`- INVEST Score: ${story.investScore.toFixed(1)}/100`);
      mappingContent.push(`- Feature File: ${this.slugify(story.summary)}.feature`);

      if (story.scenarios && story.scenarios.length > 0) {
        mappingContent.push('- Scenarios:');
        for (const scenario of story.scenarios) {
          const scenarioName = typeof scenario === 'object' ? scenario.name : scenario.substring(0, 60);
          mappingContent.push(`  - ${scenarioName}`);
        }
      }

      mappingContent.push('');
    }

    const mappingPath = path.join(this.outputDirs.functional, 'SCENARIO_MAPPING.md');
    await fs.writeFile(mappingPath, mappingContent.join('\n'));
    console.log(`  ✅ Generated Scenario Mapping: SCENARIO_MAPPING.md`);
  }

  /**
   * Build story description with quality information
   */
  buildStoryDescription(requirement, investScore) {
    const lines = [];

    lines.push(`## Functional Requirement`);
    lines.push('');
    lines.push(`${requirement.description || requirement.title || 'No description provided'}`);
    lines.push('');

    lines.push(`## INVEST Quality Score: ${investScore.investScore.toFixed(1)}/100`);
    lines.push(`Rating: ${investScore.rating}`);
    lines.push('');

    lines.push(`### Quality Breakdown:`);
    for (const item of investScore.breakdown) {
      lines.push(`- ${item.criterion}: ${item.score} (${item.status})`);
    }
    lines.push('');

    if (investScore.recommendations.length > 0) {
      lines.push(`### Recommendations:`);
      for (const rec of investScore.recommendations) {
        lines.push(`- **${rec.criterion}**: ${rec.issue}`);
        lines.push(`  - Fix: ${rec.fix}`);
      }
      lines.push('');
    }

    if (requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0) {
      lines.push(`### Acceptance Criteria:`);
      for (const ac of requirement.acceptanceCriteria) {
        lines.push(`- ${ac}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Build NFR description with quality information
   */
  buildNFRDescription(requirement, investScore) {
    const lines = [];

    lines.push(`## Non-Functional Requirement (${requirement.type || 'General'})`);
    lines.push('');
    lines.push(`${requirement.description || requirement.title || 'No description provided'}`);
    lines.push('');

    lines.push(`## INVEST Quality Score: ${investScore.investScore.toFixed(1)}/100`);
    lines.push(`Rating: ${investScore.rating}`);
    lines.push('');

    if (requirement.metric) {
      lines.push(`### Key Metric: ${requirement.metric}`);
      lines.push('');
    }

    lines.push(`### Quality Breakdown:`);
    for (const item of investScore.breakdown) {
      lines.push(`- ${item.criterion}: ${item.score} (${item.status})`);
    }
    lines.push('');

    if (requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0) {
      lines.push(`### Acceptance Criteria:`);
      for (const ac of requirement.acceptanceCriteria) {
        lines.push(`- ${ac}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Generate quality report
   */
  generateQualityReport(applicationName, functionalStories, nonFunctionalStories) {
    const allStories = [...functionalStories, ...nonFunctionalStories];
    const avgInvest = allStories.length > 0
      ? (allStories.reduce((acc, s) => acc + s.investScore, 0) / allStories.length).toFixed(2)
      : 0;

    const functionalAvg = functionalStories.length > 0
      ? (functionalStories.reduce((acc, s) => acc + s.investScore, 0) / functionalStories.length).toFixed(2)
      : 0;

    const nfrAvg = nonFunctionalStories.length > 0
      ? (nonFunctionalStories.reduce((acc, s) => acc + s.investScore, 0) / nonFunctionalStories.length).toFixed(2)
      : 0;

    return {
      applicationName,
      timestamp: new Date().toISOString(),
      summary: {
        totalStories: allStories.length,
        functionalStories: functionalStories.length,
        nonFunctionalStories: nonFunctionalStories.length,
        averageInvestScore: avgInvest,
        functionalAverage: functionalAvg,
        nfrAverage: nfrAvg
      },
      metrics: {
        epicsCreated: this.state.epicsCreated,
        storiesCreated: this.state.storiesCreated,
        featuresGenerated: this.state.featuresGenerated,
        scenariosMapped: this.state.scenariosMapped
      },
      stories: allStories
    };
  }

  /**
   * Slugify text for file names
   */
  slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '_')
      .replace(/^-+|-+$/g, '');
  }
}

module.exports = JiraInvestUpdater;
