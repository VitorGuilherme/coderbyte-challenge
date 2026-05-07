import { DatabasePage } from "../pages/DatabasePage";

describe("Database Management", () => {
  const dbPage = new DatabasePage();
  const dbName = `QA-DB-${Date.now()}`;

  beforeEach(() => {
    cy.fixture("users").then((data) => {
      cy.loginWithBugWorkaround(data.validUser.email, data.validUser.password);
    });
  });

  it("should be able to create a new database", () => {
    dbPage.clickFormsLink();
    cy.contains("Bancos de dados").click();
    dbPage.createDatabase(dbName);

    dbPage.assertDatabaseExists(dbName);
  });

  it("should display creation date matching today when a database is created", () => {
    dbPage.clickFormsLink();
    cy.contains("Bancos de dados").click();
    dbPage.createDatabase(`DATE-${Date.now()}`);

    dbPage.assertCreationDateIsToday();
  });

  it("should remove the database from the list when delete button is clicked", () => {
    const deleteDb = `DELETE-${Date.now()}`;
    dbPage.clickFormsLink();
    cy.contains("Bancos de dados").click();
    dbPage.createDatabase(deleteDb);

    dbPage.clickDeleteOnFirstDatabase();

    dbPage.assertDatabaseNotVisible(deleteDb);
  });

  it("should find the database by name using the search input", () => {
    const searchDb = `SEARCH-${Date.now()}`;
    dbPage.clickFormsLink();
    cy.contains("Bancos de dados").click();
    dbPage.createDatabase(searchDb);

    dbPage.searchDatabase(searchDb);

    dbPage.assertDatabaseExists(searchDb);
  });

  /**
   * @bug BUG-02 — Botão de arquivar remove o banco do front em vez de arquivá-lo.
   * Comportamento ESPERADO: banco aparece na seção "Arquivados".
   * Comportamento ATUAL: banco desaparece da lista sem ir para Arquivados.
   */
  it("[BUG-02] archive button should move database to Arquivados section", () => {
    const archiveDb = `ARCHIVE-${Date.now()}`;
    dbPage.clickFormsLink();
    cy.contains("Bancos de dados").click();
    dbPage.createDatabase(archiveDb);

    dbPage.clickArchiveOnFirstDatabase();

    // Comportamento ESPERADO — falha pois bug está ativo
    dbPage.getArchivedSection().should("exist");
    dbPage.assertDatabaseExists(archiveDb);
  });

  /**
   * @bug BUG-03 — Ícone de atualizar (setinha) remove o banco em vez de recarregar.
   * Comportamento ESPERADO: dados do banco são atualizados, banco permanece na lista.
   * Comportamento ATUAL: banco é removido do front após clicar no refresh.
   */
  it("[BUG-03] refresh icon should reload database info, not remove it", () => {
    const refreshTestDb = `REFRESH-${Date.now()}`;
    dbPage.clickFormsLink();
    cy.contains("Bancos de dados").click();
    dbPage.createDatabase(refreshTestDb);

    dbPage.clickRefreshOnFirstDatabase();

    // Comportamento ESPERADO — falha pois bug está ativo
    dbPage.assertDatabaseExists(refreshTestDb);
  });

  /**
   * @bug BUG-04 — Navegar para outro link da plataforma exclui o banco de dados.
   * Comportamento ESPERADO: banco persiste ao retornar para a seção.
   * Comportamento ATUAL: banco é deletado ao clicar em outro link do menu.
   */
  it("[BUG-04] navigating away and back should preserve the database", () => {
    const persistDb = `PERSIST-${Date.now()}`;
    dbPage.clickFormsLink();
    cy.contains("Bancos de dados").click();
    dbPage.createDatabase(persistDb);

    cy.get("nav a, aside a").not('[href*="banco"], [href*="database"]').first().click();
    cy.wait(1000);
    cy.contains("a", /banco|database/i).first().click();

    // Comportamento ESPERADO — falha pois bug está ativo
    dbPage.assertDatabaseExists(persistDb);
  });
});
