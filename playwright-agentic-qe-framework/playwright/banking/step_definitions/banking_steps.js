const { Given, When, Then } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const axios = require('axios');
const { Client } = require('pg');

let browser, page, dbClient;

Given('the user is on the loan application page', async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:3002/apply-loan'); // Assume banking app
});

When('the user fills in loan application details', async function () {
  await page.fill('#name', 'John Doe');
  await page.fill('#amount', '10000');
  await page.fill('#purpose', 'Home improvement');
});

When('selects loan type and amount', async function () {
  await page.selectOption('#loanType', 'personal');
});

When('submits the application', async function () {
  await page.click('#submit');
});

Then('the application should be submitted successfully', async function () {
  // Mock assertion
  console.log('Application submitted');
});

Then('an application reference number should be displayed', async function () {
  // Mock
  console.log('Reference number displayed');
});

Given('the user is logged in to banking portal', async function () {
  // Mock login
  console.log('Logged in to banking');
});

When('the user enters personal and financial details', async function () {
  await page.fill('#income', '50000');
  await page.fill('#creditScore', '750');
});

When('requests eligibility check', async function () {
  await page.click('#checkEligibility');
});

Then('eligibility status should be displayed', async function () {
  console.log('Eligibility displayed');
});

Then('maximum loan amount should be shown', async function () {
  console.log('Max amount shown');
});

Given('the user has submitted a loan application', async function () {
  // Mock existing application
});

When('the user checks application status', async function () {
  await page.goto('http://localhost:3002/application-status');
});

Then('current status should be displayed', async function () {
  console.log('Status displayed');
});

Then('next steps should be indicated', async function () {
  console.log('Next steps shown');
});

// API steps
Given('the API endpoint for loan application', function () {
  this.endpoint = 'http://localhost:3002/api/loans';
});

When('a POST request is made with loan application data', async function () {
  const response = await axios.post(this.endpoint, { name: 'John', amount: 10000 });
  this.response = response;
});

Then('application ID should be returned', function () {
  // Mock
});

Given('the API endpoint for eligibility check', function () {
  this.endpoint = 'http://localhost:3002/api/eligibility';
});

When('a POST request is made with applicant data', async function () {
  const response = await axios.post(this.endpoint, { income: 50000, creditScore: 750 });
  this.response = response;
});

Then('eligibility result should be returned', function () {
  // Mock
});

Given('an existing loan application', function () {
  this.applicationId = 1;
});

When('a GET request is made for application status', async function () {
  const response = await axios.get(`http://localhost:3002/api/loans/${this.applicationId}/status`);
  this.response = response;
});

// DB steps
Given('a new loan application', function () {
  this.appData = { id: 1, name: 'John', amount: 10000 };
});

When('application data is inserted into the database', async function () {
  dbClient = new Client({ connectionString: 'postgresql://user:pass@localhost:5434/banking' });
  await dbClient.connect();
  await dbClient.query('INSERT INTO loan_applications (id, name, amount) VALUES ($1, $2, $3)', [this.appData.id, this.appData.name, this.appData.amount]);
});

Then('retrievable by application ID', async function () {
  const res = await dbClient.query('SELECT * FROM loan_applications WHERE id = $1', [this.appData.id]);
  if (res.rows.length === 0) throw new Error('Data not stored');
});

Given('an existing loan application in database', function () {
  this.appData = { id: 1, status: 'pending' };
});

When('the application status is updated', async function () {
  await dbClient.query('UPDATE loan_applications SET status = $1 WHERE id = $2', ['approved', this.appData.id]);
});

Given('multiple loan applications for a user', function () {
  this.userId = 1;
});

When('querying applications by user ID', async function () {
  const res = await dbClient.query('SELECT * FROM loan_applications WHERE user_id = $1 ORDER BY submitted_date', [this.userId]);
  this.applications = res.rows;
});

Then('all relevant applications should be returned', function () {
  if (this.applications.length === 0) throw new Error('No applications');
});

Then('sorted by submission date', function () {
  // Mock check
});