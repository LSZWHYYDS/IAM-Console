import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space } from 'antd';
import React, { useRef, useState } from 'react';
import { getLog, deleteFlow, saveFlow } from './service';
import AddFlowPopupWindow from './components/AddFlowPopupwindow';
import { history } from 'umi';

const Flow: React.FC = () => {
  const actionRef = useRef<ActionType | null>();
  const isShowPopupWindowRef = useRef<any>(null);
  const [pageSize, setPageSize] = useState(10);

  const reloadTableData = () => {
    actionRef?.current?.reload();
  };
  const onModStatus = (row: any) => {
    const status = row.status == 1 ? 0 : 1;
    saveFlow(row.id, { ...row, status }).then((result: any) => {
      if (result?.error_description == 'SUCCESS') {
        message.success('修改成功');
        actionRef.current?.reload();
      }
    });
  };
  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (_, record: any) => {
        return (
          <div
            onClick={() => {
              history.push(`/link/flow/editflow?id=${record.id}`);
            }}
          >
            <Button type="link">{record.name}</Button>
          </div>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: '类型',
      dataIndex: 'flow_type',
      valueType: 'option',
      render: (_, record: any) => {
        return (
          <>
            <span>{record.flow_type == 'SCHEDULE' ? '定时流' : '业务流'}</span>
          </>
        );
      },
    },
    {
      title: '状态',
      width: 80,
      dataIndex: 'status',
      initialValue: 'all',
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
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <Space>
            <Popconfirm
              title="确定要删除吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                deleteFlow(record.id).then((rs) => {
                  if (rs.error_description == 'SUCCESS') {
                    message.success('删除成功');
                    reloadTableData();
                  }
                });
              }}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
            <Button type="link" onClick={() => onModStatus(record)}>
              {(record.status == '1' && '停用') || '启用'}
            </Button>
          </Space>
        );
      },
    },
  ];

  const isPopupWindow = () => {
    isShowPopupWindowRef?.current?.showModal?.();
  };
  const onPageSize = (_value, pageSizeValue) => {
    setPageSize(pageSizeValue);
  };

  return (
    <>
      <PageContainer title={false}>
        <ProTable
          headerTitle="连接流列表"
          actionRef={actionRef}
          rowKey="id"
          className="minHeight"
          search={false}
          options={false}
          request={async (params: { pageSize: number; current: number }) => {
            const result = await getLog({
              page: params.current,
              size: params.pageSize,
            });
            return {
              data: result.data.items,
              success: true,
              total: result.data.total,
            };
          }}
          pagination={{ pageSize, showSizeChanger: true, onChange: onPageSize }}
          columns={columns}
          toolBarRender={() => [
            <Button type="primary" key="primary" onClick={isPopupWindow}>
              <PlusOutlined /> 创建连接流
            </Button>,
          ]}
        />
        <AddFlowPopupWindow ref={isShowPopupWindowRef} reloadTableData={reloadTableData} />
      </PageContainer>
    </>
  );
};

export default Flow;
