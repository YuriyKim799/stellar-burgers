import ordersSlice, {
  getFeedByNumber,
  getOrdersAll,
  getUsersOrders,
  getOrderByNumber
} from './ordersSlice';
import { TOrder } from '../../utils/types';
import { TOrderResponse } from '../../../src/utils/burger-api';

// Моковые данные для тестов
const mockFeedResponse = {
  orders: [
    {
      _id: '1',
      status: 'done',
      name: 'Order 1',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      number: 1,
      ingredients: ['ing1', 'ing2']
    },
    {
      _id: '2',
      status: 'pending',
      name: 'Order 2',
      createdAt: '2023-01-02',
      updatedAt: '2023-01-02',
      number: 2,
      ingredients: ['ing3', 'ing4']
    }
  ],
  total: 100,
  totalToday: 10
};

const mockUserOrders = [
  {
    _id: '3',
    status: 'created',
    name: 'User Order',
    createdAt: '2023-01-03',
    updatedAt: '2023-01-03',
    number: 3,
    ingredients: ['ing5', 'ing6']
  }
];

const mockOrderResponse: TOrderResponse = {
  success: true, // Добавляем обязательное поле
  orders: [
    {
      _id: '4',
      status: 'done',
      name: 'Single Order',
      createdAt: '2023-01-04',
      updatedAt: '2023-01-04',
      number: 4,
      ingredients: ['ing7', 'ing8']
    }
  ]
};

const mockError = 'Server error';

describe('ordersSlice reducer', () => {
  // Тест 1: Проверка начального состояния
  it('должен вернуть initial state', () => {
    const state = ordersSlice.reducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      isLoading: false,
      orders: [],
      userOrders: [],
      order: null,
      total: null,
      totalToday: null,
      error: null,
      orderNumber: ''
    });
  });

  // Тесты для getOrdersAll
  describe('getOrdersAll', () => {
    it('isLoading true on pending', () => {
      const action = { type: getOrdersAll.pending.type };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('set orders and totals on fulfilled', () => {
      const action = {
        type: getOrdersAll.fulfilled.type,
        payload: mockFeedResponse
      };

      const state = ordersSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockFeedResponse.orders);
      expect(state.total).toBe(mockFeedResponse.total);
      expect(state.totalToday).toBe(mockFeedResponse.totalToday);
      expect(state.error).toBeNull();
    });

    it('set error on rejected', () => {
      const action = {
        type: getOrdersAll.rejected.type,
        payload: mockError
      };

      const state = ordersSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(mockError);
    });
  });

  // Тесты для getUsersOrders
  describe('getUsersOrders', () => {
    it('isLoading true on pending', () => {
      const action = { type: getUsersOrders.pending.type };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('set userOrders on fulfilled', () => {
      const action = {
        type: getUsersOrders.fulfilled.type,
        payload: mockUserOrders
      };

      const state = ordersSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.userOrders).toEqual(mockUserOrders);
    });

    it('reset loading on rejected', () => {
      const action = { type: getUsersOrders.rejected.type };
      const state = ordersSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
    });
  });

  // Тесты для getOrderByNumber
  describe('getOrderByNumber', () => {
    it('isLoading true on pending', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = ordersSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
    });

    it('set orders on fulfilled', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrderResponse
      };

      const state = ordersSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrderResponse.orders);
    });

    it('reset loading on rejected', () => {
      const action = { type: getOrderByNumber.rejected.type };
      const state = ordersSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
    });
  });
});

// Определяем initialState для удобства
const initialState = {
  isLoading: false,
  orders: [],
  userOrders: [],
  order: null,
  total: null,
  totalToday: null,
  error: null,
  orderNumber: ''
};
