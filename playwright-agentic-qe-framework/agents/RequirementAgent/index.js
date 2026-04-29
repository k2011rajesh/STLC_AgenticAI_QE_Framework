const BaseAgent = require('../BaseAgent');

class RequirementAgent extends BaseAgent {
  constructor(apiKey) {
    super('RequirementAgent', apiKey);
  }

  async analyzeRequirements(appDescription) {
    const task = `Analyze the requirements for the following application: ${appDescription}. Identify key features, user stories, and acceptance criteria for Individual Retirement Insurance application.`;
    return await this.performTask(task);
  }
}

module.exports = RequirementAgent;