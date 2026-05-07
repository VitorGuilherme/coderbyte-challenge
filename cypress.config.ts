import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://teste-colmeia-qa.colmeia-corp.com",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    video: false,
    screenshotOnRunFailure: false,
    setupNodeEvents() {},
  },
});
