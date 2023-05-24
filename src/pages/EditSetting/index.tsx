/* jshint esversion: 6 */
import React, { useState } from 'react';
import { Tabs, Card, Spin } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import EditPolicies from './EditPolicies';
import type { TabsProps } from 'antd';

const Setting: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const modifyLoadingStatus = () => {
    setLoading((newLoading) => !newLoading);
  };
  const TabsItem: TabsProps['items'] = [
    {
      key: 'policies',
      label: '基本信息',
      children: <EditPolicies modifyLoadingStatus={modifyLoadingStatus} />,
    },
  ];

  const render = () => {
    return (
      <PageContainer title={false}>
        <Spin
          spinning={loading}
          style={{ height: '80vh', opacity: 1, background: '#fff', maxHeight: 'unset' }}
        >
          <Card>
            <div className="pd-lr-20">
              <Tabs defaultActiveKey="policies" items={TabsItem} />
            </div>
          </Card>
        </Spin>
      </PageContainer>
    );
  };
  return render();
};

export default Setting;
