/**
 * Discovery & Requirement to Jira Mapper
 * Comprehensive integration of ApplicationDiscoveryAgent and RequirementAgent data
 * Maps to Jira project structure with Epics, Stories, and Sub-tasks
 * 
 * @example
 * const mapper = new DiscoveryRequirementJiraMapper({
 *   jiraUrl: 'https://k2011rajesh.atlassian.net',
 *   email: 'user@example.com',
 *   apiToken: 'your-api-token',
 *   projectKey: 'QED'
 * });
 * 
 * const result = await mapper.mapDiscoveryAndRequirementsToJira(
 *   discoveryData,
 *   requirements,
 *   applicationName
 * );
 */

const JiraCloudIntegration = require('../jira/jira_cloud_integration');

class DiscoveryRequirementJiraMapper {
  constructor(config) {
    this.jiraUrl = config.jiraUrl; // e.g., 'https://k2011rajesh.atlassian.net'
    this.email = config.email;
    this.apiToken = config.apiToken;
    this.projectKey = config.projectKey; // e.g., 'QED'
    
    // Initialize Jira integration
    this.jira = new JiraCloudIntegration(
      this.jiraUrl,
      this.email,
      this.apiToken,
      this.projectKey
    );
    
    // Mapping state
    this.mappingState = {
      epicKey: null,
      stories: [],
      subtasks: [],
      requirementLinks: [],
      componentLinks: [],
      qualityMetrics: {
        totalComponents: 0,
        totalRequirements: 0,
        mappedComponents: 0,
        mappedRequirements: 0,
        acceptanceCriteriaMapped: 0,
        testsGenerated: 0,
        totalQualityScore: 0
      }
    };
  }

  /**
   * Main orchestration method: Map all discovery and requirement data to Jira
   */
  async mapDiscoveryAndRequirementsToJira(discoveryData, requirements, applicationName) {
    console.log(`\n🚀 Starting Discovery & Requirement Mapping to Jira for: ${applicationName}`);
    console.log(`📊 Discovery Components: ${discoveryData?.codebaseComponents?.length || 0}`);
    console.log(`📋 Requirements: ${requirements?.length || 0}\n`);

    try {
      // Step 1: Create main epic for discovery and requirements
      console.log('Step 1: Creating main discovery epic...');
      this.mappingState.epicKey = await this.createMainDiscoveryEpic(applicationName, discoveryData);
      
      // Step 2: Map discovery components to Jira stories
      console.log('Step 2: Mapping discovery components to Jira...');
      await this.mapDiscoveryComponentsToJira(discoveryData, this.mappingState.epicKey);
      
      // Step 3: Map requirements to Jira stories
      console.log('Step 3: Mapping requirements to Jira...');
      await this.mapRequirementsToJira(requirements, this.mappingState.epicKey, discoveryData);
      
      // Step 4: Create test execution stories
      console.log('Step 4: Creating test execution stories...');
      await this.createTestExecutionStories(this.mappingState.epicKey, discoveryData, requirements);
      
      // Step 5: Link discovery to requirements
      console.log('Step 5: Linking discovery components to requirements...');
      await this.linkDiscoveryToRequirements(discoveryData, requirements);
      
      // Step 6: Generate mapping report
      console.log('Step 6: Generating mapping report...');
      const report = this.generateMappingReport(applicationName);
      
      console.log('\n✅ Mapping complete!\n');
      return {
        success: true,
        epicKey: this.mappingState.epicKey,
        mappingState: this.mappingState,
        report: report,
        jiraUrl: this.getJiraProjectUrl()
      };
    } catch (error) {
      console.error('❌ Error during mapping:', error.message);
      throw error;
    }
  }

  /**
   * Create main epic for the entire discovery and requirements mapping
   */
  async createMainDiscoveryEpic(applicationName, discoveryData) {
    try {
      const epicKey = await this.jira.createTestCoverageEpic(
        applicationName,
        discoveryData,
        85
      );
      
      console.log(`✅ Epic created: ${epicKey}`);
      return epicKey;
    } catch (error) {
      console.error('Error creating main epic:', error.message);
      throw error;
    }
  }

  /**
   * Map all discovery components to Jira stories
   */
  async mapDiscoveryComponentsToJira(discoveryData, epicKey) {
    const components = discoveryData?.codebaseComponents || [];
    this.mappingState.qualityMetrics.totalComponents = components.length;

    console.log(`📦 Processing ${components.length} components...`);

    for (const component of components) {
      try {
        // Extract component information
        const componentInfo = this.normalizeComponent(component);
        
        // Create story for this component
        const storyKey = await this.jira.createComponentStory(
          epicKey,
          componentInfo,
          [],
          componentInfo.investScore || 85,
          componentInfo.smartScore || 90
        );

        this.mappingState.stories.push({
          storyKey,
          componentId: componentInfo.id || componentInfo.name,
          componentName: componentInfo.name,
          type: 'component'
        });

        this.mappingState.qualityMetrics.mappedComponents++;
        console.log(`  ✓ ${componentInfo.name} → ${storyKey}`);
      } catch (error) {
        console.error(`  ✗ Error mapping component ${component.name}:`, error.message);
      }
    }
  }

  /**
   * Map requirements to Jira stories
   */
  async mapRequirementsToJira(requirements, epicKey, discoveryData) {
    if (!requirements || requirements.length === 0) {
      console.log('⚠️  No requirements to map');
      return;
    }

    this.mappingState.qualityMetrics.totalRequirements = requirements.length;
    console.log(`📋 Processing ${requirements.length} requirements...`);

    for (const requirement of requirements) {
      try {
        // Normalize requirement data
        const reqInfo = this.normalizeRequirement(requirement);
        
        // Find related components from discovery
        const relatedComponents = this.findRelatedComponents(reqInfo, discoveryData);
        
        // Create story for this requirement
        const storyKey = await this.jira.createComponentStory(
          epicKey,
          {
            name: reqInfo.title,
            type: 'requirement',
            description: reqInfo.description,
            riskLevel: reqInfo.riskLevel || 'Medium',
            dependencies: relatedComponents.map(c => c.name),
            testCoveragePriority: reqInfo.priority || 'Medium'
          },
          relatedComponents,
          reqInfo.investScore || 85,
          reqInfo.smartScore || 90
        );

        this.mappingState.stories.push({
          storyKey,
          requirementId: reqInfo.id || reqInfo.key,
          requirementTitle: reqInfo.title,
          relatedComponents: relatedComponents.map(c => c.name),
          type: 'requirement'
        });

        // Create sub-tasks for acceptance criteria
        await this.createAcceptanceCriteriaSubtasks(storyKey, reqInfo);

        this.mappingState.qualityMetrics.mappedRequirements++;
        this.mappingState.qualityMetrics.acceptanceCriteriaMapped += (reqInfo.acceptanceCriteria?.length || 0);

        console.log(`  ✓ ${reqInfo.title} → ${storyKey}`);
      } catch (error) {
        console.error(`  ✗ Error mapping requirement:`, error.message);
      }
    }
  }

  /**
   * Create sub-tasks for acceptance criteria
   */
  async createAcceptanceCriteriaSubtasks(storyKey, requirement) {
    const acceptanceCriteria = requirement.acceptanceCriteria || [];
    
    for (const ac of acceptanceCriteria) {
      try {
        const acPayload = {
          fields: {
            project: { key: this.projectKey },
            issuetype: { name: 'Sub-task' },
            parent: { key: storyKey },
            summary: typeof ac === 'string' ? ac : ac.title || ac.description,
            description: {
              version: 1,
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: this.formatAcceptanceCriteriaDescription(ac)
                    }
                  ]
                }
              ]
            },
            labels: ['acceptance-criteria', 'requirement-mapping', 'e2e-test']
          }
        };

        await this.jira.client.post('/issues', acPayload);
        console.log(`    ✓ AC: ${typeof ac === 'string' ? ac : ac.title}`);
      } catch (error) {
        console.error(`    ✗ Error creating AC sub-task:`, error.message);
      }
    }
  }

  /**
   * Create test execution stories linked to discovery and requirements
   */
  async createTestExecutionStories(epicKey, discoveryData, requirements) {
    const testStories = [
      {
        title: 'Test Infrastructure Setup',
        description: 'Set up test infrastructure, fixtures, and helpers',
        testType: 'infrastructure'
      },
      {
        title: 'API Test Suite',
        description: 'Create API test cases for all discovered endpoints',
        testType: 'api'
      },
      {
        title: 'UI Test Suite',
        description: 'Create UI/E2E test cases for discovered components',
        testType: 'ui'
      },
      {
        title: 'Database Test Suite',
        description: 'Create database integration test cases',
        testType: 'database'
      },
      {
        title: 'Integration Test Suite',
        description: 'Create integration test cases between components',
        testType: 'integration'
      }
    ];

    console.log(`🧪 Creating ${testStories.length} test execution stories...`);

    for (const testStory of testStories) {
      try {
        const storyKey = await this.jira.createComponentStory(
          epicKey,
          {
            name: testStory.title,
            type: testStory.testType,
            description: testStory.description,
            riskLevel: 'Medium',
            testCoveragePriority: 'High'
          },
          [],
          80,
          85
        );

        this.mappingState.stories.push({
          storyKey,
          testType: testStory.testType,
          type: 'test-execution'
        });

        console.log(`  ✓ ${testStory.title} → ${storyKey}`);
      } catch (error) {
        console.error(`  ✗ Error creating test story:`, error.message);
      }
    }
  }

  /**
   * Link discovery components to requirements
   */
  async linkDiscoveryToRequirements(discoveryData, requirements) {
    const componentStories = this.mappingState.stories.filter(s => s.type === 'component');
    const requirementStories = this.mappingState.stories.filter(s => s.type === 'requirement');

    console.log(`🔗 Linking ${componentStories.length} components to ${requirementStories.length} requirements...`);

    for (const reqStory of requirementStories) {
      const relatedComponents = reqStory.relatedComponents || [];
      
      for (const componentName of relatedComponents) {
        const componentStory = componentStories.find(s => s.componentName === componentName);
        
        if (componentStory) {
          try {
            // Create link relationship in Jira
            await this.jira.client.post('/issueLink', {
              type: { name: 'relates to' },
              inwardIssue: { key: reqStory.storyKey },
              outwardIssue: { key: componentStory.storyKey }
            });

            this.mappingState.requirementLinks.push({
              from: reqStory.storyKey,
              to: componentStory.storyKey,
              type: 'relates-to'
            });

            console.log(`  ✓ ${reqStory.storyKey} → ${componentStory.storyKey}`);
          } catch (error) {
            // Link might already exist, continue
            console.log(`  ⓘ Link already exists or skipped: ${error.message.substring(0, 50)}`);
          }
        }
      }
    }
  }

  /**
   * Normalize component data from various formats
   */
  normalizeComponent(component) {
    if (typeof component === 'string') {
      return {
        name: component,
        id: component.toLowerCase().replace(/\s+/g, '_'),
        type: 'unknown',
        riskLevel: 'Medium',
        testCoveragePriority: 'Medium'
      };
    }

    return {
      id: component.id || component.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown',
      name: component.name || component.title || 'Unknown Component',
      type: component.type || component.componentType || 'unknown',
      description: component.description || '',
      riskLevel: component.riskLevel || component.risk || 'Medium',
      testCoveragePriority: component.testCoveragePriority || component.priority || 'Medium',
      dependencies: component.dependencies || [],
      investScore: component.investScore || 85,
      smartScore: component.smartScore || 90
    };
  }

  /**
   * Normalize requirement data from various formats
   */
  normalizeRequirement(requirement) {
    if (typeof requirement === 'string') {
      return {
        id: requirement.substring(0, 20),
        key: requirement.substring(0, 20),
        title: requirement,
        description: '',
        acceptanceCriteria: [],
        priority: 'Medium',
        riskLevel: 'Medium'
      };
    }

    return {
      id: requirement.id || requirement.key || requirement.title?.substring(0, 20),
      key: requirement.key || requirement.id,
      title: requirement.title || requirement.summary || requirement.name || 'Unknown Requirement',
      description: requirement.description || requirement.details || '',
      acceptanceCriteria: requirement.acceptanceCriteria || requirement.criteria || [],
      priority: requirement.priority || 'Medium',
      riskLevel: requirement.riskLevel || requirement.risk || 'Medium',
      investScore: requirement.investScore || 85,
      smartScore: requirement.smartScore || 90
    };
  }

  /**
   * Find components related to a requirement
   */
  findRelatedComponents(requirement, discoveryData) {
    const components = discoveryData?.codebaseComponents || [];
    const keywords = this.extractKeywords(requirement.title + ' ' + requirement.description);

    return components.filter(comp => {
      const compText = (comp.name || '') + ' ' + (comp.description || '');
      const compKeywords = compText.toLowerCase().split(/\s+/);
      
      return keywords.some(keyword => 
        compKeywords.some(ck => ck.includes(keyword) || keyword.includes(ck))
      );
    }).slice(0, 5); // Limit to 5 related components
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(text) {
    if (!text) return [];
    
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 10);
  }

  /**
   * Format acceptance criteria for Jira description
   */
  formatAcceptanceCriteriaDescription(ac) {
    if (typeof ac === 'string') {
      return ac;
    }

    if (ac.gherkin && Array.isArray(ac.gherkin)) {
      return `BDD Scenario:\n${ac.gherkin.join('\n')}`;
    }

    return (ac.description || ac.title || '') + (ac.expected ? `\nExpected: ${ac.expected}` : '');
  }

  /**
   * Generate comprehensive mapping report
   */
  generateMappingReport(applicationName) {
    const metrics = this.mappingState.qualityMetrics;
    const timestamp = new Date().toISOString();

    return {
      applicationName,
      timestamp,
      epicKey: this.mappingState.epicKey,
      summary: {
        totalComponents: metrics.totalComponents,
        mappedComponents: metrics.mappedComponents,
        componentMappingRate: `${((metrics.mappedComponents / metrics.totalComponents) * 100).toFixed(1)}%`,
        totalRequirements: metrics.totalRequirements,
        mappedRequirements: metrics.mappedRequirements,
        requirementMappingRate: `${((metrics.mappedRequirements / metrics.totalRequirements) * 100).toFixed(1)}%`,
        acceptanceCriteriaMapped: metrics.acceptanceCriteriaMapped,
        totalStoriesCreated: this.mappingState.stories.length,
        jiraProject: this.projectKey
      },
      stories: this.mappingState.stories,
      links: this.mappingState.requirementLinks,
      jiraUrl: this.getJiraProjectUrl(),
      documentation: {
        boardUrl: `${this.jiraUrl}/jira/core/projects/${this.projectKey}/board?filter=&groupBy=status`,
        backlogUrl: `${this.jiraUrl}/jira/core/projects/${this.projectKey}/backlog`,
        epicUrl: `${this.jiraUrl}/jira/core/projects/${this.projectKey}/issues/?jql=parent=${this.mappingState.epicKey}`
      }
    };
  }

  /**
   * Get Jira project URL
   */
  getJiraProjectUrl() {
    return `${this.jiraUrl}/jira/core/projects/${this.projectKey}/board?filter=&groupBy=status`;
  }

  /**
   * Print mapping summary to console
   */
  printSummary() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 DISCOVERY & REQUIREMENT MAPPING SUMMARY');
    console.log('='.repeat(70));
    
    const metrics = this.mappingState.qualityMetrics;
    console.log(`\n📦 Components Mapped: ${metrics.mappedComponents}/${metrics.totalComponents}`);
    console.log(`📋 Requirements Mapped: ${metrics.mappedRequirements}/${metrics.totalRequirements}`);
    console.log(`✅ Acceptance Criteria: ${metrics.acceptanceCriteriaMapped}`);
    console.log(`📚 Total Stories Created: ${this.mappingState.stories.length}`);
    console.log(`🔗 Links Created: ${this.mappingState.requirementLinks.length}`);
    
    console.log(`\n🎯 Epic Key: ${this.mappingState.epicKey}`);
    console.log(`🔗 Jira URL: ${this.getJiraProjectUrl()}`);
    console.log('\n' + '='.repeat(70) + '\n');
  }
}

module.exports = DiscoveryRequirementJiraMapper;
