const { Given, When, Then } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const axios = require('axios');
const { Client } = require('pg');
const UIHelper = require('../helpers/UIHelper');
const APIHelper = require('../helpers/APIHelper');
const DatabaseHelper = require('../helpers/DatabaseHelper');
const InsuranceApplicationPage = require('../page_objects/InsuranceApplicationPage');

let browser, page, uiHelper, apiHelper, dbHelper, appPage;

Given('the user is on the insurance application page', async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  uiHelper = new UIHelper(page);
  appPage = new InsuranceApplicationPage(page);
  await uiHelper.navigateTo('http://localhost:3000/apply');
});

When('the user fills in personal details', async function () {
  await appPage.fillApplicationForm('John Doe', 45, 50000, 'retirement');
});

When('selects retirement insurance type', async function () {
  // Already done in fill
});

When('submits the application', async function () {
  await appPage.submitApplication();
});

Then('the application should be submitted successfully', async function () {
  await uiHelper.assertVisible('.success');
});

Then('a confirmation message should be displayed', async function () {
  const message = await appPage.getConfirmationMessage();
  expect(message).toContain('Application submitted');
});

// Other steps...

// Add more steps for other scenarios, API, DB

Given('the API endpoint for application creation', function () {
  this.endpoint = 'http://localhost:3000/api/applications';
});

When('a POST request is made with valid application data', async function () {
  const response = await axios.post(this.endpoint, { name: 'John', age: 45 });
  this.response = response;
});

Then('the response should be 201 Created', function () {
  if (this.response.status !== 201) throw new Error('Status not 201');
});

// DB steps
Given('a new insurance application', function () {
  this.appData = { id: 1, name: 'John' };
});

When('the application data is inserted into the database', async function () {
  dbClient = new Client({ connectionString: 'postgresql://user:pass@localhost:5432/insurance' });
  await dbClient.connect();
  await dbClient.query('INSERT INTO applications (id, name) VALUES ($1, $2)', [this.appData.id, this.appData.name]);
});

Then('the data should be stored successfully', async function () {
  const res = await dbClient.query('SELECT * FROM applications WHERE id = $1', [this.appData.id]);
  if (res.rows.length === 0) throw new Error('Data not stored');
});