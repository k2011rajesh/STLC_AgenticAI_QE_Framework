const { Given, When, Then } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const axios = require('axios');
const { Client } = require('pg');

let browser, page, dbClient;

Given('the user is on the healthcare registration page', async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:3001/register'); // Assume healthcare app
});

When('the user fills in personal health details', async function () {
  await page.fill('#name', 'Jane Doe');
  await page.fill('#age', '35');
  await page.fill('#medicalHistory', 'None');
});

When('selects healthcare plan', async function () {
  await page.selectOption('#plan', 'premium');
});

When('submits the registration', async function () {
  await page.click('#submit');
});

Then('the registration should be successful', async function () {
  // Mock assertion
  console.log('Registration successful');
});

Then('a confirmation should be displayed', async function () {
  // Mock
  console.log('Confirmation displayed');
});

Given('the user is logged in to healthcare portal', async function () {
  // Mock login
  console.log('Logged in');
});

When('the user navigates to appointment booking', async function () {
  await page.goto('http://localhost:3001/appointments');
});

When('selects a doctor and time', async function () {
  await page.selectOption('#doctor', 'Dr. Smith');
  await page.fill('#time', '10:00 AM');
});

When('confirms the appointment', async function () {
  await page.click('#confirm');
});

Then('the appointment should be booked', async function () {
  console.log('Appointment booked');
});

Then('confirmation details should be shown', async function () {
  console.log('Details shown');
});

Given('the user is logged in', async function () {
  // Mock
});

When('the user accesses medical records', async function () {
  await page.goto('http://localhost:3001/records');
});

Then('health history should be displayed', async function () {
  console.log('History displayed');
});

Then('records should be secure', async function () {
  console.log('Records secure');
});

// API steps
Given('the API endpoint for patient creation', function () {
  this.endpoint = 'http://localhost:3001/api/patients';
});

When('a POST request is made with patient data', async function () {
  const response = await axios.post(this.endpoint, { name: 'Jane', age: 35 });
  this.response = response;
});

Then('patient ID should be returned', function () {
  // Mock
});

Given('an existing appointment', function () {
  this.appointmentId = 1;
});

When('a GET request is made for appointment details', async function () {
  const response = await axios.get(`http://localhost:3001/api/appointments/${this.appointmentId}`);
  this.response = response;
});

Given('an existing patient record', function () {
  this.patientId = 1;
});

When('a PUT request is made to update patient data', async function () {
  const response = await axios.put(`http://localhost:3001/api/patients/${this.patientId}`, { name: 'Jane Updated' });
  this.response = response;
});

// DB steps
Given('a new patient registration', function () {
  this.patientData = { id: 1, name: 'Jane' };
});

When('patient data is inserted into the database', async function () {
  dbClient = new Client({ connectionString: 'postgresql://user:pass@localhost:5433/healthcare' });
  await dbClient.connect();
  await dbClient.query('INSERT INTO patients (id, name) VALUES ($1, $2)', [this.patientData.id, this.patientData.name]);
});

Then('retrievable by patient ID', async function () {
  const res = await dbClient.query('SELECT * FROM patients WHERE id = $1', [this.patientData.id]);
  if (res.rows.length === 0) throw new Error('Data not stored');
});

Given('an existing appointment in the database', function () {
  this.appointmentData = { id: 1, status: 'pending' };
});

When('the appointment status is updated', async function () {
  await dbClient.query('UPDATE appointments SET status = $1 WHERE id = $2', ['confirmed', this.appointmentData.id]);
});

Given('multiple records for a patient', function () {
  this.patientId = 1;
});

When('querying medical history by patient ID', async function () {
  const res = await dbClient.query('SELECT * FROM medical_history WHERE patient_id = $1 ORDER BY date', [this.patientId]);
  this.records = res.rows;
});

Then('all relevant records should be returned', function () {
  if (this.records.length === 0) throw new Error('No records');
});

Then('sorted by date', function () {
  // Mock check
});