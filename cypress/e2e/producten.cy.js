describe("Producten Raadplegen", () => {
  it("Producten zonder inloggen", () => {
    cy.visit('http://localhost:5173/producten');
    cy.get("[data-cy=ProductenOverzicht").should('contain', 'Producten Overzicht');
    cy.get("[data-cy=oProductNaam]").should('exist');
    cy.get("[data-cy=oProductStock]").should('exist');  });

  it("Producten met inloggen klant", () => {
    cy.login("test@test.com", "1234", "submit_btn");
    cy.visit('http://localhost:5173/producten');
    cy.get("[data-cy=ProductenOverzicht").should('contain', 'Producten Overzicht');
    cy.get("[data-cy=oProductNaam]").should('exist');
    cy.get("[data-cy=oProductStock]").should('exist');  });

  it("Producten met inloggen leverancier", () => {
    cy.login("test@test.com", "1234", "submit_btn2");
    cy.visit('http://localhost:5173/producten');
    cy.get("[data-cy=ProductenOverzicht").should('contain', 'Producten Overzicht');
    cy.get("[data-cy=oProductNaam]").should('exist');
    cy.get("[data-cy=oProductStock]").should('exist');
  });

  it("Navigeren naar productdetails", () => {
    cy.visit('http://localhost:5173/producten');
    cy.get('.card').first().find('[data-cy=productDetailsLink]').click();
    cy.url().should('include', '/producten/product/');
    cy.get("[data-cy=productTitle]").should('exist');
    cy.get("[data-cy=productVoorraad]").should('contain', 'Aantal in vooraad');
    cy.get("[data-cy=productPrijs]").should('contain', 'Eenheidsprijs');
    cy.get("[data-cy=productLeverancier]").should('contain', 'Leverancier');
    cy.get("[data-cy=productStock]").should('contain', 'In Stock');

  });
});