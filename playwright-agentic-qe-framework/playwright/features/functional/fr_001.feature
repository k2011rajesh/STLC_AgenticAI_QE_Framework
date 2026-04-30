# FR-001: User Registration
# JIRA Story: QED-101
# Xray Test Plan: XR-TP-001
# INVEST Score: 85.1/100
# Rating: ⭐⭐⭐⭐⭐ Excellent

@jira("QED-101")
@xray-test-plan("XR-TP-001")
Feature: User Registration
  As a user
  I want to register with email and password
  So that I can create an account and access the system

  @xray("XR-TC-101")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5
  Scenario: Successful Registration
    Given user is on registration page
    When user enters valid email and password
    And user enters personal details
    And user clicks "Register" button
    Then AC-1: Account is created successfully
    And AC-2: Confirmation email is sent to provided email
    And AC-3: Account status shows as "Active"
    And AC-4: User is redirected to login page
    And AC-5: Email contains account activation link

  @xray("XR-TC-102")
  @acceptance-ac1 @acceptance-ac2
  Scenario: Invalid Email Format
    Given user is on registration page
    When user enters invalid email format (without @)
    And user clicks "Register" button
    Then AC-1: Error message "Invalid email format" is displayed
    And AC-2: Registration is not completed

  @xray("XR-TC-103")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3
  Scenario: Password Strength Validation
    Given user is on registration page
    When user enters weak password (less than 8 characters)
    And user clicks "Register" button
    Then AC-1: Password strength indicator shows red
    And AC-2: Error message "Password must be at least 8 characters" is shown
    And AC-3: System prevents registration with weak password

  @xray("XR-TC-104")
  @acceptance-ac1 @acceptance-ac2
  Scenario: Duplicate Email Prevention
    Given user is on registration page
    When user enters email that is already registered
    And user clicks "Register" button
    Then AC-1: Error message "Email already exists" is displayed
    And AC-2: Link to login page is provided

