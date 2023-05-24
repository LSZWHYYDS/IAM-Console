import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import AdminsList from './components/AdminsList';
import RoleList from '@/pages/Permissions/Roles';

const roles = [
  { type: 'SUPER_ADMIN', name: '系统管理员' },
  { type: 'USER_ADMIN', name: '用户管理员' },
  { type: 'APP_ADMIN', name: '应用管理员' },
];

const tabList = [
  {
    key: 'system',
    tab: '系统内置角色',
  },
  {
    key: 'custom',
    tab: '自定义角色',
  },
];

const RolesList: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('system');

  const adminList = roles.map((role) => {
    return <AdminsList role={role} style={{ marginBottom: '24px' }} key={role.type} />;
  });
  return (
    <PageContainer
      tabList={tabList}
      tabActiveKey={currentTab}
      onTabChange={(activeKey: string) => setCurrentTab(activeKey)}
    >
      {currentTab === 'system' ? adminList : <RoleList isSelf={true} />}
    </PageContainer>
  );
};
export default RolesList;
