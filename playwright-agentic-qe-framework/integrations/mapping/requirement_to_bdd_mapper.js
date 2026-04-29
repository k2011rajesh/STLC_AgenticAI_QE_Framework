/**
 * Requirement to BDD Test Case Quality Mapping
 * Maps requirements → acceptance criteria → BDD scenarios
 * Applies quality scoring throughout the pipeline
 */

class RequirementToBDDMapper {
  constructor() {
    this.mappings = [];
    this.qualityScores = {};
    this.coverage = {
      requirementsCovered: 0,
      acceptanceCriteriaCovered: 0,
      bddScenariosCovered: 0,
      totalRequirements: 0
    };
  }

  /**
   * Map requirement to BDD scenarios with quality scoring
   */
  mapRequirementToBDD(requirement, acceptanceCriteria = [], investScore = 0, smartScore = 0) {
    const mapping = {
      requirementId: requirement.id || requirement.key,
      requirementTitle: requirement.title || requirement.summary,
      requirementDescription: requirement.description,
      rawRequirement: requirement.text || '',
      acceptanceCriteria: acceptanceCriteria,
      bddScenarios: [],
      qualityMetrics: {
        requirementClarity: this.evaluateRequirementClarity(requirement),
        acceptanceCriteriaCompleteness: this.evaluateAcceptanceCriteriaCompleteness(acceptanceCriteria),
        bddGherkinQuality: 0,
        investScore,
        smartScore,
        overallQualityScore: 0
      },
      mappingStatus: 'in-progress'
    };

    // Generate BDD scenarios from requirement
    mapping.bddScenarios = this.generateBDDScenariosFromRequirement(
      requirement,
      acceptanceCriteria
    );

    // Calculate quality scores
    mapping.qualityMetrics.bddGherkinQuality = this.evaluateBDDQuality(mapping.bddScenarios);
    mapping.qualityMetrics.overallQualityScore = this.calculateOverallQualityScore(
      mapping.qualityMetrics
    );

    mapping.mappingStatus = mapping.qualityMetrics.overallQualityScore >= 75 ? 'complete' : 'needs-review';

    this.mappings.push(mapping);
    this.updateCoverage(mapping);

    return mapping;
  }

  /**
   * Evaluate requirement clarity (0-100)
   */
  evaluateRequirementClarity(requirement) {
    let score = 0;

    // Check for clear summary
    if (requirement.title && requirement.title.length > 10) score += 15;

    // Check for detailed description
    if (requirement.description && requirement.description.length > 50) score += 20;

    // Check for clear business value
    if (requirement.businessValue || requirement.text?.includes('so that')) score += 15;

    // Check for user story format
    if (requirement.text?.includes('As a ') && requirement.text?.includes('I want')) score += 20;

    // Check for acceptance criteria linked
    if (requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0) score += 20;

    // Check for priority/priority
    if (requirement.priority) score += 10;

    return Math.min(score, 100);
  }

  /**
   * Evaluate acceptance criteria completeness (0-100)
   */
  evaluateAcceptanceCriteriaCompleteness(criteria) {
    if (!criteria || criteria.length === 0) return 0;

    let score = 0;
    const maxCriteria = 5;

    // Number of criteria
    const criteriaCount = Math.min(criteria.length, maxCriteria);
    score += (criteriaCount / maxCriteria) * 20;

    // Check for measurable criteria
    const measurable = criteria.filter(c =>
      c.description?.includes('should') ||
      c.description?.includes('must') ||
      c.description?.includes('can')
    ).length;
    score += (measurable / criteria.length) * 30;

    // Check for clear expected results
    const withExpectedResults = criteria.filter(c => c.expected || c.expectedResult).length;
    score += (withExpectedResults / criteria.length) * 30;

    // Check for specific data/parameters
    const withParameters = criteria.filter(c => c.parameters || c.examples).length;
    score += (withParameters / criteria.length) * 20;

    return Math.min(score, 100);
  }

  /**
   * Generate BDD scenarios from requirement and acceptance criteria
   */
  generateBDDScenariosFromRequirement(requirement, acceptanceCriteria = []) {
    const scenarios = [];

    // Generate main scenario from requirement
    if (requirement.title) {
      scenarios.push({
        title: `Happy path: ${requirement.title}`,
        feature: requirement.title,
        scenarios: [
          {
            name: `User can ${requirement.title.toLowerCase()}`,
            given: this.generateGiven(requirement),
            when: this.generateWhen(requirement),
            then: this.generateThen(requirement),
            examples: []
          }
        ]
      });
    }

    // Generate scenarios from acceptance criteria
    acceptanceCriteria.forEach((ac, index) => {
      scenarios.push({
        title: `AC${index + 1}: ${ac.title}`,
        feature: requirement.title,
        scenarios: [
          {
            name: ac.title,
            given: ac.given || this.generateGiven(ac),
            when: ac.when || this.generateWhen(ac),
            then: ac.then || this.generateThen(ac),
            expected: ac.expected,
            examples: ac.examples || this.generateExamples(ac)
          }
        ]
      });
    });

    // Add negative scenarios
    scenarios.push({
      title: `Negative: ${requirement.title}`,
      feature: requirement.title,
      scenarios: [
        {
          name: `Error handling for ${requirement.title}`,
          given: this.generateGiven(requirement),
          when: `${this.generateWhen(requirement)} with invalid data`,
          then: 'error is displayed',
          examples: []
        }
      ]
    });

    return scenarios;
  }

  /**
   * Generate Given step from requirement
   */
  generateGiven(item) {
    if (item.given) return item.given;
    if (item.precondition) return `Given ${item.precondition}`;
    return 'Given user is on the application';
  }

  /**
   * Generate When step from requirement
   */
  generateWhen(item) {
    if (item.when) return item.when;
    if (item.action) return `When user performs ${item.action}`;
    const action = item.title?.toLowerCase() || 'performs action';
    return `When user ${action}`;
  }

  /**
   * Generate Then step from requirement
   */
  generateThen(item) {
    if (item.then) return item.then;
    if (item.expectedResult) return `Then ${item.expectedResult}`;
    if (item.expected) return `Then ${item.expected}`;
    return 'Then action completes successfully';
  }

  /**
   * Generate test data examples
   */
  generateExamples(ac) {
    if (ac.examples && ac.examples.length > 0) return ac.examples;

    // Generate common examples based on criteria type
    const examples = [];

    if (ac.description?.includes('email')) {
      examples.push({
        label: 'Valid email',
        parameters: { email: 'user@example.com' },
        expected: 'accepted'
      });
      examples.push({
        label: 'Invalid email',
        parameters: { email: 'invalid-email' },
        expected: 'rejected'
      });
    }

    if (ac.description?.includes('password')) {
      examples.push({
        label: 'Strong password',
        parameters: { password: 'SecurePass123!@#' },
        expected: 'accepted'
      });
      examples.push({
        label: 'Weak password',
        parameters: { password: '123' },
        expected: 'rejected'
      });
    }

    if (ac.description?.includes('number') || ac.description?.includes('amount')) {
      examples.push({
        label: 'Valid amount',
        parameters: { amount: '1000' },
        expected: 'accepted'
      });
      examples.push({
        label: 'Invalid amount',
        parameters: { amount: '-100' },
        expected: 'rejected'
      });
    }

    return examples.length > 0 ? examples : [{ label: 'Default', parameters: {}, expected: 'pass' }];
  }

  /**
   * Evaluate BDD Gherkin quality (0-100)
   */
  evaluateBDDQuality(scenarios) {
    if (!scenarios || scenarios.length === 0) return 0;

    let totalScore = 0;
    let scenarioCount = 0;

    scenarios.forEach(scenarioGroup => {
      scenarioGroup.scenarios?.forEach(scenario => {
        let score = 0;

        // Check for clear title
        if (scenario.name && scenario.name.length > 5) score += 15;

        // Check for Given-When-Then structure
        if (scenario.given && scenario.when && scenario.then) score += 25;

        // Check for specific step language (not vague)
        const vaguePhrases = ['test', 'check', 'verify', 'do something'];
        const isVague = vaguePhrases.some(phrase =>
          scenario.when?.toLowerCase().includes(phrase)
        );
        if (!isVague) score += 15;

        // Check for data examples
        if (scenario.examples && scenario.examples.length > 0) score += 20;

        // Check for expected results
        if (scenario.expected) score += 15;

        // Check for no ambiguous language
        if (!scenario.then?.includes('properly') && !scenario.then?.includes('correctly')) score += 10;

        totalScore += Math.min(score, 100);
        scenarioCount++;
      });
    });

    return scenarioCount > 0 ? Math.round(totalScore / scenarioCount) : 0;
  }

  /**
   * Calculate overall quality score
   */
  calculateOverallQualityScore(metrics) {
    // Weighted average of quality metrics
    const weights = {
      requirementClarity: 0.2,
      acceptanceCriteriaCompleteness: 0.2,
      bddGherkinQuality: 0.3,
      investScore: 0.15,
      smartScore: 0.15
    };

    let totalScore = 0;
    Object.keys(weights).forEach(metric => {
      totalScore += (metrics[metric] || 0) * weights[metric];
    });

    return Math.round(totalScore);
  }

  /**
   * Update coverage statistics
   */
  updateCoverage(mapping) {
    this.coverage.totalRequirements = this.mappings.length;
    if (mapping.qualityMetrics.overallQualityScore > 0) {
      this.coverage.requirementsCovered++;
    }
    this.coverage.acceptanceCriteriaCovered += mapping.acceptanceCriteria.length;
    this.coverage.bddScenariosCovered += mapping.bddScenarios.length;
  }

  /**
   * Get mapping quality report
   */
  getQualityReport() {
    const report = {
      totalMappings: this.mappings.length,
      completeMappings: this.mappings.filter(m => m.mappingStatus === 'complete').length,
      incompleteMappings: this.mappings.filter(m => m.mappingStatus === 'needs-review').length,
      coverage: this.coverage,
      averageQualityScore: this.mappings.length > 0
        ? Math.round(
          this.mappings.reduce((sum, m) => sum + m.qualityMetrics.overallQualityScore, 0) /
          this.mappings.length
        )
        : 0,
      qualityDistribution: this.getQualityDistribution(),
      detailedMappings: this.mappings.map(m => ({
        requirementId: m.requirementId,
        title: m.requirementTitle,
        qualityScore: m.qualityMetrics.overallQualityScore,
        status: m.mappingStatus,
        scenarioCount: m.bddScenarios.length,
        investScore: m.qualityMetrics.investScore,
        smartScore: m.qualityMetrics.smartScore
      }))
    };

    return report;
  }

  /**
   * Get quality distribution
   */
  getQualityDistribution() {
    const distribution = {
      excellent: 0,    // 90-100
      good: 0,        // 80-89
      acceptable: 0,  // 70-79
      needsImprovement: 0,  // 60-69
      poor: 0         // <60
    };

    this.mappings.forEach(m => {
      const score = m.qualityMetrics.overallQualityScore;
      if (score >= 90) distribution.excellent++;
      else if (score >= 80) distribution.good++;
      else if (score >= 70) distribution.acceptable++;
      else if (score >= 60) distribution.needsImprovement++;
      else distribution.poor++;
    });

    return distribution;
  }

  /**
   * Export mappings for integration
   */
  exportForJIRA() {
    return this.mappings.map(m => ({
      jiraStory: m.requirementId,
      acceptanceCriteria: m.acceptanceCriteria,
      bddScenarios: m.bddScenarios,
      qualityMetrics: m.qualityMetrics
    }));
  }

  /**
   * Export mappings for Xray
   */
  exportForXray() {
    return this.mappings.map(m => ({
      featureFile: `${m.requirementId}.feature`,
      scenarios: m.bddScenarios,
      testCases: m.bddScenarios.flatMap(sg =>
        sg.scenarios.map(s => ({
          name: s.name,
          feature: sg.feature,
          steps: [
            { keyword: 'Given', text: s.given },
            { keyword: 'When', text: s.when },
            { keyword: 'Then', text: s.then }
          ],
          examples: s.examples
        }))
      )
    }));
  }

  /**
   * Validate mapping completeness
   */
  validateMapping(mapping) {
    const issues = [];

    if (!mapping.requirementDescription || mapping.requirementDescription.length < 20) {
      issues.push('Requirement description too short or missing');
    }

    if (mapping.acceptanceCriteria.length === 0) {
      issues.push('No acceptance criteria defined');
    }

    if (mapping.bddScenarios.length === 0) {
      issues.push('No BDD scenarios generated');
    }

    if (mapping.qualityMetrics.overallQualityScore < 70) {
      issues.push(`Quality score ${mapping.qualityMetrics.overallQualityScore} below threshold`);
    }

    return {
      isValid: issues.length === 0,
      issues,
      score: mapping.qualityMetrics.overallQualityScore
    };
  }
}

module.exports = RequirementToBDDMapper;
