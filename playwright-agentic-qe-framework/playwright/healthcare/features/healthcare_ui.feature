# Healthcare Domain Features
# JIRA Stories: QED-101, QED-102, QED-103, QED-104
# Xray Test Plan: XR-TP-001

@jira("QED-101")
@xray-test-plan("XR-TP-001")
@domain("healthcare")
@regression
Feature: Healthcare Application UI

  @xray("XR-TC-101")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5
  @smoke
  Scenario: User registers for healthcare services
    Given the user is on the healthcare registration page
    When the user fills in personal health details
    And selects healthcare plan
    And submits the registration
    Then AC-1: the registration should be successful
    And AC-2: a confirmation should be displayed
    And AC-3: confirmation email is sent
    And AC-4: account status shows "Active"
    And AC-5: user can login immediately

  @jira("QED-102")
  @xray("XR-TC-105")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6
  @regression
  Scenario: User schedules an appointment
    Given the user is logged in to healthcare portal
    When the user navigates to appointment booking
    And selects a doctor and time
    And confirms the appointment
    Then AC-1: the appointment should be booked
    And AC-2: confirmation details should be shown
    And AC-3: calendar is updated
    And AC-4: confirmation notification is sent
    And AC-5: appointment reminder email is sent
    And AC-6: SMS confirmation is sent (if opted)

  @jira("QED-103")
  @xray("XR-TC-109")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5
  @regression
  Scenario: User views medical records
    Given the user is logged in
    When the user accesses medical records
    Then AC-1: health history should be displayed in timeline format
    And AC-2: records should be secure (encrypted)
    And AC-3: records can be filtered by date
    And AC-4: records can be filtered by type
    And AC-5: user can download records as PDF