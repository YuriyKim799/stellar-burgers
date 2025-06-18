import constructorBurgerSlice, {
  addIngredient,
  removeIngredient,
  changePositionDown,
  changePositionUp,
  clearIngedients
} from '../burgerConstructorSlice/burgerConstructorSlice';
import { TConstructorIngredient } from '../../utils/types';
import mockIngredients from '../../utils/mocks/ingredients.json';

describe('constructorBurgerSlice reducer', () => {
  // Создаем функции для преобразования данных
  const toConstructorIngredient = (
    ingredient: (typeof mockIngredients)[0]
  ): TConstructorIngredient => ({
    ...ingredient,
    id: ingredient._id // Добавляем поле id если оно требуется
  });

  // Выбираем конкретные ингредиенты из моковых данных
  const [mockBun1, mockBun2, mockMain, mockSauce, ...restIngredients] =
    mockIngredients.map(toConstructorIngredient);

  // Тест 1: Проверка начального состояния
  it('должен вернуть initial state', () => {
    const initialState = constructorBurgerSlice.reducer(undefined, {
      type: 'unknown'
    });

    expect(initialState).toEqual({
      bun: null,
      ingredients: [],
      success: false
    });
  });

  // Тест 2: Добавление булки
  it('должен добавить bun', () => {
    const action = addIngredient(mockBun1);
    const state = constructorBurgerSlice.reducer(undefined, action);

    expect(state.bun).toEqual(mockBun1);
    expect(state.ingredients).toHaveLength(0);
  });

  // Тест 3: Добавление обычного ингредиента
  it('должен добавить обычный ингредиент', () => {
    const initialState = { bun: null, ingredients: [], success: false };
    const action = addIngredient(mockMain);
    const state = constructorBurgerSlice.reducer(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockMain);
  });

  // Тест 4: Замена булки
  it('должен поменять существующий bun', () => {
    const initialState = { bun: mockBun2, ingredients: [], success: false };
    const newBun: TConstructorIngredient = {
      ...mockBun2,
      _id: 'bun2',
      name: 'Новая булка'
    };

    const action = addIngredient(newBun);
    const state = constructorBurgerSlice.reducer(initialState, action);

    expect(state.bun).toEqual(newBun);
    expect(state.ingredients).toHaveLength(0);
  });

  // Тест 5: Удаление ингредиента
  it('должен удалить ингредиент по индексу', () => {
    const initialState = {
      bun: mockBun1,
      ingredients: [mockMain, mockSauce],
      success: false
    };

    const action = removeIngredient(0);
    const state = constructorBurgerSlice.reducer(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(mockSauce);
  });

  // Тест 6: Перемещение ингредиента вниз
  it('должен переместить ингредиент вниз', () => {
    const initialState = {
      bun: mockBun1,
      ingredients: [mockMain, mockSauce],
      success: false
    };

    const action = changePositionDown(0);
    const state = constructorBurgerSlice.reducer(initialState, action);

    expect(state.ingredients).toEqual([mockSauce, mockMain]);
  });

  // Тест 7: Перемещение ингредиента вверх
  it('должен перевести ингредиент вверх', () => {
    const initialState = {
      bun: mockBun1,
      ingredients: [mockMain, mockSauce],
      success: false
    };

    const action = changePositionUp(1);
    const state = constructorBurgerSlice.reducer(initialState, action);

    expect(state.ingredients).toEqual([mockSauce, mockMain]);
  });

  // Тест 8: Перемещение первого элемента вверх (циклический сдвиг)
  it('зацикливаем перемещиние первого ингредиента вверх', () => {
    const initialState = {
      bun: mockBun1,
      ingredients: [mockMain, mockSauce],
      success: false
    };

    const action = changePositionUp(0);
    const state = constructorBurgerSlice.reducer(initialState, action);

    expect(state.ingredients).toEqual([mockSauce, mockMain]);
  });

  // Тест 9: Перемещение последнего элемента вниз (циклический сдвиг)
  it('зацикливаем перемещиние последнего ингредиента вниз', () => {
    const initialState = {
      bun: mockBun1,
      ingredients: [mockMain, mockSauce],
      success: false
    };

    const action = changePositionDown(1);
    const state = constructorBurgerSlice.reducer(initialState, action);

    expect(state.ingredients).toEqual([mockSauce, mockMain]);
  });

  // Тест 10: Очистка конструктора
  it('должен очистить все ингредиенты', () => {
    const initialState = {
      bun: mockBun1,
      ingredients: [mockMain, mockSauce],
      success: false
    };

    const action = clearIngedients();
    const state = constructorBurgerSlice.reducer(initialState, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
