@regression @healthcare
Feature: Healthcare Domain Regression Suite

  Scenario Outline: Patients register with different health profiles
    Given the user is on the healthcare registration page
    When the user registers with name "<patientName>" age "<age>" and condition "<condition>"
    And selects health plan "<planType>"
    And accepts terms and conditions
    Then patient account should be created successfully
    And confirmation email should be sent to "<email>"

    Examples: Patient Registration Scenarios
      | patientName  | age | condition      | planType  | email                  |
      | Jane Doe     | 35  | None           | premium   | jane@example.com       |
      | Bob Smith    | 50  | Hypertension   | standard  | bob@example.com        |
      | Alice Green  | 28  | Diabetes       | premium   | alice@example.com      |
      | Charlie Brown| 65  | Heart Disease  | standard  | charlie@example.com    |

  Scenario Outline: Patients schedule appointments with different providers
    Given a patient is logged into healthcare portal
    When the patient selects provider "<providerName>" with specialty "<specialty>"
    And books appointment on "<appointmentDate>" at "<appointmentTime>"
    And confirms the appointment
    Then appointment should be confirmed
    And confirmation code "<confirmationCode>" should be generated

    Examples: Appointment Scheduling Scenarios
      | providerName | specialty      | appointmentDate | appointmentTime | confirmationCode |
      | Dr. Smith    | Cardiology     | 2024-02-01      | 10:00 AM        | APT-001          |
      | Dr. Johnson  | Neurology      | 2024-02-05      | 02:00 PM        | APT-002          |
      | Dr. Williams | General        | 2024-02-10      | 09:30 AM        | APT-003          |
      | Dr. Brown    | Orthopedics    | 2024-02-15      | 03:00 PM        | APT-004          |

  Scenario Outline: Medical records access and retrieval
    Given a patient has medical records on file
    When the patient requests records from date "<fromDate>" to "<toDate>"
    And filters by record type "<recordType>"
    Then matching records should be retrieved
    And records should be encrypted and secure

    Examples: Medical Records Scenarios
      | fromDate   | toDate     | recordType      |
      | 2023-01-01 | 2024-01-31 | Lab Results     |
      | 2023-06-01 | 2024-01-31 | Prescriptions   |
      | 2022-01-01 | 2024-01-31 | Visit Notes     |
      | 2023-01-01 | 2024-01-31 | Imaging         |

  Scenario Outline: Prescription refill requests
    Given a patient has active prescriptions
    When the patient requests refill for medication "<medicationName>" with quantity "<quantity>"
    And submits refill request to provider "<providerName>"
    Then refill request should be sent to provider
    And patient should receive confirmation email

    Examples: Prescription Refill Scenarios
      | medicationName | quantity | providerName |
      | Lisinopril     | 30       | Dr. Smith    |
      | Metformin      | 90       | Dr. Johnson  |
      | Atorvastatin   | 60       | Dr. Williams |
      | Aspirin        | 100      | Dr. Brown    |