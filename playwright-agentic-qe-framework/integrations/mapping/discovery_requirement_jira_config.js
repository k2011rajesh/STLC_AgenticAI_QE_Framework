/**
 * Discovery & Requirement to Jira Configuration
 * Configuration for mapping application discovery and requirements to Jira
 * 
 * Project: QED (Quality Engineering Dashboard)
 * Jira URL: https://k2011rajesh.atlassian.net/jira/core/projects/QED/board
 */

const jiraConfig = {
  // Jira Cloud Connection
  jiraUrl: 'https://k2011rajesh.atlassian.net',
  
  // Project Configuration
  projectKey: 'QED', // Extracted from URL: /projects/QED/
  projectName: 'Quality Engineering Dashboard',
  
  // Jira Board Configuration
  boardUrl: 'https://k2011rajesh.atlassian.net/jira/core/projects/QED/board?filter=&groupBy=status',
  backlogUrl: 'https://k2011rajesh.atlassian.net/jira/core/projects/QED/backlog',
  
  // Authentication (use environment variables in production)
  email: process.env.JIRA_EMAIL || 'your-email@example.com',
  apiToken: process.env.JIRA_API_TOKEN || 'your-api-token',
  
  // Mapping Configuration
  mapping: {
    // Create epics for major discovery areas
    createEpics: true,
    epicNamingPattern: 'QE: {appName} - {area}',
    
    // Create stories for components
    createComponentStories: true,
    componentStoryNamingPattern: 'QA: {componentName} Test Coverage',
    
    // Create stories for requirements
    createRequirementStories: true,
    requirementStoryNamingPattern: 'Requirement: {requirementTitle}',
    
    // Create sub-tasks for acceptance criteria
    createAcceptanceCriteriaSubtasks: true,
    
    // Create test execution stories
    createTestExecutionStories: true,
    testExecutionTypes: [
      'infrastructure',
      'api',
      'ui',
      'database',
      'integration'
    ],
    
    // Link discovery to requirements
    createLinks: true,
    linkTypes: ['relates to', 'blocks', 'is blocked by'],
    
    // Quality scoring
    defaultInvestScore: 85,
    defaultSmartScore: 90,
    
    // Labels and tagging
    labels: {
      component: ['component-test', 'quality-mapped', 'invest-ready'],
      requirement: ['requirement-mapping', 'acceptance-criteria', 'e2e-test'],
      testExecution: ['test-execution', 'qa-ready', 'automation-ready'],
      infrastructure: ['infrastructure', 'test-setup', 'fixtures']
    }
  },
  
  // Quality Thresholds
  qualityThresholds: {
    investScore: {
      ready: 85,
      good: 75,
      acceptable: 65
    },
    smartScore: {
      ready: 85,
      good: 75,
      acceptable: 65
    },
    mappingCompleteness: {
      target: 100,
      minimum: 80
    }
  },
  
  // Jira Field Mapping
  fields: {
    epic: {
      name: 'Epic Name',
      customFieldId: 'customfield_10000'
    },
    component: {
      name: 'Component/Module',
      customFieldId: 'customfield_10001'
    },
    storyPoints: {
      name: 'Story Points',
      customFieldId: 'customfield_10002'
    },
    qualityScore: {
      name: 'Quality Score',
      customFieldId: 'customfield_10003'
    },
    investScore: {
      name: 'INVEST Score',
      customFieldId: 'customfield_10004'
    },
    smartScore: {
      name: 'SMART Score',
      customFieldId: 'customfield_10005'
    }
  },
  
  // Discovery Data Configuration
  discovery: {
    // Tech stack areas to document
    techStackAreas: [
      'frontend',
      'backend',
      'database',
      'infrastructure',
      'testing',
      'integration',
      'monitoring'
    ],
    
    // Component types to track
    componentTypes: [
      'service',
      'controller',
      'model',
      'utility',
      'config',
      'fixture',
      'helper'
    ],
    
    // Risk levels
    riskLevels: ['Critical', 'High', 'Medium', 'Low'],
    
    // Test coverage priorities
    testCoveragePriorities: ['Critical', 'High', 'Medium', 'Low']
  },
  
  // Requirement Configuration
  requirements: {
    // Requirement types
    types: [
      'functional',
      'non-functional',
      'security',
      'performance',
      'usability',
      'compliance'
    ],
    
    // Requirement priorities
    priorities: ['Critical', 'High', 'Medium', 'Low'],
    
    // Acceptance criteria types
    acceptanceCriteriaTypes: [
      'functional',
      'performance',
      'security',
      'usability'
    ]
  }
};

module.exports = jiraConfig;
