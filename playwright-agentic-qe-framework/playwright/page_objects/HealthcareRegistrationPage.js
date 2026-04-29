class HealthcareRegistrationPage {
  constructor(page) {
    this.page = page;
    this.nameInput = '#name';
    this.ageInput = '#age';
    this.medicalHistoryInput = '#medicalHistory';
    this.planSelect = '#plan';
    this.submitButton = '#submit';
    this.confirmationMessage = '.confirmation';
  }

  async fillRegistrationForm(name, age, medicalHistory, plan) {
    await this.page.fill(this.nameInput, name);
    await this.page.fill(this.ageInput, age.toString());
    await this.page.fill(this.medicalHistoryInput, medicalHistory);
    await this.page.selectOption(this.planSelect, plan);
  }

  async submitRegistration() {
    await this.page.click(this.submitButton);
  }

  async getConfirmationMessage() {
    return await this.page.textContent(this.confirmationMessage);
  }
}

module.exports = HealthcareRegistrationPage;