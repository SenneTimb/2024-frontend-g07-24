describe("Bestellingen Raadplegen", () => {
  it("Bestellingen van klant", () => {
    cy.login("test@test.com", "1234", "submit_btn");
    cy.url().should('include', '/bestellingen');

    cy.get("[data-cy=bestellingenTitel]").should('contain', 'Bestellingen');
  });

  it("Bestellingdetails van klant", () => {
    cy.login("info@techsolution.com", "1234", "submit_btn");
    cy.url().should('include', '/bestellingen');
    cy.get('.table-container .table tbody tr').first().click();
    cy.url().should('include', '/bestelling');
    cy.get("[data-cy=bestellingDetailsTitelKlant]").should('contain', 'Bestelling Details');
  });

  it("Bestellingen van leverancier", () => {
    cy.login("test@test.com", "1234", "submit_btn2");
    cy.url().should('include', '/bestellingen');

    cy.get("[data-cy=bestellingenTitel]").should('contain', 'Bestellingen');
  });

  it("Bestellingdetails van leverancier", () => {
    cy.login("test@test.com", "1234", "submit_btn2");
    cy.url().should('include', '/bestellingen');
    cy.get('.table-container .table tbody tr').first().click();
    cy.url().should('include', '/bestelling');
    cy.get("[data-cy=bestellingDetailsTitelLeverancier]").should('contain', 'Bestelling Details');

  });
});
