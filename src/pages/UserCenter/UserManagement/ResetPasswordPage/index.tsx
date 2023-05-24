import React from 'react';
import { history } from 'umi';
import staticMethod from '@/utils/staticMethod';
import ResetPasswordForm from '../ResetPasswordForm';

const ResetPasswordPage: React.FC = () => {
  const username = sessionStorage.getItem('loginId');
  const query = staticMethod.parseQueryString(window.location.href) || {};
  if (!username && !query.reset_password_token) {
    return '用户名为空，无法修改密码';
  }
  const onClose = () => {
    history.push('/user/login');
  };
  return (
    <ResetPasswordForm
      username={username}
      reset_password_token={query.reset_password_token}
      tcode={query.tcode}
      onClose={onClose}
    />
  );
};
export default ResetPasswordPage;
