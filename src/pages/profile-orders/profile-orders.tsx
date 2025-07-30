import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useDispatch } from '../../services/store';
import { getUsersOrders } from '../../slices/ordersSlice/ordersSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsersOrders());
  }, [dispatch]);
  const orders: TOrder[] =
    useSelector((state: RootState) => state.orders.userOrders) ?? [];

  return <ProfileOrdersUI orders={orders} />;
};
