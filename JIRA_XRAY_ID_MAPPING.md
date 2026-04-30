# 🔗 JIRA & Xray Test Case ID Mapping

**Project:** STLC_AgenticAI_QE_Framework  
**Generated:** April 29, 2026  
**Status:** ✅ Active for Xray Integration

---

## 📋 Mapping Overview

This document provides complete JIRA Story IDs, Xray Test Case IDs, and Acceptance Criteria mapping for all BDD test cases.

### Naming Conventions

- **JIRA Story Format:** `QED-XXX` (e.g., QED-001, QED-002)
- **Xray Test Case Format:** `XR-TC-XXX` (e.g., XR-TC-001, XR-TC-002)
- **Acceptance Criteria:** AC-1, AC-2, AC-3, etc.

---

## 🏥 Healthcare Domain

### HCFR-001: Patient Registration
| Item | ID | Details |
|------|----|----|
| **JIRA Story** | QED-101 | Patient Registration & Account Creation |
| **Xray Test Cases** | XR-TC-101 to XR-TC-104 | 4 test scenarios |
| **Feature File** | healthcare_ui.feature | Line 5-25 |

**Test Scenarios & Acceptance Criteria:**

1. **Scenario: User registers for healthcare services**
   - **Xray Test Case ID:** XR-TC-101
   - **AC-1:** User navigates to registration page
   - **AC-2:** User enters valid email, password, and personal details
   - **AC-3:** System validates all required fields
   - **AC-4:** Confirmation email is sent to provided email
   - **AC-5:** Account status shows as "Active"

2. **Scenario: Invalid Email Registration**
   - **Xray Test Case ID:** XR-TC-102
   - **AC-1:** User enters invalid email format
   - **AC-2:** System displays email validation error message
   - **AC-3:** Registration is not completed

3. **Scenario: Password Strength Validation**
   - **Xray Test Case ID:** XR-TC-103
   - **AC-1:** User enters weak password (< 8 chars)
   - **AC-2:** Password strength indicator shows red
   - **AC-3:** System prevents weak password submission

4. **Scenario: Duplicate Email Prevention**
   - **Xray Test Case ID:** XR-TC-104
   - **AC-1:** User enters email already registered
   - **AC-2:** System shows "Email already exists" error
   - **AC-3:** Registration is not completed

---

### HCFR-002: Appointment Scheduling
| Item | ID | Details |
|------|----|----|
| **JIRA Story** | QED-102 | Appointment Booking & Management |
| **Xray Test Cases** | XR-TC-105 to XR-TC-108 | 4 test scenarios |
| **Feature File** | healthcare_ui.feature | Line 26-50 |

**Test Scenarios & Acceptance Criteria:**

1. **Scenario: User schedules an appointment**
   - **Xray Test Case ID:** XR-TC-105
   - **AC-1:** User is logged in to healthcare portal
   - **AC-2:** User navigates to appointment booking page
   - **AC-3:** Available doctors and time slots are displayed
   - **AC-4:** User selects doctor and available time slot
   - **AC-5:** Appointment is confirmed and appears in calendar
   - **AC-6:** Confirmation notification is sent

2. **Scenario: Reschedule Appointment**
   - **Xray Test Case ID:** XR-TC-106
   - **AC-1:** User has an existing appointment
   - **AC-2:** User clicks "Reschedule" button
   - **AC-3:** User selects new date and time
   - **AC-4:** Old appointment is cancelled
   - **AC-5:** New appointment is confirmed

3. **Scenario: Cancel Appointment**
   - **Xray Test Case ID:** XR-TC-107
   - **AC-1:** User has a scheduled appointment
   - **AC-2:** User clicks "Cancel" button
   - **AC-3:** Cancellation confirmation is shown
   - **AC-4:** Appointment is removed from calendar

4. **Scenario: View Appointment Details**
   - **Xray Test Case ID:** XR-TC-108
   - **AC-1:** User navigates to appointments page
   - **AC-2:** All scheduled appointments are listed
   - **AC-3:** Each appointment shows doctor, date, time, location
   - **AC-4:** User can click to view full details

---

### HCFR-003: Medical Records Access
| Item | ID | Details |
|------|----|----|
| **JIRA Story** | QED-103 | Secure Medical Records Management |
| **Xray Test Cases** | XR-TC-109 to XR-TC-112 | 4 test scenarios |
| **Feature File** | healthcare_ui.feature | Line 51-75 |

**Test Scenarios & Acceptance Criteria:**

1. **Scenario: User views medical records**
   - **Xray Test Case ID:** XR-TC-109
   - **AC-1:** User is logged in
   - **AC-2:** User accesses medical records section
   - **AC-3:** Health history is displayed in timeline format
   - **AC-4:** Records are secure (encrypted in transit)
   - **AC-5:** User can filter records by date or type

2. **Scenario: Add Lab Results**
   - **Xray Test Case ID:** XR-TC-110
   - **AC-1:** User navigates to lab results section
   - **AC-2:** User can upload new lab result file
   - **AC-3:** System validates file format (PDF, JPG, PNG)
   - **AC-4:** Lab result is added with date and test name

3. **Scenario: Download Medical Summary**
   - **Xray Test Case ID:** XR-TC-111
   - **AC-1:** User selects specific records
   - **AC-2:** User clicks "Generate Summary"
   - **AC-3:** PDF summary is generated
   - **AC-4:** Summary includes all selected records
   - **AC-5:** User can download and print

4. **Scenario: HIPAA Compliance Audit**
   - **Xray Test Case ID:** XR-TC-112
   - **AC-1:** All record access is logged
   - **AC-2:** Audit trail shows who accessed what and when
   - **AC-3:** Only authorized personnel can access records
   - **AC-4:** Records are encrypted at rest

---

### HCNFR-001: Healthcare Performance
| Item | ID | Details |
|------|----|----|
| **JIRA Story** | QED-104 | System Performance & Reliability |
| **Xray Test Cases** | XR-TC-113 to XR-TC-116 | 4 test scenarios |
| **Feature File** | healthcare_api.feature | Line 1-50 |

**Test Scenarios & Acceptance Criteria:**

1. **Scenario: Load Testing - 10k Concurrent Users**
   - **Xray Test Case ID:** XR-TC-113
   - **AC-1:** System handles 10,000 concurrent users
   - **AC-2:** Response time < 200ms for 99% requests
   - **AC-3:** 99.9% uptime maintained
   - **AC-4:** No dropped connections

2. **Scenario: Response Time Monitoring**
   - **Xray Test Case ID:** XR-TC-114
   - **AC-1:** API response time monitored continuously
   - **AC-2:** Alert triggered if response > 300ms
   - **AC-3:** All endpoints respond within threshold

3. **Scenario: Database Failover**
   - **Xray Test Case ID:** XR-TC-115
   - **AC-1:** Primary database fails
   - **AC-2:** Failover to secondary database occurs
   - **AC-3:** Failover completes in < 30 seconds
   - **AC-4:** No data loss or corruption

4. **Scenario: Cache Validation**
   - **Xray Test Case ID:** XR-TC-116
   - **AC-1:** Cache is properly configured
   - **AC-2:** Cache hit rate > 80%
   - **AC-3:** Cache invalidation works correctly
   - **AC-4:** Stale data is not served

---

## 🏢 Insurance Domain

### INFR-001: Policy Management
| Item | ID | Details |
|------|----|----|
| **JIRA Story** | QED-201 | Policy Creation & Management |
| **Xray Test Cases** | XR-TC-201 to XR-TC-204 | 4 test scenarios |
| **Feature File** | policy_purchase.feature | Line 1-60 |

**Test Scenarios & Acceptance Criteria:**

1. **Scenario: Purchase Policy Successfully**
   - **Xray Test Case ID:** XR-TC-201
   - **AC-1:** Policy is displayed with price and coverage details
   - **AC-2:** Customer reviews all policy details
   - **AC-3:** "Buy Now" button is visible and clickable
   - **AC-4:** Payment form accepts customer personal details
   - **AC-5:** Payment is processed successfully
   - **AC-6:** Policy is immediately activated
   - **AC-7:** Policy certificate is generated automatically
   - **AC-8:** Confirmation email is sent with policy number

2. **Scenario: Payment Failure and Retry**
   - **Xray Test Case ID:** XR-TC-202
   - **AC-1:** Payment gateway processes payment
   - **AC-2:** Payment fails with specific error message
   - **AC-3:** "Retry Payment" button is available
   - **AC-4:** Customer can enter different payment method
   - **AC-5:** Retry is successful
   - **AC-6:** Policy is activated after successful payment

3. **Scenario: Generate Policy Certificate**
   - **Xray Test Case ID:** XR-TC-203
   - **AC-1:** Policy is successfully purchased
   - **AC-2:** "Download Certificate" button is available
   - **AC-3:** PDF certificate is generated
   - **AC-4:** Certificate includes policy number, coverage, and premium
   - **AC-5:** Certificate can be downloaded and printed

4. **Scenario: Add Beneficiaries**
   - **Xray Test Case ID:** XR-TC-204
   - **AC-1:** "Add Beneficiary" button is visible during purchase
   - **AC-2:** User can add multiple beneficiaries
   - **AC-3:** Beneficiary details are saved
   - **AC-4:** Beneficiary information appears in policy

---

### INFR-002: Claims Processing
| Item | ID | Details |
|------|----|----|
| **JIRA Story** | QED-202 | Claim Filing & Settlement |
| **Xray Test Cases** | XR-TC-205 to XR-TC-209 | 5 test scenarios |
| **Feature File** | claims.feature | Line 1-80 |

**Test Scenarios & Acceptance Criteria:**

1. **Scenario: File New Claim**
   - **Xray Test Case ID:** XR-TC-205
   - **AC-1:** User navigates to claims section
   - **AC-2:** "File New Claim" button is visible
   - **AC-3:** Claim form displays all required fields
   - **AC-4:** User enters claim details and uploads documents
   - **AC-5:** Claim is submitted successfully
   - **AC-6:** Claim reference number is generated

2. **Scenario: Claim Status Tracking**
   - **Xray Test Case ID:** XR-TC-206
   - **AC-1:** User can view claim status
   - **AC-2:** Status shows: Submitted → Under Review → Approved/Rejected
   - **AC-3:** Timeline shows when each status was updated
   - **AC-4:** Estimated settlement date is displayed

3. **Scenario: Document Upload for Claim**
   - **Xray Test Case ID:** XR-TC-207
   - **AC-1:** Multiple document types are supported (PDF, JPG, PNG)
   - **AC-2:** File size limit is enforced (max 10MB)
   - **AC-3:** Uploaded documents are scanned for viruses
   - **AC-4:** Document upload confirmation is shown

4. **Scenario: Claim Approval Notification**
   - **Xray Test Case ID:** XR-TC-208
   - **AC-1:** Approved claim triggers notification
   - **AC-2:** Email notification includes settlement amount
   - **AC-3:** SMS notification is sent (if opted)
   - **AC-4:** In-app notification appears

5. **Scenario: Claim Rejection Appeal**
   - **Xray Test Case ID:** XR-TC-209
   - **AC-1:** Rejected claim shows rejection reason
   - **AC-2:** User can file appeal
   - **AC-3:** Appeal form requires supporting documents
   - **AC-4:** Appeal is reviewed by manager

---

### INFR-003: Premium Calculation
| Item | ID | Details |
|------|----|----|
| **JIRA Story** | QED-203 | Dynamic Premium Pricing |
| **Xray Test Cases** | XR-TC-210 to XR-TC-213 | 4 test scenarios |
| **Feature File** | premium_calculation.feature | Line 1-60 |

**Test Scenarios & Acceptance Criteria:**

1. **Scenario: Get Quote Based on Personal Details**
   - **Xray Test Case ID:** XR-TC-210
   - **AC-1:** Quote page displays input fields for age, income, health
   - **AC-2:** User enters personal details
   - **AC-3:** Premium is calculated based on risk assessment
   - **AC-4:** Quote is displayed with breakdown of costs

2. **Scenario: Apply Discount Code**
   - **Xray Test Case ID:** XR-TC-211
   - **AC-1:** Discount code field is visible
   - **AC-2:** Valid discount code is applied
   - **AC-3:** Premium is reduced accordingly
   - **AC-4:** Discount details are shown

3. **Scenario: Compare Multiple Plans**
   - **Xray Test Case ID:** XR-TC-212
   - **AC-1:** Multiple plan options are displayed
   - **AC-2:** Each plan shows coverage and premium
   - **AC-3:** User can compare side-by-side
   - **AC-4:** Recommendation engine suggests best plan

4. **Scenario: Premium Adjustment for Pre-existing Conditions**
   - **Xray Test Case ID:** XR-TC-213
   - **AC-1:** Pre-existing condition disclosure question appears
   - **AC-2:** Premium is adjusted based on condition severity
   - **AC-3:** Adjustment factor is clearly shown
   - **AC-4:** Updated premium is recalculated

---

### INFR-004: Policy Renewal
| Item | ID | Details |
|------|----|----|
| **JIRA Story** | QED-204 | Automated Policy Renewal |
| **Xray Test Cases** | XR-TC-214 to XR-TC-216 | 3 test scenarios |
| **Feature File** | policy_search.feature | Line 1-50 |

**Test Scenarios & Acceptance Criteria:**

1. **Scenario: Automatic Renewal Reminder**
   - **Xray Test Case ID:** XR-TC-214
   - **AC-1:** 30 days before expiry, renewal reminder is sent
   - **AC-2:** Email contains renewal link and new premium
   - **AC-3:** SMS reminder is sent (if opted)
   - **AC-4:** In-app notification appears on dashboard

2. **Scenario: Manual Policy Renewal**
   - **Xray Test Case ID:** XR-TC-215
   - **AC-1:** User navigates to renewal section
   - **AC-2:** New premium is calculated
   - **AC-3:** User reviews and confirms renewal terms
   - **AC-4:** Payment is processed
   - **AC-5:** Renewal confirmation is sent

3. **Scenario: Policy Modification During Renewal**
   - **Xray Test Case ID:** XR-TC-216
   - **AC-1:** User can modify coverage during renewal
   - **AC-2:** Premium is recalculated based on changes
   - **AC-3:** Updated terms are displayed for review
   - **AC-4:** Changes are effective from renewal date

---

### INFNFR-001: Insurance Performance
| Item | ID | Details |
|------|----|----|
| **JIRA Story** | QED-205 | System Scalability & Performance |
| **Xray Test Cases** | XR-TC-217 to XR-TC-220 | 4 test scenarios |
| **Feature File** | claims.feature (Performance section) | Line 100+ |

**Test Scenarios & Acceptance Criteria:**

1. **Scenario: Load Test - Peak Hour Traffic**
   - **Xray Test Case ID:** XR-TC-217
   - **AC-1:** System handles 5,000 concurrent users during peak hours
   - **AC-2:** Page load time < 2 seconds
   - **AC-3:** No requests timeout
   - **AC-4:** User experience remains consistent

2. **Scenario: Database Query Performance**
   - **Xray Test Case ID:** XR-TC-218
   - **AC-1:** Policy search completes in < 500ms
   - **AC-2:** Claim listing loads in < 1 second
   - **AC-3:** Complex queries use proper indexing
   - **AC-4:** Query optimization is effective

3. **Scenario: API Rate Limiting**
   - **Xray Test Case ID:** XR-TC-219
   - **AC-1:** API rate limit is enforced (1000 req/min per user)
   - **AC-2:** Exceeding limit returns 429 status
   - **AC-3:** Rate limit headers are returned
   - **AC-4:** User is informed of reset time

4. **Scenario: Session Management Under Load**
   - **Xray Test Case ID:** XR-TC-220
   - **AC-1:** Sessions remain valid under high load
   - **AC-2:** Concurrent session limit is enforced (max 3 per user)
   - **AC-3:** Idle sessions timeout after 30 minutes
   - **AC-4:** Session data is not corrupted

---

## 🏦 Banking Domain

### BFR-001: User Registration
| Item | ID | Details |
|------|----|----|
| **JIRA Story** | QED-301 | Banking Account Registration |
| **Xray Test Cases** | XR-TC-301 to XR-TC-304 | 4 test scenarios |
| **Feature File** | banking_ui.feature | Line 1-50 |

**Test Scenarios & Acceptance Criteria:**

1. **Scenario: Successful Registration**
   - **Xray Test Case ID:** XR-TC-301
   - **AC-1:** Registration page displays all required fields
   - **AC-2:** User enters valid details (name, email, phone, password)
   - **AC-3:** System validates all inputs
   - **AC-4:** OTP is sent to registered email/phone
   - **AC-5:** User verifies OTP
   - **AC-6:** Account is created and activated
   - **AC-7:** Confirmation email is sent

2. **Scenario: Existing Account Prevention**
   - **Xray Test Case ID:** XR-TC-302
   - **AC-1:** User enters email that already exists
   - **AC-2:** Error message shows "Email already registered"
   - **AC-3:** Registration is prevented
   - **AC-4:** Link to login page is provided

3. **Scenario: Password Security Requirements**
   - **Xray Test Case ID:** XR-TC-303
   - **AC-1:** Password must be 8+ characters
   - **AC-2:** Password must contain uppercase letter
   - **AC-3:** Password must contain number
   - **AC-4:** Password must contain special character
   - **AC-5:** Real-time validation feedback is shown

4. **Scenario: KYC Verification**
   - **Xray Test Case ID:** XR-TC-304
   - **AC-1:** User uploads identity proof (Aadhaar/PAN)
   - **AC-2:** System verifies document authenticity
   - **AC-3:** KYC status shows "Verified" or "Under Review"
   - **AC-4:** Limited transactions allowed until KYC is complete

---

### BFR-002: User Login
| Item | ID | Details |
|------|----|----|
| **JIRA Story** | QED-302 | Secure User Authentication |
| **Xray Test Cases** | XR-TC-305 to XR-TC-308 | 4 test scenarios |
| **Feature File** | banking_ui.feature | Line 51-100 |

**Test Scenarios & Acceptance Criteria:**

1. **Scenario: Successful Login**
   - **Xray Test Case ID:** XR-TC-305
   - **AC-1:** User enters valid email and password
   - **AC-2:** System verifies credentials
   - **AC-3:** Two-factor authentication prompt appears
   - **AC-4:** User enters OTP from authenticator app
   - **AC-5:** User is logged in and dashboard is displayed

2. **Scenario: Invalid Credentials**
   - **Xray Test Case ID:** XR-TC-306
   - **AC-1:** User enters incorrect password
   - **AC-2:** Error message appears after 3 attempts
   - **AC-3:** Account lock warning is shown
   - **AC-4:** "Forgot Password" link is provided

3. **Scenario: Account Lockout Prevention**
   - **Xray Test Case ID:** XR-TC-307
   - **AC-1:** 5 failed login attempts lock account
   - **AC-2:** User receives email notification
   - **AC-3:** Account remains locked for 24 hours
   - **AC-4:** User can unlock via email verification

4. **Scenario: Biometric Login (if supported)**
   - **Xray Test Case ID:** XR-TC-308
   - **AC-1:** User can enable fingerprint/face login
   - **AC-2:** Biometric data is securely stored
   - **AC-3:** Login via biometric works seamlessly
   - **AC-4:** Fallback to password is available

---

## 📊 Summary Statistics

| Domain | Stories | Test Cases | Scenarios |
|--------|---------|-----------|-----------|
| **Healthcare** | 4 (QED-101 to QED-104) | 16 (XR-TC-101 to XR-TC-116) | 16 |
| **Insurance** | 5 (QED-201 to QED-205) | 20 (XR-TC-201 to XR-TC-220) | 20 |
| **Banking** | 2 (QED-301 to QED-302) | 8 (XR-TC-301 to XR-TC-308) | 8 |
| **TOTAL** | **11** | **44** | **44** |

---

## 🔗 Integration with Xray

### Xray Test Plan: XR-TP-001
- **Name:** STLC AgenticAI QE Framework - BDD Master Test Plan
- **Status:** Active
- **Test Cycles:** 
  - XR-TC-001: Healthcare Cycle
  - XR-TC-002: Insurance Cycle
  - XR-TC-003: Banking Cycle

### Xray Test Execution
1. Import test cases into Xray via Cucumber feature files
2. Tag mapping: `@xray("XR-TC-XXX")`
3. Acceptance criteria linked via scenario names
4. Results auto-uploaded after test execution
5. Dashboard shows real-time coverage metrics

---

## 📝 Feature File Tagging Convention

All feature files should include:

```gherkin
@jira("QED-XXX")
@xray("XR-TC-XXX")
@domain("healthcare|insurance|banking")
Feature: Feature Name
  Description

  @acceptance-ac1
  @acceptance-ac2
  Scenario: Scenario Name
    Given AC-1: Precondition
    When AC-2: Action
    Then AC-3: Expected result
```

---

## ✅ Implementation Checklist

- [x] JIRA Stories created for each requirement
- [x] Xray Test Cases mapped to scenarios
- [x] Acceptance Criteria numbered
- [x] Feature files tagged with IDs
- [x] Mapping document created
- [x] Ready for Xray import
- [ ] Execute in Xray and track results
- [ ] Generate coverage reports

---

**Document Version:** 1.0  
**Last Updated:** April 29, 2026  
**Status:** ✅ Ready for Xray Integration

