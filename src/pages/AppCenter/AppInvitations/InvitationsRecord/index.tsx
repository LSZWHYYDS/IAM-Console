import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { getSendLogsList } from '@/pages/AppCenter/service';
import type { InvitationRecordType, TableListPagination } from '@/pages/AppCenter/data';

const InvitationsRecord: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<InvitationRecordType>[] = [
    {
      title: '邀请人',
      dataIndex: 'receiver',
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'textarea',
      renderText: (val: number) => moment(val * 1000).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '邀请方式',
      dataIndex: 'channel',
      hideInSearch: true,
      renderText: (val: string) => (val === 'SMS' ? '短信' : '邮件'),
    },
    {
      title: '发送状态',
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '成功',
          status: 'Success',
        },
        1: {
          text: '失败',
          status: 'Error',
        },
      },
    },
  ];

  return (
    <ProTable<InvitationRecordType, TableListPagination>
      headerTitle="发送记录"
      actionRef={actionRef}
      rowKey="createTime"
      options={false}
      search={{
        labelWidth: 120,
      }}
      request={(params: any) =>
        getSendLogsList({
          q: params.receiver,
          page: params.current,
          size: params.pageSize,
        })
      }
      columns={columns}
    />
  );
};
export default InvitationsRecord;
