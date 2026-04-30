/**
 * Discovery & Requirement to Jira Mapper - Usage Example
 * 
 * This example demonstrates how to:
 * 1. Collect application discovery data
 * 2. Analyze requirements
 * 3. Map everything to Jira QED project
 * 
 * Usage:
 *   node discovery_requirement_jira_mapper_example.js
 * 
 * Prerequisites:
 *   - Set environment variables (JIRA_EMAIL, JIRA_API_TOKEN)
 *   - Jira project QED must exist
 *   - User must have access to QED project
 */

require('dotenv').config();
const DiscoveryRequirementJiraMapper = require('./discovery_requirement_jira_mapper');

/**
 * Sample Application Discovery Data
 * This would typically come from ApplicationDiscoveryAgent
 */
const SAMPLE_DISCOVERY_DATA = {
  applicationName: 'Banking Application',
  techStack: {
    frontend: 'React 18.2 with Redux Toolkit',
    backend: 'Node.js 18 with Express.js',
    database: 'PostgreSQL 14',
    testing: 'Playwright, Jest',
    infrastructure: 'Docker, Kubernetes, AWS',
    api: 'REST API, GraphQL',
    authentication: 'JWT, OAuth 2.0',
    monitoring: 'ELK Stack, Prometheus'
  },
  architecture: {
    pattern: 'Microservices',
    layers: ['Presentation', 'API Gateway', 'Business Logic', 'Data Access'],
    scalability: 'Horizontal scaling with load balancing',
    security: 'TLS, encryption, API authentication'
  },
  codebaseComponents: [
    {
      id: 'auth_service',
      name: 'Authentication Service',
      type: 'service',
      description: 'Handles user authentication, JWT token generation, session management',
      riskLevel: 'High',
      testCoveragePriority: 'Critical',
      dependencies: ['database', 'encryption_service'],
      investScore: 88,
      smartScore: 90
    },
    {
      id: 'payment_service',
      name: 'Payment Service',
      type: 'service',
      description: 'Processes payments, manages transactions, handles payment gateway integration',
      riskLevel: 'Critical',
      testCoveragePriority: 'Critical',
      dependencies: ['auth_service', 'database', 'notification_service'],
      investScore: 92,
      smartScore: 94
    },
    {
      id: 'user_service',
      name: 'User Management Service',
      type: 'service',
      description: 'User profile management, preferences, account settings',
      riskLevel: 'Medium',
      testCoveragePriority: 'High',
      dependencies: ['auth_service', 'database'],
      investScore: 85,
      smartScore: 88
    },
    {
      id: 'account_controller',
      name: 'Account Controller',
      type: 'controller',
      description: 'HTTP endpoints for account operations',
      riskLevel: 'High',
      testCoveragePriority: 'High',
      dependencies: ['user_service', 'auth_service'],
      investScore: 83,
      smartScore: 85
    },
    {
      id: 'transaction_controller',
      name: 'Transaction Controller',
      type: 'controller',
      description: 'HTTP endpoints for transaction management',
      riskLevel: 'Critical',
      testCoveragePriority: 'Critical',
      dependencies: ['payment_service', 'auth_service'],
      investScore: 89,
      smartScore: 91
    },
    {
      id: 'user_model',
      name: 'User Data Model',
      type: 'model',
      description: 'Database schema and ORM mappings for user entities',
      riskLevel: 'Medium',
      testCoveragePriority: 'High',
      dependencies: ['database'],
      investScore: 80,
      smartScore: 82
    },
    {
      id: 'transaction_model',
      name: 'Transaction Data Model',
      type: 'model',
      description: 'Database schema and ORM mappings for transactions',
      riskLevel: 'High',
      testCoveragePriority: 'Critical',
      dependencies: ['database', 'payment_service'],
      investScore: 87,
      smartScore: 89
    },
    {
      id: 'auth_helper',
      name: 'Authentication Helper',
      type: 'utility',
      description: 'JWT verification, token validation, permission checking',
      riskLevel: 'High',
      testCoveragePriority: 'Critical',
      dependencies: [],
      investScore: 90,
      smartScore: 92
    },
    {
      id: 'encryption_service',
      name: 'Encryption Service',
      type: 'utility',
      description: 'Data encryption/decryption, password hashing',
      riskLevel: 'Critical',
      testCoveragePriority: 'Critical',
      dependencies: [],
      investScore: 94,
      smartScore: 96
    }
  ]
};

/**
 * Sample Requirements Data
 * This would typically come from RequirementAgent
 */
const SAMPLE_REQUIREMENTS = [
  {
    id: 'REQ-001',
    key: 'BNK-001',
    title: 'User Registration and Authentication',
    description: 'System must allow users to register new accounts and authenticate with email/password',
    acceptanceCriteria: [
      'Users can create account with valid email and password',
      'Password must be at least 8 characters',
      'Existing email cannot be used for registration',
      'Login generates JWT token',
      'Invalid credentials show error message',
      'Session expires after 24 hours of inactivity'
    ],
    priority: 'Critical',
    riskLevel: 'High'
  },
  {
    id: 'REQ-002',
    key: 'BNK-002',
    title: 'Secure Payment Processing',
    description: 'System must process payments securely with proper validation and audit trail',
    acceptanceCriteria: [
      'Payment amount must be validated',
      'Payment gateway integration works correctly',
      'Transaction records are created in database',
      'Confirmation emails are sent to users',
      'Payment history is retrievable',
      'Failed transactions are handled gracefully',
      'PCI DSS compliance is maintained'
    ],
    priority: 'Critical',
    riskLevel: 'Critical'
  },
  {
    id: 'REQ-003',
    key: 'BNK-003',
    title: 'User Account Management',
    description: 'Users should be able to view and update their account information',
    acceptanceCriteria: [
      'Users can view their profile information',
      'Users can update personal information',
      'Users can change password',
      'Password change requires current password verification',
      'Profile changes are persisted in database',
      'Audit trail tracks profile changes'
    ],
    priority: 'High',
    riskLevel: 'Medium'
  },
  {
    id: 'REQ-004',
    key: 'BNK-004',
    title: 'Transaction History and Reporting',
    description: 'Users should view complete transaction history with filtering and export options',
    acceptanceCriteria: [
      'Users can view all their transactions',
      'Transactions can be filtered by date range',
      'Transactions can be filtered by type',
      'Transaction details show all relevant information',
      'Transactions can be exported as CSV',
      'Transactions can be exported as PDF'
    ],
    priority: 'High',
    riskLevel: 'Medium'
  },
  {
    id: 'REQ-005',
    key: 'BNK-005',
    title: 'Data Security and Encryption',
    description: 'All sensitive data must be encrypted at rest and in transit',
    acceptanceCriteria: [
      'Passwords are hashed using bcrypt',
      'Sensitive fields are encrypted in database',
      'HTTPS is used for all communications',
      'API responses do not expose sensitive data',
      'Encryption keys are securely managed',
      'Regular security audits are conducted'
    ],
    priority: 'Critical',
    riskLevel: 'Critical'
  }
];

/**
 * Main execution function
 */
async function main() {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 DISCOVERY & REQUIREMENT TO JIRA MAPPING - EXAMPLE');
  console.log('='.repeat(80) + '\n');

  // Validate environment variables
  if (!process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
    console.error('❌ Error: Missing environment variables');
    console.error('   Please set JIRA_EMAIL and JIRA_API_TOKEN');
    console.error('\n   Example:');
    console.error('   export JIRA_EMAIL="user@example.com"');
    console.error('   export JIRA_API_TOKEN="your-api-token"\n');
    process.exit(1);
  }

  try {
    // Initialize mapper
    console.log('📋 Initializing Jira Mapper...');
    const mapper = new DiscoveryRequirementJiraMapper({
      jiraUrl: 'https://k2011rajesh.atlassian.net',
      email: process.env.JIRA_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN,
      projectKey: 'QED'
    });
    console.log('✅ Mapper initialized\n');

    // Display discovery data
    console.log('📦 DISCOVERY DATA');
    console.log('-'.repeat(80));
    console.log(`Application: ${SAMPLE_DISCOVERY_DATA.applicationName}`);
    console.log(`Tech Stack Areas: ${Object.keys(SAMPLE_DISCOVERY_DATA.techStack).length}`);
    console.log(`Components: ${SAMPLE_DISCOVERY_DATA.codebaseComponents.length}`);
    console.log(`\nTech Stack:`);
    Object.entries(SAMPLE_DISCOVERY_DATA.techStack).forEach(([area, tech]) => {
      console.log(`  • ${area}: ${tech}`);
    });
    console.log();

    // Display requirements
    console.log('📋 REQUIREMENTS');
    console.log('-'.repeat(80));
    console.log(`Total Requirements: ${SAMPLE_REQUIREMENTS.length}`);
    SAMPLE_REQUIREMENTS.forEach(req => {
      console.log(`  • ${req.key}: ${req.title}`);
      console.log(`    Priority: ${req.priority}, Risk: ${req.riskLevel}`);
      console.log(`    Criteria: ${req.acceptanceCriteria.length}`);
    });
    console.log();

    // Perform mapping
    console.log('🔄 PERFORMING MAPPING');
    console.log('-'.repeat(80) + '\n');
    
    const result = await mapper.mapDiscoveryAndRequirementsToJira(
      SAMPLE_DISCOVERY_DATA,
      SAMPLE_REQUIREMENTS,
      SAMPLE_DISCOVERY_DATA.applicationName
    );

    // Display results
    console.log('\n' + '='.repeat(80));
    console.log('✅ MAPPING COMPLETE');
    console.log('='.repeat(80) + '\n');

    mapper.printSummary();

    // Display detailed report
    console.log('📊 DETAILED MAPPING REPORT\n');
    const report = result.report;
    console.log(`Epic Key: ${report.epicKey}`);
    console.log(`Application: ${report.applicationName}`);
    console.log(`Timestamp: ${report.timestamp}\n`);

    console.log('Summary:');
    Object.entries(report.summary).forEach(([key, value]) => {
      console.log(`  • ${key}: ${value}`);
    });

    console.log('\nJira URLs:');
    console.log(`  📊 Board: ${report.documentation.boardUrl}`);
    console.log(`  📑 Backlog: ${report.documentation.backlogUrl}`);
    console.log(`  🎯 Epic: ${report.documentation.epicUrl}\n`);

    // Display created stories summary
    console.log('Stories Created:');
    const storyTypes = {};
    report.stories.forEach(story => {
      storyTypes[story.type] = (storyTypes[story.type] || 0) + 1;
    });
    Object.entries(storyTypes).forEach(([type, count]) => {
      console.log(`  • ${type}: ${count}`);
    });

    console.log(`\nLinks Created: ${report.links.length}`);
    console.log('\n' + '='.repeat(80) + '\n');

    // Success summary
    console.log('🎉 SUCCESS!\n');
    console.log('Next Steps:');
    console.log(`  1. Open Jira: ${result.jiraUrl}`);
    console.log(`  2. Review epic ${report.epicKey}`);
    console.log(`  3. Update story details as needed`);
    console.log(`  4. Start test design with DesignAgent\n`);

    return result;

  } catch (error) {
    console.error('❌ Error during mapping:', error.message);
    if (error.response?.data) {
      console.error('Details:', error.response.data);
    }
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { SAMPLE_DISCOVERY_DATA, SAMPLE_REQUIREMENTS, main };
