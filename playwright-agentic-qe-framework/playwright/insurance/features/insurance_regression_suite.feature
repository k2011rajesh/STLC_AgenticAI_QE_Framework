@regression @insurance
Feature: Insurance Domain Regression Suite

  Scenario Outline: User applies for different insurance types
    Given the user is on the insurance application page
    When the user fills application form with "<name>" "<age>" "<income>"
    And selects "<insuranceType>" insurance
    And submits the application
    Then the application should be submitted successfully
    And premium should be calculated as "<expectedPremium>"

    Examples: Insurance Application Scenarios
      | name      | age | income | insuranceType | expectedPremium |
      | John Doe  | 45  | 50000  | retirement    | 200             |
      | Jane Smith| 35  | 60000  | life          | 150             |
      | Bob Brown | 55  | 75000  | retirement    | 280             |
      | Alice Green| 42 | 55000  | term          | 120             |

  Scenario Outline: Users get quotes with various parameters
    Given the user is on the quote page
    When the user enters age "<age>" and income "<income>"
    And requests a quote for "<quoteType>"
    Then a quote should be displayed
    And quote amount should be between "<minQuote>" and "<maxQuote>"

    Examples: Quote Calculation Scenarios
      | age | income | quoteType  | minQuote | maxQuote |
      | 30  | 40000  | basic      | 100      | 150      |
      | 40  | 60000  | standard   | 150      | 250      |
      | 50  | 80000  | premium    | 250      | 400      |
      | 60  | 50000  | basic      | 200      | 300      |

  Scenario Outline: Policy management operations
    Given a user has existing policies
    When the user updates policy with coverage "<coverage>" and deductible "<deductible>"
    And submits the policy update
    Then the policy should be updated successfully
    And updated details should be visible in dashboard

    Examples: Policy Update Scenarios
      | coverage | deductible |
      | 500000   | 1000       |
      | 250000   | 500        |
      | 1000000  | 2000       |
      | 750000   | 1500       |

  Scenario Outline: Payment processing with different methods
    Given a user is ready to make a payment for premium "<premium>"
    When user selects payment method "<paymentMethod>"
    And confirms the payment for "<amount>"
    Then the payment should be processed successfully
    And confirmation should be displayed with transaction "<transactionId>"

    Examples: Payment Scenarios
      | premium | paymentMethod | amount | transactionId |
      | 200     | credit_card   | 200    | TXN-INS-001   |
      | 150     | debit_card    | 150    | TXN-INS-002   |
      | 250     | bank_transfer | 250    | TXN-INS-003   |
      | 300     | credit_card   | 300    | TXN-INS-004   |