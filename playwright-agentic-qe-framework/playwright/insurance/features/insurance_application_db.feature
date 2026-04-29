@regression
Feature: Individual Retirement Insurance Application Database

  @smoke
  Scenario: Store application data in database
    Given a new insurance application
    When the application data is inserted into the database
    Then the data should be stored successfully
    And retrievable by application ID

  @regression
  Scenario: Update policy in database
    Given an existing policy in the database
    When the policy details are updated
    Then the database should reflect the changes
    And the update timestamp should be set

  @regression
  Scenario: Query policies by user
    Given multiple policies for a user
    When querying policies by user ID
    Then all relevant policies should be returned
    And sorted by creation date