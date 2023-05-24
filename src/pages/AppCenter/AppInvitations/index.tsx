import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import SmsInvitations from './SmsInvitations';
import EmailInvitations from './EmailInvitations';
import InvitationsRecord from './InvitationsRecord';
import { getDefaultApp } from '@/pages/AppCenter/service';
import type { AppType } from '@/pages/AppCenter/data';

const tabList = [
  {
    key: 'sms',
    tab: '短信邀请',
  },
  {
    key: 'email',
    tab: '邮件邀请',
  },
  {
    key: 'record',
    tab: '发送记录',
  },
];

const AppInvitations: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('sms');
  const [appInfo, setAppInfo] = useState<AppType>();

  // 获取默认应用
  const handleGetDefaultApp = async () => {
    try {
      const result = await getDefaultApp();
      setAppInfo(result.data);
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    handleGetDefaultApp();
  }, []);

  return (
    <PageContainer
      tabList={tabList}
      tabActiveKey={currentTab}
      onTabChange={(activeKey: string) => setCurrentTab(activeKey)}
    >
      {currentTab === 'sms' ? <SmsInvitations appInfo={appInfo || {}} /> : null}
      {currentTab === 'email' ? <EmailInvitations appInfo={appInfo || {}} /> : null}
      {currentTab === 'record' ? <InvitationsRecord /> : null}
    </PageContainer>
  );
};

export default AppInvitations;
