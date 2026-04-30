# Banking Domain - Loan Application
# JIRA Story: QED-301 (User Registration), QED-302 (User Login)
# Xray Test Plan: XR-TP-001
# INVEST Score: 86.5/100

@jira("QED-302")
@xray-test-plan("XR-TP-001")
@domain("banking")
@loan-application
Feature: Banking Loan Application UI

  @xray("XR-TC-305")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6 @acceptance-ac7 @acceptance-ac8
  @smoke
  Scenario: User applies for a personal loan
    Given the user is on the loan application page
    When the user fills in loan application details
    And selects loan type and amount
    And submits the application
    Then AC-1: the application should be submitted successfully
    And AC-2: an application reference number should be displayed
    And AC-3: confirmation email is sent with reference number
    And AC-4: application appears in user profile
    And AC-5: status shows as "Pending Review"
    And AC-6: estimated decision timeline is shown
    And AC-7: user can track application status
    And AC-8: user can upload supporting documents

  @xray("XR-TC-306")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5
  @regression
  Scenario: User checks loan eligibility
    Given the user is logged in to banking portal
    When the user enters personal and financial details
    And requests eligibility check
    Then AC-1: eligibility status should be displayed
    And AC-2: maximum loan amount should be shown
    And AC-3: interest rate is calculated and shown
    And AC-4: EMI (Estimated Monthly Installment) is calculated
    And AC-5: detailed eligibility report can be downloaded

  @xray("XR-TC-307")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4
  @regression
  Scenario: User views loan status
    Given the user has submitted a loan application
    When the user checks application status
    Then AC-1: current status should be displayed
    And AC-2: next steps should be indicated
    And AC-3: estimated decision date is shown
    And AC-4: user can contact support for assistance