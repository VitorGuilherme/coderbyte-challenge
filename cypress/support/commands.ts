/// <reference types="cypress" />

export {};

/**
 * Comando global de login que encapsula o fluxo completo,
 * incluindo o clique em "Continuar" no modal de erro (BUG-01).
 */
Cypress.Commands.add("loginWithBugWorkaround", (email: string, password: string) => {
  cy.visit("/");
  cy.get('[data-testid="email"], input[type="email"], #email').type(email);
  cy.get('[data-testid="password"], input[type="password"], #password').type(password);
  cy.get('[data-testid="login-btn"], button[type="submit"]').click();

  // BUG-01: plataforma exibe modal de erro mesmo com credenciais corretas.
  // O workaround é clicar em "Continuar" para prosseguir ao dashboard.
  cy.get("body").then(($body) => {
    const hasContinueBtn = $body.find('button:contains("Continuar"), [data-testid="modal-continue"]').length > 0;
    if (hasContinueBtn) {
      cy.contains("button", "Continuar").click();
    }
  });
});

// Declaração TypeScript do comando personalizado
declare global {
  namespace Cypress {
    interface Chainable {
      loginWithBugWorkaround(email: string, password: string): Chainable<void>;
    }
  }
}
