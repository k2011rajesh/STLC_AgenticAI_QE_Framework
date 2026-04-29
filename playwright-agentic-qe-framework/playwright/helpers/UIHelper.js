const { expect } = require('@playwright/test');

class UIHelper {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(url) {
    await this.page.goto(url);
  }

  async fillInput(selector, value) {
    await this.page.fill(selector, value);
  }

  async clickButton(selector) {
    await this.page.click(selector);
  }

  async selectOption(selector, value) {
    await this.page.selectOption(selector, value);
  }

  async waitForElement(selector) {
    await this.page.waitForSelector(selector);
  }

  async getText(selector) {
    return await this.page.textContent(selector);
  }

  async assertText(selector, expectedText) {
    const text = await this.getText(selector);
    expect(text).toContain(expectedText);
  }

  async assertVisible(selector) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}

module.exports = UIHelper;