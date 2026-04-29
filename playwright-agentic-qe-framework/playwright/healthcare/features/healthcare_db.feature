@regression
Feature: Healthcare Application Database

  @smoke
  Scenario: Insert patient data into database
    Given a new patient registration
    When patient data is inserted into the database
    Then the data should be stored successfully
    And retrievable by patient ID

  @regression
  Scenario: Update appointment status in database
    Given an existing appointment in the database
    When the appointment status is updated
    Then the database should reflect the changes
    And update timestamp should be recorded

  @regression
  Scenario: Query medical history by patient
    Given multiple records for a patient
    When querying medical history by patient ID
    Then all relevant records should be returned
    And sorted by date