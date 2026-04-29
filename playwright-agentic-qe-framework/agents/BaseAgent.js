const OpenAI = require('openai');

class BaseAgent {
  constructor(name, apiKey) {
    this.name = name;
    this.apiKey = apiKey;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async performTask(taskDescription) {
    try {
      if (this.apiKey) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: taskDescription }],
        });
        const result = response.choices[0].message.content;
        this.updateQualityScore(true);
        return result;
      } else {
        // Mock response
        const mockResponses = {
          'analyze requirements': 'Mock: Requirements analyzed for Individual Retirement Insurance app.',
          'design test cases': 'Mock: Gherkin scenarios designed for UI, API, DB.',
          'prepare test data': 'Mock: Test data prepared including user profiles and policies.',
          'execute tests': 'Mock: Tests executed successfully.',
          'log defects': 'Mock: No defects found.',
          'generate report': 'Mock: Report generated with quality scores.',
          'setup CI': 'Mock: CI/CD workflows set up.',
          'learn from results': 'Mock: Learned from past executions.'
        };
        const key = Object.keys(mockResponses).find(k => taskDescription.toLowerCase().includes(k));
        const result = mockResponses[key] || 'Mock: Task completed.';
        this.updateQualityScore(true);
        return result;
      }
    } catch (error) {
      this.updateQualityScore(false);
      throw error;
    }
  }

  updateQualityScore(success) {
    if (success) {
      this.qualityScore = Math.min(100, this.qualityScore + 1);
    } else {
      this.qualityScore = Math.max(0, this.qualityScore - 5);
    }
  }

  getQualityScore() {
    return this.qualityScore;
  }
}

module.exports = BaseAgent;