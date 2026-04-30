# Insurance Domain - Premium Calculation
# JIRA Story: QED-203 (Premium Calculation)
# Xray Test Plan: XR-TP-001
# INVEST Score: 81.6/100

@jira("QED-203")
@xray-test-plan("XR-TP-001")
@domain("insurance")
Feature: Premium Calculation
  As a customer
  I want to see accurate premium calculations
  So that I can understand the cost of insurance

  Background:
    Given customer is on policy quote page
    And policy parameters are entered

  @xray("XR-TC-210")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6 @acceptance-ac7 @acceptance-ac8
  Scenario: Calculate Premium Based on Risk Factors
    Given customer has entered risk factors
    When system calculates premium
    Then AC-1: accurate premium is displayed
    And AC-2: calculation breakdown is shown
    And AC-3: risk factors are clearly explained
    And AC-4: annual and monthly payment options are shown
    And AC-5: tax and additional charges are transparent
    And AC-6: premium is real-time calculated with no delays
    And AC-7: calculation is accurate to 2 decimal places
    And AC-8: premium can be locked for 7 days

  @xray("XR-TC-211")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6
  Scenario: Apply Promotional Discount
    Given premium is calculated
    And customer has promotional code
    When customer enters promotional code
    Then AC-1: promotional discount is applied
    And AC-2: discounted premium is calculated
    And AC-3: discount amount is clearly shown
    And AC-4: discount validity is displayed
    And AC-5: final amount is updated immediately
    And AC-6: discount terms are visible

  @xray("XR-TC-212")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4
  Scenario: Compare Premium Across Policies
    Given customer wants to compare policies
    When customer selects multiple policies
    Then AC-1: side-by-side comparison is shown
    And AC-2: premium differences are highlighted
    And AC-3: coverage differences are displayed
    And AC-4: customer can select best option

  @xray("XR-TC-213")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5
  Scenario: View Premium Payment Schedule
    Given policy premium is calculated
    When customer requests payment schedule
    Then AC-1: payment schedule is displayed
    And AC-2: due dates are clearly shown
    And AC-3: payment amounts are listed
    And AC-4: late payment penalties are documented
    And AC-5: payment schedule can be downloaded as PDF
    And savings amount is highlighted
    And new total is displayed

  Scenario: Family Package Discount
    Given customer is calculating premium for family
    When customer adds family members
    And system recalculates premium
    Then family package discount is applied
    And individual and family premiums are shown
    And savings is calculated and displayed

  Scenario: No Claims Bonus (NCB)
    Given customer is renewing policy
    And customer has no claims history
    When system recalculates premium
    Then No Claims Bonus (NCB) is applied
    And percentage discount is displayed
    And new premium after NCB is shown
    And total savings is highlighted
