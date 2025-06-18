import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  TUserResponse,
  updateUserApi
} from '../utils/burger-api';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie } from '../utils/cookie';

type TUserState = {
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

export const updateUser = createAsyncThunk<
  TUserResponse,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (updateData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(updateData);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
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
        state.errorMessage = '';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = '';
      })
      // Успешные операции
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isAuthenticated = true;
        state.refreshToken = action.payload.refreshToken;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isAuthenticated = true;
        state.refreshToken = action.payload.refreshToken;
        state.accessToken = action.payload.accessToken;
        state.isLoading = false;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.userData = action.payload ? action.payload.user : null; // Сохраняем данные пользователя
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userData = null;
        state.isAuthenticated = false;
        setCookie('accessToken', ''); // Удаляем куку
        localStorage.removeItem('refreshToken'); // Удаляем из localStorage
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.user) {
          state.userData = action.payload.user;
        }
      })
      // Ошибочные операции
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = (action.payload as string) || 'Ошибка регистрации';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.userData = null;
        state.errorMessage = (action.payload as string) || 'Ошибка авторизации';
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = (action.payload as string) || 'Ошибка проверки';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.errorMessage = action.payload as string;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.errorMessage = action.payload as string;
      });
  }
});

export default userSlice;
