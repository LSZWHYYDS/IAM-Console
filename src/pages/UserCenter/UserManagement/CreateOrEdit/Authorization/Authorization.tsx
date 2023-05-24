import { Modal, Input } from 'antd';
import React, { ChangeEvent, useState } from 'react';
const { TextArea } = Input;
interface Iprops {
  ApplyForVisible: boolean;
  ApplyForOkModal: (value: string) => void;
  ApplyForHideModal: () => void;
}

const AuthorizationCompon: React.FC<Iprops> = (props) => {
  const [areaTextArea, setSaveTextArea] = useState<string>('');
  const handleChange = (value: ChangeEvent<HTMLTextAreaElement>) => {
    setSaveTextArea(value.target.value);
  };
  return (
    <>
      <Modal
        title={<h3 style={{ color: '#f00' }}>管理员已开启审核功能，请填写申请说明</h3>}
        open={props.ApplyForVisible}
        onOk={() => props.ApplyForOkModal(areaTextArea)}
        onCancel={props.ApplyForHideModal}
        okText="提交"
        style={{ marginTop: '10%' }}
        width={750}
        closeIcon={true}
      >
        <TextArea
          rows={15}
          placeholder="请输入你的申请原因"
          style={{ resize: 'none' }}
          onChange={handleChange}
        />
      </Modal>
    </>
  );
};

export default AuthorizationCompon;
