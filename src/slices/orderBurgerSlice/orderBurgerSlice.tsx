import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { orderBurgerApi, TNewOrderResponse } from '../../utils/burger-api';
interface IOrder {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  name: string;
  orderErrorMessage: string;
}

const initialState: IOrder = {
  orderRequest: false,
  orderModalData: null,
  name: '',
  orderErrorMessage: ''
};

export const orderBurger = createAsyncThunk<TNewOrderResponse, string[]>(
  'order/create',
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response;
    } catch (error) {
      // Обрабатываем разные форматы ошибок
      if (typeof error === 'object' && error !== null) {
        // Ошибка от сервера (с полем message)
        if ('message' in error && typeof (error as any).message === 'string') {
          return rejectWithValue({
            orderRequest: false,
            orderErrorMessage: (error as any).message
          });
        }
        // Ошибка от API (с полем success и message)
        if ('success' in error && 'message' in error) {
          return rejectWithValue({
            orderRequest: false,
            orderErrorMessage: (error as any).message
          });
        }
      }
      // Неизвестная ошибка
      return rejectWithValue({
        orderRequest: false,
        message: 'Неизвестная ошибка при создании заказа'
      });
    }
  }
);

const orderBurgerSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder(state) {
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.name = action.payload.name;
      });
  }
});

export default orderBurgerSlice;
export const { resetOrder } = orderBurgerSlice.actions;
