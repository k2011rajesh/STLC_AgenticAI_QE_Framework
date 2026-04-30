#!/usr/bin/env node

/**
 * INVEST Quality Scoring - Standalone Report & Feature File Generator
 * 
 * Generates:
 * 1. Quality scores for all requirements (INVEST criteria)
 * 2. BDD Feature files for functional requirements
 * 3. Scenario mapping and traceability
 * 4. Comprehensive quality report (saved to file)
 */

const InvestScoringEngine = require('./integrations/quality/invest_scoring_engine');
const fs = require('fs').promises;
const path = require('path');

// Load example requirements
const { BANKING_REQUIREMENTS, BANKING_DISCOVERY_DATA } = require('./invest_quality_example.js');

class InvestReportGenerator {
  constructor() {
    this.engine = new InvestScoringEngine();
    this.outputDirs = {
      features: './playwright/features',
      functional: './playwright/features/functional',
      nonFunctional: './playwright/features/non-functional',
      reports: './reports'
    };
  }

  async generateReport(requirements, appName = 'InvestSmart Banking') {
    console.log('\n' + '='.repeat(80));
    console.log('  📊 INVEST QUALITY REPORT GENERATOR');
    console.log('='.repeat(80) + '\n');

    try {
      // Step 1: Create directories
      console.log('📁 Step 1: Creating output directories...');
      await this.createDirectories();

      // Step 2: Score requirements
      console.log('\n🎯 Step 2: Scoring requirements with INVEST criteria...');
      const scoredRequirements = this.scoreRequirements(requirements);
      this.printScoringStats(scoredRequirements);

      // Step 3: Generate feature files
      console.log('\n📝 Step 3: Generating BDD feature files...');
      const functionalReqs = scoredRequirements.filter(r => r.type === 'Functional' || !r.type);
      await this.generateFeatureFiles(functionalReqs);

      // Step 4: Generate scenario mapping
      console.log('\n🔗 Step 4: Generating scenario mapping and traceability...');
      await this.generateScenarioMapping(functionalReqs);

      // Step 5: Generate comprehensive report
      console.log('\n📋 Step 5: Generating comprehensive report...');
      const report = this.generateComprehensiveReport(
        appName,
        scoredRequirements,
        functionalReqs
      );

      // Step 6: Save report to file
      console.log('\n💾 Step 6: Saving report to file...');
      await this.saveReport(report, appName);

      // Step 7: Print report to console
      console.log('\n' + '='.repeat(80));
      this.printReport(report);
      console.log('='.repeat(80) + '\n');

      return {
        success: true,
        applicationName: appName,
        requirements: scoredRequirements,
        report,
        filesGenerated: {
          featureFiles: functionalReqs.length,
          scenarioMapping: 1,
          reportFile: 1
        }
      };
    } catch (error) {
      console.error(`\n❌ Error: ${error.message}`);
      throw error;
    }
  }

  async createDirectories() {
    const dirs = Object.values(this.outputDirs);
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`   ✅ ${dir}`);
      } catch (error) {
        console.log(`   ✅ ${dir} (already exists)`);
      }
    }
  }

  scoreRequirements(requirements) {
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

  printScoringStats(requirements) {
    const avgScore = requirements.reduce((acc, r) => acc + r.investScore, 0) / requirements.length;
    const excellent = requirements.filter(r => r.investScore >= 85).length;
    const good = requirements.filter(r => r.investScore >= 75 && r.investScore < 85).length;
    const fair = requirements.filter(r => r.investScore >= 65 && r.investScore < 75).length;
    const poor = requirements.filter(r => r.investScore < 65).length;

    console.log(`   Average INVEST Score: ${avgScore.toFixed(2)}/100`);
    console.log(`   ⭐⭐⭐⭐⭐ Excellent (85-100): ${excellent}`);
    console.log(`   ⭐⭐⭐⭐ Good (75-84): ${good}`);
    console.log(`   ⭐⭐⭐ Fair (65-74): ${fair}`);
    console.log(`   ⭐⭐ Poor (<65): ${poor}`);
  }

  async generateFeatureFiles(requirements) {
    for (const req of requirements) {
      if (!req.testScenarios || req.testScenarios.length === 0) continue;

      const feature = this.buildFeature(req);
      const filename = this.slugify(req.id) + '.feature';
      const filepath = path.join(this.outputDirs.functional, filename);

      await fs.writeFile(filepath, feature, 'utf8');
      console.log(`   ✅ ${filename}`);
    }
  }

  buildFeature(req) {
    let feature = `# ${req.id}: ${req.title}\n`;
    feature += `# INVEST Score: ${req.investScore.toFixed(1)}/100\n`;
    feature += `# Rating: ${req.investRating}\n\n`;
    feature += `Feature: ${req.title}\n`;
    feature += `  ${req.description}\n\n`;

    for (const scenario of req.testScenarios) {
      feature += `  Scenario: ${scenario.name || scenario.title}\n`;
      feature += `    Given ${scenario.given}\n`;
      feature += `    When ${scenario.when}\n`;
      feature += `    Then ${scenario.then}\n\n`;
    }

    return feature;
  }

  async generateScenarioMapping(requirements) {
    let mapping = '# Scenario Mapping & Traceability\n\n';
    mapping += `Generated: ${new Date().toISOString()}\n\n`;

    for (const req of requirements) {
      mapping += `## ${req.id}: ${req.title}\n\n`;
      mapping += `- **INVEST Score**: ${req.investScore.toFixed(1)}/100\n`;
      mapping += `- **Rating**: ${req.investRating}\n`;
      mapping += `- **Feature File**: ${this.slugify(req.id)}.feature\n`;
      mapping += `- **Scenarios**:\n`;

      if (req.testScenarios) {
        for (const scenario of req.testScenarios) {
          mapping += `  - ${scenario.name || scenario.title}\n`;
        }
      }

      mapping += '\n';
    }

    const filepath = path.join(this.outputDirs.functional, 'SCENARIO_MAPPING.md');
    await fs.writeFile(filepath, mapping, 'utf8');
    console.log(`   ✅ SCENARIO_MAPPING.md (${requirements.length} items mapped)`);
  }

  generateComprehensiveReport(appName, scoredReqs, functionalReqs) {
    const avgScore = scoredReqs.reduce((acc, r) => acc + r.investScore, 0) / scoredReqs.length;
    const funcAvg = functionalReqs.length > 0 
      ? functionalReqs.reduce((acc, r) => acc + r.investScore, 0) / functionalReqs.length 
      : 0;
    const nfrReqs = scoredReqs.filter(r => r.type === 'Non-Functional' || r.type === 'Performance' || r.type === 'Security');
    const nfrAvg = nfrReqs.length > 0 
      ? nfrReqs.reduce((acc, r) => acc + r.investScore, 0) / nfrReqs.length 
      : 0;

    const distribution = {
      excellent: scoredReqs.filter(r => r.investScore >= 85).length,
      good: scoredReqs.filter(r => r.investScore >= 75 && r.investScore < 85).length,
      fair: scoredReqs.filter(r => r.investScore >= 65 && r.investScore < 75).length,
      poor: scoredReqs.filter(r => r.investScore >= 50 && r.investScore < 65).length,
      needsWork: scoredReqs.filter(r => r.investScore < 50).length
    };

    const topScoring = scoredReqs
      .sort((a, b) => b.investScore - a.investScore)
      .slice(0, 5)
      .map(r => ({
        title: r.title,
        score: r.investScore.toFixed(1),
        rating: r.investRating
      }));

    const needsImprovement = scoredReqs
      .filter(r => r.investScore < 75)
      .sort((a, b) => a.investScore - b.investScore)
      .slice(0, 5)
      .map(r => ({
        title: r.title,
        score: r.investScore.toFixed(1),
        rating: r.investRating,
        topRecommendation: r.investRecommendations?.[0] || 'Add more details to acceptance criteria'
      }));

    const criteriaAnalysis = {
      independent: this.analyzeCriterion(scoredReqs, 'Independent'),
      negotiable: this.analyzeCriterion(scoredReqs, 'Negotiable'),
      valuable: this.analyzeCriterion(scoredReqs, 'Valuable'),
      estimable: this.analyzeCriterion(scoredReqs, 'Estimable'),
      small: this.analyzeCriterion(scoredReqs, 'Small'),
      testable: this.analyzeCriterion(scoredReqs, 'Testable')
    };

    return {
      applicationName: appName,
      timestamp: new Date().toISOString(),
      summary: {
        totalRequirements: scoredReqs.length,
        functionalRequirements: functionalReqs.length,
        nonFunctionalRequirements: nfrReqs.length,
        averageInvestScore: avgScore.toFixed(2),
        functionalAverage: funcAvg.toFixed(2),
        nfrAverage: nfrAvg.toFixed(2)
      },
      qualityDistribution: distribution,
      topScoringItems: topScoring,
      itemsNeedingImprovement: needsImprovement,
      investCriteriaAnalysis: criteriaAnalysis,
      jiraMetrics: {
        epicsCreated: 2,
        storiesCreated: scoredReqs.length,
        featuresGenerated: functionalReqs.length,
        scenariosMapped: functionalReqs.reduce((acc, r) => acc + (r.testScenarios?.length || 0), 0)
      }
    };
  }

  analyzeCriterion(requirements, criterionName) {
    const criterion = criterionName.toLowerCase().replace('-', '');
    const scores = requirements
      .map(r => r.investBreakdown?.[criterion] || r.investScores?.[criterion] || 75)
      .filter(s => typeof s === 'number');

    if (scores.length === 0) return { average: 75, strength: '⚠️ Fair' };

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    let strength = '';
    if (avg >= 80) strength = '✅ Strong';
    else if (avg >= 65) strength = '⚠️ Fair';
    else strength = '❌ Weak';

    return { average: avg.toFixed(2), strength };
  }

  async saveReport(report, appName) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${this.slugify(appName)}_invest_report_${timestamp}.json`;
    const filepath = path.join(this.outputDirs.reports, filename);

    await fs.writeFile(filepath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`   ✅ ${filename}`);
  }

  printReport(report) {
    console.log('\n  📊 INVEST QUALITY REPORT');
    console.log('  ' + '='.repeat(76));
    console.log(`\n  📱 Application: ${report.applicationName}`);
    console.log(`  📅 Generated: ${report.timestamp}`);

    console.log('\n  📊 Overall Summary:');
    console.log(`     Total Requirements: ${report.summary.totalRequirements}`);
    console.log(`     Functional: ${report.summary.functionalRequirements}`);
    console.log(`     Non-Functional: ${report.summary.nonFunctionalRequirements}`);
    console.log(`     Overall INVEST Score: ${report.summary.averageInvestScore}/100`);
    console.log(`     Functional Avg: ${report.summary.functionalAverage}/100`);
    console.log(`     NFR Avg: ${report.summary.nfrAverage}/100`);

    console.log('\n  📈 Quality Distribution:');
    console.log(`     ⭐⭐⭐⭐⭐ Excellent (85-100): ${report.qualityDistribution.excellent}`);
    console.log(`     ⭐⭐⭐⭐ Good (75-84): ${report.qualityDistribution.good}`);
    console.log(`     ⭐⭐⭐ Fair (65-74): ${report.qualityDistribution.fair}`);
    console.log(`     ⭐⭐ Poor (50-64): ${report.qualityDistribution.poor}`);
    console.log(`     ⭐ Needs Work (<50): ${report.qualityDistribution.needsWork}`);

    console.log('\n  🏆 Top Scoring Requirements:');
    for (const item of report.topScoringItems) {
      console.log(`     • ${item.title} - ${item.score}/100 ${item.rating}`);
    }

    if (report.itemsNeedingImprovement.length > 0) {
      console.log('\n  ⚠️  Items Needing Improvement:');
      for (const item of report.itemsNeedingImprovement) {
        console.log(`     • ${item.title} - ${item.score}/100`);
        console.log(`       Action: ${item.topRecommendation}`);
      }
    }

    console.log('\n  🎯 INVEST Criteria Analysis:');
    for (const [criterion, analysis] of Object.entries(report.investCriteriaAnalysis)) {
      console.log(`     ${criterion.charAt(0).toUpperCase() + criterion.slice(1)}: ${analysis.average}/100 ${analysis.strength}`);
    }

    console.log('\n  🔗 Artifacts:');
    console.log(`     Features Generated: ${report.jiraMetrics.featuresGenerated}`);
    console.log(`     Scenarios Mapped: ${report.jiraMetrics.scenariosMapped}`);
    console.log(`     Stories: ${report.jiraMetrics.storiesCreated}`);
  }

  slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  }
}

// Main execution
async function main() {
  const generator = new InvestReportGenerator();

  try {
    const result = await generator.generateReport(
      BANKING_REQUIREMENTS,
      'InvestSmart Banking'
    );

    console.log('✅ INVEST Quality Report Generated Successfully!\n');
    console.log('📂 Generated Files:');
    console.log(`   • Feature Files: ./playwright/features/functional/ (${result.filesGenerated.featureFiles} files)`);
    console.log(`   • Scenario Mapping: ./playwright/features/functional/SCENARIO_MAPPING.md`);
    console.log(`   • Quality Report: ./reports/investsmart_banking_invest_report_*.json`);
    console.log('\n✨ All INVEST quality artifacts generated successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Failed to generate report: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  InvestReportGenerator,
  BANKING_REQUIREMENTS,
  BANKING_DISCOVERY_DATA
};
