// Test data fixtures for Banking domain
module.exports = {
  banking: {
    loanApplications: [
      { id: 1, userId: 1, amount: 10000, type: 'personal', status: 'pending' },
      { id: 2, userId: 2, amount: 25000, type: 'home', status: 'approved' }
    ],
    users: [
      { id: 1, name: 'John Doe', income: 50000, creditScore: 750 },
      { id: 2, name: 'Jane Smith', income: 75000, creditScore: 800 }
    ],
    loanStatuses: [
      { id: 1, applicationId: 1, status: 'pending', updatedAt: '2024-01-01' },
      { id: 2, applicationId: 2, status: 'approved', updatedAt: '2024-01-02' }
    ]
  }
};