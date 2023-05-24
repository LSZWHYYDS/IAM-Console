import React, { useRef } from 'react';
import { Button, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { showErrorMessage, showSuccessMessage, onCopy } from '@/utils/common.utils';
import { getTriggerList, deleteTrigger } from '@/pages/Link/Manage/service';
import { history } from 'umi';

const EventList: React.FC = (props: any) => {
  const { location } = props;
  const { query } = location;
  const linkId = query.id;
  const actionRef = useRef<ActionType>();
  const onDelete = (id: string) => {
    deleteTrigger(id)
      .then(() => {
        showSuccessMessage();
        actionRef.current?.reload();
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };

  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '未启用',
          status: 'Error',
        },
        1: {
          text: '已启用',
          status: 'Success',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <Button
          key="EDIT"
          type="link"
          onClick={() => {
            history.push(`/link/manage/eventEdit?triggerId=${record.id} &linkId=` + linkId);
          }}
        >
          编辑
        </Button>,
        <Button
          key="COPY"
          type="link"
          onClick={() => {
            onCopy(record.id);
          }}
        >
          复制ID
        </Button>,
        <Popconfirm
          key="del"
          title="确定要删除吗?"
          onConfirm={() => onDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button key="DEL" type="link">
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];
  const onAdd = () => {
    history.push(`/link/manage/eventAdd?linkId=` + linkId);
  };
  return (
    <ProTable
      actionRef={actionRef}
      rowKey="id"
      search={false}
      options={false}
      request={async (params: { pageSize: number; current: number }) => {
        const result = await getTriggerList({
          linkId,
          page: params.current,
          size: params.pageSize,
        });
        return {
          data: result.data.items,
          success: true,
          total: result.data.total,
        };
      }}
      columns={columns}
      toolBarRender={() => [
        <Button type="primary" key="primary" onClick={onAdd}>
          <PlusOutlined /> 添加
        </Button>,
      ]}
    />
  );
};
export default EventList;
