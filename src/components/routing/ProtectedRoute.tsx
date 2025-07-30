// import { useSelector } from 'react-redux';
// import { RootState } from '../../services/store';
// import { Navigate, useLocation } from 'react-router-dom';
// import { Preloader } from '@ui';

// type ProtectedRouteProps = {
//   children: React.ReactElement;
//   onlyUnAuth?: boolean;
// };

// export const ProtectedRoute = ({
//   children,
//   onlyUnAuth
// }: ProtectedRouteProps) => {
//   const isAuthenticated = useSelector(
//     (state: RootState) => state.user.isAuthenticated
//   );
//   const user = useSelector((state: RootState) => state.user.userData);
//   const location = useLocation();

//   if (isAuthenticated) {
//     // пока идёт чекаут пользователя , показываем прелоадер
//     return <Preloader />;
//   }

//   if (!onlyUnAuth && !user) {
//     //  если маршрут для авторизованного пользователя, но пользователь неавторизован, то делаем редирект
//     return <Navigate replace to='/login' state={{ from: location }} />; // в поле from объекта location.state записываем информацию о URL
//   }

//   if (onlyUnAuth && user) {
//     //  если маршрут для неавторизованного пользователя, но пользователь авторизован
//     // при обратном редиректе  получаем данные о месте назначения редиректа из объекта location.state
//     // в случае если объекта location.state?.from нет — а такое может быть , если мы зашли на страницу логина по прямому URL
//     // мы сами создаём объект c указанием адреса и делаем переадресацию на главную страницу
//     const from = location.state?.from || { pathname: '/' };

//     return <Navigate replace to={from} />;
//   }

//   return children;
// };

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
