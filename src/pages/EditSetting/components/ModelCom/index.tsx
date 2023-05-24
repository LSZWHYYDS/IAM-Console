import React from 'react';
import { Modal } from 'antd';

const Index: React.FC<any> = (props) => {
  return (
    <>
      <Modal
        title="删除弹框"
        open={props.visible_delete}
        onOk={props.handleDeleteOk}
        onCancel={props.handleDeleteCancel}
      >
        <h3 style={{ color: '#333', marginTop: '20px' }}>确定要删除么?</h3>
      </Modal>
    </>
  );
};

export default Index;
