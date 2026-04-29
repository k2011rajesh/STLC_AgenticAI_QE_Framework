module.exports = {
  default: {
    require: [
      'playwright/insurance/**/*.js',
      'playwright/healthcare/step_definitions/**/*.js',
      'playwright/banking/step_definitions/**/*.js',
      'playwright/helpers/**/*.js'
    ],
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: [
      'playwright/insurance/features/**/*.feature',
      'playwright/healthcare/features/**/*.feature',
      'playwright/banking/features/**/*.feature'
    ]
  },
  smoke: {
    require: [
      'playwright/insurance/**/*.js',
      'playwright/healthcare/step_definitions/**/*.js',
      'playwright/banking/step_definitions/**/*.js',
      'playwright/helpers/**/*.js'
    ],
    format: ['progress-bar'],
    paths: [
      'playwright/insurance/features/**/*smoke*.feature',
      'playwright/healthcare/features/**/*smoke*.feature',
      'playwright/banking/features/**/*smoke*.feature'
    ]
  },
  regression: {
    require: [
      'playwright/insurance/**/*.js',
      'playwright/healthcare/step_definitions/**/*.js',
      'playwright/banking/step_definitions/**/*.js',
      'playwright/helpers/**/*.js'
    ],
    format: ['progress-bar'],
    paths: [
      'playwright/insurance/features/**/*regression*.feature',
      'playwright/healthcare/features/**/*regression*.feature',
      'playwright/banking/features/**/*regression*.feature'
    ]
  }
};