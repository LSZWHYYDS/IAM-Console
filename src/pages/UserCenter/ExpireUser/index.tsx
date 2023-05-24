import type { TableListPagination } from '@/pages/AppCenter/data';
import { parseQueryString } from '@/utils/common.utils';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Layout } from 'antd';
import React, { useRef } from 'react';
import type { UserType } from '../data';
import { getExpire } from '../service';

const { Content } = Layout;

const ExpireUser: React.FC = () => {
  const actionRef = useRef<ActionType>();

  // 列表
  const columns: ProColumns<UserType>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: '25%',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机',
      dataIndex: 'phone_number',
    },
    {
      title: '组织架构',
      dataIndex: 'orgs',
      width: '10%',
      hideInSearch: true,
      render: (_, record: UserType) => {
        if (record.orgs && record.orgs.length > 0) {
          return record.orgs.join();
        }
        return '-';
      },
    },
    {
      title: '账号有效期',
      dataIndex: 'end_date',
      width: '10%',
    },
  ];

  // 重新邀请用户
  const renderTable = () => {
    return (
      <ProTable<UserType, TableListPagination>
        actionRef={actionRef}
        rowKey="username"
        search={false}
        options={false}
        // dataSource={userList}
        request={async (pagination) => {
          const query = parseQueryString(window.location.search);
          const params: any = {
            pageSize: pagination?.pageSize,
            pageNo: pagination?.current,
            id: (query.a && query.a.toString()) || '10',
          };
          console.log(window.location.search);
          const result: any = await getExpire(params);
          return result;
        }}
        columns={columns}
        tableAlertRender={false}
        pagination={{
          showSizeChanger: true,
          pageSize: 10,
        }}
      />
    );
  };
  const path = window.location.pathname;
  if (path === '/uc/expireUser') {
    return renderTable();
  }
  return (
    <PageContainer title={false}>
      <Content>{renderTable()}</Content>
    </PageContainer>
  );
};

export default ExpireUser;
