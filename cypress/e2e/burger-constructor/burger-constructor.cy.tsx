describe('Burger constructor functionality', () => {
  beforeEach(() => {
    // 1. Сначала объявляем перехватчик
    cy.fixture('ingredients.json').then((ingredients) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: { success: true, data: ingredients }
      }).as('getIngredients');
    });

    // 2. ПОТОМ посещаем страницу (это вызовет запрос)
    cy.visit('http://localhost:4000');

    // 3. Ожидание критических запросов
    cy.wait(['@getIngredients'], {
      timeout: 20000
    });
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

    // Даем время на обновление UI
    cy.wait(3000);

    // Проверяем элементы конструктора
    cy.get('[data-cy=constructor-bun-top]', { timeout: 20000 })
      .should('be.visible')
      .and('contain', 'Краторная булка N-200i');

    cy.get('[data-cy=constructor-bun-bottom]', { timeout: 20000 })
      .should('be.visible')
      .and('contain', 'Краторная булка N-200i');

    cy.get('[data-cy=constructor-ingredient]', { timeout: 20000 }).should(
      'have.length',
      2
    );
  });

  it('открытие и закрытие modal', () => {
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

    cy.wait(10000);
    cy.get('[data-cy=order-number]').should('contain', '12345');
    cy.get('[data-cy=modal-close-button]').click();
    cy.get('[data-cy=modal]').should('not.exist');
    // cy.get('[data-cy=burger-constructor]').children().should('have.length', 0); не работает потому что есть дочерние пустые элементы страницы
    // Проверка отсутствия булки
    cy.get('[data-cy=constructor-bun-top]').should('not.exist');
    cy.get('[data-cy=constructor-bun-bottom]').should('not.exist');
    // Проверка отсутствия основных ингредиентов
    cy.get('[data-cy=constructor-ingredient]').should('have.length', 0);
  });
});
