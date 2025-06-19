import userSlice, {
  registerUser,
  loginUser,
  checkUser,
  logoutUser,
  updateUser
} from '../userSliceMain/userSliceMain';
import { TUser } from '../../utils/types';
import { TAuthResponse, TUserResponse } from '../../utils/burger-api';

const initialState = {
  isAuthenticated: false,
  isLogout: false,
  logoutMessage: '',
  userData: null,
  errorMessage: '',
  isLoading: false,
  refreshToken: '',
  accessToken: ''
};

// Мокаем localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
});

// Мокаем функции работы с куками
jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => '')
}));

// Моковые данные для тестов
const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockAuthResponse: TAuthResponse = {
  success: true,
  user: mockUser,
  accessToken: 'access-token',
  refreshToken: 'refresh-token'
};

const mockUserResponse: TUserResponse = {
  success: true,
  user: mockUser
};

const mockError = 'Authentication failed';

describe('userSlice reducer', () => {
  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorageMock.clear();

    // Сбрасываем все моки
    jest.clearAllMocks();
  });

  // Тест 1: Проверка начального состояния
  it('должен вернуть initial state', () => {
    const state = userSlice.reducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      isAuthenticated: false,
      isLogout: false,
      logoutMessage: '',
      userData: null,
      errorMessage: '',
      isLoading: false,
      refreshToken: '',
      accessToken: ''
    });
  });

  // Тесты для registerUser
  describe('registerUser', () => {
    it('isLoading true on pending', () => {
      const action = { type: registerUser.pending.type };
      const state = userSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.errorMessage).toBe('');
    });

    it('set user data and tokens on fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockAuthResponse
      };

      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.accessToken).toBe('access-token');
      expect(state.refreshToken).toBe('refresh-token');
    });

    it('set error on rejected', () => {
      const action = {
        type: registerUser.rejected.type,
        payload: mockError
      };

      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(mockError);
    });
  });

  // Тесты для loginUser
  describe('loginUser', () => {
    it('isLoading true on pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.errorMessage).toBe('');
    });

    it('set user data and tokens on fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockAuthResponse
      };

      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.accessToken).toBe('access-token');
      expect(state.refreshToken).toBe('refresh-token');
    });

    it('set error on rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        payload: mockError
      };

      const state = userSlice.reducer(
        {
          ...initialState,
          isLoading: true,
          isAuthenticated: true,
          userData: mockUser
        },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.userData).toBeNull();
      expect(state.errorMessage).toBe(mockError);
    });
  });

  // Тесты для checkUser
  describe('checkUser', () => {
    it('isLoading true on pending', () => {
      const action = { type: checkUser.pending.type };
      const state = userSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.errorMessage).toBe('');
    });

    it('set user data and auth on fulfilled', () => {
      const action = {
        type: checkUser.fulfilled.type,
        payload: mockUserResponse
      };

      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.userData).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('set error on rejected', () => {
      const action = {
        type: checkUser.rejected.type,
        payload: mockError
      };

      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(mockError);
    });
  });

  // Тесты для logoutUser
  describe('logoutUser', () => {
    it('clear error on pending', () => {
      const action = { type: logoutUser.pending.type };
      const state = userSlice.reducer(
        { ...initialState, errorMessage: 'Previous error' },
        action
      );

      expect(state.errorMessage).toBe('');
    });

    it('reset auth state on fulfilled', () => {
      // Предварительно сохраняем токен в localStorage
      localStorage.setItem('refreshToken', 'test-refresh-token');

      const action = { type: logoutUser.fulfilled.type };

      const state = userSlice.reducer(
        {
          ...initialState,
          isAuthenticated: true,
          userData: mockUser,
          accessToken: 'token',
          refreshToken: 'refresh'
        },
        action
      );

      expect(state.isAuthenticated).toBe(false);
      expect(state.userData).toBeNull();
      expect(state.accessToken).toBe('');
      expect(state.refreshToken).toBe('');

      // Проверяем, что токен удален из localStorage
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });

    it('set error on rejected', () => {
      const action = {
        type: logoutUser.rejected.type,
        payload: mockError
      };

      const state = userSlice.reducer(initialState, action);

      expect(state.errorMessage).toBe(mockError);
    });
  });

  // Тесты для updateUser
  describe('updateUser', () => {
    it('isLoading true on pending', () => {
      const action = { type: updateUser.pending.type };
      const state = userSlice.reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.errorMessage).toBe('');
    });

    it('update user data on fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated User' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: { ...mockUserResponse, user: updatedUser }
      };

      const state = userSlice.reducer(
        {
          ...initialState,
          isLoading: true,
          userData: mockUser
        },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.userData).toEqual(updatedUser);
    });

    it('set error on rejected', () => {
      const action = {
        type: updateUser.rejected.type,
        payload: mockError
      };

      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        action
      );

      expect(state.isLoading).toBe(false);
      expect(state.errorMessage).toBe(mockError);
    });
  });
});
