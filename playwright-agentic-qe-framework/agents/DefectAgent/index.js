const BaseAgent = require('../BaseAgent');

class DefectAgent extends BaseAgent {
  constructor(apiKey) {
    super('DefectAgent', apiKey);
  }

  async logDefects(testResults) {
    const task = `Analyze test results: ${testResults}. Identify defects, categorize them, and prepare defect reports for Jira integration for Individual Retirement Insurance application.`;
    return await this.performTask(task);
  }
}

module.exports = DefectAgent;