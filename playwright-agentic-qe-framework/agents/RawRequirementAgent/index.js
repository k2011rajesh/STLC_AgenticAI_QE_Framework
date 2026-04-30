/**
 * Raw Requirement Agent
 * Handles raw, unstructured requirements and converts them to structured format
 * Complements UseCaseAnalysisAgent for comprehensive requirements gathering
 * 
 * STLC Phase: 0.5 (Requirements Ingestion)
 * Purpose: Parse raw stakeholder requirements into structured format
 */

const BaseAgent = require('../BaseAgent');

class RawRequirementAgent extends BaseAgent {
  constructor(apiKey) {
    super('RawRequirementAgent', apiKey);
    this.rawRequirements = [];
    this.structuredRequirements = [];
    this.requirementTypes = new Map();
    this.qualityMetrics = {
      rawRequirementsIngested: 0,
      structuredRequirementsGenerated: 0,
      requirementsValidated: 0,
      conflictsIdentified: 0
    };
  }

  /**
   * Ingest raw requirements from various sources
   * @param {Array|String} rawRequirementInput - Raw requirements (text, arrays, etc.)
   * @returns {Array} Ingested raw requirements
   */
  async ingestRawRequirements(rawRequirementInput) {
    console.log('📥 Ingesting raw requirements...');

    // Normalize input
    const requirements = Array.isArray(rawRequirementInput)
      ? rawRequirementInput
      : [rawRequirementInput];

    this.rawRequirements = requirements.map((req, index) => ({
      id: `RAW-REQ-${index + 1}`,
      sourceText: typeof req === 'string' ? req : JSON.stringify(req),
      originalFormat: typeof req,
      timestamp: new Date().toISOString(),
      processed: false
    }));

    this.qualityMetrics.rawRequirementsIngested = this.rawRequirements.length;
    console.log(`✅ Ingested ${this.rawRequirements.length} raw requirements`);

    return this.rawRequirements;
  }

  /**
   * Parse and structure raw requirements
   * @param {Array} rawRequirements - Raw requirements to parse
   * @returns {Array} Structured requirements
   */
  async parseAndStructureRequirements(rawRequirements) {
    console.log(`🔄 Parsing ${rawRequirements.length} raw requirements...`);

    const structured = [];

    for (const rawReq of rawRequirements) {
      const task = `Parse and structure this raw requirement into a structured format:

Raw Requirement:
"${rawReq.sourceText}"

Provide structured output with:
1. Requirement ID (REQ-XXX)
2. Type (Functional, Non-Functional, Security, Performance, Usability, Compliance)
3. Priority (Critical, High, Medium, Low)
4. Description (refined 1-2 sentence description)
5. Details (full explanation)
6. Stakeholders Affected (array of roles/personas)
7. Business Value (why this requirement matters)
8. Success Criteria (how to know it's met)
9. Related Requirements (if any)
10. Assumptions (things assumed to be true)
11. Constraints (limitations)
12. Acceptance Criteria (GIVEN-WHEN-THEN format)

Return as structured JSON.`;

      const result = await this.performTask(task);
      const parsedReq = this.parseStructuredRequirement(result);

      if (parsedReq) {
        structured.push({
          ...parsedReq,
          rawRequirementId: rawReq.id,
          processed: true
        });
      }
    }

    this.structuredRequirements = structured;
    this.qualityMetrics.structuredRequirementsGenerated = structured.length;

    console.log(`✅ Structured ${structured.length} requirements`);
    return structured;
  }

  /**
   * Validate requirements for completeness and clarity
   * @param {Array} requirements - Requirements to validate
   * @returns {Object} Validation report
   */
  async validateRequirements(requirements) {
    console.log(`🔍 Validating ${requirements.length} requirements...`);

    const validationReport = {
      totalRequirements: requirements.length,
      valid: [],
      issues: [],
      completeness: {},
      conflicts: []
    };

    for (const req of requirements) {
      const issues = [];

      // Check for required fields
      if (!req.description) issues.push('Missing description');
      if (!req.priority) issues.push('Missing priority');
      if (!req.type) issues.push('Missing type');
      if (!req.acceptanceCriteria || req.acceptanceCriteria.length === 0) {
        issues.push('Missing acceptance criteria');
      }

      if (issues.length === 0) {
        validationReport.valid.push(req.id);
      } else {
        validationReport.issues.push({
          requirementId: req.id,
          issues
        });
      }
    }

    // Calculate completeness
    validationReport.completeness = {
      completenessPercentage: Math.round(
        (validationReport.valid.length / requirements.length) * 100
      ),
      validRequirements: validationReport.valid.length,
      requirementsWithIssues: validationReport.issues.length
    };

    this.qualityMetrics.requirementsValidated = validationReport.valid.length;

    console.log(`✅ Validation complete: ${validationReport.completeness.completenessPercentage}% valid`);
    return validationReport;
  }

  /**
   * Identify conflicts and dependencies between requirements
   * @param {Array} requirements - Requirements to analyze
   * @returns {Object} Conflict and dependency analysis
   */
  async analyzeConflictsAndDependencies(requirements) {
    const task = `Analyze these requirements for conflicts and dependencies:

${JSON.stringify(requirements, null, 2)}

For each requirement, identify:
1. Conflicts (contradictions with other requirements)
2. Dependencies (must have other requirements to be implemented)
3. Overlaps (similar functionality across requirements)

Provide analysis as structured JSON with:
- Conflicts array: [{ req1: id, req2: id, nature: description }]
- Dependencies array: [{ dependent: id, dependsOn: [ids], reason: description }]
- Overlaps array: [{ requirements: [ids], overlap: description }]
- Recommendations: array of suggestions to resolve issues`;

    const result = await this.performTask(task);
    const analysis = this.parseAnalysis(result);

    this.qualityMetrics.conflictsIdentified = (analysis.conflicts || []).length;

    console.log(`✅ Identified ${this.qualityMetrics.conflictsIdentified} conflicts`);
    return analysis;
  }

  /**
   * Categorize requirements by type
   * @param {Array} requirements - Requirements to categorize
   * @returns {Object} Requirements organized by type
   */
  categorizeRequirements(requirements) {
    const categorized = {};

    for (const req of requirements) {
      const type = req.type || 'Unknown';

      if (!categorized[type]) {
        categorized[type] = [];
      }
      categorized[type].push(req);
    }

    this.requirementTypes = new Map(Object.entries(categorized));
    return categorized;
  }

  /**
   * Map requirements to use cases
   * @param {Array} requirements - Structured requirements
   * @param {Array} useCases - Use cases from UseCaseAnalysisAgent
   * @returns {Object} Traceability matrix
   */
  mapRequirementsToUseCases(requirements, useCases) {
    const traceabilityMatrix = {
      mappings: [],
      unmappedRequirements: [],
      unmappedUseCases: []
    };

    const mappedUseCases = new Set();

    for (const req of requirements) {
      let mapped = false;

      for (const useCase of useCases) {
        // Simple text-based matching
        if (
          req.description.toLowerCase().includes(useCase.name.toLowerCase()) ||
          useCase.name.toLowerCase().includes(req.description.split(' ')[0]?.toLowerCase())
        ) {
          traceabilityMatrix.mappings.push({
            requirementId: req.id,
            useCaseId: useCase.id,
            confidence: 'high'
          });
          mappedUseCases.add(useCase.id);
          mapped = true;
        }
      }

      if (!mapped) {
        traceabilityMatrix.unmappedRequirements.push(req.id);
      }
    }

    // Find unmapped use cases
    useCases.forEach(uc => {
      if (!mappedUseCases.has(uc.id)) {
        traceabilityMatrix.unmappedUseCases.push(uc.id);
      }
    });

    return traceabilityMatrix;
  }

  /**
   * Generate requirement traceability report
   * @param {Array} requirements - Requirements to report on
   * @returns {String} Markdown report
   */
  generateRequirementReport(requirements) {
    const byType = this.categorizeRequirements(requirements);
    const byPriority = {};

    for (const req of requirements) {
      const priority = req.priority || 'Medium';
      if (!byPriority[priority]) byPriority[priority] = [];
      byPriority[priority].push(req);
    }

    let report = `# Requirements Analysis Report

**Generated**: ${new Date().toISOString()}  
**Total Requirements**: ${requirements.length}

## Summary

| Metric | Count |
|--------|-------|
| Total Requirements | ${requirements.length} |
| Valid Requirements | ${this.qualityMetrics.requirementsValidated} |
| Requirement Types | ${this.requirementTypes.size} |
| Conflicts Identified | ${this.qualityMetrics.conflictsIdentified} |

## By Type

${Array.from(this.requirementTypes.entries())
  .map(([type, reqs]) => `- **${type}**: ${reqs.length}`)
  .join('\n')}

## By Priority

${Object.entries(byPriority)
  .map(([priority, reqs]) => `- **${priority}**: ${reqs.length}`)
  .join('\n')}

## Requirements Detailed List

${requirements.map(req => `
### ${req.id}: ${req.description}

- **Type**: ${req.type}
- **Priority**: ${req.priority}
- **Business Value**: ${req.businessValue}
- **Success Criteria**: ${(req.successCriteria || []).join('; ')}
- **Acceptance Criteria**: ${(req.acceptanceCriteria || []).length}
`).join('\n')}

## Quality Metrics

- **Completeness**: ${this.qualityMetrics.requirementsValidated}/${requirements.length}
- **Acceptance Criteria Defined**: ${requirements.filter(r => r.acceptanceCriteria?.length > 0).length}
- **Conflicts**: ${this.qualityMetrics.conflictsIdentified}

---

*Generated by RawRequirementAgent*
`;

    return report;
  }

  /**
   * Parse structured requirement from task result
   */
  parseStructuredRequirement(result) {
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
      console.error('Error parsing requirement:', error.message);
      return null;
    }
  }

  /**
   * Parse analysis from task result
   */
  parseAnalysis(result) {
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (error) {
      return {};
    }
  }

  /**
   * Get quality metrics
   */
  getQualityMetrics() {
    return this.qualityMetrics;
  }

  /**
   * Print quality summary
   */
  printQualitySummary() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 RAW REQUIREMENT ANALYSIS QUALITY METRICS');
    console.log('='.repeat(70));
    console.log(`Raw Requirements Ingested: ${this.qualityMetrics.rawRequirementsIngested}`);
    console.log(`Structured Requirements: ${this.qualityMetrics.structuredRequirementsGenerated}`);
    console.log(`Requirements Validated: ${this.qualityMetrics.requirementsValidated}`);
    console.log(`Conflicts Identified: ${this.qualityMetrics.conflictsIdentified}`);
    console.log('='.repeat(70) + '\n');
  }
}

module.exports = RawRequirementAgent;
