/**
 * INVEST Scoring Engine
 * 
 * Scores user stories and epics based on INVEST criteria:
 * - Independent: Story is independent of other stories
 * - Negotiable: Story can be discussed and refined
 * - Valuable: Story delivers clear user value
 * - Estimable: Team can estimate the story
 * - Small: Can be completed in one sprint
 * - Testable: Story has clear acceptance criteria
 * 
 * Generates quality scores (0-100) for all Jira items
 */

class InvestScoringEngine {
  constructor() {
    this.criteria = {
      independent: 20,
      negotiable: 15,
      valuable: 20,
      estimable: 15,
      small: 15,
      testable: 15
    };

    this.weights = {
      independent: 1.0,
      negotiable: 0.8,
      valuable: 1.2,
      estimable: 1.0,
      small: 1.1,
      testable: 1.2
    };
  }

  /**
   * Score a user story
   */
  scoreUserStory(story) {
    const scores = {
      independent: this.scoreIndependence(story),
      negotiable: this.scoreNegotiability(story),
      valuable: this.scoreValue(story),
      estimable: this.scoreEstimability(story),
      small: this.scoreSize(story),
      testable: this.scoreTestability(story)
    };

    // Calculate weighted score
    let totalScore = 0;
    let totalWeight = 0;

    for (const [criterion, score] of Object.entries(scores)) {
      const weight = this.weights[criterion];
      totalScore += (score * weight);
      totalWeight += weight;
    }

    const investScore = Math.round((totalScore / totalWeight) * 100) / 100;

    return {
      scores,
      investScore,
      rating: this.getInvestRating(investScore),
      breakdown: this.getBreakdown(scores),
      recommendations: this.getRecommendations(scores)
    };
  }

  /**
   * Score independence (0-100)
   */
  scoreIndependence(story) {
    let score = 50;

    // Check for dependencies
    if (!story.dependencies || story.dependencies.length === 0) {
      score += 40;
    } else if (story.dependencies.length === 1) {
      score += 20;
    } else if (story.dependencies.length <= 3) {
      score += 10;
    }

    // Check for clear scope
    if (story.description && story.description.length > 50) {
      score += 10;
    }

    return Math.min(100, score);
  }

  /**
   * Score negotiability (0-100)
   */
  scoreNegotiability(story) {
    let score = 40;

    // Check for acceptance criteria
    if (story.acceptanceCriteria && story.acceptanceCriteria.length > 0) {
      score += 30;
    } else if (story.acceptanceCriteria && story.acceptanceCriteria.length > 1) {
      score += 40;
    }

    // Check for flexibility indicators
    if (story.notes && story.notes.includes('negotiable')) {
      score += 15;
    }

    // Check for open discussion
    if (!story.locked || story.locked === false) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Score value (0-100)
   */
  scoreValue(story) {
    let score = 30;

    // Check for clear business value
    if (story.businessValue && story.businessValue > 0) {
      score += 20 * (story.businessValue / 10);
    }

    // Check for user-facing functionality
    if (story.isUserFacing === true) {
      score += 25;
    }

    // Check for critical path
    if (story.criticalPath === true) {
      score += 20;
    }

    // Check for MVP feature
    if (story.mvpFeature === true) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Score estimability (0-100)
   */
  scoreEstimability(story) {
    let score = 40;

    // Check for story points
    if (story.storyPoints && story.storyPoints > 0) {
      score += 25;
    }

    // Check for clear acceptance criteria
    if (story.acceptanceCriteria && story.acceptanceCriteria.length >= 3) {
      score += 20;
    }

    // Check for clear scope
    if (story.scope === 'small' || story.scope === 'medium') {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Score size (0-100)
   */
  scoreSize(story) {
    let score = 40;

    // Check story points
    if (story.storyPoints) {
      if (story.storyPoints <= 5) {
        score += 40;
      } else if (story.storyPoints <= 8) {
        score += 20;
      } else if (story.storyPoints <= 13) {
        score += 10;
      }
    }

    // Check scope
    if (story.scope === 'small') {
      score += 20;
    } else if (story.scope === 'medium') {
      score += 10;
    }

    // Check complexity
    if (story.complexity === 'low') {
      score += 20;
    } else if (story.complexity === 'medium') {
      score += 10;
    }

    return Math.min(100, score);
  }

  /**
   * Score testability (0-100)
   */
  scoreTestability(story) {
    let score = 30;

    // Check for acceptance criteria
    if (story.acceptanceCriteria && story.acceptanceCriteria.length > 0) {
      score += 25;
    }

    // Check for GIVEN-WHEN-THEN format
    const givenWhenThen = story.acceptanceCriteria
      ? story.acceptanceCriteria.filter(ac => 
          ac.toLowerCase().includes('given') && 
          ac.toLowerCase().includes('when') && 
          ac.toLowerCase().includes('then')
        ).length
      : 0;

    if (givenWhenThen > 0) {
      score += 25;
    }

    // Check for test scenarios
    if (story.testScenarios && story.testScenarios.length > 0) {
      score += 15;
    }

    // Check for automatable criteria
    if (story.automatable === true) {
      score += 5;
    }

    return Math.min(100, score);
  }

  /**
   * Score an epic
   */
  scoreEpic(epic) {
    let score = 50;

    // Check for clear description
    if (epic.description && epic.description.length > 100) {
      score += 15;
    }

    // Check for related stories
    if (epic.stories && epic.stories.length >= 3) {
      score += 20;
    } else if (epic.stories && epic.stories.length > 0) {
      score += 10;
    }

    // Check for acceptance criteria
    if (epic.acceptanceCriteria && epic.acceptanceCriteria.length > 0) {
      score += 10;
    }

    // Calculate average story score
    if (epic.stories && epic.stories.length > 0) {
      const avgStoryScore = epic.stories.reduce((acc, story) => {
        const storyScore = this.scoreUserStory(story);
        return acc + storyScore.investScore;
      }, 0) / epic.stories.length;

      score += (avgStoryScore / 10);
    }

    return Math.min(100, score);
  }

  /**
   * Get INVEST rating
   */
  getInvestRating(score) {
    if (score >= 85) return '⭐⭐⭐⭐⭐ Excellent';
    if (score >= 75) return '⭐⭐⭐⭐ Good';
    if (score >= 65) return '⭐⭐⭐ Fair';
    if (score >= 50) return '⭐⭐ Poor';
    return '⭐ Needs Work';
  }

  /**
   * Get breakdown of scores
   */
  getBreakdown(scores) {
    return Object.entries(scores).map(([criterion, score]) => ({
      criterion: criterion.charAt(0).toUpperCase() + criterion.slice(1),
      score: score.toFixed(1),
      status: this.getScoreStatus(score)
    }));
  }

  /**
   * Get score status
   */
  getScoreStatus(score) {
    if (score >= 80) return '✅ Excellent';
    if (score >= 70) return '✅ Good';
    if (score >= 60) return '⚠️ Fair';
    if (score >= 50) return '⚠️ Needs Improvement';
    return '❌ Needs Major Work';
  }

  /**
   * Get recommendations for improvement
   */
  getRecommendations(scores) {
    const recommendations = [];

    if (scores.independent < 70) {
      recommendations.push({
        criterion: 'Independent',
        issue: 'Story has too many dependencies',
        fix: 'Break down into smaller, independent stories or combine with related stories'
      });
    }

    if (scores.negotiable < 70) {
      recommendations.push({
        criterion: 'Negotiable',
        issue: 'Story lacks clear acceptance criteria',
        fix: 'Add GIVEN-WHEN-THEN acceptance criteria and discussion notes'
      });
    }

    if (scores.valuable < 70) {
      recommendations.push({
        criterion: 'Valuable',
        issue: 'Story value is unclear',
        fix: 'Clearly define user value and business impact'
      });
    }

    if (scores.estimable < 70) {
      recommendations.push({
        criterion: 'Estimable',
        issue: 'Story is difficult to estimate',
        fix: 'Add more detail to story scope and acceptance criteria'
      });
    }

    if (scores.small < 70) {
      recommendations.push({
        criterion: 'Small',
        issue: 'Story is too large for one sprint',
        fix: 'Break down into smaller stories or increase sprint capacity'
      });
    }

    if (scores.testable < 70) {
      recommendations.push({
        criterion: 'Testable',
        issue: 'Story lacks clear test criteria',
        fix: 'Add specific, measurable acceptance criteria in GIVEN-WHEN-THEN format'
      });
    }

    return recommendations;
  }

  /**
   * Score a functional requirement
   */
  scoreFunctionalRequirement(requirement) {
    const story = {
      description: requirement.description || '',
      acceptanceCriteria: requirement.acceptanceCriteria || [],
      dependencies: requirement.dependencies || [],
      scope: 'small',
      complexity: requirement.complexity || 'low',
      isUserFacing: true,
      businessValue: 8,
      testScenarios: requirement.testScenarios || [],
      automatable: true
    };

    return this.scoreUserStory(story);
  }

  /**
   * Score a non-functional requirement
   */
  scoreNonFunctionalRequirement(requirement) {
    const story = {
      description: requirement.description || '',
      acceptanceCriteria: requirement.acceptanceCriteria || [],
      dependencies: requirement.dependencies || [],
      scope: 'medium',
      complexity: requirement.complexity || 'medium',
      isUserFacing: false,
      businessValue: 7,
      testScenarios: requirement.testScenarios || [],
      automatable: false
    };

    return this.scoreUserStory(story);
  }

  /**
   * Generate INVEST score label for Jira
   */
  generateInvestLabel(score) {
    if (score >= 85) return 'invest-excellent';
    if (score >= 75) return 'invest-good';
    if (score >= 65) return 'invest-fair';
    if (score >= 50) return 'invest-poor';
    return 'invest-needs-work';
  }

  /**
   * Generate quality field value for Jira custom field
   */
  generateQualityField(scores) {
    return {
      independent: Math.round(scores.independent),
      negotiable: Math.round(scores.negotiable),
      valuable: Math.round(scores.valuable),
      estimable: Math.round(scores.estimable),
      small: Math.round(scores.small),
      testable: Math.round(scores.testable),
      overall: Math.round(
        (scores.independent + scores.negotiable + scores.valuable + 
         scores.estimable + scores.small + scores.testable) / 6
      )
    };
  }
}

module.exports = InvestScoringEngine;
