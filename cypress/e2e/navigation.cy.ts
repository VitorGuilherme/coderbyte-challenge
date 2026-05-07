import { DashboardPage } from "../pages/DashboardPage";

describe("Navigation", () => {
  const dashboard = new DashboardPage();

  beforeEach(() => {
    cy.fixture("users").then((data) => {
      cy.loginWithBugWorkaround(data.validUser.email, data.validUser.password);
    });
  });

  it("should display the main dashboard with sidebar navigation after login", () => {
    dashboard.getSidebar().should("be.visible");
    cy.contains('Candidato')
  });

  /**
   * @bug BUG-05 — Botão "Colmeia Forms" redireciona para componente vazio.
   * Comportamento ESPERADO: página de formulários é exibida com conteúdo.
   * Comportamento ATUAL: componente é renderizado sem nenhum conteúdo visível.
   */
  it("[BUG-05] Colmeia Forms link should render a page with visible content", () => {
    // dashboard.getFormsLink().should("be.visible");

    dashboard.clickFormsLink();
    cy.contains("Colmeia Forms").click();

    cy.url().should("include", "colmeia-forms");
    dashboard.assertPageContentNotEmpty();
    cy.get("main, [class*='form'], [class*='content']")
      .invoke("text")
      .should("have.length.greaterThan", 5);
  });

  it("should keep the user authenticated when navigating between sections", () => {

    cy.get("nav a, aside a").first().click();
    cy.wait(500);

    cy.url().should("not.include", "/login");
    cy.url().should("not.eq", "https://teste-colmeia-qa.colmeia-corp.com/");
  });
});
