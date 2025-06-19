describe('Burger constructor functionality', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.visit('http://localhost:4000');
  });

  it('should add ingredients to constructor', () => {
    cy.get('[data-cy=ingredient-card]').first().as('bun');
    cy.get('[data-cy=ingredient-card]').eq(3).as('sauce');
    cy.get('[data-cy=ingredient-card]').eq(7).as('main');

    cy.get('@bun').trigger('dragstart');
    cy.get('[data-cy=burger-constructor]').trigger('drop');

    cy.get('@sauce').trigger('dragstart');
    cy.get('[data-cy=burger-constructor]').trigger('drop');

    cy.get('@main').trigger('dragstart');
    cy.get('[data-cy=burger-constructor]').trigger('drop');

    cy.get('[data-cy=constructor-bun-top]').should(
      'contain',
      'Краторная булка N-200i'
    );
    cy.get('[data-cy=constructor-bun-bottom]').should(
      'contain',
      'Краторная булка N-200i'
    );
    cy.get('[data-cy=constructor-ingredient]').should('have.length', 2);
  });

  it('should open and close ingredient modal', () => {
    cy.get('[data-cy=ingredient-card]').first().click();
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=modal-close-button]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=ingredient-card]').first().click();
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('body').trigger('keydown', { keyCode: 27 }); // ESC key
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=ingredient-card]').first().click();
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('should create an order', () => {
    cy.intercept('POST', 'api/auth/login', {
      fixture: 'login.json'
    });
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    });
    cy.intercept('POST', 'api/orders', {
      fixture: 'order.json'
    });

    cy.get('[data-cy=ingredient-card]').first().as('bun');
    cy.get('[data-cy=ingredient-card]').eq(3).as('sauce');
    cy.get('[data-cy=ingredient-card]').eq(7).as('main');

    cy.get('@bun').trigger('dragstart');
    cy.get('[data-cy=burger-constructor]').trigger('drop');

    cy.get('@sauce').trigger('dragstart');
    cy.get('[data-cy=burger-constructor]').trigger('drop');

    cy.get('@main').trigger('dragstart');
    cy.get('[data-cy=burger-constructor]').trigger('drop');

    cy.get('button').contains('Оформить заказ').click();

    cy.get('[data-cy=login-email-input]').type('test@example.com');
    cy.get('[data-cy=login-password-input]').type('password');
    cy.get('button').contains('Войти').click();

    cy.get('[data-cy=order-number]').should('contain', '12345');
    cy.get('[data-cy=modal-close-button]').click();
    cy.get('[data-cy=modal]').should('not.exist');
    cy.get('[data-cy=burger-constructor]').children().should('have.length', 0);
  });
});
