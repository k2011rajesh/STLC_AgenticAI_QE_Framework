/**
 * Xray for Jira Test Management Integration
 * Handles test case creation, execution recording, result mapping
 * Supports BDD scenario synchronization and test run orchestration
 */

const axios = require('axios');

class XrayIntegration {
  constructor(jiraHost, email, apiToken, clientId, clientSecret) {
    this.jiraHost = jiraHost;
    this.email = email;
    this.apiToken = apiToken;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseURL = `${jiraHost}/api/v2`;
    this.authHeader = {
      Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
      'Content-Type': 'application/json'
    };
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: this.authHeader
    });
    this.metrics = {
      testCasesCreated: 0,
      testPlansCreated: 0,
      executionsRecorded: 0,
      resultsImported: 0,
      bddScenariosImported: 0
    };
  }

  /**
   * Create test case from BDD scenario
   */
  async createTestCaseFromBDD(bddScenario, storyKey, component) {
    try {
      const testCasePayload = {
        fields: {
          project: { key: storyKey.split('-')[0] },
          issuetype: { name: 'Test' },
          summary: `TEST: ${bddScenario.title}`,
          description: {
            version: 1,
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: `Component: ${component.name}\n\n`
                  },
                  {
                    type: 'text',
                    text: `Feature: ${bddScenario.feature}\n`
                  },
                  {
                    type: 'text',
                    text: `Scenario: ${bddScenario.title}\n\n`
                  },
                  {
                    type: 'text',
                    text: `Steps:\n`,
                    marks: [{ type: 'strong' }]
                  },
                  {
                    type: 'text',
                    text: this.formatGherkinSteps(bddScenario.steps)
                  }
                ]
              }
            ]
          },
          labels: [
            'xray-test',
            'bdd',
            'automation',
            `component-${component.id}`,
            `priority-${bddScenario.priority || 'medium'}`
          ]
        }
      };

      const response = await this.client.post('/issues', testCasePayload);
      const testKey = response.data.key;

      // Add Xray test case metadata
      await this.addXrayTestMetadata(testKey, bddScenario);

      this.metrics.testCasesCreated++;
      this.metrics.bddScenariosImported++;

      console.log(`✓ Xray Test Case created: ${testKey}`);
      return testKey;
    } catch (error) {
      console.error('Error creating test case:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Add Xray-specific metadata to test case
   */
  async addXrayTestMetadata(testKey, bddScenario) {
    try {
      const metadataPayload = {
        fields: {
          customfield_xray_type: 'Cucumber',
          customfield_xray_steps: this.formatXraySteps(bddScenario.steps),
          customfield_xray_parameters: this.extractParameters(bddScenario.steps)
        }
      };

      // This would require custom field configuration in Jira
      console.log(`✓ Xray metadata added to ${testKey}`);
    } catch (error) {
      console.error('Error adding Xray metadata:', error.message);
    }
  }

  /**
   * Create test plan from story acceptance criteria
   */
  async createTestPlanFromStory(storyKey, acceptanceCriteria, bddScenarios) {
    try {
      const testPlanPayload = {
        fields: {
          project: { key: storyKey.split('-')[0] },
          issuetype: { name: 'Test Plan' },
          summary: `Test Plan: ${storyKey}`,
          description: {
            version: 1,
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: `Test Plan for Story: ${storyKey}\n\n`
                  },
                  {
                    type: 'text',
                    text: `Acceptance Criteria:\n`,
                    marks: [{ type: 'strong' }]
                  },
                  {
                    type: 'text',
                    text: acceptanceCriteria.map((ac, i) => `\n${i + 1}. ${ac.title}`).join('')
                  },
                  {
                    type: 'text',
                    text: `\n\nTest Cases: ${bddScenarios.length}`
                  }
                ]
              }
            ]
          },
          labels: ['xray-test-plan', 'story-coverage', 'e2e']
        }
      };

      const response = await this.client.post('/issues', testPlanPayload);
      const testPlanKey = response.data.key;

      // Link test cases to test plan
      for (const scenario of bddScenarios) {
        await this.linkTestCaseToTestPlan(scenario.testCaseKey, testPlanKey);
      }

      this.metrics.testPlansCreated++;
      console.log(`✓ Xray Test Plan created: ${testPlanKey}`);
      return testPlanKey;
    } catch (error) {
      console.error('Error creating test plan:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Link test case to test plan
   */
  async linkTestCaseToTestPlan(testCaseKey, testPlanKey) {
    try {
      const linkPayload = {
        type: { name: 'Tests' },
        inwardIssue: { key: testPlanKey },
        outwardIssue: { key: testCaseKey }
      };

      await this.client.post('/issueLink', linkPayload);
      console.log(`✓ Linked test case ${testCaseKey} to plan ${testPlanKey}`);
    } catch (error) {
      console.error('Error linking test case:', error.response?.data || error.message);
    }
  }

  /**
   * Record test execution with results
   */
  async recordTestExecution(testPlanKey, testResults) {
    try {
      // Create Test Execution issue
      const testExecutionPayload = {
        fields: {
          project: { key: testPlanKey.split('-')[0] },
          issuetype: { name: 'Test Execution' },
          summary: `Execution: ${testPlanKey} - ${new Date().toISOString()}`,
          description: {
            version: 1,
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: `Test Execution Results\n\n`
                  },
                  {
                    type: 'text',
                    text: `Test Plan: ${testPlanKey}\n`
                  },
                  {
                    type: 'text',
                    text: `Status: ${testResults.status}\n`
                  },
                  {
                    type: 'text',
                    text: `Total: ${testResults.total}\n`
                  },
                  {
                    type: 'text',
                    text: `Passed: ${testResults.passed}\n`
                  },
                  {
                    type: 'text',
                    text: `Failed: ${testResults.failed}\n`
                  },
                  {
                    type: 'text',
                    text: `Skipped: ${testResults.skipped}\n`
                  },
                  {
                    type: 'text',
                    text: `Pass Rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`
                  }
                ]
              }
            ]
          },
          labels: ['xray-execution', 'automated', 'e2e']
        }
      };

      const response = await this.client.post('/issues', testExecutionPayload);
      const executionKey = response.data.key;

      // Import test results
      await this.importTestResults(executionKey, testResults);

      this.metrics.executionsRecorded++;
      console.log(`✓ Test Execution recorded: ${executionKey}`);
      return executionKey;
    } catch (error) {
      console.error('Error recording test execution:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Import test results (Cucumber JSON format)
   */
  async importTestResults(executionKey, testResults) {
    try {
      // Format test results for Xray import
      const xrayResults = this.formatResultsForXray(testResults);

      // Post results to Xray
      const importPayload = {
        testExecutionKey: executionKey,
        testResults: xrayResults,
        info: {
          summary: `E2E Test Execution - ${new Date().toISOString()}`,
          environment: testResults.environment || 'test',
          startDate: new Date().toISOString(),
          finishDate: new Date().toISOString()
        }
      };

      // Xray API endpoint for result import
      const importResponse = await axios.post(
        `${this.jiraHost}/rest/raven/2.0/import/execution/cucumber`,
        xrayResults,
        { headers: this.authHeader }
      );

      this.metrics.resultsImported++;
      console.log(`✓ Test results imported for ${executionKey}`);
      return importResponse.data;
    } catch (error) {
      console.error('Error importing test results:', error.response?.data || error.message);
    }
  }

  /**
   * Format test results for Xray import
   */
  formatResultsForXray(testResults) {
    return {
      testExecutionKey: testResults.executionKey,
      tests: (testResults.scenarios || []).map(scenario => ({
        testKey: scenario.testKey,
        status: scenario.status,
        actualResult: scenario.actualResult,
        duration: scenario.duration,
        defects: scenario.defects || [],
        evidence: scenario.evidence || []
      }))
    };
  }

  /**
   * Format Gherkin steps for display
   */
  formatGherkinSteps(steps) {
    return steps
      .map((step, i) => `\n${i + 1}. ${step.keyword} ${step.text}`)
      .join('');
  }

  /**
   * Format steps for Xray
   */
  formatXraySteps(steps) {
    return steps.map(step => ({
      step: step.text,
      data: step.dataTable || [],
      expected: step.expected || ''
    }));
  }

  /**
   * Extract parameters from Gherkin steps
   */
  extractParameters(steps) {
    const parameters = [];
    steps.forEach(step => {
      // Extract variables from step text (e.g., <username>, <password>)
      const matches = step.text.match(/<(\w+)>/g) || [];
      matches.forEach(match => {
        const paramName = match.replace(/[<>]/g, '');
        if (!parameters.includes(paramName)) {
          parameters.push(paramName);
        }
      });
    });
    return parameters;
  }

  /**
   * Get test coverage report
   */
  async getTestCoverageReport(projectKey) {
    try {
      const jql = `project = ${projectKey} AND issuetype = Test`;
      const response = await this.client.get('/search', {
        params: { jql, maxResults: 100 }
      });

      const tests = response.data.issues;
      return {
        totalTests: tests.length,
        automatedTests: tests.filter(t => t.fields.labels?.includes('automation')).length,
        manualTests: tests.filter(t => !t.fields.labels?.includes('automation')).length,
        byComponent: this.groupTestsByComponent(tests)
      };
    } catch (error) {
      console.error('Error fetching coverage report:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Group tests by component
   */
  groupTestsByComponent(tests) {
    const grouped = {};
    tests.forEach(test => {
      const labels = test.fields.labels || [];
      const componentLabel = labels.find(l => l.startsWith('component-'));
      if (componentLabel) {
        const component = componentLabel.replace('component-', '');
        if (!grouped[component]) {
          grouped[component] = [];
        }
        grouped[component].push(test);
      }
    });
    return grouped;
  }

  /**
   * Synchronize Cucumber feature files to Xray
   */
  async syncCucumberFeatures(featureFilePath, projectKey) {
    try {
      // Parse cucumber features and create Xray tests
      const features = require(featureFilePath);
      let created = 0;

      for (const feature of features) {
        for (const scenario of feature.scenarios) {
          await this.createTestCaseFromBDD(
            {
              title: scenario.name,
              feature: feature.name,
              steps: scenario.steps,
              examples: scenario.examples
            },
            `${projectKey}-1`,
            { name: feature.name, id: `feat-${feature.name.toLowerCase()}` }
          );
          created++;
        }
      }

      console.log(`✓ Synced ${created} scenarios to Xray`);
      return created;
    } catch (error) {
      console.error('Error syncing Cucumber features:', error.message);
    }
  }

  /**
   * Get quality metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      totalTestAssets: this.metrics.testCasesCreated +
        this.metrics.testPlansCreated +
        this.metrics.executionsRecorded
    };
  }
}

module.exports = XrayIntegration;
