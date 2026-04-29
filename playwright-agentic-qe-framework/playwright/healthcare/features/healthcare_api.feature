@regression
Feature: Healthcare Application API

  @smoke
  Scenario: Create patient record via API
    Given the API endpoint for patient creation
    When a POST request is made with patient data
    Then the response should be 201 Created
    And patient ID should be returned

  @regression
  Scenario: Get appointment details via API
    Given an existing appointment
    When a GET request is made for appointment details
    Then the response should be 200 OK
    And appointment information should be returned

  @regression
  Scenario: Update patient information via API
    Given an existing patient record
    When a PUT request is made to update patient data
    Then the response should be 200 OK
    And patient record should be updated