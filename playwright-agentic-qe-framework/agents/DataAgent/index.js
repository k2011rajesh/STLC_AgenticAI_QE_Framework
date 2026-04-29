const BaseAgent = require('../BaseAgent');

class DataAgent extends BaseAgent {
  constructor(apiKey) {
    super('DataAgent', apiKey);
  }

  async prepareTestData(scenarios) {
    const task = `For these test scenarios: ${scenarios}, prepare test data including user profiles, insurance details, API payloads, and DB records for Individual Retirement Insurance testing.`;
    return await this.performTask(task);
  }
}

module.exports = DataAgent;