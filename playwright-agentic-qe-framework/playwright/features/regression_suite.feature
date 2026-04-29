@regression
Feature: Full Regression Suite

  Scenario: Run all insurance scenarios
    Given all insurance features are loaded
    When executing insurance regression tests
    Then all insurance scenarios should pass

  Scenario: Run all healthcare scenarios
    Given all healthcare features are loaded
    When executing healthcare regression tests
    Then all healthcare scenarios should pass

  Scenario: Cross-domain integration
    Given insurance and healthcare systems are integrated
    When running cross-domain tests
    Then integration should work seamlessly