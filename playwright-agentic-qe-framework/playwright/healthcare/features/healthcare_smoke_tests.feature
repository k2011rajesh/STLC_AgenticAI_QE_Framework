@smoke @healthcare
Feature: Healthcare Domain Smoke Tests

  Scenario: Patient successfully registers for healthcare service
    Given the user is on the healthcare registration page
    When the user fills in valid patient information
    And selects an active health plan
    And completes registration
    Then patient account should be created
    And confirmation should be displayed

  Scenario: Patient can schedule a basic appointment
    Given a patient is logged into the healthcare system
    When the patient selects a healthcare provider
    And books an appointment with available time slot
    And confirms the booking
    Then appointment should be confirmed
    And confirmation details should be displayed

  Scenario: Patient can access their medical records
    Given a patient is logged in with existing records
    When the patient navigates to medical records section
    And requests to view recent records
    Then records should load successfully
    And records should be displayed securely