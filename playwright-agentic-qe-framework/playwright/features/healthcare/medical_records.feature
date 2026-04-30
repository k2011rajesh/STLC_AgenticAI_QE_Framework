# Healthcare Domain - Medical Records
# Jira Epic: Healthcare Management System
# Jira Feature: Medical Records (HCF-003)
# Jira Story: View Medical Records
# Xray Test Case: HCT-004
# INVEST Score: 80.5/100

Feature: Medical Records Access
  As a doctor
  I want to access patient medical records
  So that I can provide informed medical care

  Background:
    Given doctor is logged into healthcare system
    And doctor has access to patient database

  Scenario: Doctor Views Patient Medical History
    Given doctor selects a patient from patient list
    And patient medical records are available
    When doctor opens patient medical record
    Then complete medical history is displayed
    And previous prescriptions are shown
    And lab results are accessible
    And medications are listed
    And allergies are clearly marked

  Scenario: Medical Records - HIPAA Compliance
    Given patient has HIPAA privacy restrictions
    And doctor without authorization tries to access
    When doctor requests patient medical records
    Then access is denied
    And error message "Access Denied - HIPAA Restrictions" is displayed
    And access denial is logged in audit trail

  Scenario: Add Lab Results to Medical Record
    Given doctor is viewing patient medical record
    And doctor has lab test results
    When doctor uploads lab results
    And doctor enters result date and values
    And doctor confirms upload
    Then lab results are added to medical record
    And patient receives notification of new lab results
    And results appear in patient's online portal

  Scenario: Generate Patient Medical Summary
    Given doctor is viewing patient medical record
    When doctor clicks "Generate Summary" button
    And doctor selects date range
    And doctor confirms summary generation
    Then medical summary document is generated
    And summary can be downloaded as PDF
    And summary includes all relevant medical information
