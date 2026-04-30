/**
 * Project Kickoff Example
 * Complete example of generating project kickoff with use cases and Jira integration
 * 
 * Usage:
 *   node project_kickoff_example.js
 * 
 * This will:
 * 1. Extract use cases from raw requirements
 * 2. Generate detailed test scenarios
 * 3. Identify actors and business rules
 * 4. Create comprehensive Jira project structure
 * 5. Generate use case documentation
 */

require('dotenv').config();
const ProjectKickoffOrchestrator = require('./agents/ProjectKickoffOrchestrator');

/**
 * Sample: Banking Application Project Kickoff
 */
async function bankingProjectKickoff() {
  const orchestrator = new ProjectKickoffOrchestrator({
    jiraUrl: 'https://k2011rajesh.atlassian.net',
    jiraEmail: process.env.JIRA_EMAIL,
    jiraApiToken: process.env.JIRA_API_TOKEN,
    jiraProjectKey: 'QED',
    useCaseOutputDir: './use_cases/banking',
    domainsOutputDir: './domains_docs/banking'
  });

  const additionalRequirements = [
    'Support multiple banking channels (mobile, web, ATM)',
    'Implement real-time fraud detection',
    'Support bill payment to utility providers',
    'Enable investment portfolio management',
    'Support recurring payment setup',
    'Provide financial advisory features'
  ];

  try {
    const result = await orchestrator.executeProjectKickoff(
      'InvestSmart Banking Platform',
      'banking',
      additionalRequirements
    );

    console.log('\n✅ Banking Project Kickoff Generated!');
    console.log(`\nAccess your project: ${result.jiraUrl}`);

    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Sample: Healthcare Application Project Kickoff
 */
async function healthcareProjectKickoff() {
  const orchestrator = new ProjectKickoffOrchestrator({
    jiraUrl: 'https://k2011rajesh.atlassian.net',
    jiraEmail: process.env.JIRA_EMAIL,
    jiraApiToken: process.env.JIRA_API_TOKEN,
    jiraProjectKey: 'QED',
    useCaseOutputDir: './use_cases/healthcare',
    domainsOutputDir: './domains_docs/healthcare'
  });

  const additionalRequirements = [
    'Multi-language support for diverse patient population',
    'Accessibility compliance (WCAG 2.1 AA)',
    'Integration with hospital information systems',
    'Prescription drug interaction checking',
    'Vaccination record tracking',
    'Emergency contact notification system'
  ];

  try {
    const result = await orchestrator.executeProjectKickoff(
      'MediCare Health Management',
      'healthcare',
      additionalRequirements
    );

    console.log('\n✅ Healthcare Project Kickoff Generated!');
    console.log(`\nAccess your project: ${result.jiraUrl}`);

    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Sample: Insurance Application Project Kickoff
 */
async function insuranceProjectKickoff() {
  const orchestrator = new ProjectKickoffOrchestrator({
    jiraUrl: 'https://k2011rajesh.atlassian.net',
    jiraEmail: process.env.JIRA_EMAIL,
    jiraApiToken: process.env.JIRA_API_TOKEN,
    jiraProjectKey: 'QED',
    useCaseOutputDir: './use_cases/insurance',
    domainsOutputDir: './domains_docs/insurance'
  });

  const additionalRequirements = [
    'Support for different policy types (life, health, auto, home)',
    'Automated underwriting engine',
    'Claims prediction and fraud detection',
    'Policy comparison tool for customers',
    'Integration with external verification services',
    'Digital document signing and storage'
  ];

  try {
    const result = await orchestrator.executeProjectKickoff(
      'InsureMax Insurance Platform',
      'insurance',
      additionalRequirements
    );

    console.log('\n✅ Insurance Project Kickoff Generated!');
    console.log(`\nAccess your project: ${result.jiraUrl}`);

    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Main: Run selected project kickoff
 */
async function main() {
  console.log('\n' + '='.repeat(100));
  console.log('🚀 PROJECT KICKOFF - SELECT DOMAIN');
  console.log('='.repeat(100) + '\n');

  console.log('Available projects:');
  console.log('  1. Banking Application');
  console.log('  2. Healthcare System');
  console.log('  3. Insurance Platform');
  console.log('  4. All Projects (Sequential)\n');

  // For demo, run banking project
  console.log('Running: Banking Application Project Kickoff\n');

  try {
    await bankingProjectKickoff();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  bankingProjectKickoff,
  healthcareProjectKickoff,
  insuranceProjectKickoff
};
