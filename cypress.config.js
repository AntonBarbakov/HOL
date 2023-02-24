const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    specPattern: 'cypress/TestCases/**/**/*.spec.{js,jsx,ts,tsx}',
    experimentalStudio: true,
    experimentalWebKitSupport: true,
    include: ["./node_modules/cypress", "cypress/**/**/**/*.js"],
    baseUrl:"https://test.myhol.holscience.com",
  },
  env: {
    PASSWORD: 'Terminator2JD',
    TEST_USERNAME: 'anton.barbakov@codeit.pro',
    SUPER_ADMIN_USERNAME: 'yulia.velichko+adm@codeit.pro',
    SUPER_ADMIN_PASS: 'Test12345!',
    TEST_INSTRUCTOR_FULLNAME: 'Tom Riddle', 
    TEST_INSTRUCTOR_ID: 262801,
    TEST_LESSON_ID: 12129,
    TEST_MASTER_LESSON_ID : 12135,
    TEST_STUDENT_PASS: '13Warriors',
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 300000,
  defaultLaunchTimeout: 300000,
  video: false,
  chromeWebSecurity: false,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Test run report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
});
