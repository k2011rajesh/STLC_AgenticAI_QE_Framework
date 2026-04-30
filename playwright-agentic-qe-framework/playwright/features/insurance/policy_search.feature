# Insurance Domain - Policy Search and Browse
# JIRA Story: QED-201 (Policy Management)
# Xray Test Plan: XR-TP-001
# INVEST Score: 83.4/100

@jira("QED-201")
@xray-test-plan("XR-TP-001")
@domain("insurance")
Feature: Policy Search and Browse
  As a customer
  I want to search and browse insurance policies
  So that I can find policies that meet my needs

  Background:
    Given customer is on insurance portal
    And policy search page is loaded

  @xray("XR-TC-201")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6 @acceptance-ac7
  Scenario: Search Policies by Type
    Given list of policy types is available (Health, Life, Auto, Home)
    When customer selects policy type "Health"
    Then AC-1: health insurance policies are displayed
    And AC-2: each policy shows coverage details
    And AC-3: premium prices are visible
    And AC-4: rating and reviews are shown
    And AC-5: search filters are applied
    And AC-6: total results count is displayed
    And AC-7: results can be sorted by price, rating, or relevance

  @xray("XR-TC-202")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6
  Scenario: Filter Policies by Premium Range
    Given policies are displayed on search page
    When customer sets minimum premium "500"
    And customer sets maximum premium "2000"
    Then AC-1: only policies within range are shown
    And AC-2: policies are sorted by premium
    And AC-3: filter is visible in active filters section
    And AC-4: filter can be easily cleared
    And AC-5: results update in real-time
    And AC-6: comparison tool is available
    And number of matching policies is displayed

  Scenario: View Policy Details
    Given list of policies is displayed
    When customer clicks on a policy
    Then policy details page opens
    And coverage benefits are listed
    And exclusions are clearly mentioned
    And premium and payment options are shown
    And customer can read detailed policy document

  Scenario: Compare Multiple Policies
    Given customer is viewing policy list
    When customer selects multiple policies for comparison
    And customer clicks "Compare" button
    Then comparison page opens
    And features of selected policies are compared side-by-side
    And price differences are highlighted
    And customer can easily identify differences
