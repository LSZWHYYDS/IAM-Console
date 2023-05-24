import { Drawer, Button, message, Space } from 'antd';
import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { DeleteOutlined, ArrowDownOutlined, CloudSyncOutlined } from '@ant-design/icons';
import styles from './packageHistory.less';
import { getPackaging, DeletePackage, DownloadPackage } from '../service';
const PackageHistory = (props: any, ref: any) => {
  const actionRef = useRef<any>(null);
  const [visible, setVisible] = useState(false);
  const onOpen = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleClickDelete = (id: number) => {
    DeletePackage(id).then(() => {
      message.success('删除成功');
      actionRef.current?.reload?.();
    });
  };

  const handleClickDownload = (id: number) => {
    DownloadPackage(id).then((rs: any) => {
      if (rs.code == '0') {
        window.location.href = rs.data;
        message.success('下载成功');
      }
    });
  };

  const handleDisabled = (type: any, b: any) => {
    const operationObj_Download = {
      0: true,
      1: false,
      2: true,
    };

    const operationObj_Delete = {
      0: false,
      1: false,
      2: true,
    };

    if (type) {
      return operationObj_Delete[b];
    } else {
      return operationObj_Download[b];
    }
  };
  useImperativeHandle(ref, () => ({
    onClose,
    onOpen,
  }));

  // 列表
  const columns: ProColumns<any>[] = [
    {
      title: '操作人',
      dataIndex: 'createBy',
    },
    {
      title: '时间',
      dataIndex: 'updateTime',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '失败',
          status: 'Error',
        },
        1: {
          text: '打包成功',
          status: 'Success',
        },
        2: {
          text: '打包中',
          status: 'Processing',
        },
      },
    },

    {
      title: '操作',
      dataIndex: 'operation',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <div>
            <Button
              icon={<ArrowDownOutlined />}
              shape="circle"
              title="下载"
              onClick={() => {
                handleClickDownload(record.id);
              }}
              disabled={handleDisabled(0, record.status)}
            />
            <Button
              icon={<DeleteOutlined />}
              shape="circle"
              title="删除"
              onClick={() => {
                handleClickDelete(record.id);
              }}
              disabled={handleDisabled(1, record.status)}
            />
          </div>
        );
      },
    },
  ];
  const refreshList = () => {
    actionRef.current?.reload?.();
  };
  return (
    <div>
      <Drawer
        title="打包历史"
        placement={'right'}
        width={630}
        onClose={onClose}
        open={visible}
        extra={
          <Space>
            <Button onClick={refreshList} type="primary">
              <CloudSyncOutlined />
              刷新列表状态
            </Button>
          </Space>
        }
      >
        <div className={styles.calssnames}>
          <ProTable
            style={{ width: '100%' }}
            actionRef={actionRef}
            rowKey="id"
            cardBordered={true}
            search={false}
            options={false}
            request={async () => {
              let historyData: any = [];
              await getPackaging().then((rs: any) => {
                historyData = rs.data;
              });
              return {
                data: historyData,
                success: true,
              };
            }}
            columns={columns}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default forwardRef(PackageHistory);
