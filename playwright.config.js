// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  //retries: 1,
  reporter: [['list'], ['html']],
  
  use: {
    baseURL: 'https://pruebas-3-3hjs.onrender.com',
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  
  projects: [
    {
      name: 'setup',
      testMatch: '**/saveStorage.spec.js', 
    },
    {
      name: 'authenticated-tests',
      testMatch: '**/*.spec.js',
      testIgnore: '**/saveStorage.spec.js', 
      dependencies: ['setup'],
      use: {
        storageState: 'fixtures/storageState.json', 
      },
    },
  ],
});