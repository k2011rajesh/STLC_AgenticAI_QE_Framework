# FR-004: Fund Transfer
# JIRA Story: QED-104
# Xray Test Plan: XR-TP-001
# INVEST Score: 78.6/100
# Rating: ⭐⭐⭐⭐ Good

@jira("QED-104")
@xray-test-plan("XR-TP-001")
Feature: Fund Transfer
  Users should transfer funds to another account

  @xray("XR-TC-113")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6 @acceptance-ac7 @acceptance-ac8
  Scenario: Successful Fund Transfer
    Given user has sufficient balance
    When user enters valid recipient and amount
    Then AC-1: funds are transferred successfully
    And AC-2: receipt is shown with transaction ID
    And AC-3: balance is updated immediately
    And AC-4: confirmation email is sent
    And AC-5: transaction appears in history
    And AC-6: receipt can be downloaded as PDF
    And AC-7: transfer timestamp is recorded
    And AC-8: recipient account is updated with funds

  @xray("XR-TC-114")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4
  Scenario: Insufficient Balance
    Given user has low balance
    When user tries to transfer more than available
    Then AC-1: insufficient balance error is shown
    And AC-2: error message provides available balance
    And AC-3: transfer is not processed
    And AC-4: user can adjust transfer amount

