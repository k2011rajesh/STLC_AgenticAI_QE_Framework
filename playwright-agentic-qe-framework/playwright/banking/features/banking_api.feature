@regression
Feature: Banking Loan Application API

  @smoke
  Scenario: Submit loan application via API
    Given the API endpoint for loan application
    When a POST request is made with loan application data
    Then the response should be 201 Created
    And application ID should be returned

  @regression
  Scenario: Check loan eligibility via API
    Given the API endpoint for eligibility check
    When a POST request is made with applicant data
    Then the response should be 200 OK
    And eligibility result should be returned

  @regression
  Scenario: Get loan application status via API
    Given an existing loan application
    When a GET request is made for application status
    Then the response should be 200 OK
    And current status should be returned