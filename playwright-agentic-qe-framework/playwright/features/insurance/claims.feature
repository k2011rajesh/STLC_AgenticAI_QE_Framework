# Insurance Domain - Claims Processing
# JIRA Story: QED-202 (Claims Processing)
# Xray Test Plan: XR-TP-001
# INVEST Score: 82.8/100

@jira("QED-202")
@xray-test-plan("XR-TP-001")
@domain("insurance")
Feature: Claims Management
  As a policyholder
  I want to file and track insurance claims
  So that I can get reimbursement for covered expenses

  Background:
    Given policyholder is logged into insurance portal
    And policyholder has active policy

  @xray("XR-TC-205")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6 @acceptance-ac7 @acceptance-ac8
  Scenario: File Insurance Claim
    Given policyholder is on claims page
    When policyholder clicks "File New Claim"
    And policyholder enters claim details
    And policyholder uploads supporting documents
    And policyholder submits claim
    Then AC-1: claim is registered in system
    And AC-2: unique claim number is generated
    And AC-3: claim confirmation email is sent
    And AC-4: claim appears in policyholder's claim history
    And AC-5: claim status shows as "Submitted"
    And AC-6: estimated processing date is provided
    And AC-7: next steps are clearly communicated
    And AC-8: claim can be viewed by authorized parties only

  @xray("XR-TC-206")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6
  Scenario: Track Claim Status
    Given policyholder has filed a claim
    And claim is in processing
    When policyholder views claim status
    Then AC-1: current claim status is displayed
    And AC-2: claim progress is shown visually (progress bar)
    And AC-3: estimated processing time is provided
    And AC-4: policyholder can view claim documents
    And AC-5: status history is available
    And AC-6: notification settings can be configured

  @xray("XR-TC-207")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6 @acceptance-ac7 @acceptance-ac8
  Scenario: Claim Approved and Payout
    Given claim is submitted and reviewed
    When claim is approved by claims officer
    Then AC-1: claim status changes to "Approved"
    And AC-2: payout amount is calculated and displayed
    And AC-3: payout notification is sent to policyholder
    And AC-4: funds are transferred within promised timeframe
    And AC-5: transaction confirmation is provided
    And AC-6: settlement details are available in account
    And AC-7: receipt can be downloaded
    And AC-8: claim closure notification is sent

  @xray("XR-TC-208")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5
  Scenario: Claim Rejection with Reason
    Given claim is submitted and reviewed
    When claim does not meet coverage criteria
    Then AC-1: claim status changes to "Rejected"
    And AC-2: rejection reason is clearly stated
    And AC-3: policy clause reference is provided
    And AC-4: appeal process information is provided
    And AC-5: policyholder can request review or appeal

  @xray("XR-TC-209")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4
  Scenario: Claim Appeal Process
    Given claim is rejected
    When policyholder files an appeal
    And policyholder provides additional documentation
    And appeal is submitted
    Then AC-1: appeal is registered in system
    And AC-2: appeal reference number is provided
    And AC-3: appeal is forwarded to senior claims officer
    And AC-4: appeals decision timeline is communicated
    And policyholder is notified via email
    And policyholder can appeal the decision
    And appeal process is explained
