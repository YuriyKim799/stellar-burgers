import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { getOrdersAll } from '../../slices/ordersSlice';
import { Modal } from '../../components/modal/modal';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const useAppDispatch = () => useDispatch();
  const dispatch = useAppDispatch();
  const orders: TOrder[] =
    useSelector((state: RootState) => state.orders.orders) ?? [];
  const isLoading = useSelector((state: RootState) => state.orders.isLoading);

  if (!orders.length) {
    // return <Preloader />;
    <>
      <FeedUI orders={[]} handleGetFeeds={() => {}} />
    </>;
  }

  return (
    <>
      {isLoading && (
        <Modal onClose={() => {}} title={'Обновляем заказы...'}>
          <Preloader />
        </Modal>
      )}
      <FeedUI
        orders={orders}
        handleGetFeeds={() => {
          dispatch(getOrdersAll());
        }}
      />
    </>
  );
};
