import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { showErrorMessage, showSuccessMessage, formatDateTime } from '@/utils/common.utils';
import { getLinkersList } from '../service';
import { change_status } from './service';
import type { LinkerType } from '../data';
import { history } from 'umi';
import AddDlg from './AddDlg';

const LinkersList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [addDlgVisible, setAddDlgVisible] = useState(false);

  const changeStatusFunc = (entry: any, status: string) => {
    const params = { connector_name: entry.profile_name, status };
    change_status(params)
      .then((res: any) => {
        if (res.error === '0') {
          showSuccessMessage();
          actionRef.current?.reloadAndRest?.();
        } else {
          showErrorMessage(res.data.message);
        }
      })
      .catch((error: any) => {
        showErrorMessage(error.message);
      });
  };
  // 列表
  const columns: ProColumns<LinkerType>[] = [
    {
      title: '名称',
      dataIndex: 'profile_name',
    },
    {
      title: '服务器地址',
      dataIndex: 'ip',
      hideInSearch: true,
      render: (_, record: LinkerType) =>
        record.config && record.config.etl_server ? record.config.etl_server : '-',
    },
    {
      title: '类型',
      dataIndex: 'ds_type',
      hideInSearch: true,
      width: '15%',
    },
    {
      title: '同步周期',
      dataIndex: 'import_period',
      hideInSearch: true,
      valueEnum: {
        1440: {
          text: '每天',
        },
        720: {
          text: '每12小时',
        },
        60: {
          text: '每小时',
        },
        30: {
          text: '每30分钟',
        },
        0: {
          text: '手动同步',
        },
      },
    },
    {
      title: '开始时间',
      dataIndex: 'last_import_start_datetime',
      hideInSearch: true,
      render: (value) => formatDateTime(value),
    },
    {
      title: '结束时间',
      dataIndex: 'last_import_finish_datetime',
      hideInSearch: true,
      render: (value) => {
        return formatDateTime(value);
      },
    },
    {
      title: '同步状态',
      dataIndex: 'import_status',
      hideInSearch: true,
      valueEnum: {
        FAILED: {
          text: '失败',
        },
        SUCCESS: {
          text: '成功',
        },
        PREVENT: {
          text: '到达阈值',
        },
        IN_PROGRESS: {
          text: '进行中',
        },
      },
    },
    {
      title: '链接器状态',
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        ALL: {
          text: '所有',
        },
        ACTIVE: {
          text: '已启用',
        },
        INACTIVE: {
          text: '已禁用',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: LinkerType) => [
        <Button
          key="EDIT"
          type="link"
          onClick={() => {
            history.push(
              `/users/linker/linkerDetail?id=${record.profile_name}&type=${record.ds_type}&NumberId=${record.id}`,
            );
          }}
        >
          编辑
        </Button>,
        <Button
          key="ENABLE"
          type="link"
          onClick={() => {
            changeStatusFunc(record, (record.status === 'ACTIVE' && 'INACTIVE') || 'ACTIVE');
          }}
        >
          {record.status === 'ACTIVE' ? '禁用' : '启用'}
        </Button>,
      ],
    },
  ];
  const onCloseAddDlg = () => {
    setAddDlgVisible(false);
  };
  const onAdd = (linkerType: string) => {
    history.push('/users/linker/add?type=' + linkerType);
  };
  return (
    <PageContainer title={!addDlgVisible}>
      {addDlgVisible && (
        <AddDlg visible={addDlgVisible} onClose={onCloseAddDlg} onSubmit={(type) => onAdd(type)} />
      )}
      {!addDlgVisible && (
        <ProTable
          headerTitle="通讯录集成列表"
          className="minHeight"
          actionRef={actionRef}
          rowKey="id"
          search={false}
          options={false}
          request={(pagination) =>
            getLinkersList({ size: pagination.pageSize, page: pagination.current })
          }
          columns={columns}
          pagination={false}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setAddDlgVisible(true);
              }}
            >
              <PlusOutlined /> 添加链接器
            </Button>,
          ]}
        />
      )}
    </PageContainer>
  );
};
export default LinkersList;
