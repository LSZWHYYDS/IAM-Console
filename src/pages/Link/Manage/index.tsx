import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Button, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { getLinkersList, deleteLink } from './service';
import { history } from 'umi';
import AddLinker from './CreateOrEdit/AddLinker';

const LinkersList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState(10);
  const [visible, setVisible] = useState(false);

  const onDelete = (id) => {
    deleteLink(id)
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
      render: (dom, record) => {
        return (
          <div>
            <Space>
              <Avatar src={record.icon || '/uc/images/link/connect.png'} shape="circle" />
              {record.name}
            </Space>
          </div>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      hideInSearch: true,
      render: (value: string) => {
        const list = {
          HTTP: 'HTTP',
          DATABASE: 'Database',
        };
        return (value && list[value]) || '--';
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: any) => [
        <Button
          key="DEL"
          type="link"
          onClick={() => {
            history.push(`/link/manage/edit?id=${record.id}`);
          }}
        >
          编辑
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
    setVisible(true);
  };
  const onPageSize = (_value, pageSizeValue) => {
    setPageSize(pageSizeValue);
  };
  const onClose = () => {
    setVisible(false);
    actionRef.current?.reload();
  };
  return (
    <PageContainer title={false}>
      <AddLinker visible={visible} location={location} onClose={onClose} />
      <ProTable
        headerTitle="连接器列表"
        actionRef={actionRef}
        rowKey="id"
        className="minHeight"
        search={false}
        options={false}
        request={async (params: { pageSize: number; current: number }) => {
          const result = await getLinkersList({
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
          <Button type="primary" key="primary" onClick={onAdd}>
            <PlusOutlined /> 添加连接器
          </Button>,
        ]}
      />
    </PageContainer>
  );
};
export default LinkersList;
