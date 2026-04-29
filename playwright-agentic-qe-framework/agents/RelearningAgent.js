const BaseAgent = require('./BaseAgent');

class RelearningAgent extends BaseAgent {
  constructor(apiKey) {
    super('RelearningAgent', apiKey);
    this.pastResults = [];
  }

  async learnFromResults(results) {
    this.pastResults.push(results);
    const task = `Analyze past test results: ${JSON.stringify(this.pastResults)}. Identify patterns, improve test strategies, and suggest optimizations for future testing of Individual Retirement Insurance application.`;
    return await this.performTask(task);
  }
}

module.exports = RelearningAgent;