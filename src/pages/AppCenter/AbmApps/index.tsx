import { PageContainer } from '@ant-design/pro-layout';
import type { FC } from 'react';
import { useState } from 'react';

import AppInfoPage from './AppInfo';
import TokenManagement from './TokenManagement';

const tabList = [
  {
    key: 'info',
    tab: '默认应用',
  },
  {
    key: 'token',
    tab: '令牌管理',
  },
];

const AbmApps: FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('info');

  return (
    <PageContainer
      tabList={tabList}
      tabActiveKey={currentTab || 'info'}
      onTabChange={(activeKey: string) => setCurrentTab(activeKey)}
    >
      {currentTab === 'info' ? <AppInfoPage /> : <TokenManagement />}
    </PageContainer>
  );
};

export default AbmApps;
