import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientSlice from '../slices/ingredientsSlice/ingredientsSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import constructorBurgerSlice from '../slices/burgerConstructorSlice/burgerConstructorSlice';
import ordersSlice from '../slices/ordersSlice';
import userSlice from '../slices/userSliceMain';
import orderBurgerSlice from '../slices/orderBurgerSlice/orderBurgerSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientSlice.reducer,
  constructorIngredients: constructorBurgerSlice.reducer, // Указываем ключ для части состояния
  orders: ordersSlice.reducer,
  user: userSlice.reducer,
  orderBurger: orderBurgerSlice.reducer
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
