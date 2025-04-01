Cypress.Commands.add('login', (email, password, knop) => {
  Cypress.log({
    displayName: 'login',
  });

  cy.visit('http://localhost:5173');
  cy.get("[data-cy=email_input]").type(email);
  cy.get("[data-cy=password_input]").type(password);
  cy.get(`[data-cy=${knop}]`).click();
});