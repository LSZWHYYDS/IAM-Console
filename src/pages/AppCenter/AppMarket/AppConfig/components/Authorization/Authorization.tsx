import React from 'react';
import EditAppAuthorities from './component/components/EditAppAuthorities';
import { Card } from 'antd';

const EditApp: React.FC<any> = (props: any) => {
  return (
    <Card bordered={false}>
      <EditAppAuthorities id={props.id} />
    </Card>
  );
};
export default EditApp;
