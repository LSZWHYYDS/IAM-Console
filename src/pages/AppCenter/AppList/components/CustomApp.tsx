import { Drawer, Space, Button } from 'antd';
import React from 'react';

interface DrawerProps {
  drawerVisible: boolean;
  onClose: (flag?: boolean) => void;
  onSubmit: (values: any) => void;
}

const AddCustomApp: React.FC<DrawerProps> = (props) => {
  const { drawerVisible, onClose: setDrawerVisible, onSubmit: handleAdd } = props;

  const handleNext = async () => {
    handleAdd({ foo: 'bar' });
  };

  return (
    <Drawer
      title={'创建自定义应用'}
      closable={true}
      maskClosable={false}
      width={'600px'}
      open={drawerVisible}
      onClose={() => {
        setDrawerVisible(false);
      }}
      footer={
        <Space>
          <Button onClick={() => setDrawerVisible(false)}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            保存
          </Button>
        </Space>
      }
      footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      Hello World
    </Drawer>
  );
};

export default AddCustomApp;
