import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState, useSelector } from '../../services/store';
import { fetchFeeds } from '../../slices/feedsSlice';
import { fetchIngredients } from '../../slices/ingredientsSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchFeeds());
  }, []);
  const feedsOrder = useSelector((state: RootState) => state.feeds.orders);

  const orders: TOrder[] = feedsOrder ?? [];

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        console.log('fetchIngredients');
        dispatch(fetchIngredients());
      }}
    />
  );
};
