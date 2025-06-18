import { rootReducer } from './store'; // Импортируем rootReducer
import ingredientSlice from '../slices/ingredientsSlice/ingredientsSlice';
import constructorBurgerSlice from '../slices/burgerConstructorSlice/burgerConstructorSlice';
import ordersSlice from '../slices/ordersSlice';
import userSlice from '../slices/userSliceMain';
import orderBurgerSlice from '../slices/orderBurgerSlice/orderBurgerSlice';

describe('rootReducer', () => {
  it('should correctly combine all reducers', () => {
    const testAction = { type: 'UNKNOWN_ACTION' };
    const initialState = rootReducer(undefined, testAction);

    // Проверяем каждую ветку состояния
    expect(initialState.ingredients).toEqual(
      ingredientSlice.reducer(undefined, testAction)
    );

    expect(initialState.constructorIngredients).toEqual(
      constructorBurgerSlice.reducer(undefined, testAction)
    );

    expect(initialState.orders).toEqual(
      ordersSlice.reducer(undefined, testAction)
    );

    expect(initialState.user).toEqual(userSlice.reducer(undefined, testAction));

    expect(initialState.orderBurger).toEqual(
      orderBurgerSlice.reducer(undefined, testAction)
    );
  });
});
