@regression
Feature: Banking Loan Application Database

  @smoke
  Scenario: Store loan application data
    Given a new loan application
    When application data is inserted into the database
    Then the data should be stored successfully
    And retrievable by application ID

  @regression
  Scenario: Update application status
    Given an existing loan application in database
    When the application status is updated
    Then the database should reflect the changes
    And status change timestamp should be recorded

  @regression
  Scenario: Query applications by user
    Given multiple loan applications for a user
    When querying applications by user ID
    Then all relevant applications should be returned
    And sorted by submission date