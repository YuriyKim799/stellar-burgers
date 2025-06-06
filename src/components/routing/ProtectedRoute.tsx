import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const userData = useSelector((state: RootState) => state.user.userData);
  const location = useLocation();

  if (isLoading) {
    // пока идёт чекаут пользователя , показываем прелоадер
    return <Preloader />;
  }

  // Обработка маршрутов только для неавторизованных пользователей
  if (onlyUnAuth && isAuthenticated && userData) {
    // Возвращаем на предыдущую страницу или на главную
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
    // return null;
  }

  // Обработка защищенных маршрутов (только для авторизованных)
  if (!onlyUnAuth && !isAuthenticated) {
    // Перенаправляем на логин, сохраняя текущий путь для возврата
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
