// Test data fixtures for Insurance domain
module.exports = {
  insurance: {
    users: [
      { id: 1, name: 'John Doe', age: 45, income: 50000 },
      { id: 2, name: 'Jane Smith', age: 35, income: 60000 }
    ],
    policies: [
      { id: 1, userId: 1, type: 'retirement', premium: 200 },
      { id: 2, userId: 2, type: 'life', premium: 150 }
    ],
    quotes: [
      { age: 45, income: 50000, premium: 200 },
      { age: 35, income: 60000, premium: 180 }
    ]
  }
};