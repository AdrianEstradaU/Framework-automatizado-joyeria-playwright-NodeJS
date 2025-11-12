class BasePage {
  constructor(page) {
    this.page = page;
  }

  async click(locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async fill(locator, value, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
    const currentValue = await locator.inputValue().catch(() => '');
    if (currentValue) await locator.clear();
    await locator.fill(value);
  }

  async waitForVisible(locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }


  async selectRowByText(tableLocator, text) {
    const row = tableLocator.locator('tr', { hasText: text }).first();
    await row.waitFor({ state: 'visible', timeout: 10000 });
    await row.scrollIntoViewIfNeeded();
    await row.click();
    await this.page.waitForTimeout(1500);
  }

  
  async validateToastMessage(message = '') {
    const toast = this.page.locator('.toast-message');
    await toast.waitFor({ state: 'visible', timeout: 8000 });
    if (message) {
      return await toast.filter({ hasText: message }).isVisible();
    }
    return await toast.isVisible();
  }

  async navigateMenu(...locators) {
    for (const loc of locators) {
      await loc.waitFor({ state: 'visible', timeout: 5000 });
      await loc.click();
      await this.page.waitForTimeout(300);
    }
  }

  async getText(locator) {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent();
  }

  async isVisible(locator, timeout = 5000) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }
 async selectOptionByText(locator, text, fieldName = '') {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.selectOption({ label: text });
    if (fieldName) console.log(` Campo "${fieldName}" seleccionado con: ${text}`);
  }
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { BasePage };
