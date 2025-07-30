import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  getFeedByNumber,
  getOrderByNumber
} from '../../slices/ordersSlice/ordersSlice';

type OrderInfoProps = {
  isPrivate?: boolean;
};

export const OrderInfo: FC<OrderInfoProps> = ({ isPrivate = false }) => {
  const dispatch = useDispatch();
  const { number } = useParams();

  const ingredients: TIngredient[] =
    useSelector((state: RootState) => state.ingredients.ingredients) ?? [];

  // Получаем все заказы нужного типа
  const orders = useSelector((state: RootState) =>
    isPrivate ? state.orders.userOrders : state.orders.orders
  );

  // Находим конкретный заказ по номеру
  const orderData = useMemo(() => {
    if (!number || !orders) return null;
    return orders.find((order) => order.number === Number(number));
  }, [number, orders]);

  // Если заказа нет в сторе, загружаем его
  useEffect(() => {
    if (!number || orderData) return;

    if (isPrivate) {
      dispatch(getOrderByNumber(Number(number)));
    } else {
      dispatch(getFeedByNumber(Number(number)));
    }
  }, [number, isPrivate, dispatch, orderData]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
