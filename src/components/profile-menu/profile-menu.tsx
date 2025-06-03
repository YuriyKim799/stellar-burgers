import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { logoutUser } from '../../slices/userSliceMain';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const useAppDispatch = () => useDispatch();
  const dispatch = useAppDispatch();
  const isLogout = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    if (isLogout) {
      navigate('/');
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
