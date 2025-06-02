import { loginUserApi, TAuthResponse, TLoginData } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

interface ILogin {
  loginSuccess: boolean;
  refreshToken: string;
  accessToken: string;
  user: TUser | null;
  loginErrorMessage: string | undefined;
}

const initialState: ILogin = {
  loginSuccess: false,
  refreshToken: '',
  accessToken: '',
  user: null,
  loginErrorMessage: ''
};

export const loginUserThunk = createAsyncThunk<
  TAuthResponse,
  TLoginData,
  { rejectValue: { loginSuccess: boolean; loginErrorMessage: string } }
>('user/login', async (userInfo, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(userInfo);
    return response;
  } catch (error) {
    // Обрабатываем разные форматы ошибок
    if (typeof error === 'object' && error !== null) {
      // Ошибка от сервера (с полем message)
      if ('message' in error && typeof (error as any).message === 'string') {
        return rejectWithValue({
          loginSuccess: false,
          loginErrorMessage: (error as any).message
        });
      }
      // Ошибка от API (с полем success и message)
      if ('success' in error && 'message' in error) {
        return rejectWithValue({
          loginSuccess: false,
          loginErrorMessage: (error as any).message
        });
      }
    }
    // Неизвестная ошибка
    return rejectWithValue({
      loginSuccess: false,
      loginErrorMessage: 'Неизвестная ошибка при входе'
    });
  }
});

const loginUserSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loginSuccess = false;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loginSuccess = false;
        state.loginErrorMessage = action.payload?.loginErrorMessage;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.refreshToken = action.payload.refreshToken;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.loginErrorMessage = '';
        state.loginSuccess = true;
      });
  }
});

export default loginUserSlice;
