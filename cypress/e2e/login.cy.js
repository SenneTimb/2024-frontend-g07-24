describe("Klant", () => {
  it("inloggen", () => {
    cy.login("test@test.com", "1234", "submit_btn");
    cy.url().should('include', '/bestellingen');
  });

  it("uitloggen als klant", () => {
    cy.login("test@test.com", "1234", "submit_btn");
    cy.get("[data-cy=logout_btn]").click();
    cy.url().should('include', '/logout');

  });
});

describe("Leverancier", () => {
  it("inloggen als leverancier", () => {
    cy.login("test@test.com", "1234", "submit_btn2");
    cy.url().should('include', '/bestellingen');
  });

  it("uitloggen als leverancier", () => {
    cy.login("test@test.com", "1234", "submit_btn2");
    cy.get("[data-cy=logout_btn]").click();
    cy.url().should('include', '/logout');

  });
});