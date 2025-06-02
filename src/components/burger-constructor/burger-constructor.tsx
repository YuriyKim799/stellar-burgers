import { FC, useMemo } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { useDispatch } from 'react-redux';
// import { checkUser } from '../../slices/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { orderBurgerThunk } from '../../slices/orderSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigate = useNavigate();
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  // dispatch(
  //   orderBurgerThunk(['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e'])
  // );
  const constructorItems = useSelector(
    (state: RootState) => state.constructorIngredients
  );

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  // const orderRequest = useSelector((state: RootState) => state.user.success);

  // const orderModalData = useSelector((state: RootState) => state.order.order);
  // const orderModalData = {
  //   _id: 'string',
  //   status: 'string',
  //   name: 'string',
  //   createdAt: 'string',
  //   updatedAt: 'string',
  //   number: 123456,
  //   ingredients: ['asdasd', 'asdasd']
  // };

  const { orderRequest, orderModalData } = useSelector(
    (state: RootState) => state.order
  );

  const onOrderClick = () => {
    // Проверка авторизации
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (constructorItems.bun === null) {
      return;
    }
    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id)
    ];
    // Отправляем запрос на создание заказа
    dispatch(orderBurgerThunk(ingredientsIds));
  };

  const closeOrderModal = () => {};

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
