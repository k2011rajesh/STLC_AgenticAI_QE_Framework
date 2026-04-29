@regression
Feature: Banking Loan Application UI

  @smoke
  Scenario: User applies for a personal loan
    Given the user is on the loan application page
    When the user fills in loan application details
    And selects loan type and amount
    And submits the application
    Then the application should be submitted successfully
    And an application reference number should be displayed

  @regression
  Scenario: User checks loan eligibility
    Given the user is logged in to banking portal
    When the user enters personal and financial details
    And requests eligibility check
    Then eligibility status should be displayed
    And maximum loan amount should be shown

  @regression
  Scenario: User views loan status
    Given the user has submitted a loan application
    When the user checks application status
    Then current status should be displayed
    And next steps should be indicated