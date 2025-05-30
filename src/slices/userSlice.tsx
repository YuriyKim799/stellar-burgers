import { TAuthResponse, TRegisterData } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { registerUserApi } from '../utils/burger-api';
import { TUser } from '@utils-types';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  registerUserError: string | undefined;
  registerUserRequest: boolean;
  refreshToken: string;
  accessToken: string;
  success: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false, // флаг для статуса проверки токена пользователя
  isAuthenticated: false,
  data: null,
  registerUserError: '',
  registerUserRequest: false,
  refreshToken: '',
  accessToken: '',
  success: false
};

export const registerUser = createAsyncThunk<
  TAuthResponse, // Тип успешного ответа
  TRegisterData, // Тип входящих параметров
  { rejectValue: string } // Тип ошибки
>('user/loginUser', async (registerData, { rejectWithValue }) => {
  try {
    localStorage.setItem(
      'refreshToken',
      (await registerUserApi(registerData)).refreshToken
    );
    return await registerUserApi(registerData);
  } catch (error) {
    // Обработка различных форматов ошибок
    if (typeof error === 'string') return rejectWithValue(error);
    if (error instanceof Error) return rejectWithValue(error.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerUserRequest = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserRequest = false;
        state.registerUserError = action.payload || 'Ошибка регистрации';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // action.payload содержит TAuthResponse
        state.data = action.payload.user; // Сохраняем данные пользователя
        state.registerUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.refreshToken = action.payload.refreshToken;
        state.accessToken = action.payload.accessToken;
        state.success = action.payload.success;
      });
  }
});

export default userSlice;
