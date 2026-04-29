@regression
Feature: Healthcare Application UI

  @smoke
  Scenario: User registers for healthcare services
    Given the user is on the healthcare registration page
    When the user fills in personal health details
    And selects healthcare plan
    And submits the registration
    Then the registration should be successful
    And a confirmation should be displayed

  @regression
  Scenario: User schedules an appointment
    Given the user is logged in to healthcare portal
    When the user navigates to appointment booking
    And selects a doctor and time
    And confirms the appointment
    Then the appointment should be booked
    And confirmation details should be shown

  @regression
  Scenario: User views medical records
    Given the user is logged in
    When the user accesses medical records
    Then health history should be displayed
    And records should be secure