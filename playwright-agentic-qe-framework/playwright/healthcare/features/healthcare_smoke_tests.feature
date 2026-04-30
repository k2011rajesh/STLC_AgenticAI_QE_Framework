# Healthcare Domain - Smoke Tests
# JIRA Stories: QED-101, QED-102, QED-103
# Xray Test Plan: XR-TP-001

@jira("QED-101")
@xray-test-plan("XR-TP-001")
@smoke 
@healthcare
@domain("healthcare")
Feature: Healthcare Domain Smoke Tests

  @xray("XR-TC-101")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6
  Scenario: Patient successfully registers for healthcare service
    Given the user is on the healthcare registration page
    When the user fills in valid patient information
    And selects an active health plan
    And completes registration
    Then AC-1: patient account should be created
    And AC-2: confirmation should be displayed
    And AC-3: confirmation email is sent
    And AC-4: patient can login immediately
    And AC-5: health plan details are visible
    And AC-6: welcome package is sent

  @jira("QED-102")
  @xray("XR-TC-105")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6
  Scenario: Patient can schedule a basic appointment
    Given a patient is logged into the healthcare system
    When the patient selects a healthcare provider
    And books an appointment with available time slot
    And confirms the booking
    Then AC-1: appointment should be confirmed
    And AC-2: confirmation details should be displayed
    And AC-3: confirmation notification is sent
    And AC-4: appointment appears in calendar
    And AC-5: reminder notification will be sent
    And AC-6: appointment can be cancelled or rescheduled

  @jira("QED-103")
  @xray("XR-TC-109")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5
  Scenario: Patient can access their medical records
    Given a patient is logged in with existing records
    When the patient navigates to medical records section
    And requests to view recent records
    Then AC-1: records should load successfully
    And AC-2: records should be displayed securely
    And AC-3: records can be filtered by date
    And AC-4: records can be downloaded as PDF
    And AC-5: record sharing options are available