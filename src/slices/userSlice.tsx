import { getUserApi, TAuthResponse, TRegisterData } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registerUserApi } from '../utils/burger-api';
import { TUser } from '@utils-types';
import { setCookie } from '../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  errorMessage: string | undefined;
  registerUserRequest: boolean;
  refreshToken: string;
  accessToken: string;
  success: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false, // флаг для статуса проверки токена пользователя
  isAuthenticated: false,
  data: null,
  errorMessage: '',
  registerUserRequest: false,
  refreshToken: '',
  accessToken: '',
  success: false
};

export const registerUser = createAsyncThunk<
  TAuthResponse, // Тип успешного ответа
  TRegisterData, // Тип входящих параметров
  { rejectValue: string } // Тип ошибки
>('user/registerUser', async (registerData, { rejectWithValue }) => {
  try {
    // Вызываем API только один раз
    const response = await registerUserApi(registerData);
    // Проверяем, что ответ содержит необходимые данные
    if (!response.accessToken || !response.refreshToken) {
      return rejectWithValue('Неверный ответ сервера');
    }
    // Сохраняем токены
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  } catch (error) {
    // Обработка различных форматов ошибок
    if (typeof error === 'string') return rejectWithValue(error);
    if (error instanceof Error) return rejectWithValue(error.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

export const checkUser = createAsyncThunk(
  'user/checkUser',
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
  name: 'user/getUser',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerUserRequest = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserRequest = false;
        state.errorMessage = action.error.message;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // action.payload содержит TAuthResponse
        state.data = action.payload.user; // Сохраняем данные пользователя
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.refreshToken = action.payload.refreshToken;
        state.accessToken = action.payload.accessToken;
        state.success = action.payload.success;
      })
      .addCase(checkUser.pending, (state) => {
        state.registerUserRequest = true;
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.errorMessage = action.error.message;
        state.success = false;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.data = action.payload ? action.payload.user : null; // Сохраняем данные пользователя
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.success = action.payload ? true : false;
      });
  }
});

export default userSlice;
