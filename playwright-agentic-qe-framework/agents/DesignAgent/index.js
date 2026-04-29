const BaseAgent = require('../BaseAgent');

class DesignAgent extends BaseAgent {
  constructor(apiKey) {
    super('DesignAgent', apiKey);
  }

  async designTestCases(requirements) {
    const task = `Based on these requirements: ${requirements}, design BDD Gherkin scenarios for UI, API, and DB testing for the Individual Retirement Insurance application. Include scenarios for applying for insurance, getting quotes, managing policies.`;
    return await this.performTask(task);
  }
}

module.exports = DesignAgent;