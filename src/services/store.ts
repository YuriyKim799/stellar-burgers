import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientSlice from '../slices/ingredientsSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import constructorBurgerSlice from '../slices/burgerConstructorSlice';
import feedSlice from '../slices/feedsSlice';
import userSlice from '../slices/userSlice';

const rootReducer = combineReducers({
  ingredients: ingredientSlice.reducer,
  constructorIngredients: constructorBurgerSlice.reducer, // Указываем ключ для части состояния
  feeds: feedSlice.reducer,
  user: userSlice.reducer
}); // Заменить на импорт настоящего редьюсера // заменил

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
