# FR-003: View Account Balance
# JIRA Story: QED-103
# Xray Test Plan: XR-TP-001
# INVEST Score: 78.8/100
# Rating: ⭐⭐⭐⭐ Good

@jira("QED-103")
@xray-test-plan("XR-TP-001")
Feature: View Account Balance
  Users should see their account balance on dashboard

  @xray("XR-TC-110")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6
  @smoke
  Scenario: Display Account Balance
    Given user is authenticated and on dashboard
    When page loads
    Then AC-1: current account balance is displayed in INR
    And AC-2: balance is accurate to 2 decimal places
    And AC-3: balance refreshes on page reload
    And AC-4: available balance is clearly labeled
    And AC-5: currency symbol (₹) is displayed
    And AC-6: balance is secure and encrypted

