// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: [['list'], ['html'],['allure-playwright'] ],
    workers: 1,
  
  use: {
    baseURL: 'https://pruebas-3-3hjs.onrender.com',
    headless: true,  
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 15000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: '**/saveStorage.spec.js', 
      use: {
        
      },
    },
    {
      name: 'login-tests',
      testMatch: '**/login.spec.js',
      use: {
        // No se usa storage, login inicia desde cero
        headless: false,
        viewport: { width: 1280, height: 720 },
        actionTimeout: 15000,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'authenticated-tests',
      testMatch: '**/*.spec.js',
      testIgnore: ['**/saveStorage.spec.js', '**/login.spec.js'],
      dependencies: ['setup'],
      use: {
        storageState: 'fixtures/storageState.json', // usa sesión guardada
      },
    },
  ],
});
