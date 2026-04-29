const BaseAgent = require('../BaseAgent');

class ReportingAgent extends BaseAgent {
  constructor(apiKey) {
    super('ReportingAgent', apiKey);
  }

  async generateReport(testResults, defects) {
    const task = `Generate a comprehensive test report including test results: ${testResults}, defects: ${defects}, and quality scores for all agents in the Individual Retirement Insurance testing framework.`;
    return await this.performTask(task);
  }
}

module.exports = ReportingAgent;