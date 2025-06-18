import orderBurgerSlice, { orderBurger, resetOrder } from './orderBurgerSlice';
import { TNewOrderResponse } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

// Моковые данные для тестов
const mockOrderResponse: TNewOrderResponse = {
  success: true,
  name: 'Space Burger',
  order: {
    _id: '123456',
    status: 'done',
    name: 'Space Burger',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c7']
  }
};

describe('orderBurgerSlice reducer', () => {
  // Тест 1: Проверка начального состояния
  it('должен возвращать initial state', () => {
    const initialState = orderBurgerSlice.reducer(undefined, {
      type: 'unknown'
    });

    expect(initialState).toEqual({
      orderRequest: false,
      orderModalData: null,
      name: '',
      orderErrorMessage: ''
    });
  });

  // Тест 2: Обработка экшена pending (запрос начат)
  it('orderBurger.pending', () => {
    const action = { type: orderBurger.pending.type };
    const state = orderBurgerSlice.reducer(initialState, action);

    expect(state).toEqual({
      orderRequest: true,
      orderModalData: null,
      name: '',
      orderErrorMessage: ''
    });
  });

  // Тест 3: Обработка экшена fulfilled (запрос успешен)
  it('orderBurger.fulfilled', () => {
    const action = {
      type: orderBurger.fulfilled.type,
      payload: mockOrderResponse
    };

    const state = orderBurgerSlice.reducer(
      { ...initialState, orderRequest: true },
      action
    );

    expect(state).toEqual({
      orderRequest: false,
      orderModalData: mockOrderResponse.order,
      name: mockOrderResponse.name,
      orderErrorMessage: ''
    });
  });

  // Тест 4: Обработка экшена rejected (запрос с ошибкой)
  it('orderBurger.rejected', () => {
    const action = {
      type: orderBurger.rejected.type,
      payload: {
        orderRequest: false,
        orderErrorMessage: 'Ошибка сервера'
      }
    };

    const state = orderBurgerSlice.reducer(
      { ...initialState, orderRequest: true },
      action
    );

    // В текущей реализации редьюсер не сохраняет ошибку
    expect(state).toEqual({
      orderRequest: false, // Флаг запроса сбрасывается
      orderModalData: null,
      name: '',
      orderErrorMessage: '' // Ошибка не сохраняется
    });
  });

  // Тест 5: Обработка сброса заказа
  it('resetOrder action', () => {
    const action = resetOrder();
    const state = orderBurgerSlice.reducer(
      {
        orderRequest: false,
        orderModalData: mockOrderResponse.order as TOrder,
        name: mockOrderResponse.name,
        orderErrorMessage: ''
      },
      action
    );

    // В текущей реализации resetOrder сбрасывает только orderModalData
    expect(state).toEqual({
      orderRequest: false,
      orderModalData: null, // Данные заказа сбрасываются
      name: mockOrderResponse.name, // Имя НЕ сбрасывается
      orderErrorMessage: '' // Ошибка остается пустой
    });
  });
});

// Определяем initialState для удобства
const initialState = {
  orderRequest: false,
  orderModalData: null,
  name: '',
  orderErrorMessage: ''
};
