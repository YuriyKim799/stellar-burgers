// Базовый URL приложения
export const BASE_URL = 'http://localhost:4000';

// Селекторы для элементов интерфейса
export const SELECTORS = {
  INGREDIENT_CARD: '[data-cy=ingredient-card]',
  CONSTRUCTOR_BUN_TOP: '[data-cy=constructor-bun-top]',
  CONSTRUCTOR_BUN_BOTTOM: '[data-cy=constructor-bun-bottom]',
  CONSTRUCTOR_INGREDIENT: '[data-cy=constructor-ingredient]',
  MODAL: '[data-cy=modal]',
  MODAL_CLOSE_BUTTON: '[data-cy=modal-close-button]',
  MODAL_OVERLAY: '[data-cy=modal-overlay]',
  ORDER_NUMBER: '[data-cy=order-number]',
  LOGIN_EMAIL_INPUT: '[data-cy=login-email-input]',
  LOGIN_PASSWORD_INPUT: '[data-cy=login-password-input]',
  LOGIN_LINK: '[data-cy=data-login-link]',
  CONSTRUCTOR_LINK: '[data-cy=data-constructor-link]',
  SUBMIT_ORDER_BUTTON: 'button:contains("Оформить заказ")',
  ADD_BUTTON: 'button:contains("Добавить")'
};

// Тестовые данные
export const TEST_DATA = {
  USER: {
    email: 'test@example.com',
    password: 'password'
  },
  INGREDIENT_NAMES: {
    bun: 'Краторная булка N-200i',
    sauce: 'Соус традиционный галактический',
    main: 'Мясо бессмертных моллюсков Protostomia'
  }
};

// Фикстуры
export const FIXTURES = {
  INGREDIENTS: 'ingredients.json',
  LOGIN: 'login.json',
  USER: 'user.json',
  ORDER: 'order.json'
};
