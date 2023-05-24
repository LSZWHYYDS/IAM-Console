import React from 'react';
import { Modal } from 'antd';
import AdminResetForm from './AdminResetForm';

export interface ResetPasswordProps {
  visible: boolean;
  username: string;
  onClose: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
  const { visible, username, onClose } = props;

  return (
    <Modal title="密码重置" open={visible} destroyOnClose footer={null} onCancel={onClose}>
      <AdminResetForm username={username} onClose={onClose} />
    </Modal>
  );
};
export default ResetPassword;
