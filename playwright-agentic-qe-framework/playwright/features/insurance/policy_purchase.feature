# Insurance Domain - Policy Purchase
# JIRA Epic: Insurance Management Platform
# JIRA Story: QED-201 (Policy Management)
# Xray Test Plan: XR-TP-001
# INVEST Score: 84.2/100

@jira("QED-201")
@xray-test-plan("XR-TP-001")
@domain("insurance")
Feature: Policy Purchase
  As a customer
  I want to purchase insurance policies
  So that I can get coverage for my needs

  Background:
    Given customer has selected a policy
    And customer is on policy purchase page

  @xray("XR-TC-201")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6 @acceptance-ac7 @acceptance-ac8
  Scenario: Purchase Policy Successfully
    Given policy is displayed with price
    And customer has reviewed policy details
    When customer clicks "Buy Now" button
    And customer enters personal details
    And customer selects payment method
    And customer completes payment
    Then AC-1: payment is processed successfully
    And AC-2: policy is activated immediately
    And AC-3: policy certificate is generated
    And AC-4: confirmation email is sent with policy number
    And AC-5: policy appears in customer account
    And AC-6: policy ID is provided
    And AC-7: coverage starts from today
    And AC-8: customer can download policy document

  @xray("XR-TC-202")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6
  Scenario: Payment Failure and Retry
    Given customer has initiated payment
    And payment gateway is processing payment
    When payment fails with error message
    Then AC-1: error message is displayed to customer
    And AC-2: customer is offered to retry payment
    When customer retries payment with different card
    Then AC-3: payment is successful
    And AC-4: policy is activated
    And AC-5: previous failed transaction is not charged
    And AC-6: confirmation email is sent

  @xray("XR-TC-203")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5
  Scenario: Generate Policy Certificate
    Given policy is successfully purchased
    When customer clicks "Download Certificate"
    Then AC-1: policy certificate PDF is generated
    And AC-2: certificate shows policy number
    And AC-3: certificate shows coverage details
    And AC-4: certificate shows premium amount
    And AC-5: certificate can be downloaded and printed

  @xray("XR-TC-204")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4
  Scenario: Add Beneficiaries During Purchase
    Given customer is purchasing policy
    When customer clicks "Add Beneficiary"
    And customer enters beneficiary details (name, relationship, percentage)
    And customer adds multiple beneficiaries
    Then AC-1: beneficiary details are saved
    And AC-2: total percentage adds up to 100%
    And AC-3: beneficiary information appears in policy
    And AC-4: beneficiaries can be modified later
    And customer enters beneficiary details
    And customer specifies beneficiary relationship
    Then beneficiary is added to policy
    And beneficiary can be updated later
    And family coverage is configured correctly
