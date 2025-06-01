import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { RootState, useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector((state: RootState) => state.user.data);
  return <AppHeaderUI userName={user?.name} />;
};
