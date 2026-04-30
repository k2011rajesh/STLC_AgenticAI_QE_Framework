# FR-005: Transaction History
# JIRA Story: QED-105
# Xray Test Plan: XR-TP-001
# INVEST Score: 80.3/100
# Rating: ⭐⭐⭐⭐ Good

@jira("QED-105")
@xray-test-plan("XR-TP-001")
Feature: Transaction History
  Users should view their transaction history

  @xray("XR-TC-116")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6 @acceptance-ac7 @acceptance-ac8
  @smoke
  Scenario: View All Transactions
    Given user is on transaction history page
    When page loads
    Then AC-1: all transactions are displayed with date and amount
    And AC-2: transactions are sorted by date (newest first)
    And AC-3: transaction type is shown (debit/credit)
    And AC-4: transaction status is displayed
    And AC-5: balance changes are reflected
    And AC-6: transactions can be filtered by date range
    And AC-7: transactions can be exported as CSV
    And AC-8: transaction details can be expanded

