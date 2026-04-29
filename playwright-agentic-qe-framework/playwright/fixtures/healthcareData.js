// Test data fixtures for Healthcare domain
module.exports = {
  healthcare: {
    patients: [
      { id: 1, name: 'Jane Doe', age: 35, medicalHistory: 'None' },
      { id: 2, name: 'Bob Johnson', age: 50, medicalHistory: 'Hypertension' }
    ],
    appointments: [
      { id: 1, patientId: 1, doctor: 'Dr. Smith', time: '10:00 AM', status: 'confirmed' },
      { id: 2, patientId: 2, doctor: 'Dr. Brown', time: '2:00 PM', status: 'pending' }
    ],
    medicalRecords: [
      { id: 1, patientId: 1, diagnosis: 'Healthy', date: '2024-01-01' },
      { id: 2, patientId: 2, diagnosis: 'Hypertension', date: '2024-02-01' }
    ]
  }
};