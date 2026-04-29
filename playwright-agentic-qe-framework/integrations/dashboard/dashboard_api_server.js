/**
 * E2E Quality Metrics Dashboard API Server
 * RESTful endpoints for real-time quality metrics, trends, and visualization
 */

const express = require('express');
const cors = require('cors');
const QualityReportingAPI = require('../reporting/quality_reporting_api');
const QualityScoringPipeline = require('../quality/quality_scoring_pipeline');

class DashboardAPIServer {
  constructor(config = {}) {
    this.app = express();
    this.port = config.port || 3000;
    this.reportingAPI = new QualityReportingAPI();
    this.scoringPipeline = new QualityScoringPipeline();
    this.config = config;
    this.metricsCache = {};
    this.cacheExpiry = config.cacheExpiry || 5 * 60 * 1000; // 5 minutes

    this.initializeMiddleware();
    this.initializeRoutes();
  }

  /**
   * Initialize Express middleware
   */
  initializeMiddleware() {
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));

    // Request logging middleware
    this.app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });

    // Authentication middleware (if configured)
    if (this.config.requireAuth) {
      this.app.use((req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || token !== this.config.apiKey) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
      });
    }

    // Error handling middleware
    this.app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({
        error: err.message,
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Initialize API routes
   */
  initializeRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    // Quality Score Endpoints
    this.app.get('/api/metrics/quality-score', this.getQualityScore.bind(this));
    this.app.get('/api/metrics/quality-trend', this.getQualityTrend.bind(this));
    this.app.get('/api/metrics/quality-distribution', this.getQualityDistribution.bind(this));

    // Test Execution Endpoints
    this.app.get('/api/metrics/test-execution', this.getTestExecutionMetrics.bind(this));
    this.app.get('/api/metrics/test-execution/:domain', this.getTestExecutionByDomain.bind(this));
    this.app.post('/api/metrics/test-execution', this.recordTestExecution.bind(this));

    // Coverage Endpoints
    this.app.get('/api/metrics/coverage', this.getCoverageMetrics.bind(this));
    this.app.get('/api/metrics/coverage/by-component', this.getCoverageByComponent.bind(this));
    this.app.get('/api/metrics/coverage/:component', this.getComponentCoverage.bind(this));

    // Traceability Endpoints
    this.app.get('/api/metrics/traceability', this.getTraceabilityMatrix.bind(this));
    this.app.get('/api/metrics/traceability/:requirementId', this.getRequirementTraceability.bind(this));

    // Requirements Endpoints
    this.app.get('/api/metrics/requirements', this.getRequirementsMetrics.bind(this));
    this.app.get('/api/metrics/requirements/:id', this.getRequirementDetails.bind(this));
    this.app.post('/api/metrics/requirements', this.recordRequirement.bind(this));

    // BDD Endpoints
    this.app.get('/api/metrics/bdd', this.getBDDMetrics.bind(this));
    this.app.get('/api/metrics/bdd/scenarios', this.getBDDScenarios.bind(this));
    this.app.post('/api/metrics/bdd', this.recordBDDScenario.bind(this));

    // Dashboard Endpoints
    this.app.get('/api/dashboard', this.getDashboard.bind(this));
    this.app.get('/api/dashboard/summary', this.getDashboardSummary.bind(this));
    this.app.get('/api/dashboard/widgets/:widget', this.getWidget.bind(this));

    // Report Endpoints
    this.app.post('/api/reports/generate', this.generateReport.bind(this));
    this.app.get('/api/reports/:reportId', this.getReport.bind(this));
    this.app.get('/api/reports/:reportId/export', this.exportReport.bind(this));
    this.app.get('/api/reports', this.listReports.bind(this));

    // Trend Analysis Endpoints
    this.app.get('/api/analytics/trends', this.getTrendAnalysis.bind(this));
    this.app.get('/api/analytics/velocity', this.getQualityVelocity.bind(this));
    this.app.get('/api/analytics/consistency', this.getConsistencyScore.bind(this));
    this.app.get('/api/analytics/recommendations', this.getRecommendations.bind(this));

    // Risk Assessment Endpoints
    this.app.get('/api/risks', this.getRiskAssessment.bind(this));
    this.app.get('/api/risks/:severity', this.getRisksBySeverity.bind(this));

    // Data Aggregation Endpoints
    this.app.post('/api/aggregate/requirements-bdd', this.aggregateRequirementsBDD.bind(this));
    this.app.post('/api/aggregate/bdd-execution', this.aggregateBDDExecution.bind(this));
    this.app.post('/api/aggregate/full-pipeline', this.aggregateFullPipeline.bind(this));

    // Webhook Endpoints
    this.app.post('/api/webhooks/jira', this.handleJiraWebhook.bind(this));
    this.app.post('/api/webhooks/xray', this.handleXrayWebhook.bind(this));
    this.app.post('/api/webhooks/ci', this.handleCIWebhook.bind(this));

    // Configuration & Admin
    this.app.get('/api/config', this.getConfiguration.bind(this));
    this.app.post('/api/config/cache/clear', this.clearCache.bind(this));
  }

  /**
   * Get current quality score
   */
  getQualityScore(req, res) {
    try {
      const cacheKey = 'quality-score';
      if (this.metricsCache[cacheKey] && !this.isCacheExpired(cacheKey)) {
        return res.json(this.metricsCache[cacheKey]);
      }

      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report) {
        return res.status(404).json({ error: 'No quality report available' });
      }

      const response = {
        score: report.quality_metrics.overall_score,
        requirement: report.quality_metrics.requirement_quality,
        execution: report.quality_metrics.execution_quality,
        coverage: report.quality_metrics.coverage_quality,
        status: this.getScoreStatus(report.quality_metrics.overall_score),
        timestamp: new Date().toISOString()
      };

      this.setCacheWithExpiry(cacheKey, response);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get quality score trend
   */
  getQualityTrend(req, res) {
    try {
      const cacheKey = 'quality-trend';
      if (this.metricsCache[cacheKey] && !this.isCacheExpired(cacheKey)) {
        return res.json(this.metricsCache[cacheKey]);
      }

      const metrics = this.scoringPipeline.scoreHistory.slice(-20);
      const scores = metrics.map(m => ({
        timestamp: m.timestamp,
        score: m.overallScore,
        phase: m.phase
      }));

      const response = {
        scores,
        trend: this.calculateTrend(scores),
        velocity: this.calculateVelocity(scores),
        consistency: this.calculateConsistency(scores),
        timestamp: new Date().toISOString()
      };

      this.setCacheWithExpiry(cacheKey, response);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get quality score distribution
   */
  getQualityDistribution(req, res) {
    try {
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report) {
        return res.status(404).json({ error: 'No quality report available' });
      }

      const response = {
        requirement: report.requirement_analysis,
        bdd: report.bdd_analysis.gherkin_compliance,
        execution: {
          passed: report.test_execution.passed,
          failed: report.test_execution.failed,
          skipped: report.test_execution.skipped,
          passRate: report.test_execution.pass_rate
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get test execution metrics
   */
  getTestExecutionMetrics(req, res) {
    try {
      const cacheKey = 'test-execution-metrics';
      if (this.metricsCache[cacheKey] && !this.isCacheExpired(cacheKey)) {
        return res.json(this.metricsCache[cacheKey]);
      }

      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report) {
        return res.status(404).json({ error: 'No test execution data available' });
      }

      const response = {
        total: report.test_execution.total_tests,
        passed: report.test_execution.passed,
        failed: report.test_execution.failed,
        skipped: report.test_execution.skipped,
        passRate: report.test_execution.pass_rate,
        failRate: report.test_execution.fail_rate,
        skipRate: report.test_execution.skip_rate,
        executionTime: report.test_execution.execution_time,
        flakiness: report.test_execution.flakiness,
        byDomain: report.test_execution.by_domain,
        timestamp: new Date().toISOString()
      };

      this.setCacheWithExpiry(cacheKey, response);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get test execution by domain
   */
  getTestExecutionByDomain(req, res) {
    try {
      const { domain } = req.params;
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      
      if (!report || !report.test_execution.by_domain) {
        return res.status(404).json({ error: 'No domain data available' });
      }

      const domainData = report.test_execution.by_domain[domain];
      if (!domainData) {
        return res.status(404).json({ error: `Domain ${domain} not found` });
      }

      res.json({
        domain,
        ...domainData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Record test execution
   */
  recordTestExecution(req, res) {
    try {
      const testResults = req.body;
      const score = this.scoringPipeline.scoreTestExecutionPhase(testResults);
      
      this.clearCache('test-execution-metrics');
      
      res.json({
        recorded: true,
        score: score.overallScore,
        metrics: score.metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get coverage metrics
   */
  getCoverageMetrics(req, res) {
    try {
      const cacheKey = 'coverage-metrics';
      if (this.metricsCache[cacheKey] && !this.isCacheExpired(cacheKey)) {
        return res.json(this.metricsCache[cacheKey]);
      }

      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report) {
        return res.status(404).json({ error: 'No coverage data available' });
      }

      const response = {
        requirement: report.coverage_analysis.requirement_coverage,
        bdd: report.coverage_analysis.bdd_coverage,
        code: report.coverage_analysis.code_coverage,
        branch: report.coverage_analysis.branch_coverage,
        line: report.coverage_analysis.line_coverage,
        trend: report.coverage_analysis.coverage_trend,
        timestamp: new Date().toISOString()
      };

      this.setCacheWithExpiry(cacheKey, response);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get coverage by component
   */
  getCoverageByComponent(req, res) {
    try {
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report || !report.bdd_analysis.coverage_by_component) {
        return res.status(404).json({ error: 'No component coverage data' });
      }

      const components = Object.entries(report.bdd_analysis.coverage_by_component).map(
        ([component, data]) => ({
          component,
          scenarios: data.scenarios,
          steps: data.steps,
          averageStepsPerScenario: Math.round(data.steps / Math.max(data.scenarios, 1))
        })
      );

      res.json({
        components,
        totalComponents: components.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get component coverage
   */
  getComponentCoverage(req, res) {
    try {
      const { component } = req.params;
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      
      if (!report || !report.bdd_analysis.coverage_by_component) {
        return res.status(404).json({ error: 'No component data' });
      }

      const data = report.bdd_analysis.coverage_by_component[component];
      if (!data) {
        return res.status(404).json({ error: `Component ${component} not found` });
      }

      res.json({
        component,
        ...data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get traceability matrix
   */
  getTraceabilityMatrix(req, res) {
    try {
      const cacheKey = 'traceability-matrix';
      if (this.metricsCache[cacheKey] && !this.isCacheExpired(cacheKey)) {
        return res.json(this.metricsCache[cacheKey]);
      }

      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report) {
        return res.status(404).json({ error: 'No traceability data' });
      }

      const response = {
        matrix: report.traceability_matrix,
        timestamp: new Date().toISOString()
      };

      this.setCacheWithExpiry(cacheKey, response);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get requirement traceability
   */
  getRequirementTraceability(req, res) {
    try {
      const { requirementId } = req.params;
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      
      if (!report || !report.traceability_matrix.gaps) {
        return res.status(404).json({ error: 'No traceability data' });
      }

      const gaps = report.traceability_matrix.gaps.filter(g => g.requirement_id === requirementId);

      res.json({
        requirementId,
        gaps,
        hasGaps: gaps.length > 0,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get requirements metrics
   */
  getRequirementsMetrics(req, res) {
    try {
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report) {
        return res.status(404).json({ error: 'No requirements data' });
      }

      res.json({
        analysis: report.requirement_analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get requirement details
   */
  getRequirementDetails(req, res) {
    try {
      const { id } = req.params;
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      
      if (!report || !report.requirement_analysis) {
        return res.status(404).json({ error: 'No requirement details' });
      }

      // This would typically query a database
      res.json({
        id,
        message: 'Requirement detail implementation pending'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Record requirement
   */
  recordRequirement(req, res) {
    try {
      const requirement = req.body;
      const score = this.scoringPipeline.scoreRequirementPhase(
        requirement,
        requirement.acceptanceCriteria
      );

      res.json({
        recorded: true,
        score: score.overallScore,
        metrics: score.metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get BDD metrics
   */
  getBDDMetrics(req, res) {
    try {
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report) {
        return res.status(404).json({ error: 'No BDD data' });
      }

      res.json({
        analysis: report.bdd_analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get BDD scenarios
   */
  getBDDScenarios(req, res) {
    try {
      const { component } = req.query;
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      
      if (!report) {
        return res.status(404).json({ error: 'No BDD scenarios' });
      }

      res.json({
        scenarios: [],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Record BDD scenario
   */
  recordBDDScenario(req, res) {
    try {
      const bddScenarios = req.body.scenarios;
      const mapping = req.body.mapping;

      const score = this.scoringPipeline.scoreBDDDesignPhase(
        bddScenarios,
        mapping.acceptanceCriteria,
        mapping
      );

      res.json({
        recorded: true,
        score: score.overallScore,
        metrics: score.metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get dashboard
   */
  getDashboard(req, res) {
    try {
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report) {
        return res.status(404).json({ error: 'No dashboard data' });
      }

      const dashboard = this.reportingAPI.generateDashboard(report.id);
      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get dashboard summary
   */
  getDashboardSummary(req, res) {
    try {
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report) {
        return res.status(404).json({ error: 'No dashboard data' });
      }

      res.json({
        summary: report.executive_summary,
        qualityScore: report.quality_metrics.overall_score,
        health: report.executive_summary.overall_health,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get widget data
   */
  getWidget(req, res) {
    try {
      const { widget } = req.params;
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report) {
        return res.status(404).json({ error: 'No widget data' });
      }

      const dashboard = this.reportingAPI.generateDashboard(report.id);
      const widgetData = dashboard.widgets.find(w => w.id === widget);

      if (!widgetData) {
        return res.status(404).json({ error: `Widget ${widget} not found` });
      }

      res.json(widgetData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Generate quality report
   */
  generateReport(req, res) {
    try {
      const { qualityData, executionData, config } = req.body;
      const report = this.reportingAPI.generateQualityReport(
        qualityData,
        executionData,
        config
      );

      res.json({
        reportId: report.id,
        url: `/api/reports/${report.id}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get report
   */
  getReport(req, res) {
    try {
      const { reportId } = req.params;
      const report = this.reportingAPI.reports[reportId];

      if (!report) {
        return res.status(404).json({ error: `Report ${reportId} not found` });
      }

      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Export report
   */
  exportReport(req, res) {
    try {
      const { reportId } = req.params;
      const { format = 'json' } = req.query;

      const report = this.reportingAPI.reports[reportId];
      if (!report) {
        return res.status(404).json({ error: `Report ${reportId} not found` });
      }

      const exported = this.reportingAPI.exportReport(reportId, format);

      if (format === 'html') {
        res.setHeader('Content-Type', 'text/html');
      } else if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
      } else {
        res.setHeader('Content-Type', 'application/json');
      }

      res.send(exported);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * List reports
   */
  listReports(req, res) {
    try {
      const reports = Object.entries(this.reportingAPI.reports).map(([id, report]) => ({
        id,
        title: report.title,
        timestamp: report.timestamp,
        qualityScore: report.quality_metrics.overall_score
      }));

      res.json({
        total: reports.length,
        reports,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get trend analysis
   */
  getTrendAnalysis(req, res) {
    try {
      const analysis = this.reportingAPI.analyzeTrends(this.scoringPipeline.scoreHistory);
      res.json({
        analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get quality velocity
   */
  getQualityVelocity(req, res) {
    try {
      const velocity = this.scoringPipeline.calculateVelocity();
      res.json({
        velocity,
        unit: 'points per day',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get consistency score
   */
  getConsistencyScore(req, res) {
    try {
      const consistency = this.scoringPipeline.calculateConsistency();
      res.json({
        score: consistency,
        status: consistency >= 80 ? 'consistent' : consistency >= 60 ? 'moderate' : 'variable',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get recommendations
   */
  getRecommendations(req, res) {
    try {
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report) {
        return res.status(404).json({ error: 'No recommendations' });
      }

      res.json({
        recommendations: report.recommendations,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get risk assessment
   */
  getRiskAssessment(req, res) {
    try {
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      if (!report) {
        return res.status(404).json({ error: 'No risk data' });
      }

      res.json({
        risks: report.risk_assessment,
        total: report.risk_assessment.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get risks by severity
   */
  getRisksBySeverity(req, res) {
    try {
      const { severity } = req.params;
      const report = this.reportingAPI.reports[Object.keys(this.reportingAPI.reports)[0]];
      
      if (!report) {
        return res.status(404).json({ error: 'No risk data' });
      }

      const risks = report.risk_assessment.filter(r => r.severity === severity);
      res.json({
        severity,
        risks,
        total: risks.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Aggregate requirements and BDD
   */
  aggregateRequirementsBDD(req, res) {
    try {
      const { requirements, bddScenarios } = req.body;
      const aggregation = {
        totalRequirements: requirements.length,
        totalScenarios: bddScenarios.length,
        scenariosPerRequirement: Math.round(bddScenarios.length / Math.max(requirements.length, 1)),
        coverage: Math.round((bddScenarios.length / (requirements.length * 2)) * 100),
        timestamp: new Date().toISOString()
      };

      res.json(aggregation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Aggregate BDD and execution
   */
  aggregateBDDExecution(req, res) {
    try {
      const { bddScenarios, testResults } = req.body;
      const aggregation = {
        totalScenarios: bddScenarios.length,
        totalTests: testResults.total,
        passed: testResults.passed,
        failed: testResults.failed,
        scenarioPassRate: Math.round((testResults.passed / testResults.total) * 100),
        timestamp: new Date().toISOString()
      };

      res.json(aggregation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Aggregate full pipeline
   */
  aggregateFullPipeline(req, res) {
    try {
      const { requirements, bddScenarios, testResults } = req.body;
      
      const fullPipeline = {
        requirements: requirements.length,
        bddScenarios: bddScenarios.length,
        testExecutions: testResults.total,
        qualityMetrics: {
          passRate: Math.round((testResults.passed / testResults.total) * 100),
          coverage: Math.round((bddScenarios.length / (requirements.length * 2)) * 100)
        },
        timestamp: new Date().toISOString()
      };

      res.json(fullPipeline);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle JIRA webhook
   */
  handleJiraWebhook(req, res) {
    try {
      const webhookData = req.body;
      console.log('JIRA Webhook received:', webhookData.event);

      // Clear relevant caches on JIRA updates
      this.clearCache('quality-score');
      this.clearCache('test-execution-metrics');

      res.json({ acknowledged: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle Xray webhook
   */
  handleXrayWebhook(req, res) {
    try {
      const webhookData = req.body;
      console.log('Xray Webhook received:', webhookData.event);

      // Clear caches on Xray updates
      this.clearCache('coverage-metrics');
      this.clearCache('test-execution-metrics');

      res.json({ acknowledged: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handle CI webhook
   */
  handleCIWebhook(req, res) {
    try {
      const webhookData = req.body;
      console.log('CI Webhook received:', webhookData.event);

      // Clear all caches on CI completion
      this.clearCache();

      res.json({ acknowledged: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get configuration
   */
  getConfiguration(req, res) {
    try {
      res.json({
        port: this.port,
        cacheExpiry: this.cacheExpiry,
        requireAuth: this.config.requireAuth,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Clear cache
   */
  clearCache(key = null) {
    if (key) {
      delete this.metricsCache[key];
      console.log(`Cache cleared: ${key}`);
    } else {
      this.metricsCache = {};
      console.log('All caches cleared');
    }
  }

  /**
   * Cache helper methods
   */
  setCacheWithExpiry(key, value) {
    this.metricsCache[key] = {
      data: value,
      expiry: Date.now() + this.cacheExpiry
    };
  }

  isCacheExpired(key) {
    const cached = this.metricsCache[key];
    if (!cached) return true;
    return Date.now() > cached.expiry;
  }

  /**
   * Utility methods
   */
  getScoreStatus(score) {
    if (score >= 85) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'acceptable';
    return 'needs-improvement';
  }

  calculateTrend(scores) {
    if (scores.length < 2) return 'insufficient-data';
    const recent = scores.slice(-5);
    return recent[recent.length - 1].score >= recent[0].score ? 'improving' : 'declining';
  }

  calculateVelocity(scores) {
    if (scores.length < 2) return 0;
    const first = scores[0].score;
    const last = scores[scores.length - 1].score;
    return Math.round((last - first) / scores.length * 100) / 100;
  }

  calculateConsistency(scores) {
    if (scores.length === 0) return 0;
    const mean = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s.score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    return Math.round(Math.max(0, 100 - stdDev));
  }

  /**
   * Start server
   */
  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`Dashboard API Server running on port ${this.port}`);
      console.log(`Health check: http://localhost:${this.port}/health`);
      console.log(`API Documentation: http://localhost:${this.port}/api/docs`);
    });
  }

  /**
   * Stop server
   */
  stop() {
    if (this.server) {
      this.server.close(() => {
        console.log('Dashboard API Server stopped');
      });
    }
  }
}

module.exports = DashboardAPIServer;
