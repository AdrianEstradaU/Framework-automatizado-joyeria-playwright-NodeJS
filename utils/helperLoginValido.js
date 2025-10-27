
const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');

exports.test = test.extend({
  loggedInPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('andres', 'A123456a');
    await page.locator('text=Módulo de Joyería').waitFor();
    await use(page); // entrega la página ya logueada al test
  }
});