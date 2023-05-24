import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Popconfirm, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import moment from 'moment';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { getSyncGeneList } from '../service';
import { pushSync, pushInactive, pushActive } from './service';
import type { SyncGeneType } from '../data';
import { history } from 'umi';
import AddDlg from './AddDlg';

const SyncGeneList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [addDlgVisible, setAddDlgVisible] = useState(false);

  const onCloseAddDlg = () => {
    setAddDlgVisible(false);
  };
  const asynRow = (id: string) => {
    pushSync(id, true)
      .then((res) => {
        if (res.result) {
          showSuccessMessage('同步成功');
          actionRef.current?.reloadAndRest?.();
        } else {
          showErrorMessage(res.error_description);
        }
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };
  const changeStatus = (id: string, active: boolean) => {
    const func = (active && pushActive) || pushInactive;
    func(id)
      .then((res) => {
        if (res.result) {
          showSuccessMessage('操作成功');
          actionRef.current?.reloadAndRest?.();
        } else {
          showErrorMessage(res.error_description);
        }
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };
  // 列表
  const columns: ProColumns<SyncGeneType>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '所属企业',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      hideInSearch: true,
    },
    {
      title: '同步周期',
      dataIndex: 'push_period',
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
      dataIndex: 'push_start_time',
      hideInSearch: true,
      render: (_, record: SyncGeneType) =>
        record.push_start_time ? moment(record.push_start_time).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '结束时间',
      dataIndex: 'push_end_time',
      hideInSearch: true,
      render: (_, record: SyncGeneType) =>
        record.push_end_time ? moment(record.push_end_time).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '同步状态',
      dataIndex: 'push_status',
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
      render: (_, record: SyncGeneType) => [
        <Button
          key="EDIT"
          type="link"
          onClick={() => {
            const path = {
              DINGDING: 'Dingding',
            };
            history.push(
              `/users/syncgene/syncgeneDetail` +
                path[record.type] +
                `?id=${record.id}&type=` +
                record.type,
            );
          }}
        >
          编辑
        </Button>,
        <Button
          key="ENABLE"
          type="link"
          onClick={() => {
            changeStatus(record.id, record.status !== 'ACTIVE');
          }}
        >
          {record.status === 'ACTIVE' ? '禁用' : '启用'}
        </Button>,
        <Popconfirm
          key="DELETE"
          placement="topRight"
          title={() => (
            <>
              <h4>确定要同步数据吗？</h4>
            </>
          )}
          onConfirm={() => {
            asynRow(record.id);
          }}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link">同步</Button>
        </Popconfirm>,
      ],
    },
  ];
  const onAdd = (type: string) => {
    if (type == 'SCIM') {
      history.push('/users/syncgene/add?type=' + type);
    } else {
      history.push('/users/syncgene/add' + type);
    }
  };
  return (
    <PageContainer title={!addDlgVisible}>
      {addDlgVisible && (
        <AddDlg visible={addDlgVisible} onClose={onCloseAddDlg} onSubmit={(type) => onAdd(type)} />
      )}
      {!addDlgVisible && (
        <ProTable
          headerTitle="通讯录同步列表"
          actionRef={actionRef}
          rowKey="id"
          className="minHeight"
          search={false}
          options={false}
          request={(pagination) =>
            getSyncGeneList({ size: pagination.pageSize, page: pagination.current })
          }
          columns={columns}
          pagination={{ pageSize: 10 }}
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
export default SyncGeneList;
