/**
 * E2E Quality Reporting & Dashboarding API
 * Generates comprehensive quality reports, metrics, and interactive dashboards
 */

class QualityReportingAPI {
  constructor() {
    this.reports = {};
    this.dashboards = {};
    this.metrics = [];
  }

  /**
   * Generate comprehensive quality report
   */
  generateQualityReport(qualityData, executionData, config = {}) {
    const reportId = `report-${Date.now()}`;

    const report = {
      id: reportId,
      timestamp: new Date().toISOString(),
      title: config.title || 'E2E Quality Report',
      executive_summary: this.generateExecutiveSummary(qualityData, executionData),
      requirement_analysis: this.analyzeRequirements(qualityData.requirements),
      bdd_analysis: this.analyzeBDD(qualityData.bdd),
      test_execution: this.analyzeTestExecution(executionData),
      quality_metrics: this.calculateQualityMetrics(qualityData, executionData),
      traceability_matrix: this.generateTraceabilityMatrix(qualityData),
      risk_assessment: this.assessRisks(qualityData, executionData),
      recommendations: this.generateRecommendations(qualityData, executionData),
      trend_analysis: this.analyzeTrends(this.metrics),
      coverage_analysis: this.analyzeCoverage(qualityData, executionData)
    };

    this.reports[reportId] = report;
    this.metrics.push({
      timestamp: new Date().toISOString(),
      reportId,
      qualityScore: report.quality_metrics.overall_score
    });

    return report;
  }

  /**
   * Generate executive summary
   */
  generateExecutiveSummary(qualityData, executionData) {
    return {
      report_date: new Date().toISOString(),
      summary_text: `Comprehensive E2E Quality Report covering ${qualityData.total_requirements} requirements, ` +
        `${qualityData.total_scenarios} BDD scenarios, and ${executionData.total_tests} test executions.`,
      key_findings: [
        {
          category: 'Quality',
          value: `${qualityData.average_quality_score}/100`,
          status: qualityData.average_quality_score >= 80 ? 'PASS' : 'NEEDS_IMPROVEMENT'
        },
        {
          category: 'Test Execution',
          value: `${executionData.pass_rate}% pass rate`,
          status: executionData.pass_rate >= 95 ? 'PASS' : 'WARNING'
        },
        {
          category: 'Coverage',
          value: `${executionData.code_coverage}% code coverage`,
          status: executionData.code_coverage >= 80 ? 'PASS' : 'WARNING'
        },
        {
          category: 'Traceability',
          value: `${qualityData.requirement_coverage}% of requirements traced`,
          status: qualityData.requirement_coverage >= 90 ? 'PASS' : 'NEEDS_IMPROVEMENT'
        }
      ],
      overall_health: this.calculateHealthScore(qualityData, executionData)
    };
  }

  /**
   * Calculate health score
   */
  calculateHealthScore(qualityData, executionData) {
    const qualityScore = (qualityData.average_quality_score / 100) * 0.3;
    const executionScore = (executionData.pass_rate / 100) * 0.35;
    const coverageScore = (executionData.code_coverage / 100) * 0.2;
    const traceabilityScore = (qualityData.requirement_coverage / 100) * 0.15;

    const health = Math.round(
      (qualityScore + executionScore + coverageScore + traceabilityScore) * 100
    );

    return {
      score: health,
      status: health >= 85 ? 'HEALTHY' : health >= 70 ? 'ACCEPTABLE' : 'AT_RISK'
    };
  }

  /**
   * Analyze requirements
   */
  analyzeRequirements(requirements) {
    if (!requirements || requirements.length === 0) {
      return {
        total: 0,
        analyzed: 0,
        high_quality: 0,
        needs_improvement: 0
      };
    }

    const highQuality = requirements.filter(r => r.quality_score >= 80).length;
    const needsImprovement = requirements.filter(r => r.quality_score < 70).length;

    return {
      total: requirements.length,
      analyzed: requirements.length,
      high_quality: highQuality,
      needs_improvement: needsImprovement,
      average_score: Math.round(
        requirements.reduce((sum, r) => sum + (r.quality_score || 0), 0) / requirements.length
      ),
      invest_compliance: this.analyzeINVESTCompliance(requirements),
      smart_compliance: this.analyzeSMARTCompliance(requirements)
    };
  }

  /**
   * Analyze INVEST compliance
   */
  analyzeINVESTCompliance(requirements) {
    return {
      independent: requirements.filter(r => r.invest?.independent >= 80).length,
      negotiable: requirements.filter(r => r.invest?.negotiable >= 80).length,
      valuable: requirements.filter(r => r.invest?.valuable >= 80).length,
      estimable: requirements.filter(r => r.invest?.estimable >= 80).length,
      small: requirements.filter(r => r.invest?.small >= 80).length,
      testable: requirements.filter(r => r.invest?.testable >= 80).length
    };
  }

  /**
   * Analyze SMART compliance
   */
  analyzeSMARTCompliance(requirements) {
    return {
      specific: requirements.filter(r => r.smart?.specific >= 80).length,
      measurable: requirements.filter(r => r.smart?.measurable >= 80).length,
      achievable: requirements.filter(r => r.smart?.achievable >= 80).length,
      relevant: requirements.filter(r => r.smart?.relevant >= 80).length,
      timeBound: requirements.filter(r => r.smart?.timeBound >= 80).length
    };
  }

  /**
   * Analyze BDD scenarios
   */
  analyzeBDD(bdd) {
    if (!bdd || bdd.length === 0) {
      return {
        total_scenarios: 0,
        total_steps: 0,
        average_quality: 0
      };
    }

    let totalSteps = 0;
    let totalQuality = 0;

    bdd.forEach(scenario => {
      totalSteps += scenario.steps?.length || 0;
      totalQuality += scenario.quality_score || 0;
    });

    return {
      total_scenarios: bdd.length,
      total_steps: totalSteps,
      average_quality: Math.round(totalQuality / bdd.length),
      gherkin_compliance: this.analyzeGherkinCompliance(bdd),
      coverage_by_component: this.analyzeBDDCoverageByComponent(bdd)
    };
  }

  /**
   * Analyze Gherkin compliance
   */
  analyzeGherkinCompliance(bdd) {
    const compliant = bdd.filter(s => {
      const hasGWT = s.given && s.when && s.then;
      const hasExamples = s.examples && s.examples.length > 0;
      return hasGWT && hasExamples;
    }).length;

    return {
      total_analyzed: bdd.length,
      compliant: compliant,
      compliance_rate: Math.round((compliant / bdd.length) * 100)
    };
  }

  /**
   * Analyze BDD coverage by component
   */
  analyzeBDDCoverageByComponent(bdd) {
    const coverage = {};

    bdd.forEach(scenario => {
      const component = scenario.component || 'unknown';
      if (!coverage[component]) {
        coverage[component] = { scenarios: 0, steps: 0 };
      }
      coverage[component].scenarios++;
      coverage[component].steps += scenario.steps?.length || 0;
    });

    return coverage;
  }

  /**
   * Analyze test execution
   */
  analyzeTestExecution(executionData) {
    return {
      total_tests: executionData.total || 0,
      passed: executionData.passed || 0,
      failed: executionData.failed || 0,
      skipped: executionData.skipped || 0,
      pass_rate: executionData.total > 0 ?
        Math.round((executionData.passed / executionData.total) * 100) : 0,
      fail_rate: executionData.total > 0 ?
        Math.round((executionData.failed / executionData.total) * 100) : 0,
      skip_rate: executionData.total > 0 ?
        Math.round((executionData.skipped / executionData.total) * 100) : 0,
      execution_time: executionData.duration || 0,
      flakiness: this.analyzeFlakiness(executionData),
      by_domain: this.analyzeExecutionByDomain(executionData)
    };
  }

  /**
   * Analyze test flakiness
   */
  analyzeFlakiness(executionData) {
    if (!executionData.flake_history) return { flaky_tests: 0, flake_rate: 0 };

    const flakyCount = executionData.flake_history.filter(f => f.flaky).length;
    return {
      flaky_tests: flakyCount,
      flake_rate: Math.round((flakyCount / (executionData.flake_history.length || 1)) * 100),
      recommendations: flakyCount > 0 ? this.generateFlakinessFixes(executionData.flake_history) : []
    };
  }

  /**
   * Generate flakiness fixes
   */
  generateFlakinessFixes(flakeHistory) {
    const fixes = [];

    const timeoutFlakes = flakeHistory.filter(f => f.reason === 'timeout');
    if (timeoutFlakes.length > 0) {
      fixes.push({
        issue: 'Test timeouts causing flakiness',
        fix: 'Increase wait times or optimize selectors',
        tests_affected: timeoutFlakes.length
      });
    }

    const asyncFlakes = flakeHistory.filter(f => f.reason === 'async');
    if (asyncFlakes.length > 0) {
      fixes.push({
        issue: 'Async operation not completed',
        fix: 'Add proper wait conditions for async operations',
        tests_affected: asyncFlakes.length
      });
    }

    return fixes;
  }

  /**
   * Analyze execution by domain
   */
  analyzeExecutionByDomain(executionData) {
    if (!executionData.by_domain) return {};

    const analysis = {};
    Object.keys(executionData.by_domain).forEach(domain => {
      const domainData = executionData.by_domain[domain];
      analysis[domain] = {
        total: domainData.total,
        passed: domainData.passed,
        pass_rate: Math.round((domainData.passed / domainData.total) * 100),
        status: (domainData.passed / domainData.total) >= 0.95 ? 'PASS' : 'NEEDS_REVIEW'
      };
    });

    return analysis;
  }

  /**
   * Calculate quality metrics
   */
  calculateQualityMetrics(qualityData, executionData) {
    const requirementQuality = qualityData.average_quality_score || 0;
    const executionQuality = executionData.pass_rate || 0;
    const coverageQuality = executionData.code_coverage || 0;

    const overall = Math.round(
      (requirementQuality * 0.3 +
        executionQuality * 0.4 +
        coverageQuality * 0.3)
    );

    return {
      overall_score: overall,
      requirement_quality: requirementQuality,
      execution_quality: executionQuality,
      coverage_quality: coverageQuality,
      traceability_score: qualityData.requirement_coverage || 0,
      quality_trend: this.calculateQualityTrend()
    };
  }

  /**
   * Calculate quality trend
   */
  calculateQualityTrend() {
    if (this.metrics.length < 2) return 'stable';

    const recent = this.metrics.slice(-5);
    const avgRecent = recent.reduce((sum, m) => sum + m.qualityScore, 0) / recent.length;
    const avgPrevious = this.metrics.slice(-10, -5)
      .reduce((sum, m) => sum + m.qualityScore, 0) /
      Math.max(this.metrics.slice(-10, -5).length, 1);

    if (avgRecent > avgPrevious + 2) return 'improving';
    if (avgRecent < avgPrevious - 2) return 'declining';
    return 'stable';
  }

  /**
   * Generate traceability matrix
   */
  generateTraceabilityMatrix(qualityData) {
    const matrix = {
      total_requirements: qualityData.total_requirements || 0,
      requirements_with_bdd: 0,
      requirements_with_tests: 0,
      requirements_with_executions: 0,
      gaps: []
    };

    if (qualityData.requirements) {
      qualityData.requirements.forEach(req => {
        if (req.bdd_scenarios && req.bdd_scenarios.length > 0) matrix.requirements_with_bdd++;
        if (req.test_cases && req.test_cases.length > 0) matrix.requirements_with_tests++;
        if (req.execution_results) matrix.requirements_with_executions++;

        if (!req.bdd_scenarios || req.bdd_scenarios.length === 0) {
          matrix.gaps.push({
            requirement_id: req.id,
            gap_type: 'no_bdd_coverage',
            severity: 'high'
          });
        }

        if (!req.test_cases || req.test_cases.length === 0) {
          matrix.gaps.push({
            requirement_id: req.id,
            gap_type: 'no_test_cases',
            severity: 'high'
          });
        }
      });
    }

    matrix.coverage_rate = Math.round(
      (matrix.requirements_with_tests / Math.max(matrix.total_requirements, 1)) * 100
    );

    return matrix;
  }

  /**
   * Assess risks
   */
  assessRisks(qualityData, executionData) {
    const risks = [];

    if ((qualityData.average_quality_score || 0) < 70) {
      risks.push({
        category: 'Quality',
        severity: 'high',
        description: 'Requirements/BDD quality below acceptable threshold',
        mitigation: 'Review and improve requirement specifications and BDD scenarios'
      });
    }

    if ((executionData.pass_rate || 0) < 90) {
      risks.push({
        category: 'Reliability',
        severity: 'high',
        description: 'Test pass rate below 90%',
        mitigation: 'Investigate and fix failing tests, reduce flakiness'
      });
    }

    if ((executionData.code_coverage || 0) < 70) {
      risks.push({
        category: 'Coverage',
        severity: 'medium',
        description: 'Code coverage below 70%',
        mitigation: 'Add tests for uncovered code paths'
      });
    }

    return risks;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(qualityData, executionData) {
    const recommendations = [];

    // Quality recommendations
    if (qualityData.average_quality_score < 75) {
      recommendations.push({
        priority: 'high',
        area: 'Quality',
        recommendation: 'Improve requirement clarity and completeness',
        expected_impact: 'Reduce defects by 15-20%'
      });
    }

    // Coverage recommendations
    if ((qualityData.total_scenarios || 0) < (qualityData.total_requirements || 1) * 2) {
      recommendations.push({
        priority: 'high',
        area: 'Coverage',
        recommendation: 'Increase BDD scenario coverage to 2-3 scenarios per requirement',
        expected_impact: 'Better acceptance criteria coverage'
      });
    }

    // Execution recommendations
    if ((executionData.pass_rate || 0) < 95) {
      recommendations.push({
        priority: 'high',
        area: 'Reliability',
        recommendation: 'Reduce test flakiness and fix failing tests',
        expected_impact: 'More reliable test execution'
      });
    }

    return recommendations;
  }

  /**
   * Analyze trends
   */
  analyzeTrends(metrics) {
    if (metrics.length < 2) {
      return { trend: 'insufficient-data', velocity: 0 };
    }

    const recent = metrics.slice(-10);
    const trend = recent[recent.length - 1].qualityScore >= recent[0].qualityScore
      ? 'improving'
      : 'declining';

    const velocity = (recent[recent.length - 1].qualityScore - recent[0].qualityScore) /
      Math.max(recent.length, 1);

    return {
      trend,
      velocity: Math.round(velocity * 100) / 100,
      recent_scores: recent.map(m => m.qualityScore)
    };
  }

  /**
   * Analyze coverage
   */
  analyzeCoverage(qualityData, executionData) {
    return {
      requirement_coverage: qualityData.requirement_coverage || 0,
      bdd_coverage: qualityData.bdd_coverage || 0,
      code_coverage: executionData.code_coverage || 0,
      branch_coverage: executionData.branch_coverage || 0,
      line_coverage: executionData.line_coverage || 0,
      coverage_trend: this.calculateCoverageTrend()
    };
  }

  /**
   * Calculate coverage trend
   */
  calculateCoverageTrend() {
    if (this.metrics.length < 2) return 'stable';
    // Implementation for coverage trend
    return 'stable';
  }

  /**
   * Generate interactive dashboard
   */
  generateDashboard(reportId, config = {}) {
    const report = this.reports[reportId];
    if (!report) throw new Error(`Report ${reportId} not found`);

    const dashboard = {
      id: `dashboard-${reportId}`,
      title: config.title || 'E2E Quality Dashboard',
      timestamp: new Date().toISOString(),
      widgets: [
        this.createQualityScoreWidget(report),
        this.createTestExecutionWidget(report),
        this.createCoverageWidget(report),
        this.createTraceabilityWidget(report),
        this.createTrendChartWidget(report),
        this.createRiskAssessmentWidget(report)
      ],
      exportFormats: ['json', 'pdf', 'html', 'csv']
    };

    this.dashboards[dashboard.id] = dashboard;
    return dashboard;
  }

  /**
   * Create quality score widget
   */
  createQualityScoreWidget(report) {
    return {
      id: 'quality-score',
      type: 'gauge',
      title: 'Overall Quality Score',
      value: report.quality_metrics.overall_score,
      target: 85,
      min: 0,
      max: 100,
      format: 'percentage',
      color: this.getQualityColor(report.quality_metrics.overall_score)
    };
  }

  /**
   * Create test execution widget
   */
  createTestExecutionWidget(report) {
    return {
      id: 'test-execution',
      type: 'summary',
      title: 'Test Execution Summary',
      metrics: [
        { label: 'Total Tests', value: report.test_execution.total_tests },
        { label: 'Passed', value: report.test_execution.passed, color: 'green' },
        { label: 'Failed', value: report.test_execution.failed, color: 'red' },
        { label: 'Skipped', value: report.test_execution.skipped, color: 'gray' },
        { label: 'Pass Rate', value: `${report.test_execution.pass_rate}%` }
      ]
    };
  }

  /**
   * Create coverage widget
   */
  createCoverageWidget(report) {
    return {
      id: 'coverage',
      type: 'stacked-bar',
      title: 'Coverage Analysis',
      data: [
        { label: 'Requirement', value: report.coverage_analysis.requirement_coverage },
        { label: 'BDD', value: report.coverage_analysis.bdd_coverage },
        { label: 'Code', value: report.coverage_analysis.code_coverage }
      ]
    };
  }

  /**
   * Create traceability widget
   */
  createTraceabilityWidget(report) {
    return {
      id: 'traceability',
      type: 'sankey',
      title: 'Traceability: Requirement → BDD → Test → Execution',
      flow: {
        requirements: report.traceability_matrix.total_requirements,
        with_bdd: report.traceability_matrix.requirements_with_bdd,
        with_tests: report.traceability_matrix.requirements_with_tests,
        with_executions: report.traceability_matrix.requirements_with_executions
      }
    };
  }

  /**
   * Create trend chart widget
   */
  createTrendChartWidget(report) {
    return {
      id: 'trend',
      type: 'line-chart',
      title: 'Quality Score Trend',
      data: report.trend_analysis.recent_scores || [],
      trend: report.trend_analysis.trend,
      velocity: report.trend_analysis.velocity
    };
  }

  /**
   * Create risk assessment widget
   */
  createRiskAssessmentWidget(report) {
    return {
      id: 'risks',
      type: 'table',
      title: 'Risk Assessment',
      data: report.risk_assessment.map(risk => ({
        category: risk.category,
        severity: risk.severity,
        description: risk.description,
        mitigation: risk.mitigation
      }))
    };
  }

  /**
   * Get quality color
   */
  getQualityColor(score) {
    if (score >= 85) return 'green';
    if (score >= 70) return 'yellow';
    return 'red';
  }

  /**
   * Export report
   */
  exportReport(reportId, format = 'json') {
    const report = this.reports[reportId];
    if (!format) throw new Error(`Report ${reportId} not found`);

    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'html':
        return this.generateHTMLReport(report);
      case 'markdown':
        return this.generateMarkdownReport(report);
      case 'csv':
        return this.generateCSVReport(report);
      default:
        return JSON.stringify(report, null, 2);
    }
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(report) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${report.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .metric { margin: 20px 0; padding: 10px; border-left: 4px solid #007bff; }
        .metric-value { font-size: 24px; font-weight: bold; }
        .metric-label { font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <h1>${report.title}</h1>
      <p>Generated: ${report.timestamp}</p>
      <div class="metric">
        <div class="metric-label">Overall Quality Score</div>
        <div class="metric-value">${report.quality_metrics.overall_score}/100</div>
      </div>
      <div class="metric">
        <div class="metric-label">Test Pass Rate</div>
        <div class="metric-value">${report.test_execution.pass_rate}%</div>
      </div>
      <div class="metric">
        <div class="metric-label">Code Coverage</div>
        <div class="metric-value">${report.coverage_analysis.code_coverage}%</div>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Generate Markdown report
   */
  generateMarkdownReport(report) {
    return `
# ${report.title}

Generated: ${report.timestamp}

## Executive Summary
${report.executive_summary.summary_text}

### Key Findings
${report.executive_summary.key_findings.map(f =>
      `- **${f.category}**: ${f.value} (${f.status})`
    ).join('\n')}

## Quality Metrics
- Overall Score: **${report.quality_metrics.overall_score}/100**
- Requirement Quality: ${report.quality_metrics.requirement_quality}/100
- Execution Quality: ${report.quality_metrics.execution_quality}/100
- Coverage Quality: ${report.quality_metrics.coverage_quality}/100

## Test Execution
- Total Tests: ${report.test_execution.total_tests}
- Passed: ${report.test_execution.passed}
- Failed: ${report.test_execution.failed}
- Pass Rate: **${report.test_execution.pass_rate}%**

## Recommendations
${report.recommendations.map(r =>
      `- [${r.priority.toUpperCase()}] ${r.recommendation}`
    ).join('\n')}
    `;
  }

  /**
   * Generate CSV report
   */
  generateCSVReport(report) {
    const rows = [
      ['Metric', 'Value'],
      ['Overall Quality Score', report.quality_metrics.overall_score],
      ['Test Pass Rate', report.test_execution.pass_rate + '%'],
      ['Code Coverage', report.coverage_analysis.code_coverage + '%'],
      ['Total Tests', report.test_execution.total_tests],
      ['Tests Passed', report.test_execution.passed],
      ['Tests Failed', report.test_execution.failed]
    ];

    return rows.map(row => row.join(',')).join('\n');
  }
}

module.exports = QualityReportingAPI;
