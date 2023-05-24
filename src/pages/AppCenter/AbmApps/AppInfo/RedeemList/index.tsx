import React, { useRef } from 'react';
import { Button, Drawer, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { SyncOutlined } from '@ant-design/icons';
import { getCdKeyList } from '@/pages/AppCenter/service';
import type { cdkeyItemType, TableListPagination } from '@/pages/AppCenter/data';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

export interface RedeemListProps {
  onClose: (flag?: boolean) => void;

  redeemListVisible: boolean;
}

const RedeemList: React.FC<RedeemListProps> = (props) => {
  const actionRef = useRef<ActionType>();

  const { onClose: handleRedeemListVisible, redeemListVisible } = props;

  // 列表
  const columns: ProColumns<cdkeyItemType>[] = [
    {
      title: '兑换码',
      dataIndex: 'orderId',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      render: (_, record: cdkeyItemType) =>
        record.status && record.status === 1 ? (
          <Tag color="default">已兑换</Tag>
        ) : (
          <Tag color="success">未兑换</Tag>
        ),
    },
    {
      title: '兑换时间',
      dataIndex: 'updateTime',
      hideInSearch: true,
      render: (_, record: cdkeyItemType) =>
        record.updateTime ? moment(record.updateTime * 1000).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
  ];

  return (
    <Drawer
      width={'50%'}
      destroyOnClose
      title="兑换码详情"
      open={redeemListVisible}
      onClose={() => {
        handleRedeemListVisible(false);
      }}
      bodyStyle={{ background: '#f1f2f6' }}
    >
      <ProTable<cdkeyItemType, TableListPagination>
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
        request={(params) =>
          getCdKeyList({ page: params.current, size: params.pageSize }).then((res) => {
            return res;
          })
        }
        columns={columns}
        pagination={{
          defaultPageSize: 10,
        }}
      />
    </Drawer>
  );
};

export default RedeemList;
