import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../slices/userSliceMain';
import { Preloader } from '@ui';
import { Modal } from '@components';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const user = useSelector((state: RootState) => state.user.userData);
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isFormChanged) {
      setFormValue((prevState) => ({
        ...prevState,
        name: formValue.name,
        email: formValue.email,
        password: formValue.password
      }));
    }
    dispatch(updateUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      {isLoading && (
        <Modal onClose={() => {}} title={'Обновляем данные...'}>
          <Preloader />
        </Modal>
      )}
      <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </>
  );
};
