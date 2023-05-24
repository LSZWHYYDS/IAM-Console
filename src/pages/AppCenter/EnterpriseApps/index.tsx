import { PageContainer } from '@ant-design/pro-layout';
import { FC } from 'react';
import { useState } from 'react';
import IosAppList from './IosApps';
import AndroidAppList from './AndroidApps';
import Windows from './windows';
import Mac from './mac';
const tabList = [
  {
    key: 'ios',
    tab: 'iOS 应用',
  },
  {
    key: 'android',
    tab: 'Android 应用',
  },
  {
    key: 'windows',
    tab: 'Windows 应用',
  },
  {
    key: 'mac',
    tab: 'Mac 应用',
  },
];
const tabComList = {
  ios: <IosAppList />,
  android: <AndroidAppList />,
  windows: <Windows />,
  mac: <Mac />,
};
const EnterpriseApps: FC = () => {
  const [currentTab, setCurrentTab] = useState<string>(
    sessionStorage.getItem('activeKey') || 'ios',
  );
  return (
    <PageContainer
      tabList={tabList}
      tabActiveKey={currentTab || 'info'}
      onTabChange={(activeKey: string) => {
        sessionStorage.setItem('activeKey', activeKey);
        setCurrentTab(activeKey);
      }}
    >
      {tabComList[currentTab]}
    </PageContainer>
  );
};

export default EnterpriseApps;
