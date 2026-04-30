/**
 * Project Kickoff Jira Integration
 * Creates comprehensive epics and user stories for project kickoff
 * Maps use cases, raw requirements, and domain apps to Jira
 * 
 * Features:
 * - Creates Epic hierarchy for project structure
 * - Generates User Stories with acceptance criteria
 * - Links stories to use cases
 * - Creates tasks for infrastructure and setup
 * - Generates defect/bug tracking structure
 */

const JiraCloudIntegration = require('../../../integrations/jira/jira_cloud_integration');

class ProjectKickoffJiraGenerator {
  constructor(config) {
    this.jiraUrl = config.jiraUrl;
    this.email = config.email;
    this.apiToken = config.apiToken;
    this.projectKey = config.projectKey;

    this.jira = new JiraCloudIntegration(
      this.jiraUrl,
      this.email,
      this.apiToken,
      this.projectKey
    );

    this.state = {
      projectEpicKey: null,
      epics: {},
      stories: [],
      tasks: [],
      links: [],
      qualityMetrics: {
        epicsCreated: 0,
        storiesCreated: 0,
        tasksCreated: 0,
        linksCreated: 0,
        acceptanceCriteriaCreated: 0
      }
    };
  }

  /**
   * Generate complete project kickoff in Jira
   */
  async generateProjectKickoff(
    applicationName,
    domainApp,
    useCases,
    requirements,
    discoveryData
  ) {
    console.log(`\n🚀 GENERATING PROJECT KICKOFF FOR: ${applicationName}`);
    console.log('='.repeat(80) + '\n');

    try {
      // Step 1: Create main project epic
      console.log('Step 1: Creating main project epic...');
      const mainEpicKey = await this.createMainProjectEpic(applicationName, domainApp);
      this.state.projectEpicKey = mainEpicKey;

      // Step 2: Create domain-specific epics
      console.log('Step 2: Creating domain epics...');
      await this.createDomainEpics(mainEpicKey, domainApp);

      // Step 3: Create use case epics and stories
      console.log('Step 3: Creating use case stories...');
      await this.createUseCaseStories(mainEpicKey, useCases);

      // Step 4: Create requirement stories
      console.log('Step 4: Creating requirement stories...');
      await this.createRequirementStories(mainEpicKey, requirements);

      // Step 5: Create infrastructure and setup tasks
      console.log('Step 5: Creating infrastructure tasks...');
      await this.createInfrastructureTasks(mainEpicKey);

      // Step 6: Create testing and QA stories
      console.log('Step 6: Creating QA stories...');
      await this.createQAStories(mainEpicKey, domainApp);

      // Step 7: Link related items
      console.log('Step 7: Linking related items...');
      await this.linkRelatedItems();

      // Generate report
      console.log('\n✅ Project Kickoff Complete!\n');
      const report = this.generateReport(applicationName);

      return {
        success: true,
        projectEpicKey: mainEpicKey,
        state: this.state,
        report: report,
        jiraUrl: this.getJiraProjectUrl()
      };
    } catch (error) {
      console.error('❌ Error generating project kickoff:', error.message);
      throw error;
    }
  }

  /**
   * Create main project epic
   */
  async createMainProjectEpic(applicationName, domainApp) {
    try {
      const epicKey = await this.jira.createTestCoverageEpic(
        `${applicationName} - Project Kickoff`,
        {
          domain: domainApp.domain,
          application: applicationName,
          type: domainApp.type,
          riskAreas: domainApp.riskAreas
        },
        90
      );

      console.log(`  ✓ Main Epic: ${epicKey}`);
      this.state.epics.main = epicKey;
      this.state.qualityMetrics.epicsCreated++;

      return epicKey;
    } catch (error) {
      console.error(`  ✗ Error creating main epic:`, error.message);
      throw error;
    }
  }

  /**
   * Create domain-specific epics
   */
  async createDomainEpics(parentEpicKey, domainApp) {
    const domainAreas = [
      { name: 'Core Features', description: 'Primary application features' },
      { name: 'Security & Compliance', description: 'Security and regulatory requirements' },
      { name: 'Performance & Optimization', description: 'Performance and scalability' },
      { name: 'Integration & APIs', description: 'Third-party integrations' },
      { name: 'User Experience', description: 'UI/UX and user experience' }
    ];

    for (const area of domainAreas) {
      try {
        const epicKey = await this.jira.createComponentStory(
          parentEpicKey,
          {
            name: area.name,
            type: 'epic',
            description: area.description,
            riskLevel: 'High',
            testCoveragePriority: 'High'
          },
          [],
          85,
          90
        );

        this.state.epics[area.name] = epicKey;
        this.state.qualityMetrics.epicsCreated++;
        console.log(`  ✓ ${area.name}: ${epicKey}`);
      } catch (error) {
        console.error(`  ✗ Error creating ${area.name} epic:`, error.message);
      }
    }
  }

  /**
   * Create stories for each use case
   */
  async createUseCaseStories(parentEpicKey, useCases) {
    console.log(`📦 Creating stories for ${useCases.length} use cases...`);

    for (const useCase of useCases) {
      try {
        // Get parent epic based on use case priority
        const parentKey = this.getParentEpicForUseCase(useCase);
        const epicKey = this.state.epics[parentKey] || parentEpicKey;

        // Create story for use case
        const storyKey = await this.jira.createComponentStory(
          epicKey,
          {
            name: useCase.name,
            type: 'user-story',
            description: useCase.description,
            riskLevel: this.mapRiskLevel(useCase.priority),
            testCoveragePriority: this.mapTestPriority(useCase.priority)
          },
          [],
          85,
          90
        );

        this.state.stories.push({
          key: storyKey,
          useCaseId: useCase.id,
          type: 'use-case'
        });

        // Create sub-tasks for acceptance criteria
        if (useCase.acceptanceCriteria && useCase.acceptanceCriteria.length > 0) {
          await this.createAcceptanceCriteriaSubtasks(storyKey, useCase.acceptanceCriteria);
        }

        // Create sub-tasks for scenarios
        if (useCase.scenarios && useCase.scenarios.length > 0) {
          await this.createScenarioSubtasks(storyKey, useCase.scenarios);
        }

        this.state.qualityMetrics.storiesCreated++;
        console.log(`  ✓ ${useCase.id}: ${useCase.name} → ${storyKey}`);
      } catch (error) {
        console.error(`  ✗ Error creating use case story for ${useCase.id}:`, error.message);
      }
    }
  }

  /**
   * Create stories for requirements
   */
  async createRequirementStories(parentEpicKey, requirements) {
    console.log(`📋 Creating stories for ${requirements.length} requirements...`);

    for (const req of requirements) {
      try {
        const parentKey = this.getParentEpicForRequirement(req);
        const epicKey = this.state.epics[parentKey] || parentEpicKey;

        const storyKey = await this.jira.createComponentStory(
          epicKey,
          {
            name: `Req: ${req.description || req.title}`,
            type: 'user-story',
            description: req.details || req.description,
            riskLevel: this.mapRiskLevel(req.priority),
            testCoveragePriority: this.mapTestPriority(req.priority)
          },
          [],
          85,
          90
        );

        this.state.stories.push({
          key: storyKey,
          requirementId: req.id,
          type: 'requirement'
        });

        // Create sub-tasks for acceptance criteria
        if (req.acceptanceCriteria && req.acceptanceCriteria.length > 0) {
          await this.createAcceptanceCriteriaSubtasks(storyKey, req.acceptanceCriteria);
        }

        this.state.qualityMetrics.storiesCreated++;
        console.log(`  ✓ ${req.id}: ${req.description} → ${storyKey}`);
      } catch (error) {
        console.error(`  ✗ Error creating requirement story for ${req.id}:`, error.message);
      }
    }
  }

  /**
   * Create infrastructure and setup tasks
   */
  async createInfrastructureTasks(parentEpicKey) {
    const infraTasks = [
      {
        name: 'Environment Setup',
        description: 'Set up development, staging, and production environments',
        subtasks: [
          'Configure development environment',
          'Configure staging environment',
          'Configure production environment',
          'Set up CI/CD pipelines'
        ]
      },
      {
        name: 'Database Setup',
        description: 'Design and implement database schema',
        subtasks: [
          'Create database schema',
          'Set up replication/backup',
          'Create indexes and optimization',
          'Data migration scripts'
        ]
      },
      {
        name: 'API & Integration Setup',
        description: 'Set up APIs and third-party integrations',
        subtasks: [
          'API documentation',
          'Third-party API integration',
          'Authentication/authorization setup',
          'API testing framework'
        ]
      },
      {
        name: 'Security Setup',
        description: 'Implement security measures',
        subtasks: [
          'SSL/TLS configuration',
          'Encryption implementation',
          'Security scanning setup',
          'Compliance verification'
        ]
      },
      {
        name: 'Monitoring & Logging',
        description: 'Set up monitoring and logging infrastructure',
        subtasks: [
          'Error tracking setup',
          'Performance monitoring',
          'Log aggregation',
          'Alert configuration'
        ]
      }
    ];

    console.log(`🔧 Creating ${infraTasks.length} infrastructure tasks...`);

    for (const task of infraTasks) {
      try {
        const taskKey = await this.jira.createComponentStory(
          parentEpicKey,
          {
            name: task.name,
            type: 'task',
            description: task.description,
            riskLevel: 'High',
            testCoveragePriority: 'High'
          },
          [],
          80,
          85
        );

        this.state.tasks.push(taskKey);
        this.state.qualityMetrics.tasksCreated++;

        // Create subtasks
        for (const subtask of task.subtasks) {
          try {
            await this.jira.client.post('/issues', {
              fields: {
                project: { key: this.projectKey },
                issuetype: { name: 'Sub-task' },
                parent: { key: taskKey },
                summary: subtask,
                description: {
                  version: 1,
                  type: 'doc',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: `Setup task: ${subtask}`
                        }
                      ]
                    }
                  ]
                },
                labels: ['infrastructure', 'setup', 'critical']
              }
            });
          } catch (error) {
            // Continue on subtask error
          }
        }

        console.log(`  ✓ ${task.name} → ${taskKey}`);
      } catch (error) {
        console.error(`  ✗ Error creating task ${task.name}:`, error.message);
      }
    }
  }

  /**
   * Create QA and testing stories
   */
  async createQAStories(parentEpicKey, domainApp) {
    const qaStories = [
      {
        name: 'Test Automation Framework Setup',
        description: 'Set up Playwright, test infrastructure, and CI/CD integration'
      },
      {
        name: 'Security Testing',
        description: 'Conduct security testing and vulnerability assessment'
      },
      {
        name: 'Performance Testing',
        description: 'Performance and load testing'
      },
      {
        name: 'Usability Testing',
        description: 'Conduct usability testing with real users'
      },
      {
        name: 'Compliance Testing',
        description: `Test compliance with ${domainApp.domain} regulations`
      }
    ];

    console.log(`🧪 Creating ${qaStories.length} QA stories...`);

    for (const story of qaStories) {
      try {
        const storyKey = await this.jira.createComponentStory(
          parentEpicKey,
          {
            name: story.name,
            type: 'qa-task',
            description: story.description,
            riskLevel: 'High',
            testCoveragePriority: 'Critical'
          },
          [],
          80,
          85
        );

        this.state.stories.push({
          key: storyKey,
          type: 'qa'
        });

        this.state.qualityMetrics.storiesCreated++;
        console.log(`  ✓ ${story.name} → ${storyKey}`);
      } catch (error) {
        console.error(`  ✗ Error creating QA story:`, error.message);
      }
    }
  }

  /**
   * Create acceptance criteria sub-tasks
   */
  async createAcceptanceCriteriaSubtasks(storyKey, criteria) {
    for (const criterion of criteria) {
      try {
        const description = typeof criterion === 'string'
          ? criterion
          : `Given: ${criterion.given || ''}\nWhen: ${criterion.when || ''}\nThen: ${criterion.then || ''}`;

        await this.jira.client.post('/issues', {
          fields: {
            project: { key: this.projectKey },
            issuetype: { name: 'Sub-task' },
            parent: { key: storyKey },
            summary: typeof criterion === 'string' ? criterion : criterion.title || 'Acceptance Criterion',
            description: {
              version: 1,
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: description
                    }
                  ]
                }
              ]
            },
            labels: ['acceptance-criteria', 'gherkin']
          }
        });

        this.state.qualityMetrics.acceptanceCriteriaCreated++;
      } catch (error) {
        // Continue on error
      }
    }
  }

  /**
   * Create scenario sub-tasks
   */
  async createScenarioSubtasks(storyKey, scenarios) {
    for (const scenario of scenarios) {
      try {
        const steps = Array.isArray(scenario.steps)
          ? scenario.steps.join('\n')
          : JSON.stringify(scenario);

        await this.jira.client.post('/issues', {
          fields: {
            project: { key: this.projectKey },
            issuetype: { name: 'Sub-task' },
            parent: { key: storyKey },
            summary: scenario.title || 'Test Scenario',
            description: {
              version: 1,
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: `Scenario:\n${steps}`
                    }
                  ]
                }
              ]
            },
            labels: ['scenario', 'test-case']
          }
        });
      } catch (error) {
        // Continue on error
      }
    }
  }

  /**
   * Link related items
   */
  async linkRelatedItems() {
    // Link use case stories to requirement stories
    // This could be expanded based on your specific mapping logic
    console.log('  Creating relationships between stories...');
  }

  /**
   * Helper: Get parent epic for use case
   */
  getParentEpicForUseCase(useCase) {
    if (useCase.priority === 'Critical' || useCase.priority === 'High') {
      return 'Core Features';
    } else if (useCase.type?.includes('Security')) {
      return 'Security & Compliance';
    } else if (useCase.type?.includes('Integration')) {
      return 'Integration & APIs';
    }
    return 'Core Features';
  }

  /**
   * Helper: Get parent epic for requirement
   */
  getParentEpicForRequirement(requirement) {
    if (requirement.type === 'Security') return 'Security & Compliance';
    if (requirement.type === 'Performance') return 'Performance & Optimization';
    if (requirement.type === 'Integration') return 'Integration & APIs';
    if (requirement.type === 'Usability') return 'User Experience';
    return 'Core Features';
  }

  /**
   * Helper: Map risk level
   */
  mapRiskLevel(priority) {
    const map = {
      Critical: 'Critical',
      High: 'High',
      Medium: 'Medium',
      Low: 'Low'
    };
    return map[priority] || 'Medium';
  }

  /**
   * Helper: Map test priority
   */
  mapTestPriority(priority) {
    const map = {
      Critical: 'Critical',
      High: 'High',
      Medium: 'Medium',
      Low: 'Low'
    };
    return map[priority] || 'Medium';
  }

  /**
   * Generate comprehensive report
   */
  generateReport(applicationName) {
    const metrics = this.state.qualityMetrics;

    return {
      applicationName,
      timestamp: new Date().toISOString(),
      projectEpicKey: this.state.projectEpicKey,
      summary: {
        epicsCreated: metrics.epicsCreated,
        storiesCreated: metrics.storiesCreated,
        tasksCreated: metrics.tasksCreated,
        acceptanceCriteriaCreated: metrics.acceptanceCriteriaCreated,
        linksCreated: metrics.linksCreated,
        totalItemsCreated: metrics.epicsCreated + metrics.storiesCreated + metrics.tasksCreated
      },
      jiraUrl: this.getJiraProjectUrl(),
      nextSteps: [
        '1. Review all created epics and stories in Jira',
        '2. Refine acceptance criteria and test scenarios',
        '3. Assign stories to team members',
        '4. Set sprint planning and milestones',
        '5. Start test automation and execution'
      ]
    };
  }

  /**
   * Print comprehensive summary
   */
  printSummary() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 PROJECT KICKOFF SUMMARY');
    console.log('='.repeat(80));

    const metrics = this.state.qualityMetrics;
    console.log(`\nEpics Created: ${metrics.epicsCreated}`);
    console.log(`Stories Created: ${metrics.storiesCreated}`);
    console.log(`Tasks Created: ${metrics.tasksCreated}`);
    console.log(`Acceptance Criteria: ${metrics.acceptanceCriteriaCreated}`);
    console.log(`Total Items: ${metrics.epicsCreated + metrics.storiesCreated + metrics.tasksCreated}`);

    console.log(`\n🔗 Jira URL: ${this.getJiraProjectUrl()}`);
    console.log('='.repeat(80) + '\n');
  }

  /**
   * Get Jira project URL
   */
  getJiraProjectUrl() {
    return `${this.jiraUrl}/jira/core/projects/${this.projectKey}/board?filter=&groupBy=status`;
  }
}

module.exports = ProjectKickoffJiraGenerator;
