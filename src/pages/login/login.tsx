import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState, useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';
import { loginUser } from '../../slices/userSliceMain';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  const loginSuccess = useSelector(
    (state: RootState) => state.user.isAuthChecked
  );
  const errorMessage = useSelector(
    (state: RootState) => state.user.errorMessage
  );
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  if (loginSuccess) {
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
