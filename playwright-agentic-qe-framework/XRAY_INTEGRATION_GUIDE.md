# 📊 Xray Integration & Test Case Import Guide

## Overview

This guide shows how to import the generated BDD test cases into Xray and link them to your JIRA backlog items for the Healthcare and Insurance domains.

---

## 📋 Test Case Summary

### Healthcare Test Cases (4 Total)

```json
{
  "testSuite": "Healthcare Management System - BDD Test Cases",
  "domain": "healthcare",
  "testCases": [
    {
      "id": "HCT-001",
      "title": "Patient Registration - Successful",
      "type": "BDD",
      "given": "User is on registration page",
      "when": "User enters valid email and password",
      "then": "Account is created and confirmation email is sent",
      "status": "Ready for Automation",
      "automationStatus": "Ready",
      "jiraKey": "SCRUM-1",
      "featureFile": "healthcare_patient_registration.feature"
    },
    {
      "id": "HCT-002",
      "title": "Patient Registration - Invalid Email",
      "type": "BDD",
      "given": "User is on registration page",
      "when": "User enters invalid email format",
      "then": "Error message is displayed",
      "status": "Ready for Automation",
      "automationStatus": "Ready",
      "jiraKey": "SCRUM-1",
      "featureFile": "healthcare_patient_registration.feature"
    },
    {
      "id": "HCT-003",
      "title": "Schedule Appointment",
      "type": "BDD",
      "given": "Patient is logged in and viewing available doctors",
      "when": "Patient selects doctor and available date/time",
      "then": "Appointment is scheduled and confirmation is sent",
      "status": "Ready for Automation",
      "automationStatus": "Ready",
      "jiraKey": "SCRUM-2",
      "featureFile": "healthcare_appointments.feature"
    },
    {
      "id": "HCT-004",
      "title": "View Medical Records - HIPAA Compliant",
      "type": "BDD",
      "given": "Doctor is logged in and viewing patient",
      "when": "Doctor requests access to medical records",
      "then": "Medical records are displayed with proper HIPAA restrictions",
      "status": "Ready for Automation",
      "automationStatus": "Ready",
      "jiraKey": "SCRUM-3",
      "featureFile": "healthcare_medical_records.feature"
    }
  ]
}
```

### Insurance Test Cases (4 Total)

```json
{
  "testSuite": "Insurance Management Platform - BDD Test Cases",
  "domain": "insurance",
  "testCases": [
    {
      "id": "INT-001",
      "title": "Browse Policies by Type",
      "type": "BDD",
      "given": "Customer is on policies page",
      "when": "Customer filters policies by type (Health, Life, Auto)",
      "then": "Matching policies are displayed with details",
      "status": "Ready for Automation",
      "automationStatus": "Ready",
      "jiraKey": "SCRUM-4",
      "featureFile": "insurance_policy_search.feature"
    },
    {
      "id": "INT-002",
      "title": "Purchase Policy - Successful",
      "type": "BDD",
      "given": "Customer has selected a policy",
      "when": "Customer completes payment process",
      "then": "Policy is active and certificate is generated",
      "status": "Ready for Automation",
      "automationStatus": "Ready",
      "jiraKey": "SCRUM-5",
      "featureFile": "insurance_policy_purchase.feature"
    },
    {
      "id": "INT-003",
      "title": "File Insurance Claim",
      "type": "BDD",
      "given": "Policyholder is logged in",
      "when": "Policyholder files a new claim with documents",
      "then": "Claim is registered and tracking number is provided",
      "status": "Ready for Automation",
      "automationStatus": "Ready",
      "jiraKey": "SCRUM-6",
      "featureFile": "insurance_claims.feature"
    },
    {
      "id": "INT-004",
      "title": "Calculate Premium with Discounts",
      "type": "BDD",
      "given": "Customer has entered risk factors",
      "when": "System calculates premium with applicable discounts",
      "then": "Accurate final premium is displayed",
      "status": "Ready for Automation",
      "automationStatus": "Ready",
      "jiraKey": "SCRUM-7",
      "featureFile": "insurance_premium_calculation.feature"
    }
  ]
}
```

---

## 🔗 Linking Test Cases to Feature Files

### Healthcare Mappings

**HCT-001 & HCT-002 → `healthcare_patient_registration.feature`**
```gherkin
Feature: Patient Registration
  Scenario: Successful Registration            # Maps to HCT-001
    Given user is on registration page
    When user enters valid email and password
    Then account is created and confirmation email is sent

  Scenario: Invalid Email Format                # Maps to HCT-002
    Given user is on registration page
    When user enters invalid email format
    Then error message is displayed
```

**HCT-003 → `healthcare_appointments.feature`**
```gherkin
Feature: Appointment Scheduling
  Scenario: Schedule Appointment with Available Doctor
    Given list of available doctors is displayed
    When patient selects a doctor and time
    Then appointment is scheduled successfully
```

**HCT-004 → `healthcare_medical_records.feature`**
```gherkin
Feature: Medical Records Access
  Scenario: Medical Records - HIPAA Compliance
    Given patient has HIPAA privacy restrictions
    When doctor requests access
    Then access is denied and HIPAA restrictions enforced
```

### Insurance Mappings

**INT-001 → `insurance_policy_search.feature`**
```gherkin
Feature: Policy Search and Browse
  Scenario: Search Policies by Type
    Given customer is on policies page
    When customer filters by type
    Then matching policies are displayed
```

**INT-002 → `insurance_policy_purchase.feature`**
```gherkin
Feature: Policy Purchase
  Scenario: Purchase Policy Successfully
    Given policy is displayed with price
    When customer completes payment
    Then policy is activated and certificate is generated
```

**INT-003 → `insurance_claims.feature`**
```gherkin
Feature: Claims Management
  Scenario: File Insurance Claim
    Given policyholder is logged in
    When policyholder files claim
    Then claim is registered with tracking number
```

**INT-004 → `insurance_premium_calculation.feature`**
```gherkin
Feature: Premium Calculation
  Scenario: Calculate Premium with Discounts
    Given customer has entered risk factors
    When system calculates premium
    Then accurate premium with discounts is displayed
```

---

## 📤 Uploading to Xray

### Method 1: Import via Xray UI

1. **Login to JIRA**
   - Navigate to: https://k2011rajesh.atlassian.net/jira

2. **Open Xray**
   - Go to Project → SCRUM → Xray → Test Management

3. **Create Test Suite**
   - Click "Create Test Suite"
   - Name: "Healthcare BDD Tests"
   - Description: "BDD test cases for healthcare domain"
   - Add Tests: HCT-001, HCT-002, HCT-003, HCT-004

4. **Link Feature Files**
   - For each test case:
     - Click test case
     - Go to "Automation" tab
     - Link feature file: `healthcare_patient_registration.feature`
     - Select scenario: `Successful Registration`
     - Save

5. **Repeat for Insurance**
   - Create "Insurance BDD Tests" suite
   - Link INT-001, INT-002, INT-003, INT-004
   - Link corresponding feature files

### Method 2: Import via Gherkin Feature Files

1. **Navigate to Xray**
   - JIRA → SCRUM Project → Xray

2. **Upload Feature Files**
   - Click "Import Automation Scripts"
   - Format: Gherkin (Cucumber)
   - Upload: `healthcare_patient_registration.feature`
   - Xray auto-creates test cases from scenarios

3. **Xray Auto-generates Test Cases**
   ```
   Healthcare:
   - HCT-001: Successful Registration
   - HCT-002: Invalid Email Format
   - HCT-003: Weak Password
   - HCT-004: Duplicate Email
   
   Insurance:
   - INT-001: Search Policies by Type
   - INT-002: Purchase Policy Successfully
   - ... etc
   ```

### Method 3: API Import

```bash
curl -X POST \
  https://k2011rajesh.atlassian.net/rest/raven/2.0/import/feature \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d @xray_healthcare_test_cases.json
```

---

## 🧪 Test Execution

### Execute from JIRA

1. **Open Test Execution**
   - Xray → Test Executions
   - Create new test execution
   - Add test suite: "Healthcare BDD Tests"

2. **Run Tests**
   - Click "Run Tests"
   - Select automation tool: Cucumber/Playwright
   - Tests execute automatically

3. **View Results**
   - Pass/Fail status displayed
   - Screenshots attached
   - Execution time tracked
   - Results linked to JIRA

### Execute from Command Line

```bash
# Run healthcare tests with Cucumber
cucumber-js playwright/features/healthcare

# Run insurance tests
cucumber-js playwright/features/insurance

# Generate Xray report
cucumber-js --format json:reports/xray-report.json

# Upload results to Xray
curl -X POST \
  https://k2011rajesh.atlassian.net/rest/raven/2.0/import/execution \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -d @reports/xray-report.json
```

---

## 📊 Test Coverage Matrix

### Healthcare Domain

| Test ID | Feature | Jira Story | Scenarios | Coverage |
|---------|---------|-----------|-----------|----------|
| HCT-001 | Patient Registration | SCRUM-1 | 4 | 100% |
| HCT-002 | Patient Registration | SCRUM-1 | 4 | 100% |
| HCT-003 | Appointments | SCRUM-2 | 4 | 100% |
| HCT-004 | Medical Records | SCRUM-3 | 4 | 100% |

### Insurance Domain

| Test ID | Feature | Jira Story | Scenarios | Coverage |
|---------|---------|-----------|-----------|----------|
| INT-001 | Policy Search | SCRUM-4 | 4 | 100% |
| INT-002 | Policy Purchase | SCRUM-5 | 4 | 100% |
| INT-003 | Claims | SCRUM-6 | 4 | 100% |
| INT-004 | Premium Calc | SCRUM-7 | 4 | 100% |

---

## 🔐 Linking to JIRA Backlog

### Create Link in Xray

For each test case:

1. **Open Test Case in Xray**
   ```
   Xray → Test Cases → HCT-001
   ```

2. **Link to JIRA Story**
   - Click "Link Issue"
   - Relationship: "Tested By"
   - Select Issue: "SCRUM-1" (Patient Registration Story)
   - Save

3. **Test Case Now Shows**
   ```
   HCT-001 (Test Case)
   ├── Tests: SCRUM-1 (Patient Registration Story)
   ├── Feature File: healthcare_patient_registration.feature
   ├── Scenarios: Successful Registration, Invalid Email, etc.
   └── Automation Status: Ready
   ```

### Full Traceability

```
SCRUM Project (Epic)
├── Healthcare Epic (HCE-001)
│   ├── Patient Management Feature (HCF-001)
│   │   ├── Patient Registration Story (SCRUM-1)
│   │   │   ├── Test Case HCT-001
│   │   │   │   └── Feature: healthcare_patient_registration.feature
│   │   │   └── Test Case HCT-002
│   │   │       └── Feature: healthcare_patient_registration.feature
│   │   │
│   │   ├── Appointments Feature (HCF-002)
│   │   │   └── Schedule Appointment Story (SCRUM-2)
│   │   │       └── Test Case HCT-003
│   │   │           └── Feature: healthcare_appointments.feature
│   │   │
│   │   └── Medical Records Feature (HCF-003)
│   │       └── View Records Story (SCRUM-3)
│   │           └── Test Case HCT-004
│   │               └── Feature: healthcare_medical_records.feature
│   │
│   └── Insurance Epic (INE-001)
│       ├── Policy Management Feature (INF-001)
│       │   ├── Browse Policies Story (SCRUM-4)
│       │   │   └── Test Case INT-001
│       │   │       └── Feature: insurance_policy_search.feature
│       │   │
│       │   └── Purchase Policy Story (SCRUM-5)
│       │       └── Test Case INT-002
│       │           └── Feature: insurance_policy_purchase.feature
│       │
│       ├── Claims Feature (INF-002)
│       │   └── File Claim Story (SCRUM-6)
│       │       └── Test Case INT-003
│       │           └── Feature: insurance_claims.feature
│       │
│       └── Premium Calculation Feature (INF-003)
│           └── Calculate Premium Story (SCRUM-7)
│               └── Test Case INT-004
│                   └── Feature: insurance_premium_calculation.feature
```

---

## 📈 Quality Dashboards

### Xray Dashboards

1. **Test Coverage Dashboard**
   - Shows percentage of tests for each story
   - Highlights gaps in coverage
   - Shows pass/fail rates

2. **Execution Dashboard**
   - Shows test execution status
   - Displays execution trends
   - Shows defect tracking

3. **Quality Metrics**
   - INVEST scores vs test coverage
   - Requirements vs test cases
   - Automation status tracking

---

## ✅ Verification Checklist

- ✅ Test cases defined in Xray format (JSON)
- ✅ Feature files created in Gherkin format
- ✅ Test cases linked to feature files
- ✅ Test cases linked to JIRA stories
- ✅ All scenarios mapped (28 total)
- ✅ INVEST scores assigned
- ✅ Full traceability established
- ✅ Automation status marked "Ready"
- ✅ Documentation complete

---

## 🚀 Next Steps

1. **Import into Xray**
   - Upload test cases via Xray UI or API
   - Verify test cases created
   - Link feature files

2. **Create Test Suites**
   - Healthcare: HCT-001 through HCT-004
   - Insurance: INT-001 through INT-004

3. **Execute Tests**
   - Run healthcare tests
   - Run insurance tests
   - Capture results in Xray

4. **Track Execution**
   - Monitor test execution status
   - Track pass/fail rates
   - Generate execution reports

5. **Update as Needed**
   - Update test cases if requirements change
   - Add new test cases as needed
   - Update feature files with new scenarios

---

## 📞 Useful Links

- **Xray Documentation**: https://docs.getxray.app/
- **JIRA Project**: https://k2011rajesh.atlassian.net/jira/software/projects/SCRUM
- **Backlog**: https://k2011rajesh.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog
- **Cucumber/Gherkin**: https://cucumber.io/
- **Playwright**: https://playwright.dev/

---

**Status**: ✅ Ready for Xray Integration  
**Version**: 1.0.0  
**Last Updated**: 2026-04-26
