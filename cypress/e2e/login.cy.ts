import { LoginPage } from "../pages/LoginPage";

describe("Login", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.navigate();
  });

  it("should display all login form elements on page load", () => {
    loginPage.getEmailInput().should("be.visible");
    loginPage.getPasswordInput().should("be.visible");
    loginPage.getLoginButton().should("be.visible");
    loginPage.getForgotPasswordLink().should("be.visible");
  });

  /**
   * @bug BUG-01 — Modal de erro exibido mesmo com credenciais válidas.
   * Comportamento ESPERADO: login redireciona direto ao dashboard.
   * Comportamento ATUAL: modal de erro aparece após credenciais corretas.
   */
  it("[BUG-01] should show an error modal even when credentials are valid", () => {
    cy.fixture("users").then((data) => {
      loginPage.login(data.validUser.email, data.validUser.password);

      loginPage.getErrorModal().should("be.visible");
    });
  });

  /**
   * @bug BUG-01 — Workaround: clicar em "Continuar" no modal redireciona corretamente.
   */
  it("[BUG-01] should redirect to dashboard after clicking Continuar on error modal", () => {
    cy.fixture("users").then((data) => {
      loginPage.login(data.validUser.email, data.validUser.password);
      loginPage.clickContinueOnModal();

      cy.url().should("not.include", "/login");
    });
  });

  it("should not login with empty email and password", () => {

    loginPage.clickLogin();

    cy.url().should("include", "/");
    loginPage.getEmailInput().should("be.visible");
  });

  it("should not login with invalid credentials", () => {
    cy.fixture("users").then((data) => {
      loginPage.login(data.invalidUser.email, data.invalidUser.password);

      cy.url().should("not.include", "/dashboard");
      cy.url().should("not.include", "/home");
    });
  });
});
