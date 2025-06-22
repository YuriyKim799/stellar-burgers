import { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';
import { RootState, useSelector } from '../../../services/store';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation(); // Хук для определения текущего пути
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  // Определяем активные состояния для ссылок
  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname.startsWith('/feed');
  const isProfileActive = ['/profile', '/login'].includes(location.pathname);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            data-cy='data-constructor-link'
            to={'/'}
            className={
              isConstructorActive ? `${styles.link_active}` : `${styles.link}`
            }
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className={'text text_type_main-default ml-2 mr-10'}>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            to={'/feed'}
            className={
              isFeedActive ? `${styles.link_active}` : `${styles.link}`
            }
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <NavLink
            data-cy='data-login-link'
            to={isAuthenticated ? '/profile' : '/login'}
            className={
              isProfileActive ? `${styles.link_active}` : `${styles.link}`
            }
          >
            <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
