import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState, useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';
import { checkUser, loginUser } from '../../slices/userSliceMain/userSliceMain';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const errorMessage = useSelector(
    (state: RootState) => state.user.errorMessage
  );
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <LoginUI
      errorText={errorMessage ? errorMessage : ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
