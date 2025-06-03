import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';
import { getFeedsApi } from '../utils/burger-api';

interface IFeeds {
  success: boolean;
  orders: TOrder[] | undefined;
  total: number | null | undefined;
  totalToday: number | null | undefined;
  status: string;
  error: string | null;
}

const initialState: IFeeds = {
  success: false,
  orders: [],
  total: null,
  totalToday: null,
  status: 'idle',
  error: null
};

export const fetchFeeds = createAsyncThunk(
  'feeds/fetchAll',
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

const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload?.orders;
        state.total = action.payload?.total;
        state.totalToday = action.payload?.totalToday;
        state.success = true;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export default feedSlice;
