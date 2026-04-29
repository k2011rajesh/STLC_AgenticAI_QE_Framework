const ApplicationDiscoveryAgent = require('./agents/ApplicationDiscoveryAgent');
const RequirementAgent = require('./agents/RequirementAgent');
const DesignAgent = require('./agents/DesignAgent');
const DataAgent = require('./agents/DataAgent');
const ExecutionAgent = require('./agents/ExecutionAgent');
const DefectAgent = require('./agents/DefectAgent');
const ReportingAgent = require('./agents/ReportingAgent');
const CICDAgent = require('./agents/CICDAgent');
const RelearningAgent = require('./agents/RelearningAgent');

const apiKey = process.env.OPENAI_API_KEY; // Assume set

async function runFramework() {
  const appDescription = 'Individual Retirement Insurance application with UI for applying, API for quotes, DB for policies.';

  // Phase 0: Application Discovery
  const discoveryAgent = new ApplicationDiscoveryAgent(apiKey);
  const techStack = await discoveryAgent.discoverTechStack(appDescription, './playwright');
  const architecture = await discoveryAgent.analyzeArchitecture(appDescription, techStack);
  const components = await discoveryAgent.mapCodebaseComponents('./playwright', architecture);
  const jiraMapping = await discoveryAgent.createJiraMapping(components, appDescription);
  const downstreamContext = await discoveryAgent.contextualizeForDownstreamAgents();
  const discoverySummary = discoveryAgent.getDiscoverySummary();

  // Phase 1: Requirements Analysis
  const reqAgent = new RequirementAgent(apiKey);
  const requirements = await reqAgent.analyzeRequirements(appDescription);

  const designAgent = new DesignAgent(apiKey);
  const scenarios = await designAgent.designTestCases(requirements);

  const dataAgent = new DataAgent(apiKey);
  const testData = await dataAgent.prepareTestData(scenarios);

  const execAgent = new ExecutionAgent(apiKey);
  const testResults = await execAgent.executeTests('npm test');

  const defectAgent = new DefectAgent(apiKey);
  const defects = await defectAgent.logDefects(testResults);

  const reportAgent = new ReportingAgent(apiKey);
  const report = await reportAgent.generateReport(testResults, defects);

  const cICD = new CICDAgent(apiKey);
  await cICD.setupCI('GitHub Actions workflows');

  const relearn = new RelearningAgent(apiKey);
  const learnings = await relearn.learnFromResults({ testResults, defects });

  // Print quality scores
  console.log('Agent Quality Scores:');
  console.log(`Discovery: ${discoveryAgent.getQualityScore()}`);
  console.log(`Requirement: ${reqAgent.getQualityScore()}`);
  console.log(`Design: ${designAgent.getQualityScore()}`);
  console.log(`Data: ${dataAgent.getQualityScore()}`);
  console.log(`Execution: ${execAgent.getQualityScore()}`);
  console.log(`Defect: ${defectAgent.getQualityScore()}`);
  console.log(`Reporting: ${reportAgent.getQualityScore()}`);
  console.log(`CI/CD: ${cICD.getQualityScore()}`);
  console.log(`Relearning: ${relearn.getQualityScore()}`);

  console.log('\n=== Application Discovery Summary ===');
  console.log(JSON.stringify(discoverySummary, null, 2));

  console.log('Framework execution complete.');
}

runFramework().catch(console.error);