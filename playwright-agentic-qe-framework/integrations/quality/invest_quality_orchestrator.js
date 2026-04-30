/**
 * INVEST Quality Orchestrator
 * 
 * Complete workflow for:
 * 1. Creating/updating Jira epics with INVEST quality scores
 * 2. Creating functional and non-functional user stories
 * 3. Scoring all items using INVEST criteria
 * 4. Generating BDD Feature files for scenarios
 * 5. Mapping scenarios to features
 * 
 * Usage:
 *   const orchestrator = new InvestQualityOrchestrator(config);
 *   const result = await orchestrator.executeInvestQualityWorkflow(
 *     'MyApp',
 *     requirements,
 *     discoveryData
 *   );
 */

const JiraInvestUpdater = require('./jira_invest_updater');
const InvestScoringEngine = require('./invest_scoring_engine');

class InvestQualityOrchestrator {
  constructor(config) {
    this.config = config;
    this.updater = new JiraInvestUpdater(config);
    this.engine = new InvestScoringEngine();
  }

  /**
   * Execute complete INVEST quality workflow
   */
  async executeInvestQualityWorkflow(applicationName, requirements, discoveryData) {
    console.log('\n' + '='.repeat(80));
    console.log('  🎯 INVEST QUALITY & BDD ORCHESTRATOR');
    console.log('='.repeat(80) + '\n');

    try {
      // Step 1: Parse and validate requirements
      console.log('📋 Step 1: Parsing and validating requirements...');
      const parsedRequirements = this.parseRequirements(requirements);
      console.log(`   ✅ Parsed ${parsedRequirements.length} requirements`);

      // Step 2: Score all requirements
      console.log('\n📊 Step 2: Scoring requirements with INVEST criteria...');
      const scoredRequirements = this.scoreAllRequirements(parsedRequirements);
      this.printScoringStatistics(scoredRequirements);

      // Step 3: Execute Jira update with INVEST scores
      console.log('\n🔄 Step 3: Connecting to Jira and creating/updating items...');
      const jiraResult = await this.updater.executeInvestUpdate(
        scoredRequirements,
        discoveryData,
        applicationName
      );

      // Step 4: Generate comprehensive report
      console.log('\n📈 Step 4: Generating comprehensive quality report...');
      const report = this.generateComprehensiveReport(
        applicationName,
        scoredRequirements,
        jiraResult
      );

      // Step 5: Print summary
      this.printExecutionSummary(report, jiraResult.state);

      return {
        success: true,
        applicationName,
        requirements: scoredRequirements,
        jiraResult,
        report,
        state: jiraResult.state
      };
    } catch (error) {
      console.error(`\n❌ Execution failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Parse requirements from various formats
   */
  parseRequirements(requirements) {
    if (Array.isArray(requirements)) {
      return requirements.map((req, index) => {
        if (typeof req === 'string') {
          return {
            id: `REQ-${index + 1}`,
            title: req,
            description: req,
            type: 'Functional',
            acceptanceCriteria: [],
            testScenarios: [],
            priority: 'Medium'
          };
        }
        return req;
      });
    }

    if (typeof requirements === 'object') {
      return Object.entries(requirements).map(([key, value]) => ({
        id: key,
        ...value
      }));
    }

    return [];
  }

  /**
   * Score all requirements using INVEST engine
   */
  scoreAllRequirements(requirements) {
    return requirements.map(req => {
      let score;

      if (req.type === 'Non-Functional' || req.type === 'Performance' || req.type === 'Security') {
        score = this.engine.scoreNonFunctionalRequirement(req);
      } else {
        score = this.engine.scoreFunctionalRequirement(req);
      }

      return {
        ...req,
        investScore: score.investScore,
        investScores: score.scores,
        investRating: score.rating,
        investRecommendations: score.recommendations,
        investBreakdown: score.breakdown
      };
    });
  }

  /**
   * Print scoring statistics
   */
  printScoringStatistics(scoredRequirements) {
    const avgScore = scoredRequirements.reduce((acc, r) => acc + r.investScore, 0) / scoredRequirements.length;
    const excellent = scoredRequirements.filter(r => r.investScore >= 85).length;
    const good = scoredRequirements.filter(r => r.investScore >= 75 && r.investScore < 85).length;
    const fair = scoredRequirements.filter(r => r.investScore >= 65 && r.investScore < 75).length;
    const poor = scoredRequirements.filter(r => r.investScore < 65).length;

    console.log(`   📊 Average INVEST Score: ${avgScore.toFixed(2)}/100`);
    console.log(`   ⭐⭐⭐⭐⭐ Excellent (85-100): ${excellent}`);
    console.log(`   ⭐⭐⭐⭐ Good (75-84): ${good}`);
    console.log(`   ⭐⭐⭐ Fair (65-74): ${fair}`);
    console.log(`   ⭐⭐ Poor (<65): ${poor}`);

    // Print low-scoring items
    const lowScored = scoredRequirements.filter(r => r.investScore < 65);
    if (lowScored.length > 0) {
      console.log(`\n   ⚠️ Items needing improvement (${lowScored.length}):`);
      for (const item of lowScored) {
        console.log(`      - ${item.title} (${item.investScore.toFixed(1)}/100)`);
        for (const rec of item.investRecommendations) {
          console.log(`        • ${rec.criterion}: ${rec.fix}`);
        }
      }
    }
  }

  /**
   * Print execution summary
   */
  printExecutionSummary(report, state) {
    console.log('\n' + '='.repeat(80));
    console.log('  ✅ EXECUTION SUMMARY');
    console.log('='.repeat(80) + '\n');

    console.log(`📱 Application: ${report.applicationName}`);
    console.log(`📅 Timestamp: ${report.timestamp}`);
    console.log('');

    console.log('📊 Quality Metrics:');
    console.log(`   • Total Stories: ${report.summary.totalStories}`);
    console.log(`   • Functional Stories: ${report.summary.functionalStories}`);
    console.log(`   • Non-Functional Stories: ${report.summary.nonFunctionalStories}`);
    console.log(`   • Average INVEST Score: ${report.summary.averageInvestScore}/100`);
    console.log(`   • Functional Average: ${report.summary.functionalAverage}/100`);
    console.log(`   • NFR Average: ${report.summary.nfrAverage}/100`);
    console.log('');

    console.log('📦 Jira Artifacts:');
    console.log(`   • Epics Created: ${state.epicsCreated}`);
    console.log(`   • Stories Created: ${state.storiesCreated}`);
    console.log(`   • Features Generated: ${state.featuresGenerated}`);
    console.log(`   • Scenarios Mapped: ${state.scenariosMapped}`);
    console.log('');

    if (state.errors.length > 0) {
      console.log('⚠️ Errors:');
      for (const error of state.errors) {
        console.log(`   • ${error}`);
      }
      console.log('');
    }

    console.log('📂 Generated Files:');
    console.log(`   • Feature Files: ./playwright/features/functional/`);
    console.log(`   • Step Definitions: ./playwright/step_definitions/`);
    console.log(`   • Scenario Mapping: ./playwright/features/functional/SCENARIO_MAPPING.md`);
    console.log('');

    console.log('🔗 Jira Project:');
    console.log(`   • Project Key: ${this.config.projectKey}`);
    console.log(`   • URL: ${this.config.jiraUrl}/jira/core/projects/${this.config.projectKey}/board`);
    console.log('');

    console.log('='.repeat(80) + '\n');
  }

  /**
   * Generate comprehensive quality report
   */
  generateComprehensiveReport(applicationName, requirements, jiraResult) {
    const functional = requirements.filter(r => r.type !== 'Non-Functional' && r.type !== 'Performance' && r.type !== 'Security');
    const nonFunctional = requirements.filter(r => r.type === 'Non-Functional' || r.type === 'Performance' || r.type === 'Security');

    const avgFunctional = functional.length > 0
      ? functional.reduce((acc, r) => acc + r.investScore, 0) / functional.length
      : 0;

    const avgNFR = nonFunctional.length > 0
      ? nonFunctional.reduce((acc, r) => acc + r.investScore, 0) / nonFunctional.length
      : 0;

    const avgOverall = requirements.reduce((acc, r) => acc + r.investScore, 0) / requirements.length;

    return {
      applicationName,
      timestamp: new Date().toISOString(),
      summary: {
        totalRequirements: requirements.length,
        functionalRequirements: functional.length,
        nonFunctionalRequirements: nonFunctional.length,
        averageInvestScore: avgOverall.toFixed(2),
        functionalAverage: avgFunctional.toFixed(2),
        nfrAverage: avgNFR.toFixed(2)
      },
      qualityDistribution: this.getQualityDistribution(requirements),
      jiraMetrics: {
        epicsCreated: jiraResult.state.epicsCreated,
        storiesCreated: jiraResult.state.storiesCreated,
        featuresGenerated: jiraResult.state.featuresGenerated,
        scenariosMapped: jiraResult.state.scenariosMapped
      },
      topScoringItems: this.getTopScoringItems(requirements, 5),
      itemsNeedingImprovement: this.getItemsNeedingImprovement(requirements, 5),
      investCriteriaAnalysis: this.analyzeInvestCriteria(requirements)
    };
  }

  /**
   * Get quality distribution
   */
  getQualityDistribution(requirements) {
    return {
      excellent: requirements.filter(r => r.investScore >= 85).length,
      good: requirements.filter(r => r.investScore >= 75 && r.investScore < 85).length,
      fair: requirements.filter(r => r.investScore >= 65 && r.investScore < 75).length,
      poor: requirements.filter(r => r.investScore >= 50 && r.investScore < 65).length,
      needsWork: requirements.filter(r => r.investScore < 50).length
    };
  }

  /**
   * Get top scoring items
   */
  getTopScoringItems(requirements, limit = 5) {
    return requirements
      .sort((a, b) => b.investScore - a.investScore)
      .slice(0, limit)
      .map(r => ({
        title: r.title,
        score: r.investScore.toFixed(2),
        rating: r.investRating
      }));
  }

  /**
   * Get items needing improvement
   */
  getItemsNeedingImprovement(requirements, limit = 5) {
    return requirements
      .filter(r => r.investScore < 70)
      .sort((a, b) => a.investScore - b.investScore)
      .slice(0, limit)
      .map(r => ({
        title: r.title,
        score: r.investScore.toFixed(2),
        rating: r.investRating,
        topRecommendation: r.investRecommendations.length > 0 ? r.investRecommendations[0].fix : 'Enhance story details'
      }));
  }

  /**
   * Analyze INVEST criteria across all requirements
   */
  analyzeInvestCriteria(requirements) {
    const scores = {
      independent: [],
      negotiable: [],
      valuable: [],
      estimable: [],
      small: [],
      testable: []
    };

    for (const req of requirements) {
      if (req.investScores) {
        for (const [criterion, score] of Object.entries(req.investScores)) {
          if (scores[criterion]) {
            scores[criterion].push(score);
          }
        }
      }
    }

    const analysis = {};
    for (const [criterion, values] of Object.entries(scores)) {
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        analysis[criterion] = {
          average: avg.toFixed(2),
          strength: avg >= 75 ? '✅ Strong' : avg >= 60 ? '⚠️ Fair' : '❌ Weak'
        };
      }
    }

    return analysis;
  }
}

module.exports = InvestQualityOrchestrator;
