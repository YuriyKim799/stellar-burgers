import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { RootState, useSelector } from '../../services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */

  const orders: TOrder[] =
    useSelector((state: RootState) => state.orders.orders) ?? [];

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        console.log('Обновить');
      }}
    />
  );
};
