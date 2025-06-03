import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  refreshToken
} from '../utils/burger-api';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getCookie, setCookie } from '../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean; // user зарегился залогинился и авторизовался
  isLogout: boolean;
  logoutMessage: string;
  userData: TUser | null;
  errorMessage: string | undefined;
  isLoading: boolean;
  refreshToken: string;
  accessToken: string;
};

const initialState: TUserState = {
  isAuthChecked: false, // есть ли на сервере такой персонаж
  isAuthenticated: false, // user зарегился залогинился и авторизовался
  isLogout: false, // user разлогинился или нет
  logoutMessage: '', // сообщение с сервера при разлогировании
  userData: null, // user инфа логин пассворд почта
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
  } catch (error: any) {
    return rejectWithValue(error.message);
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
    } catch (error: any) {
      if (error.message === 'jwt expired') {
        try {
          // Пытаемся обновить токен
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            return rejectWithValue('Refresh token отсутствует');
          }
          // Повторяем запрос с новым токеном
          const response = await getUserApi();
          return response;
        } catch (refreshError) {
          return rejectWithValue('Ошибка обновления токена');
        }
      }
      return rejectWithValue(error.message || 'Ошибка проверки');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      .addCase(logoutUser.pending, (state) => {
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
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLogout = action.payload.success;
        state.userData = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true; // Помечаем проверку как завершённую
        setCookie('accessToken', ''); // Удаляем куку
        localStorage.removeItem('refreshToken'); // Удаляем из localStorage
      })
      // Ошибочные операции
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = (action.payload as string) || 'Ошибка регистрации';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true; // Важно: помечаем проверку как завершённую
        state.isAuthenticated = false; // Гарантируем сброс авторизации
        state.userData = null;
        state.errorMessage = (action.payload as string) || 'Ошибка авторизации';
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = (action.payload as string) || 'Ошибка проверки';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLogout = false;
        state.errorMessage = action.payload as string;
      });
  }
});

export default userSlice;
