import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card } from 'antd';
import { history, useParams } from 'umi';

const AppDetails: React.FC = () => {
  const params: any = useParams();
  const { id } = params;
  return (
    <PageContainer
      title="应用信息"
      extra={[
        <Button key="BACK" onClick={() => history.goBack()}>
          返回
        </Button>,
        <Button key="EDIT" type="primary" onClick={() => history.push(`/apps/applist/${id}/edit`)}>
          编辑
        </Button>,
      ]}
    >
      <Card title="应用信息">HELLO WORLD!</Card>
    </PageContainer>
  );
};
export default AppDetails;
