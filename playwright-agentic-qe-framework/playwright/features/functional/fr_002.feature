# FR-002: User Login
# JIRA Story: QED-102
# Xray Test Plan: XR-TP-001
# INVEST Score: 81.9/100
# Rating: ⭐⭐⭐⭐ Good

@jira("QED-102")
@xray-test-plan("XR-TP-001")
Feature: User Login
  Users should be able to login with email and password

  @xray("XR-TC-106")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5
  @smoke
  Scenario: Successful Login
    Given user has valid account
    When user enters correct credentials
    Then AC-1: user is logged in successfully
    And AC-2: user is redirected to dashboard
    And AC-3: session is created
    And AC-4: user profile is loaded
    And AC-5: login timestamp is recorded

  @xray("XR-TC-107")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3
  Scenario: Failed Login
    Given user has account
    When user enters wrong password
    Then AC-1: error message is displayed
    And AC-2: error message says "Invalid credentials"
    And AC-3: user remains on login page

