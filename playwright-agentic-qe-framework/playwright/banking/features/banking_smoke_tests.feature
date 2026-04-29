@smoke @banking
Feature: Banking Domain Smoke Tests

  Scenario: Customer successfully applies for a personal loan
    Given the user is on the loan application page
    When the user fills in basic application information
    And requests a standard loan amount
    And submits the application
    Then application should be received
    And reference number should be provided

  Scenario: Customer can check loan eligibility quickly
    Given the user is on the banking portal
    When the user enters basic financial information
    And requests eligibility check
    Then eligibility determination should complete
    And result should be displayed immediately

  Scenario: Existing customer can check loan status
    Given a customer has an active loan
    When the customer navigates to loan status page
    And requests current status
    Then loan details should load
    And current balance and payment information should display