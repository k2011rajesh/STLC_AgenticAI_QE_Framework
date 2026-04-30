# Healthcare Domain - Regression Suite
# JIRA Stories: QED-101, QED-102, QED-103, QED-104
# Xray Test Plan: XR-TP-001

@jira("QED-101")
@xray-test-plan("XR-TP-001")
@regression 
@healthcare
@domain("healthcare")
Feature: Healthcare Domain Regression Suite

  @xray("XR-TC-102")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6 @acceptance-ac7 @acceptance-ac8
  Scenario Outline: Patients register with different health profiles
    Given the user is on the healthcare registration page
    When the user registers with name "<patientName>" age "<age>" and condition "<condition>"
    And selects health plan "<planType>"
    And accepts terms and conditions
    Then AC-1: patient account should be created successfully
    And AC-2: confirmation email should be sent to "<email>"
    And AC-3: patient ID is assigned
    And AC-4: insurance details are linked
    And AC-5: health profile is recorded
    And AC-6: emergency contact is verified
    And AC-7: medical history is documented
    And AC-8: account status shows "Active"

    Examples: Patient Registration Scenarios
      | patientName  | age | condition      | planType  | email                  |
      | Jane Doe     | 35  | None           | premium   | jane@example.com       |
      | Bob Smith    | 50  | Hypertension   | standard  | bob@example.com        |
      | Alice Green  | 28  | Diabetes       | premium   | alice@example.com      |
      | Charlie Brown| 65  | Heart Disease  | standard  | charlie@example.com    |

  @jira("QED-102")
  @xray("XR-TC-106")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6 @acceptance-ac7
  Scenario Outline: Patients schedule appointments with different providers
    Given a patient is logged into healthcare portal
    When the patient selects provider "<providerName>" with specialty "<specialty>"
    And books appointment on "<appointmentDate>" at "<appointmentTime>"
    And confirms the appointment
    Then AC-1: appointment should be confirmed
    And AC-2: confirmation code "<confirmationCode>" should be generated
    And AC-3: appointment details are displayed
    And AC-4: calendar is updated
    And AC-5: confirmation notification is sent
    And AC-6: pre-appointment questionnaire is sent
    And AC-7: appointment reminder is scheduled

    Examples: Appointment Scheduling Scenarios
      | providerName | specialty      | appointmentDate | appointmentTime | confirmationCode |
      | Dr. Smith    | Cardiology     | 2024-02-01      | 10:00 AM        | APT-001          |
      | Dr. Johnson  | Neurology      | 2024-02-05      | 02:00 PM        | APT-002          |
      | Dr. Williams | General        | 2024-02-10      | 09:30 AM        | APT-003          |
      | Dr. Brown    | Orthopedics    | 2024-02-15      | 03:00 PM        | APT-004          |

  @jira("QED-103")
  @xray("XR-TC-111")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5 @acceptance-ac6
  Scenario Outline: Medical records access and retrieval
    Given a patient has medical records on file
    When the patient requests records from date "<fromDate>" to "<toDate>"
    And filters by record type "<recordType>"
    Then AC-1: matching records should be retrieved
    And AC-2: records should be encrypted and secure
    And AC-3: record count is displayed
    And AC-4: records can be downloaded
    And AC-5: audit trail is logged
    And AC-6: privacy compliance is maintained

    Examples: Medical Records Scenarios
      | fromDate   | toDate     | recordType      |
      | 2023-01-01 | 2024-01-31 | Lab Results     |
      | 2023-06-01 | 2024-01-31 | Prescriptions   |
      | 2022-01-01 | 2024-01-31 | Visit Notes     |
      | 2023-01-01 | 2024-01-31 | Imaging         |

  @jira("QED-104")
  @xray("XR-TC-113")
  @acceptance-ac1 @acceptance-ac2 @acceptance-ac3 @acceptance-ac4 @acceptance-ac5
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