/**
 * JIRA Cloud Integration Module
 * Handles epic/story/task creation, acceptance criteria mapping, requirement linking
 * Supports automated E2E test orchestration with quality scoring
 */

const axios = require('axios');

class JiraCloudIntegration {
  constructor(jiraHost, email, apiToken, projectKey) {
    this.jiraHost = jiraHost; // e.g., 'https://your-domain.atlassian.net'
    this.email = email;
    this.apiToken = apiToken;
    this.projectKey = projectKey;
    this.baseURL = `${jiraHost}/rest/api/3`;
    this.authHeader = {
      Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
      'Content-Type': 'application/json'
    };
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: this.authHeader
    });
    this.issueMapping = {}; // Track created issues
    this.qualityMetrics = {
      epicsCreated: 0,
      storiesCreated: 0,
      tasksCreated: 0,
      requirementsMapped: 0,
      acceptanceCriteriaMapped: 0,
      bddTestsCovered: 0
    };
  }

  /**
   * Create Epic for test coverage with quality criteria
   * Links to discovery and requirements
   */
  async createTestCoverageEpic(appName, discoveryData, investScore = 85) {
    try {
      const epicPayload = {
        fields: {
          project: { key: this.projectKey },
          issuetype: { name: 'Epic' },
          summary: `QE: Test Coverage - ${appName}`,
          description: {
            version: 1,
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: `Comprehensive test coverage for ${appName} discovered architecture.\n\n`
                  },
                  {
                    type: 'text',
                    text: `Tech Stack: ${JSON.stringify(discoveryData.techStack || {}, null, 2)}\n\n`,
                    marks: [{ type: 'code' }]
                  },
                  {
                    type: 'text',
                    text: `Quality Gate: INVEST Score ${investScore}/100`
                  }
                ]
              }
            ]
          },
          customfield_10000: `Test Coverage`, // Epic Name (standard field)
          labels: ['test-coverage', 'e2e', 'discovered-architecture']
        }
      };

      const response = await this.client.post('/issues', epicPayload);
      const epicKey = response.data.key;

      this.issueMapping[epicKey] = {
        type: 'epic',
        appName,
        discoveryData,
        investScore,
        createdAt: new Date().toISOString()
      };

      this.qualityMetrics.epicsCreated++;
      console.log(`✓ Epic created: ${epicKey}`);
      return epicKey;
    } catch (error) {
      console.error('Error creating epic:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create user story for component with INVEST & SMART evaluation
   * Maps to requirements and BDD scenarios
   */
  async createComponentStory(
    epicKey,
    component,
    requirements,
    investScore = 85,
    smartScore = 90
  ) {
    try {
      const acceptanceCriteria = this.generateAcceptanceCriteria(component, requirements);

      const storyPayload = {
        fields: {
          project: { key: this.projectKey },
          issuetype: { name: 'Story' },
          parent: { key: epicKey },
          summary: `QA: ${component.name} Test Coverage`,
          description: {
            version: 1,
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: `Component: ${component.name}\n`
                  },
                  {
                    type: 'text',
                    text: `Type: ${component.type}\n`
                  },
                  {
                    type: 'text',
                    text: `Risk Level: ${component.riskLevel}\n\n`
                  },
                  {
                    type: 'text',
                    text: `Quality Metrics:\n`,
                    marks: [{ type: 'strong' }]
                  },
                  {
                    type: 'text',
                    text: `• INVEST Score: ${investScore}/100\n`
                  },
                  {
                    type: 'text',
                    text: `• SMART Score: ${smartScore}/100\n`
                  },
                  {
                    type: 'text',
                    text: `• Dependency Count: ${component.dependencies?.length || 0}\n`
                  },
                  {
                    type: 'text',
                    text: `• Test Priority: ${component.testCoveragePriority || 'Medium'}`
                  }
                ]
              }
            ]
          },
          customfield_10001: ['ui-testing', 'api-testing', 'db-testing'], // Custom Labels
          labels: [
            'component-test',
            `risk-${component.riskLevel?.toLowerCase()}`,
            'quality-mapped',
            'invest-ready',
            'smart-aligned'
          ]
        }
      };

      const response = await this.client.post('/issues', storyPayload);
      const storyKey = response.data.key;

      this.issueMapping[storyKey] = {
        type: 'story',
        component,
        requirements,
        investScore,
        smartScore,
        acceptanceCriteria,
        createdAt: new Date().toISOString()
      };

      // Add acceptance criteria as sub-tasks
      await this.createAcceptanceCriteriaSubtasks(storyKey, acceptanceCriteria);

      this.qualityMetrics.storiesCreated++;
      this.qualityMetrics.requirementsMapped += (requirements?.length || 0);
      this.qualityMetrics.acceptanceCriteriaMapped += acceptanceCriteria.length;

      console.log(`✓ Story created: ${storyKey}`);
      return storyKey;
    } catch (error) {
      console.error('Error creating story:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Generate acceptance criteria from component and requirements
   */
  generateAcceptanceCriteria(component, requirements = []) {
    const criteria = [
      {
        title: `UI Testing for ${component.name}`,
        description: `All UI elements for ${component.name} should be accessible and functional`,
        gherkin: [
          `Given user is on ${component.name} page`,
          `When user interacts with component`,
          `Then all elements render correctly`
        ]
      },
      {
        title: `API Integration for ${component.name}`,
        description: `All API endpoints related to ${component.name} should work correctly`,
        gherkin: [
          `Given API endpoint for ${component.name}`,
          `When request is sent with valid parameters`,
          `Then response is 200 with expected data`
        ]
      },
      {
        title: `Database Persistence for ${component.name}`,
        description: `Data should persist correctly in database`,
        gherkin: [
          `Given data for ${component.name}`,
          `When data is saved to database`,
          `Then data can be retrieved and verified`
        ]
      }
    ];

    // Add requirement-specific criteria
    requirements.forEach(req => {
      criteria.push({
        title: `Requirement: ${req.title || req}`,
        description: `Acceptance criteria for requirement: ${req.description || req}`,
        gherkin: req.acceptanceCriteria || []
      });
    });

    return criteria;
  }

  /**
   * Create subtasks for acceptance criteria with BDD scenarios
   */
  async createAcceptanceCriteriaSubtasks(storyKey, criteria) {
    try {
      for (const ac of criteria) {
        const acPayload = {
          fields: {
            project: { key: this.projectKey },
            issuetype: { name: 'Sub-task' },
            parent: { key: storyKey },
            summary: ac.title,
            description: {
              version: 1,
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: `${ac.description}\n\n`
                    },
                    {
                      type: 'text',
                      text: `BDD Scenario:\n`,
                      marks: [{ type: 'strong' }]
                    },
                    {
                      type: 'text',
                      text: ac.gherkin.map(line => `\n${line}`).join(''),
                      marks: [{ type: 'code' }]
                    }
                  ]
                }
              ]
            },
            labels: ['acceptance-criteria', 'bdd-scenario', 'e2e-test']
          }
        };

        const response = await this.client.post('/issues', acPayload);
        this.qualityMetrics.acceptanceCriteriaMapped++;
      }
    } catch (error) {
      console.error('Error creating acceptance criteria subtasks:', error.response?.data || error.message);
    }
  }

  /**
   * Create test execution task linked to BDD scenarios
   */
  async createTestExecutionTask(storyKey, bddScenarios, executionContext) {
    try {
      const taskPayload = {
        fields: {
          project: { key: this.projectKey },
          issuetype: { name: 'Task' },
          parent: { key: storyKey },
          summary: `Execute BDD Tests - ${storyKey}`,
          description: {
            version: 1,
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: `BDD Test Execution Context\n\n`
                  },
                  {
                    type: 'text',
                    text: `Scenarios: ${bddScenarios.length}\n`
                  },
                  {
                    type: 'text',
                    text: `Environment: ${executionContext.environment}\n`
                  },
                  {
                    type: 'text',
                    text: `Browser: ${executionContext.browser}\n`
                  },
                  {
                    type: 'text',
                    text: `Test Data: ${executionContext.testDataProfile}`
                  }
                ]
              }
            ]
          },
          labels: ['test-execution', 'bdd', 'e2e', 'automated'],
          customfield_10005: executionContext.environment // Environment field
        }
      };

      const response = await this.client.post('/issues', taskPayload);
      const taskKey = response.data.key;

      this.qualityMetrics.tasksCreated++;
      this.qualityMetrics.bddTestsCovered += bddScenarios.length;

      return taskKey;
    } catch (error) {
      console.error('Error creating test execution task:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Link requirement to story
   */
  async linkRequirementToStory(storyKey, requirementKey) {
    try {
      const linkPayload = {
        type: { name: 'relates to' },
        inwardIssue: { key: requirementKey },
        outwardIssue: { key: storyKey }
      };

      await this.client.post('/issueLink', linkPayload);
      console.log(`✓ Linked ${requirementKey} to ${storyKey}`);
    } catch (error) {
      console.error('Error linking requirement:', error.response?.data || error.message);
    }
  }

  /**
   * Update story with test execution results
   */
  async updateStoryWithTestResults(storyKey, testResults) {
    try {
      const updatePayload = {
        fields: {
          labels: [
            ...new Set([
              ...(testResults.labels || []),
              testResults.status === 'passed' ? 'test-passed' : 'test-failed',
              `coverage-${testResults.coverage}`,
              'results-mapped'
            ])
          ]
        }
      };

      await this.client.put(`/issues/${storyKey}`, updatePayload);

      // Add comment with test results
      await this.addCommentWithTestResults(storyKey, testResults);

      console.log(`✓ Story ${storyKey} updated with test results`);
    } catch (error) {
      console.error('Error updating story:', error.response?.data || error.message);
    }
  }

  /**
   * Add comment with detailed test results
   */
  async addCommentWithTestResults(storyKey, testResults) {
    try {
      const commentPayload = {
        body: {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `Test Execution Results\n\n`,
                  marks: [{ type: 'strong' }]
                },
                {
                  type: 'text',
                  text: `Status: ${testResults.status}\n`
                },
                {
                  type: 'text',
                  text: `Coverage: ${testResults.coverage}%\n`
                },
                {
                  type: 'text',
                  text: `Passed: ${testResults.passed || 0}\n`
                },
                {
                  type: 'text',
                  text: `Failed: ${testResults.failed || 0}\n`
                },
                {
                  type: 'text',
                  text: `Skipped: ${testResults.skipped || 0}\n`
                },
                {
                  type: 'text',
                  text: `Duration: ${testResults.duration}ms\n`
                },
                {
                  type: 'text',
                  text: `Quality Score: ${testResults.qualityScore}/100`
                }
              ]
            }
          ]
        }
      };

      await this.client.post(`/issues/${storyKey}/comments`, commentPayload);
    } catch (error) {
      console.error('Error adding comment:', error.response?.data || error.message);
    }
  }

  /**
   * Search for requirements by key or summary
   */
  async searchRequirements(jql) {
    try {
      const response = await this.client.get('/search', {
        params: { jql, maxResults: 100 }
      });
      return response.data.issues || [];
    } catch (error) {
      console.error('Error searching requirements:', error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Get issue details with all fields
   */
  async getIssueDetails(issueKey) {
    try {
      const response = await this.client.get(`/issues/${issueKey}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching issue:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get quality metrics summary
   */
  getQualityMetrics() {
    return {
      ...this.qualityMetrics,
      totalIssuesCreated: this.qualityMetrics.epicsCreated +
        this.qualityMetrics.storiesCreated +
        this.qualityMetrics.tasksCreated,
      averageInvestScore: 85, // TODO: Calculate from created stories
      averageSmartScore: 90
    };
  }

  /**
   * Generic method to create any issue (Epic, Story, Sub-task, Task)
   */
  async createIssue(issueData) {
    try {
      const response = await this.client.post('/issues', issueData);
      return {
        key: response.data.key,
        id: response.data.id,
        self: response.data.self
      };
    } catch (error) {
      console.error('Error creating issue:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Generate JIRA dashboard URL for quality metrics
   */
  getDashboardURL() {
    return `${this.jiraHost}/secure/RapidBoard.jspa?rapidView=1`;
  }
}

module.exports = JiraCloudIntegration;
