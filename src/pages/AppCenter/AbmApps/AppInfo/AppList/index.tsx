import React, { useRef } from 'react';
import { Button, message, Drawer, Popconfirm, Avatar, Space } from 'antd';
import ProTable from '@ant-design/pro-table';

import { SyncOutlined } from '@ant-design/icons';
import { setDefaultApp, getAppList } from '@/pages/AppCenter/service';
import type { AppType, TableListPagination } from '@/pages/AppCenter/data';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

export interface AppListProps {
  onClose: (flag?: boolean) => void;
  onDefaultAppChanged: () => void;
  appListVisiable: boolean;
}

const AppList: React.FC<AppListProps> = (props) => {
  const actionRef = useRef<ActionType>();

  const {
    onClose: handleAppListVisiable,
    onDefaultAppChanged: handleGetDefaultApp,
    appListVisiable,
  } = props;
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  // 列表
  const columns: ProColumns<AppType>[] = [
    {
      title: '应用名',
      dataIndex: 'name',
      render: (_, record) => (
        <Space>
          <Avatar shape="square" src={record.icon} />
          {record.name}
        </Space>
      ),
    },
    {
      title: '应用大小',
      dataIndex: 'appSize',
      hideInSearch: true,
      width: '15%',
      render: (_, record: AppType) =>
        record.appSize ? `${Math.round(record.appSize / 1024 / 1024)}MB` : '--',
    },
    {
      title: '当前版本',
      dataIndex: 'version',
      hideInSearch: true,
      width: '15%',
    },
    {
      title: '开发商',
      dataIndex: 'company',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) =>
        record.defaultApp ? (
          '已选择'
        ) : (
          <Popconfirm
            title={`您当前选择的是【${record.name}】客户端`}
            placement="topRight"
            onConfirm={() => {
              setConfirmLoading(true);
              setDefaultApp({ adamId: record.adamId })
                .then(async (res) => {
                  if (res.code === '0') {
                    actionRef.current?.reloadAndRest?.();
                    handleGetDefaultApp();
                  } else {
                    message.error('选择默认应用发生错误，请重试');
                  }
                })
                .finally(() => {
                  setConfirmLoading(false);
                });
            }}
            okButtonProps={{ loading: confirmLoading }}
          >
            <Button key={`select-btn-${record.id}`}>选择</Button>
          </Popconfirm>
        ),
    },
  ];

  return (
    <Drawer
      width={'50%'}
      destroyOnClose
      title="应用列表"
      open={appListVisiable}
      onClose={() => handleAppListVisiable()}
      bodyStyle={{ background: '#f1f2f6' }}
    >
      <ProTable<AppType, TableListPagination>
        headerTitle="应用列表"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <SyncOutlined /> 刷新
          </Button>,
        ]}
        request={() => getAppList({ refresh: true })}
        columns={columns}
      />
    </Drawer>
  );
};

export default AppList;
