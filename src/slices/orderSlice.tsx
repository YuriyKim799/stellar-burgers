import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';
import { orderBurgerApi, TNewOrderResponse } from '@api';

type TOrderErrorResponse = {
  orderRequest: false;
  message: string;
};

interface IOrder {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  name: string;
}

const initialState: IOrder = {
  orderRequest: false,
  orderModalData: null,
  name: ''
};

export const orderBurgerThunk = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { rejectValue: TOrderErrorResponse }
>('order/create', async (ingredients, { rejectWithValue }) => {
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
          message: (error as any).message
        });
      }
      // Ошибка от API (с полем success и message)
      if ('success' in error && 'message' in error) {
        return rejectWithValue({
          orderRequest: false,
          message: (error as any).message
        });
      }
    }
    // Неизвестная ошибка
    return rejectWithValue({
      orderRequest: false,
      message: 'Неизвестная ошибка при создании заказа'
    });
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(orderBurgerThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurgerThunk.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(orderBurgerThunk.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = true;
        state.name = action.payload.name;
      });
  }
});

export default orderSlice;
