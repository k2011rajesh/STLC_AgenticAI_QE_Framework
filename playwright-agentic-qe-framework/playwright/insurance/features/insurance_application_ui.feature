@regression
Feature: Individual Retirement Insurance Application UI

  @smoke
  Scenario: User applies for retirement insurance
    Given the user is on the insurance application page
    When the user fills in personal details
    And selects retirement insurance type
    And submits the application
    Then the application should be submitted successfully
    And a confirmation message should be displayed

  @regression
  Scenario: User gets a quote
    Given the user is on the quote page
    When the user enters age and income details
    And requests a quote
    Then a quote should be displayed
    And it should include premium amount

  @regression
  Scenario: User views policy details
    Given the user is logged in
    When the user navigates to policy details
    Then policy information should be displayed
    And it should include coverage and benefits