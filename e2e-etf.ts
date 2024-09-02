// cypress/e2e/etf-list.spec.js

describe('ETF List', () => {
    beforeEach(() => {
      // Visit the main page before each test
      cy.visit('/');
    });
  
    it('should display the initial list of ETFs', () => {
      // Check if the page title is correct
      cy.get('h1').should('contain', 'ETFList');
  
      // Verify that the table is present
      cy.get('table').should('exist');
  
      // Check if the table headers are correct
      const expectedHeaders = ['Ticker', 'Fund Name', 'Issuer', 'AUM Bill', 'Expense Ratio', 'ThreeMoTR', 'Segment'];
      cy.get('thead th').each(($el, index) => {
        cy.wrap($el).should('contain', expectedHeaders[index]);
      });
  
      // Verify that there are ETFs listed in the table
      cy.get('tbody tr').should('have.length.gt', 0);
    });
  
    it('should change the order of ETFs when clicking different buttons', () => {
      // Store the initial order of ETFs
      cy.get('tbody tr').then($initialRows => {
        const initialOrder = $initialRows.map((_, el) => el.children[0].innerText).get();
  
        // Click the "ER" button
        cy.contains('button', 'ER').click();
  
        // Verify that the list has changed
        cy.get('tbody tr').then($newRows => {
          const newOrder = $newRows.map((_, el) => el.children[0].innerText).get();
          expect(newOrder).not.to.deep.equal(initialOrder);
        });
  
        // Click the "AUM Bill" button
        cy.contains('button', 'AUM Bill').click();
  
        // Verify that the list has changed again
        cy.get('tbody tr').then($newRows => {
          const newOrder = $newRows.map((_, el) => el.children[0].innerText).get();
          expect(newOrder).not.to.deep.equal(initialOrder);
        });
  
        // Click the "3M TR" button
        cy.contains('button', '3M TR').click();
  
        // Verify that the list has changed once more
        cy.get('tbody tr').then($newRows => {
          const newOrder = $newRows.map((_, el) => el.children[0].innerText).get();
          expect(newOrder).not.to.deep.equal(initialOrder);
        });
  
        // Click the "All" button to return to the initial state
        cy.contains('button', 'All').click();
  
        // Verify that we're back to the initial state
        cy.get('tbody tr').then($newRows => {
          const newOrder = $newRows.map((_, el) => el.children[0].innerText).get();
          expect(newOrder).to.deep.equal(initialOrder);
        });
      });
    });
  });