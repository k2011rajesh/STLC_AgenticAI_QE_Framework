/**
 * E2E Quality Scoring Pipeline
 * Tracks quality metrics from requirement → BDD → execution → reporting
 * Provides comprehensive quality dashboarding
 */

class QualityScoringPipeline {
  constructor() {
    this.pipeline = {
      requirementPhase: {},
      bddDesignPhase: {},
      testExecutionPhase: {},
      reportingPhase: {}
    };
    this.metrics = {
      requirementQuality: [],
      bddQuality: [],
      executionQuality: [],
      reportQuality: [],
      traceability: []
    };
    this.scoreHistory = [];
  }

  /**
   * Score requirement phase (0-100)
   */
  scoreRequirementPhase(requirement, acceptanceCriteria) {
    const score = {
      timestamp: new Date().toISOString(),
      phase: 'requirement',
      requirementId: requirement.id,
      metrics: {
        clarity: this.scoreClarity(requirement),
        completeness: this.scoreCompleteness(requirement),
        testability: this.scoreTestability(requirement, acceptanceCriteria),
        traceability: this.scoreTraceability(requirement),
        invest: this.scoreINVEST(requirement, acceptanceCriteria)
      },
      overallScore: 0
    };

    // Calculate overall score (weighted average)
    score.overallScore = Math.round(
      (score.metrics.clarity * 0.20 +
        score.metrics.completeness * 0.20 +
        score.metrics.testability * 0.25 +
        score.metrics.traceability * 0.15 +
        score.metrics.invest * 0.20)
    );

    this.pipeline.requirementPhase[requirement.id] = score;
    this.metrics.requirementQuality.push(score);
    this.scoreHistory.push(score);

    return score;
  }

  /**
   * Score requirement clarity (0-100)
   */
  scoreClarity(requirement) {
    let score = 0;

    // Title clarity
    if (requirement.title && requirement.title.length > 10 && requirement.title.length < 100) {
      score += 25;
    }

    // Description depth
    const descriptionLength = (requirement.description || '').length;
    if (descriptionLength > 100 && descriptionLength < 1000) {
      score += 25;
    }

    // Use of clear language (no vague words)
    const vagueWords = ['good', 'bad', 'nice', 'easy', 'simple', 'complex'];
    const hasVagueLanguage = vagueWords.some(w =>
      (requirement.description || '').toLowerCase().includes(w)
    );
    if (!hasVagueLanguage) score += 25;

    // Specific measurable terms
    const measurableTerms = ['must', 'should', 'when', 'then', 'given'];
    const hasMeasurable = measurableTerms.some(t =>
      (requirement.description || '').toLowerCase().includes(t)
    );
    if (hasMeasurable) score += 25;

    return Math.min(score, 100);
  }

  /**
   * Score requirement completeness (0-100)
   */
  scoreCompleteness(requirement) {
    let score = 0;

    if (requirement.title) score += 15;
    if (requirement.description) score += 15;
    if (requirement.businessValue) score += 15;
    if (requirement.priority) score += 15;
    if (requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0) score += 20;
    if (requirement.dependencies) score += 10;
    if (requirement.estimatedEffort) score += 10;

    return Math.min(score, 100);
  }

  /**
   * Score testability (0-100)
   */
  scoreTestability(requirement, acceptanceCriteria = []) {
    let score = 0;

    // Has testable acceptance criteria
    if (acceptanceCriteria && acceptanceCriteria.length >= 3) score += 30;
    else if (acceptanceCriteria && acceptanceCriteria.length >= 1) score += 15;

    // Has clear expected results
    const hasExpectedResults = acceptanceCriteria.some(ac => ac.expected || ac.expectedResult);
    if (hasExpectedResults) score += 20;

    // Has test data examples
    const hasExamples = acceptanceCriteria.some(ac => ac.examples || ac.dataTable);
    if (hasExamples) score += 25;

    // Has defined test approach
    if (requirement.testApproach) score += 20;

    // Not too complex
    const complexity = (requirement.description || '').split(' ').length;
    if (complexity < 200) score += 5;

    return Math.min(score, 100);
  }

  /**
   * Score traceability (0-100)
   */
  scoreTraceability(requirement) {
    let score = 0;

    if (requirement.epic) score += 20;
    if (requirement.relatedRequirements && requirement.relatedRequirements.length > 0) score += 20;
    if (requirement.featureArea) score += 20;
    if (requirement.jiraKey) score += 20;
    if (requirement.sourceDocument) score += 20;

    return Math.min(score, 100);
  }

  /**
   * Score INVEST criteria for requirement
   */
  scoreINVEST(requirement, acceptanceCriteria) {
    let invest = 0;

    // Independent - no hard dependencies
    const dependencyCount = (requirement.dependencies || []).length;
    invest += Math.max(0, 100 - (dependencyCount * 15));

    // Negotiable - flexible implementation
    const isDeterministic = (requirement.description || '').includes('must use specific');
    invest += isDeterministic ? 50 : 80;

    // Valuable - clear business value
    invest += requirement.businessValue ? 80 : 50;

    // Estimable - team can estimate
    invest += (requirement.estimatedEffort || requirement.complexity) ? 75 : 50;

    // Small - fits in sprint
    const effortEstimate = requirement.storyPoints || 5;
    invest += effortEstimate <= 13 ? 90 : 40;

    // Testable - acceptance criteria defined
    invest += acceptanceCriteria && acceptanceCriteria.length > 0 ? 90 : 50;

    return Math.round(invest / 6);
  }

  /**
   * Score BDD design phase (0-100)
   */
  scoreBDDDesignPhase(bddScenarios, acceptanceCriteria, mapping) {
    const score = {
      timestamp: new Date().toISOString(),
      phase: 'bdd-design',
      mappingId: mapping.requirementId,
      metrics: {
        gherkinQuality: this.scoreGherkinQuality(bddScenarios),
        scenarioCoverage: this.scoreScenarioCoverage(bddScenarios, acceptanceCriteria),
        testDataCompleteness: this.scoreTestDataCompleteness(bddScenarios),
        stepDefinitionQuality: this.scoreStepDefinitionQuality(bddScenarios),
        maintainability: this.scoreMaintainability(bddScenarios)
      },
      overallScore: 0
    };

    score.overallScore = Math.round(
      (score.metrics.gherkinQuality * 0.25 +
        score.metrics.scenarioCoverage * 0.25 +
        score.metrics.testDataCompleteness * 0.20 +
        score.metrics.stepDefinitionQuality * 0.20 +
        score.metrics.maintainability * 0.10)
    );

    this.pipeline.bddDesignPhase[mapping.requirementId] = score;
    this.metrics.bddQuality.push(score);
    this.scoreHistory.push(score);

    return score;
  }

  /**
   * Score Gherkin quality (0-100)
   */
  scoreGherkinQuality(scenarios) {
    if (!scenarios || scenarios.length === 0) return 0;

    let totalScore = 0;
    let count = 0;

    scenarios.forEach(scenarioGroup => {
      scenarioGroup.scenarios?.forEach(scenario => {
        let score = 0;

        // Clear title
        if (scenario.name && scenario.name.length > 5) score += 15;

        // Complete Given-When-Then
        if (scenario.given && scenario.when && scenario.then) score += 30;

        // Non-ambiguous language
        const ambiguousTerms = ['test', 'check', 'verify', 'should work'];
        const hasAmbiguity = ambiguousTerms.some(t =>
          scenario.when?.toLowerCase().includes(t)
        );
        if (!hasAmbiguity) score += 20;

        // Specific expected results
        if (scenario.expected && scenario.expected.length > 5) score += 20;

        // No implementation details
        const hasImplDetails = ['click', 'type', 'submit'].some(t =>
          scenario.given?.toLowerCase().includes(t)
        );
        if (!hasImplDetails) score += 15;

        totalScore += Math.min(score, 100);
        count++;
      });
    });

    return count > 0 ? Math.round(totalScore / count) : 0;
  }

  /**
   * Score scenario coverage (0-100)
   */
  scoreScenarioCoverage(scenarios, acceptanceCriteria) {
    let score = 50; // Base score

    const acCount = (acceptanceCriteria || []).length;
    const scenarioCount = scenarios.reduce((sum, sg) => sum + (sg.scenarios?.length || 0), 0);

    // Coverage ratio (ideally 2-3 scenarios per AC)
    const coverageRatio = scenarioCount / Math.max(acCount, 1);
    if (coverageRatio >= 2 && coverageRatio <= 4) score += 30;
    else if (coverageRatio >= 1) score += 15;

    // Happy path scenarios
    const hasHappyPath = scenarios.some(sg => sg.title?.includes('Happy'));
    if (hasHappyPath) score += 10;

    // Negative scenarios
    const hasNegative = scenarios.some(sg => sg.title?.includes('Negative'));
    if (hasNegative) score += 10;

    return Math.min(score, 100);
  }

  /**
   * Score test data completeness (0-100)
   */
  scoreTestDataCompleteness(scenarios) {
    if (!scenarios || scenarios.length === 0) return 0;

    let score = 0;
    let scenarioCount = 0;

    scenarios.forEach(scenarioGroup => {
      scenarioGroup.scenarios?.forEach(scenario => {
        let scenarioScore = 0;

        // Has examples/test data
        if (scenario.examples && scenario.examples.length > 0) scenarioScore += 40;

        // Has parameter placeholders
        const hasParameters = (scenario.when + scenario.then).includes('<');
        if (hasParameters) scenarioScore += 30;

        // Multiple test cases
        if (scenario.examples && scenario.examples.length > 2) scenarioScore += 30;

        score += Math.min(scenarioScore, 100);
        scenarioCount++;
      });
    });

    return scenarioCount > 0 ? Math.round(score / scenarioCount) : 0;
  }

  /**
   * Score step definition quality (0-100)
   */
  scoreStepDefinitionQuality(scenarios) {
    let score = 50;

    const totalSteps = scenarios.reduce((sum, sg) =>
      sum + sg.scenarios.reduce((s, sc) =>
        s + 3, 0) // Given, When, Then
      , 0);

    // Check for step reusability
    const uniqueSteps = new Set();
    scenarios.forEach(sg => {
      sg.scenarios.forEach(sc => {
        if (sc.given) uniqueSteps.add(sc.given);
        if (sc.when) uniqueSteps.add(sc.when);
        if (sc.then) uniqueSteps.add(sc.then);
      });
    });

    const reusabilityRatio = uniqueSteps.size / Math.max(totalSteps, 1);
    if (reusabilityRatio < 0.5) score += 30;
    else if (reusabilityRatio < 0.7) score += 20;
    else score += 10;

    return Math.min(score, 100);
  }

  /**
   * Score maintainability (0-100)
   */
  scoreMaintainability(scenarios) {
    let score = 50;

    // Clear structure
    const hasStructure = scenarios.every(sg =>
      sg.scenarios.every(s => s.given && s.when && s.then)
    );
    if (hasStructure) score += 20;

    // Consistent naming
    const titles = scenarios.map(sg => sg.title).filter(t => t);
    const uniqueTitles = new Set(titles);
    if (uniqueTitles.size === titles.length) score += 15;

    // Documentation
    const hasDocumentation = scenarios.some(sg =>
      sg.description || sg.feature
    );
    if (hasDocumentation) score += 15;

    return Math.min(score, 100);
  }

  /**
   * Score test execution phase (0-100)
   */
  scoreTestExecutionPhase(testResults) {
    const score = {
      timestamp: new Date().toISOString(),
      phase: 'execution',
      metrics: {
        passRate: this.scorePassRate(testResults),
        flakiness: this.scoreFlakiness(testResults),
        executionSpeed: this.scoreExecutionSpeed(testResults),
        coverage: this.scoreCoverage(testResults),
        reliability: this.scoreReliability(testResults)
      },
      testResults: {
        total: testResults.total,
        passed: testResults.passed,
        failed: testResults.failed,
        skipped: testResults.skipped
      },
      overallScore: 0
    };

    score.overallScore = Math.round(
      (score.metrics.passRate * 0.30 +
        score.metrics.flakiness * 0.20 +
        score.metrics.executionSpeed * 0.15 +
        score.metrics.coverage * 0.25 +
        score.metrics.reliability * 0.10)
    );

    this.pipeline.testExecutionPhase[new Date().getTime()] = score;
    this.metrics.executionQuality.push(score);
    this.scoreHistory.push(score);

    return score;
  }

  /**
   * Score pass rate (0-100)
   */
  scorePassRate(testResults) {
    if (testResults.total === 0) return 0;
    const passRate = (testResults.passed / testResults.total) * 100;
    return Math.round(passRate);
  }

  /**
   * Score flakiness (0-100, where 100 = not flaky)
   */
  scoreFlakiness(testResults) {
    // If flake rate is tracked
    if (testResults.flakeRate !== undefined) {
      return Math.max(0, 100 - testResults.flakeRate);
    }
    return 90; // Assume not flaky if not tracked
  }

  /**
   * Score execution speed (0-100)
   */
  scoreExecutionSpeed(testResults) {
    const totalDuration = testResults.duration || 0;
    const avgPerTest = totalDuration / Math.max(testResults.total, 1);

    // < 5 seconds per test = perfect
    // > 30 seconds per test = poor
    if (avgPerTest < 5000) return 100;
    if (avgPerTest > 30000) return 40;

    return Math.round(100 - ((avgPerTest - 5000) / 25000) * 60);
  }

  /**
   * Score code/feature coverage (0-100)
   */
  scoreCoverage(testResults) {
    return testResults.coverage || 0;
  }

  /**
   * Score reliability (0-100)
   */
  scoreReliability(testResults) {
    let score = 50;

    // All passes in multiple runs
    if (testResults.consistentPasses) score += 30;

    // No timeout failures
    if (!testResults.timeouts) score += 20;

    // No environment-related failures
    if (!testResults.environmentIssues) score += 20;

    return Math.min(score, 100);
  }

  /**
   * Generate comprehensive quality report
   */
  generateQualityReport() {
    return {
      timestamp: new Date().toISOString(),
      phases: {
        requirements: {
          totalScored: this.metrics.requirementQuality.length,
          averageScore: this.calculateAverageScore(this.metrics.requirementQuality),
          distribution: this.getDistribution(this.metrics.requirementQuality)
        },
        bddDesign: {
          totalScored: this.metrics.bddQuality.length,
          averageScore: this.calculateAverageScore(this.metrics.bddQuality),
          distribution: this.getDistribution(this.metrics.bddQuality)
        },
        execution: {
          totalScored: this.metrics.executionQuality.length,
          averageScore: this.calculateAverageScore(this.metrics.executionQuality),
          distribution: this.getDistribution(this.metrics.executionQuality)
        }
      },
      overallQualityScore: this.calculateOverallQualityScore(),
      trends: this.analyzeTrends(),
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Calculate average score
   */
  calculateAverageScore(scores) {
    if (scores.length === 0) return 0;
    const sum = scores.reduce((total, s) => total + s.overallScore, 0);
    return Math.round(sum / scores.length);
  }

  /**
   * Get score distribution
   */
  getDistribution(scores) {
    const distribution = {
      excellent: 0,    // 90-100
      good: 0,        // 80-89
      acceptable: 0,  // 70-79
      needsImprovement: 0,  // <70
    };

    scores.forEach(s => {
      const score = s.overallScore;
      if (score >= 90) distribution.excellent++;
      else if (score >= 80) distribution.good++;
      else if (score >= 70) distribution.acceptable++;
      else distribution.needsImprovement++;
    });

    return distribution;
  }

  /**
   * Calculate overall quality score
   */
  calculateOverallQualityScore() {
    const avgReq = this.calculateAverageScore(this.metrics.requirementQuality);
    const avgBDD = this.calculateAverageScore(this.metrics.bddQuality);
    const avgExec = this.calculateAverageScore(this.metrics.executionQuality);

    return Math.round(
      (avgReq * 0.25 + avgBDD * 0.35 + avgExec * 0.40)
    );
  }

  /**
   * Analyze quality trends
   */
  analyzeTrends() {
    if (this.scoreHistory.length < 2) return { trend: 'insufficient-data' };

    const recent = this.scoreHistory.slice(-5);
    const trend = recent[recent.length - 1].overallScore >= recent[0].overallScore
      ? 'improving'
      : 'declining';

    return {
      trend,
      velocityPerDay: this.calculateVelocity(),
      consistencyScore: this.calculateConsistency()
    };
  }

  /**
   * Calculate quality velocity
   */
  calculateVelocity() {
    if (this.scoreHistory.length < 2) return 0;
    const last = this.scoreHistory[this.scoreHistory.length - 1];
    const first = this.scoreHistory[0];
    const daysApart = (new Date(last.timestamp) - new Date(first.timestamp)) / (1000 * 60 * 60 * 24);
    return Math.round((last.overallScore - first.overallScore) / Math.max(daysApart, 1));
  }

  /**
   * Calculate consistency score
   */
  calculateConsistency() {
    const scores = this.scoreHistory.map(s => s.overallScore);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    return Math.round(Math.max(0, 100 - stdDev));
  }

  /**
   * Generate improvement recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.calculateAverageScore(this.metrics.requirementQuality) < 75) {
      recommendations.push({
        area: 'Requirements',
        priority: 'high',
        recommendation: 'Improve requirement clarity and completeness'
      });
    }

    if (this.calculateAverageScore(this.metrics.bddQuality) < 75) {
      recommendations.push({
        area: 'BDD Design',
        priority: 'high',
        recommendation: 'Enhance Gherkin scenario quality and coverage'
      });
    }

    if (this.calculateAverageScore(this.metrics.executionQuality) < 80) {
      recommendations.push({
        area: 'Test Execution',
        priority: 'high',
        recommendation: 'Reduce flakiness and improve test reliability'
      });
    }

    return recommendations;
  }
}

module.exports = QualityScoringPipeline;
