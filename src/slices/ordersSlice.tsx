import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';
import {
  getFeedsApi,
  TOrderResponse,
  getOrderByNumberApi,
  getOrdersApi
} from '../utils/burger-api';

interface IOrders {
  isLoading: boolean;
  orders: TOrder[] | undefined;
  userOrders: TOrder[] | undefined;
  total: number | null | undefined;
  totalToday: number | null | undefined;
  error: string | null;
  orderNumber: string;
  order: TOrder | null;
}

const initialState: IOrders = {
  isLoading: false,
  orders: [],
  userOrders: [],
  order: null,
  total: null,
  totalToday: null,
  error: null,
  orderNumber: ''
};

export const getOrdersAll = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message); // Тип payload будет string
      }
    }
  }
);

export const getUsersOrders = createAsyncThunk(
  'userOrders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrdersApi();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message); // Тип payload будет string
      }
    }
  }
);

export const getOrderByNumber = createAsyncThunk<TOrderResponse, number>(
  'order/get',
  async (number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response;
    } catch (error) {
      // Обработка различных форматов ошибок
      const errorMessage =
        typeof error === 'object' && error !== null
          ? 'message' in error
            ? (error as { message: string }).message
            : 'success' in error
              ? (error as { message?: string }).message ||
                'Ошибка при получении заказа'
              : 'Неизвестная ошибка'
          : 'Неизвестная ошибка';

      return rejectWithValue({
        error: errorMessage
      });
    }
  }
);

const ordersSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {
    getFeedByNumber: (state, action: PayloadAction<number>) => {
      state.order =
        state.orders?.find((order) => order.number === action.payload) || null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersAll.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrdersAll.fulfilled, (state, action) => {
        state.orders = action.payload?.orders;
        state.total = action.payload?.total;
        state.totalToday = action.payload?.totalToday;
        state.isLoading = false;
      })
      .addCase(getOrdersAll.rejected, (state, action) => {
        state.isLoading = true;
        state.error = action.payload as string;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
      })
      .addCase(getUsersOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsersOrders.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUsersOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      });
  }
});
export const { getFeedByNumber } = ordersSlice.actions;
export default ordersSlice;
