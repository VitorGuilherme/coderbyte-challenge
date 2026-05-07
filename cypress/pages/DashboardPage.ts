export class DashboardPage {
  private readonly pageContent = 'main, [class*="content"], [class*="main"], #content';

  clickFormsLink(): void {
    cy.get('a[routerlink*="/dashboard/campanha"], a[routerlink*="/dashboard/campanha"]').click();
  }

  clickDatabaseLink(): void {
    cy.get('a[routerlink*="banco"], a[routerlink*="database"]').click();
  }

  clickArchivedLink(): void {
    cy.get('a[routerlink*="arquivado"], a[routerlink*="archived"]').click();
  }

  getSidebar() {
    return cy.get('aside');
  }

  getFormsLink() {
    return cy.get('a[routerlink*="colmeia-forms"], a[routerlink*="forms"]');
  }

  getDatabaseLink() {
    return cy.get('a[routerlink*="banco"], a[routerlink*="database"]');
  }

  getArchivedLink() {
    return cy.get('a[routerlink*="arquivado"], a[routerlink*="archived"]');
  }

  getPageContent() {
    return cy.get(this.pageContent);
  }

  assertPageContentNotEmpty(): void {
    cy.get(this.pageContent)
      .invoke("text")
      .then((text) => {
        expect(text.trim().length).to.be.greaterThan(0);
      });
  }
}
