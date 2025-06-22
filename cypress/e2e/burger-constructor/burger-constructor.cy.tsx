// Импорт констант
import { BASE_URL, SELECTORS } from '../../support/cypress.constants';

// Функция для добавления ингредиента
const addIngredient = (index: number) => {
  cy.get(SELECTORS.INGREDIENT_CARD)
    .eq(index)
    .within(() => {
      cy.contains('button', 'Добавить').click();
    });
};

// Функция для добавления базовых ингредиентов (булка, соус, начинка)
const addBaseIngredients = () => {
  addIngredient(0); // Булки
  cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP, { timeout: 5000 })
    .should('be.visible')
    .and('contain', 'Краторная булка N-200i');

  addIngredient(3); // Соус
  addIngredient(7); // Основной ингредиент
};

describe('Burger constructor functionality', () => {
  beforeEach(() => {
    cy.fixture('ingredients.json').then((ingredients) => {
      cy.intercept('GET', 'api/ingredients', {
        statusCode: 200,
        body: { success: true, data: ingredients }
      }).as('getIngredients');
    });

    cy.visit(BASE_URL);
    cy.wait('@getIngredients', { timeout: 20000 });
  });

  it('добавляем ингредиенты используя кнопку addButton', () => {
    cy.wait(1000);
    cy.get(SELECTORS.INGREDIENT_CARD).should('have.length.gt', 0);

    addBaseIngredients();

    cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM)
      .should('be.visible')
      .and('contain', 'Краторная булка N-200i');

    cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT, { timeout: 10000 }).should(
      'have.length',
      2
    );
  });

  it('открытие и закрытие modal', () => {
    cy.get(SELECTORS.INGREDIENT_CARD).first().click();
    cy.get(SELECTORS.MODAL).should('be.visible');
    cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
    cy.get(SELECTORS.MODAL).should('not.exist');

    cy.get(SELECTORS.INGREDIENT_CARD).first().click();
    cy.get(SELECTORS.MODAL).should('be.visible');
    cy.document().trigger('keydown', { key: 'Escape' });
    cy.get(SELECTORS.MODAL).should('not.exist');

    cy.get(SELECTORS.INGREDIENT_CARD).first().click();
    cy.get(SELECTORS.MODAL).should('be.visible');
    cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
    cy.get(SELECTORS.MODAL).should('not.exist');
  });

  it('создаем заказ', () => {
    // Стабим запросы
    cy.intercept('POST', 'api/auth/login', { fixture: 'login.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
    cy.wait(1000);
    // Переходим на страницу логина
    cy.get(SELECTORS.LOGIN_LINK).click();

    // Заполняем форму
    cy.get(SELECTORS.LOGIN_EMAIL_INPUT).type('test@example.com');
    cy.get(SELECTORS.LOGIN_PASSWORD_INPUT).type('password');

    // Возвращаемся на главную
    cy.get(SELECTORS.CONSTRUCTOR_LINK).click();
    cy.wait(1000);

    // Добавляем ингредиенты
    addBaseIngredients();

    // Оформляем заказ
    cy.get('button').contains('Оформить заказ').click();
    cy.wait(3000);

    // Проверяем заказ
    cy.get(SELECTORS.ORDER_NUMBER).should('contain', '12345');
    cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
    cy.get(SELECTORS.MODAL).should('not.exist');

    // Проверяем очистку конструктора
    cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
    cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('not.exist');
    cy.get(SELECTORS.CONSTRUCTOR_INGREDIENT).should('have.length', 0);
  });
});
