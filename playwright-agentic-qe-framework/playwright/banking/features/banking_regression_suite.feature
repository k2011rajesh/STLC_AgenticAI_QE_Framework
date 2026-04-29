@regression @banking
Feature: Banking Domain Regression Suite

  Scenario Outline: Loan applications with different credit profiles
    Given the user is on the loan application page
    When the user applies with income "<income>" and credit score "<creditScore>"
    And requests loan amount "<loanAmount>" for purpose "<purpose>"
    And submits the application
    Then application should be processed
    And eligibility status should be "<eligibilityStatus>"

    Examples: Loan Application Scenarios
      | income | creditScore | loanAmount | purpose              | eligibilityStatus |
      | 50000  | 750         | 10000      | Home Improvement     | Eligible          |
      | 75000  | 800         | 25000      | Debt Consolidation   | Eligible          |
      | 35000  | 650         | 5000       | Personal             | Conditional       |
      | 100000 | 850         | 50000      | Business             | Eligible          |

  Scenario Outline: Credit scoring evaluation
    Given applicant financial profile with income "<income>"
    When system evaluates credit score "<creditScore>" and employment "<employmentStatus>"
    And analyzes debt to income ratio "<debtToIncome>"
    Then credit score should be calculated
    And risk category should be "<riskCategory>"

    Examples: Credit Scoring Scenarios
      | income | creditScore | employmentStatus | debtToIncome | riskCategory |
      | 50000  | 750         | Employed         | 0.35         | Low          |
      | 60000  | 700         | Employed         | 0.45         | Medium       |
      | 40000  | 650         | Self-Employed    | 0.55         | High         |
      | 80000  | 800         | Employed         | 0.25         | Low          |

  Scenario Outline: Loan payment processing
    Given a customer has active loan with monthly payment "<monthlyPayment>"
    When customer makes payment of "<paymentAmount>" via "<paymentMethod>"
    And submits payment on "<paymentDate>"
    Then payment should be processed successfully
    And balance should be reduced by "<paymentAmount>"

    Examples: Payment Processing Scenarios
      | monthlyPayment | paymentAmount | paymentMethod | paymentDate | 
      | 500            | 500           | ACH           | 2024-01-15  |
      | 750            | 750           | Credit Card   | 2024-01-10  |
      | 1000           | 1000          | Bank Transfer | 2024-01-05  |
      | 600            | 600           | ACH           | 2024-01-20  |

  Scenario Outline: Regulatory compliance validation
    Given loan application for amount "<loanAmount>" at rate "<interestRate>"
    When system validates compliance for loan type "<loanType>"
    And checks TILA disclosure requirements
    And validates ATR rules
    Then all compliance checks should pass
    And required disclosures should be "<disclosureStatus>"

    Examples: Compliance Scenarios
      | loanAmount | interestRate | loanType    | disclosureStatus |
      | 10000      | 5.5          | Personal    | Complete         |
      | 25000      | 6.2          | Auto        | Complete         |
      | 15000      | 5.8          | Personal    | Complete         |
      | 50000      | 7.0          | Home        | Complete         |