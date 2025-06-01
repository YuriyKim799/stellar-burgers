import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { checkUser } from '../../slices/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState, useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();
  const success = useSelector((state: RootState) => state.user.success);
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(checkUser());
  };

  if (success) {
    return <Navigate to={'/'} />;
  }

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
