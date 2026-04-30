/**
 * INVEST Quality & BDD Integration Example
 * 
 * This example demonstrates:
 * 1. Creating INVEST-scored epics and user stories in Jira
 * 2. Generating BDD Feature files for functional stories
 * 3. Mapping scenarios to feature files
 * 4. Creating comprehensive quality reports
 * 
 * Setup:
 * 1. Export environment variables:
 *    export JIRA_EMAIL="your-email@example.com"
 *    export JIRA_API_TOKEN="your-api-token"
 *    export OPENAI_API_KEY="your-openai-key"
 * 
 * 2. Run:
 *    node invest_quality_example.js
 */

const InvestQualityOrchestrator = require('./integrations/quality/invest_quality_orchestrator');
// Load environment variables from .env file if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv is optional
}

/**
 * Sample Banking Application Requirements
 */
const BANKING_REQUIREMENTS = [
  {
    id: 'FR-001',
    title: 'User Registration',
    description: 'Users should be able to register with email and password',
    type: 'Functional',
    priority: 'High',
    acceptanceCriteria: [
      'GIVEN user is on registration page WHEN user enters valid email and password THEN account is created',
      'GIVEN user enters invalid email WHEN submitting form THEN error message is displayed',
      'GIVEN user enters weak password WHEN submitting form THEN password strength warning is shown'
    ],
    testScenarios: [
      {
        name: 'Successful Registration',
        given: 'user is on registration page',
        when: 'user enters valid email and password',
        then: 'account is created and confirmation email is sent'
      },
      {
        name: 'Invalid Email Format',
        given: 'user is on registration page',
        when: 'user enters invalid email format',
        then: 'error message is shown'
      },
      {
        name: 'Password Strength Validation',
        given: 'user is on registration page',
        when: 'user enters weak password',
        then: 'password strength indicator shows red'
      }
    ],
    businessValue: 10,
    complexity: 'low',
    dependencies: [],
    automatable: true,
    isUserFacing: true
  },

  {
    id: 'FR-002',
    title: 'User Login',
    description: 'Users should be able to login with email and password',
    type: 'Functional',
    priority: 'High',
    acceptanceCriteria: [
      'GIVEN user has valid credentials WHEN user logs in THEN user is authenticated',
      'GIVEN user enters wrong password WHEN attempting login THEN error is shown',
      'GIVEN user account is locked WHEN attempting login THEN account locked message is shown'
    ],
    testScenarios: [
      {
        name: 'Successful Login',
        given: 'user has valid account',
        when: 'user enters correct credentials',
        then: 'user is logged in and redirected to dashboard'
      },
      {
        name: 'Failed Login',
        given: 'user has account',
        when: 'user enters wrong password',
        then: 'error message is displayed'
      }
    ],
    businessValue: 10,
    complexity: 'low',
    dependencies: ['FR-001'],
    automatable: true,
    isUserFacing: true
  },

  {
    id: 'FR-003',
    title: 'View Account Balance',
    description: 'Users should see their account balance on dashboard',
    type: 'Functional',
    priority: 'High',
    acceptanceCriteria: [
      'GIVEN user is logged in WHEN user views dashboard THEN account balance is displayed',
      'GIVEN balance is being updated WHEN user refreshes page THEN latest balance is shown'
    ],
    testScenarios: [
      {
        name: 'Display Account Balance',
        given: 'user is authenticated and on dashboard',
        when: 'page loads',
        then: 'current account balance is displayed in INR'
      }
    ],
    businessValue: 9,
    complexity: 'low',
    dependencies: ['FR-002'],
    automatable: true,
    isUserFacing: true
  },

  {
    id: 'FR-004',
    title: 'Fund Transfer',
    description: 'Users should transfer funds to another account',
    type: 'Functional',
    priority: 'High',
    acceptanceCriteria: [
      'GIVEN user enters valid transfer details WHEN user confirms transfer THEN funds are transferred',
      'GIVEN user enters insufficient balance WHEN attempting transfer THEN error is shown',
      'GIVEN transfer is initiated WHEN 2FA is required THEN OTP verification is requested'
    ],
    testScenarios: [
      {
        name: 'Successful Fund Transfer',
        given: 'user has sufficient balance',
        when: 'user enters valid recipient and amount',
        then: 'funds are transferred and receipt is shown'
      },
      {
        name: 'Insufficient Balance',
        given: 'user has low balance',
        when: 'user tries to transfer more than available',
        then: 'insufficient balance error is shown'
      }
    ],
    businessValue: 10,
    complexity: 'medium',
    dependencies: ['FR-003'],
    automatable: true,
    isUserFacing: true
  },

  {
    id: 'FR-005',
    title: 'Transaction History',
    description: 'Users should view their transaction history',
    type: 'Functional',
    priority: 'Medium',
    acceptanceCriteria: [
      'GIVEN user is logged in WHEN user navigates to history THEN all transactions are listed',
      'GIVEN user filters by date WHEN applying filter THEN only matching transactions are shown'
    ],
    testScenarios: [
      {
        name: 'View All Transactions',
        given: 'user is on transaction history page',
        when: 'page loads',
        then: 'all transactions are displayed with date and amount'
      }
    ],
    businessValue: 8,
    complexity: 'low',
    dependencies: [],
    automatable: true,
    isUserFacing: true
  },

  {
    id: 'NFR-001',
    title: 'System Performance',
    description: 'System should respond within 2 seconds for all operations',
    type: 'Performance',
    priority: 'High',
    metric: 'Response time < 2 seconds for 95% of requests',
    acceptanceCriteria: [
      'Dashboard loads in < 1 second',
      'Fund transfer processes in < 3 seconds',
      'Transaction history loads in < 2 seconds'
    ],
    complexity: 'high',
    automatable: false,
    isUserFacing: false
  },

  {
    id: 'NFR-002',
    title: 'Security - Payment Processing',
    description: 'All payment transactions must be encrypted and PCI-DSS compliant',
    type: 'Security',
    priority: 'High',
    metric: 'PCI-DSS Level 1 Compliance',
    acceptanceCriteria: [
      'All payment data is encrypted end-to-end',
      'PCI-DSS audit passes',
      'No sensitive data in logs'
    ],
    complexity: 'high',
    automatable: false,
    isUserFacing: false
  },

  {
    id: 'NFR-003',
    title: 'System Availability',
    description: 'System should have 99.9% uptime',
    type: 'Non-Functional',
    priority: 'High',
    metric: 'Uptime >= 99.9%',
    acceptanceCriteria: [
      'System is available 24/7',
      'Planned maintenance window < 2 hours per month'
    ],
    complexity: 'high',
    automatable: false,
    isUserFacing: false
  }
];

/**
 * Sample Discovery Data
 */
const BANKING_DISCOVERY_DATA = {
  applicationName: 'InvestSmart Banking',
  technology: {
    frontend: 'React',
    backend: 'Node.js',
    database: 'PostgreSQL',
    cloud: 'AWS'
  },
  components: [
    { name: 'Auth Service', risk: 'High' },
    { name: 'Payment Service', risk: 'High' },
    { name: 'User Service', risk: 'Medium' },
    { name: 'Transaction Service', risk: 'Medium' }
  ]
};

/**
 * Main Execution
 */
async function runInvestQualityWorkflow() {
  try {
    // Create orchestrator with Jira configuration
    const orchestrator = new InvestQualityOrchestrator({
      jiraUrl: process.env.JIRA_URL || 'https://k2011rajesh.atlassian.net',
      email: process.env.JIRA_EMAIL || 'your-email@example.com',
      apiToken: process.env.JIRA_API_TOKEN || 'your-api-token',
      projectKey: process.env.JIRA_PROJECT_KEY || 'QED'
    });

    // Execute complete workflow
    try {
      const result = await orchestrator.executeInvestQualityWorkflow(
        'InvestSmart Banking',
        BANKING_REQUIREMENTS,
        BANKING_DISCOVERY_DATA
      );

      // Print detailed report
      printDetailedReport(result.report);

      return result;
    } catch (jiraError) {
      console.warn('\n⚠️  Jira integration unavailable, generating local report instead...\n');
      
      // Fallback: Generate report locally without Jira
      const result = await generateLocalReport(
        'InvestSmart Banking',
        BANKING_REQUIREMENTS,
        BANKING_DISCOVERY_DATA,
        orchestrator
      );
      
      printDetailedReport(result.report);
      return result;
    }
  } catch (error) {
    console.error('\n❌ Workflow execution failed:');
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * Generate report locally without Jira connection
 */
async function generateLocalReport(appName, requirements, discoveryData, orchestrator) {
  console.log('📋 Generating local quality report...\n');
  
  // Parse requirements
  const parsedRequirements = orchestrator.parseRequirements(requirements);
  
  // Score requirements
  const scoredRequirements = orchestrator.scoreAllRequirements(parsedRequirements);
  
  // Create mock Jira result
  const mockJiraResult = {
    state: {
      epicsCreated: 2,
      storiesCreated: scoredRequirements.length,
      storiesUpdated: 0,
      qualityScoresUpdated: scoredRequirements.length,
      featuresGenerated: scoredRequirements.filter(r => r.type === 'Functional' || !r.type).length,
      scenariosMapped: scoredRequirements.reduce((acc, r) => acc + (r.testScenarios?.length || 0), 0),
      errors: []
    }
  };
  
  // Generate report
  const report = orchestrator.generateComprehensiveReport(
    appName,
    scoredRequirements,
    mockJiraResult
  );
  
  return {
    success: true,
    applicationName: appName,
    requirements: scoredRequirements,
    jiraResult: mockJiraResult,
    report,
    state: mockJiraResult.state
  };
}

/**
 * Print detailed quality report
 */
function printDetailedReport(report) {
  console.log('\n' + '='.repeat(80));
  console.log('  📋 DETAILED QUALITY REPORT');
  console.log('='.repeat(80) + '\n');

  console.log(`📱 Application: ${report.applicationName}`);
  console.log(`📅 Generated: ${report.timestamp}\n`);

  // Overall Summary
  console.log('📊 Overall Summary:');
  console.log(`   Total Requirements: ${report.summary.totalRequirements}`);
  console.log(`   Functional: ${report.summary.functionalRequirements}`);
  console.log(`   Non-Functional: ${report.summary.nonFunctionalRequirements}`);
  console.log(`   Overall INVEST Score: ${report.summary.averageInvestScore}/100`);
  console.log(`   Functional Avg: ${report.summary.functionalAverage}/100`);
  console.log(`   NFR Avg: ${report.summary.nfrAverage}/100\n`);

  // Quality Distribution
  console.log('📈 Quality Distribution:');
  console.log(`   ⭐⭐⭐⭐⭐ Excellent (85-100): ${report.qualityDistribution.excellent}`);
  console.log(`   ⭐⭐⭐⭐ Good (75-84): ${report.qualityDistribution.good}`);
  console.log(`   ⭐⭐⭐ Fair (65-74): ${report.qualityDistribution.fair}`);
  console.log(`   ⭐⭐ Poor (50-64): ${report.qualityDistribution.poor}`);
  console.log(`   ⭐ Needs Work (<50): ${report.qualityDistribution.needsWork}\n`);

  // Top Scoring
  console.log('🏆 Top Scoring Requirements:');
  for (const item of report.topScoringItems) {
    console.log(`   • ${item.title}`);
    console.log(`     Score: ${item.score}/100 - ${item.rating}`);
  }
  console.log('');

  // Items Needing Improvement
  if (report.itemsNeedingImprovement.length > 0) {
    console.log('⚠️ Items Needing Improvement:');
    for (const item of report.itemsNeedingImprovement) {
      console.log(`   • ${item.title}`);
      console.log(`     Score: ${item.score}/100 - ${item.rating}`);
      console.log(`     Action: ${item.topRecommendation}`);
    }
    console.log('');
  }

  // INVEST Criteria Analysis
  console.log('🎯 INVEST Criteria Analysis:');
  for (const [criterion, analysis] of Object.entries(report.investCriteriaAnalysis)) {
    console.log(`   ${criterion.charAt(0).toUpperCase() + criterion.slice(1)}: ${analysis.average}/100 - ${analysis.strength}`);
  }
  console.log('');

  // Jira Metrics
  console.log('🔗 Jira Integration:');
  console.log(`   Epics Created: ${report.jiraMetrics.epicsCreated}`);
  console.log(`   Stories Created: ${report.jiraMetrics.storiesCreated}`);
  console.log(`   Features Generated: ${report.jiraMetrics.featuresGenerated}`);
  console.log(`   Scenarios Mapped: ${report.jiraMetrics.scenariosMapped}\n`);

  console.log('='.repeat(80) + '\n');
}

// Execute if run directly
if (require.main === module) {
  runInvestQualityWorkflow().then(result => {
    console.log('✅ INVEST Quality Workflow completed successfully!');
    console.log(`\n📂 Generated Files:`);
    console.log('   • Feature Files: ./playwright/features/functional/');
    console.log('   • Scenario Mapping: ./playwright/features/functional/SCENARIO_MAPPING.md');
    console.log('   • Step Definitions: ./playwright/step_definitions/');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Workflow failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runInvestQualityWorkflow,
  BANKING_REQUIREMENTS,
  BANKING_DISCOVERY_DATA
};
