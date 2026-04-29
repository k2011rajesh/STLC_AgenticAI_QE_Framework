@regression
Feature: Individual Retirement Insurance Application API

  @smoke
  Scenario: Create insurance application via API
    Given the API endpoint for application creation
    When a POST request is made with valid application data
    Then the response should be 201 Created
    And the response should include application ID

  @regression
  Scenario: Get quote via API
    Given the API endpoint for quotes
    When a GET request is made with user parameters
    Then the response should be 200 OK
    And the response should include quote details

  @regression
  Scenario: Update policy via API
    Given an existing policy
    When a PUT request is made to update policy details
    Then the response should be 200 OK
    And the policy should be updated