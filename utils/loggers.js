const { allure } = require('allure-playwright');

const info = (msg) => {
  console.log(`[INFO] ${new Date().toISOString()} : ${msg}`);
  allure.step(`[INFO] ${msg}`, () => {});
};

const success = (msg) => {
  console.log(`[SUCCESS] ${new Date().toISOString()} : ${msg}`);
  allure.step(`[SUCCESS] ${msg}`, () => {});
};

const warn = (msg) => {
  console.warn(`[WARN] ${new Date().toISOString()} : ${msg}`);
  allure.step(`[WARN] ${msg}`, () => {});
};

const error = (msg) => {
  console.error(`[ERROR] ${new Date().toISOString()} : ${msg}`);
  allure.step(`[ERROR] ${msg}`, () => {});
};

module.exports = { info, success, warn, error };