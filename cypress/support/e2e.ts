// ***********************************************************
// Support file — carregado automaticamente antes de cada spec.
// Usado para comandos globais e configurações de comportamento.
// ***********************************************************

import "./commands";

// Suprime erros de aplicação que não são responsabilidade do teste
Cypress.on("uncaught:exception", () => false);
