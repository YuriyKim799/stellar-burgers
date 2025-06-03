import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orderBurgerThunk, resetOrder } from '../../slices/orderSlice';
import { clearIngedients } from '../../slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigate = useNavigate();
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  const constructorItems = useSelector(
    (state: RootState) => state.constructorIngredients
  );

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const { orderRequest, orderModalData } = useSelector(
    (state: RootState) => state.order
  );

  const onOrderClick = () => {
    // Проверка авторизации
    if (!constructorItems.bun || !constructorItems.ingredients) {
      return;
    }

    if (isAuthenticated) {
      const ingredientsIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((ing) => ing._id)
      ];
      // Отправляем запрос на создание заказа
      dispatch(orderBurgerThunk(ingredientsIds));
    }
    navigate('/login');
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(clearIngedients());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
