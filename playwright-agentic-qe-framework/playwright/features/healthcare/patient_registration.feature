# Healthcare Domain - Patient Registration
# Jira Epic: Healthcare Management System
# Jira Feature: Patient Management (HCF-001)
# Jira Story: Patient Registration
# Xray Test Cases: HCT-001, HCT-002
# INVEST Score: 85.2/100

Feature: Patient Registration
  As a new user
  I want to register with the healthcare system
  So that I can access patient portal and schedule appointments

  Background:
    Given the healthcare application is accessible
    And the registration page is loaded

  Scenario: Successful Patient Registration
    Given user is on the registration page
    And user has a valid email address
    When user enters email address
    And user enters valid password
    And user accepts terms and conditions
    And user clicks submit button
    Then user account is created successfully
    And confirmation email is sent to user
    And user is redirected to login page

  Scenario: Registration with Invalid Email Format
    Given user is on the registration page
    When user enters invalid email format
    And user enters password
    And user clicks submit button
    Then error message "Invalid email format" is displayed
    And user is not redirected to login page

  Scenario: Registration with Weak Password
    Given user is on the registration page
    When user enters valid email
    And user enters weak password (less than 8 characters)
    And user clicks submit button
    Then password strength warning is displayed
    And password validation error is shown
    And user cannot proceed with registration

  Scenario: Duplicate Email Registration
    Given user with email "test@example.com" already exists
    And user is on the registration page
    When user enters same email "test@example.com"
    And user enters password
    And user clicks submit button
    Then error message "Email already registered" is displayed
    And user is prompted to login or use different email
