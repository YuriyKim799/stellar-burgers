import ingredientSlice, { fetchIngredients } from './ingredientsSlice';
import mockIngredients from '../../utils/mocks/ingredients.json';

describe('ingredientSlice reducer', () => {
  it('должен вручную инициализировать стейт', () => {
    expect(ingredientSlice.reducer(undefined, { type: 'unknown' })).toEqual({
      ingredients: [],
      isIngredientsLoading: false,
      error: null
    });
  });

  it('устанавливает isIngredientsLoading в pending на true', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientSlice.reducer(initialState, action);

    expect(state).toEqual({
      ingredients: [],
      isIngredientsLoading: true,
      error: null
    });
  });

  it('должен устанавливать ингредиенты и isIngredientsLoading на false при fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };

    const state = ingredientSlice.reducer(initialState, action);

    expect(state).toEqual({
      ingredients: mockIngredients,
      isIngredientsLoading: false,
      error: null
    });
  });

  it('должен устанавливать в error errorMessage и isIngredientsLoading на false при rejected', () => {
    const errorMessage = 'Network error';
    const action = {
      type: fetchIngredients.rejected.type,
      payload: errorMessage
    };

    const state = ingredientSlice.reducer(initialState, action);

    expect(state).toEqual({
      ingredients: [],
      isIngredientsLoading: false,
      error: errorMessage
    });
  });
});

// Определяем initialState для удобства
const initialState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};
