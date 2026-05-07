export class DatabasePage {
  private readonly createDatabaseButton = 'button:contains("Criar"), button:contains("Novo"), [data-testid="create-db"]';
  private readonly databaseNameInput = 'input[placeholder*="nome"], input[placeholder*="Nome do item"], [data-testid="db-name-input"]';
  private readonly confirmCreateButton = 'button:contains("Confirmar"), button:contains("Salvar"), button[type="submit"]';
  private readonly databaseItems = '[class*="database-item"], [class*="db-item"], [data-testid="database-card"]';
  private readonly archiveButton = 'button[title="Arquivar"]';
  private readonly deleteButton = 'button[title="Apagar"]';
  private readonly creationDate = '[class*="date"], [class*="created-at"], [class*="criado"], time, [data-testid*="date"], [data-testid*="created"]';
  private readonly refreshButton = 'button[data-variant="icon"][data-active]';
  private readonly archivedSection = '[class*="archived"], [data-testid="archived-list"]';
  private readonly emptyState = '[class*="empty"], p:contains("nenhum"), p:contains("vazio")';
  private readonly searchInput = 'input[placeholder*="Pesquisar"], input[placeholder*="pesquisar"], input[type="search"], [data-testid="search-input"]';

  clickFormsLink(): void {
    cy.get('a[routerlink*="/dashboard/campanha"], a[routerlink*="/dashboard/campanha"]').click();
  }

  createDatabase(name: string): void {
    cy.get(this.createDatabaseButton).click();
    cy.get(this.databaseNameInput).should("be.visible").type(name);
    cy.get(this.confirmCreateButton).last().click();
  }
  clickArchiveOnFirstDatabase(): void {
    cy.get(this.archiveButton).first().click();
  }

  clickDeleteOnFirstDatabase(): void {
    cy.get(this.deleteButton).first().click();
  }

  clickRefreshOnFirstDatabase(): void {
    cy.get(this.refreshButton).first().click();
  }

  assertArchiveButtonVisible(): void {
    cy.get(this.archiveButton).first().should("be.visible");
  }

  assertDeleteButtonVisible(): void {
    cy.get(this.deleteButton).first().should("be.visible");
  }

  searchDatabase(name: string): void {
    cy.get(this.searchInput).should("be.visible").clear().type(name);
  }

  assertCreationDateIsToday(): void {
    const now = new Date(Date.now());
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const formattedBR = `${day}/${month}/${year}`;
    const formattedISO = `${year}-${month}-${day}`;

    cy.get(this.creationDate)
      .first()
      .invoke("text")
      .then((text) => {
        expect(text).to.satisfy(
          (t: string) => t.includes(formattedBR) || t.includes(formattedISO),
          `Data de criação deveria ser hoje (${formattedBR} ou ${formattedISO})`
        );
      });
  }

  getDatabaseItemByName(name: string) {
    return cy.contains(this.databaseItems, name);
  }

  getDatabaseCount() {
    return cy.get(this.databaseItems).its("length");
  }

  getArchivedSection() {
    return cy.get(this.archivedSection);
  }

  getEmptyState() {
    return cy.get(this.emptyState);
  }

  assertDatabaseExists(name: string): void {
    cy.contains(name).should("be.visible");
  }

  assertDatabaseNotVisible(name: string): void {
    cy.contains(name).should("not.exist");
  }
}
