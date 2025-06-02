import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRegisterData
} from '../utils/burger-api';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie } from '../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  userData: TUser | null;
  errorMessage: string | undefined;
  isLoading: boolean;
  refreshToken: string;
  accessToken: string;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  userData: null,
  errorMessage: '',
  isLoading: false,
  refreshToken: '',
  accessToken: ''
};

// Регистрация пользователя
export const registerUser = createAsyncThunk<
  TAuthResponse,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (registerData, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(registerData);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  } catch (error) {
    if (typeof error === 'string') return rejectWithValue(error);
    if (error instanceof Error) return rejectWithValue(error.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

// Авторизация пользователя
export const loginUser = createAsyncThunk<
  TAuthResponse,
  TLoginData,
  { rejectValue: string }
>('user/login', async (loginData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(loginData);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue(error.message || 'Ошибка авторизации');
  }
});

// Проверка аутентификации
export const checkUser = createAsyncThunk(
  'user/check',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Можно добавить редукторы для выхода пользователя итд
  },
  extraReducers: (builder) => {
    builder
      // Ожидающие операции
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = '';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = '';
      })
      .addCase(checkUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = '';
      })
      // Успешные операции
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.refreshToken = action.payload.refreshToken;
        state.accessToken = action.payload.accessToken;
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.refreshToken = action.payload.refreshToken;
        state.accessToken = action.payload.accessToken;
        state.isLoading = false;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.userData = action.payload ? action.payload.user : null; // Сохраняем данные пользователя
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      // Ошибочные операции
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = (action.payload as string) || 'Ошибка регистрации';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = (action.payload as string) || 'Ошибка авторизации';
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.errorMessage = (action.payload as string) || 'Ошибка проверки';
      });
  }
});

export default userSlice;
