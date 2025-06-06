import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '../utils/types';

interface IIngredients {
  success: boolean;
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: IIngredients = {
  bun: null,
  ingredients: [],
  success: false
};

const constructorBurgerSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredient = action.payload;
      // Если ингредиент - булка
      if (ingredient.type === 'bun') {
        state.bun = ingredient; // Заменяем текущую булку
      }
      // Если обычный ингредиент
      else {
        state.ingredients.push(ingredient);
      }
    },
    changePositionDown: (state, action: PayloadAction<number>) => {
      const currentIndex = action.payload;
      const ingredients = state.ingredients;
      const totalItems = ingredients.length;
      // Если элементов меньше 2, ничего не делаем
      if (totalItems < 2) return;
      // Вычисляем новый индекс с учетом циклического сдвига
      const nextIndex = (currentIndex + 1) % totalItems;
      // Меняем местами текущий элемент со следующим
      [ingredients[currentIndex], ingredients[nextIndex]] = [
        ingredients[nextIndex],
        ingredients[currentIndex]
      ];
    },
    changePositionUp: (state, action: PayloadAction<number>) => {
      const currentIndex = action.payload;
      const ingredients = state.ingredients;
      const totalItems = ingredients.length;
      if (totalItems < 2) return;
      // Вычисляем новый индекс с циклическим сдвигом
      const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
      // Меняем местами текущий элемент с предыдущим
      [ingredients[currentIndex], ingredients[prevIndex]] = [
        ingredients[prevIndex],
        ingredients[currentIndex]
      ];
    },
    // Удаление ингредиента
    removeIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.ingredients.splice(index, 1);
    },
    clearIngedients: (state) => {
      state.ingredients = [];
      state.bun = null;
    }
  }
});

export const {
  addIngredient,
  changePositionDown,
  changePositionUp,
  removeIngredient,
  clearIngedients
} = constructorBurgerSlice.actions;

export default constructorBurgerSlice;
