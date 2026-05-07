export class LoginPage {
  private readonly emailInput = 'input[type="email"], input[placeholder*="mail"], #email';
  private readonly passwordInput = 'input[type="password"], #password';
  private readonly loginButton = 'button[type="submit"], button:contains("Entrar")';
  private readonly errorModal = 'button[type="button"], button:contains("Continuar")';
  private readonly continueButton = 'button:contains("Continuar"), .swal2-confirm';
  private readonly forgotPasswordLink = 'a:contains("Esqueceu"), a:contains("senha")';
  private readonly errorMessage = '.error, .alert, [class*="error"], [class*="alert"]';


  navigate(): void {
    cy.visit("/");
  }

  fillEmail(email: string): void {
    cy.get(this.emailInput).should("be.visible").clear().type(email);
  }

  fillPassword(password: string): void {
    cy.get(this.passwordInput).should("be.visible").clear().type(password);
  }

  clickLogin(): void {
    cy.get(this.loginButton).click();
  }

  login(email: string, password: string): void {
    this.fillEmail(email);
    this.fillPassword(password);
    this.clickLogin();
  }

  clickContinueOnModal(): void {
    cy.get(this.continueButton).should("be.visible").click();
  }

  getEmailInput() {
    return cy.get(this.emailInput);
  }

  getPasswordInput() {
    return cy.get(this.passwordInput);
  }

  getLoginButton() {
    return cy.get(this.loginButton);
  }

  getErrorModal() {
    return cy.get(this.errorModal);
  }

  getContinueButton() {
    return cy.contains("button", "Continuar");
  }

  getForgotPasswordLink() {
    return cy.get(this.forgotPasswordLink);
  }

  getErrorMessage() {
    return cy.get(this.errorMessage);
  }
}
