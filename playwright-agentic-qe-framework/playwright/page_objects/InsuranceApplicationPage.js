class InsuranceApplicationPage {
  constructor(page) {
    this.page = page;
    this.nameInput = '#name';
    this.ageInput = '#age';
    this.incomeInput = '#income';
    this.typeSelect = '#type';
    this.submitButton = '#submit';
    this.confirmationMessage = '.confirmation';
  }

  async fillApplicationForm(name, age, income, type) {
    await this.page.fill(this.nameInput, name);
    await this.page.fill(this.ageInput, age.toString());
    await this.page.fill(this.incomeInput, income.toString());
    await this.page.selectOption(this.typeSelect, type);
  }

  async submitApplication() {
    await this.page.click(this.submitButton);
  }

  async getConfirmationMessage() {
    return await this.page.textContent(this.confirmationMessage);
  }
}

module.exports = InsuranceApplicationPage;