# Healthcare Domain - Appointment Management
# Jira Epic: Healthcare Management System
# Jira Feature: Appointment Management (HCF-002)
# Jira Story: Schedule Appointment
# Xray Test Case: HCT-003
# INVEST Score: 82.1/100

Feature: Appointment Scheduling
  As a patient
  I want to schedule appointments with doctors
  So that I can receive medical consultation at convenient times

  Background:
    Given patient is logged into healthcare system
    And patient is on appointment booking page

  Scenario: Schedule Appointment with Available Doctor
    Given list of available doctors is displayed
    And available time slots are shown
    When patient selects a doctor
    And patient selects available date and time
    And patient confirms appointment request
    Then appointment is scheduled successfully
    And confirmation email is sent to patient
    And appointment appears in patient's calendar
    And reminder notification is set for 24 hours before

  Scenario: Reschedule Existing Appointment
    Given patient has an existing appointment on "2026-05-15"
    And patient is viewing their appointments
    When patient clicks reschedule button
    And patient selects new date and time
    And patient confirms reschedule request
    Then original appointment is cancelled
    And new appointment is created
    And cancellation and new appointment emails are sent

  Scenario: Cannot Book Appointment - Doctor Not Available
    Given patient is on appointment booking page
    When patient tries to select time slot that is already booked
    Then time slot becomes unavailable
    And error message "This slot is no longer available" is shown
    And patient is prompted to select different time

  Scenario: Cancel Appointment
    Given patient has scheduled appointment
    And patient is viewing their appointments
    When patient clicks cancel button
    And patient confirms cancellation
    Then appointment is cancelled
    And cancellation confirmation email is sent
    And time slot becomes available for other patients
