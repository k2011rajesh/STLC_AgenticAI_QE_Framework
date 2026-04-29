@smoke @insurance
Feature: Insurance Domain Smoke Tests

  Scenario: User successfully completes basic insurance application
    Given the user is on the insurance application page
    When the user fills in valid application details
    And selects a standard insurance type
    And submits the application
    Then the application should be confirmed
    And reference number should be generated

  Scenario: System calculates basic quote correctly
    Given the user is on the quote page
    When the user enters standard age and income details
    And requests a basic quote
    Then a valid quote amount should be displayed
    And quote should include premium breakdown

  Scenario: User can view existing policy information
    Given a user is logged in with an active policy
    When the user navigates to policy details
    Then policy information should load
    And coverage details should be visible
    And policy status should show as active