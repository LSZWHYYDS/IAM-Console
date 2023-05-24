import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import AddDialog from './CreateOrEdit/AddDialog';
import Detail from './CreateOrEdit/index';
import { change_status, deleteObj, getList } from './service';

const CertList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [addDlgVisible, setAddDlgVisible] = useState(false);
  const [detailVisbile, setDetailVisbile] = useState(false);

  const [certType, setCertType] = useState('');
  const [detailData, setDetailData] = useState({});
  const reloadData = () => {
    actionRef.current?.reloadAndRest?.();
  };
  const onDelete = (entry: any) => {
    deleteObj(entry).then((res: any) => {
      if (res.error === '0') {
        showSuccessMessage();
        reloadData();
      } else {
        showErrorMessage(res.data.message);
      }
    });
  };
  const changeStatusFunc = (entry: any, status: number) => {
    const params = { id: entry.id, status };
    change_status(params)
      .then((res: any) => {
        if (res.error === '0') {
          showSuccessMessage();
          reloadData();
        } else {
          showErrorMessage(res.data.message);
        }
      })
      .catch((error: any) => {
        showErrorMessage(error.message);
      });
  };
  // 列表
  const columns: ProColumns<any>[] = [
    {
      title: '平台集成类型',
      dataIndex: 'type',
    },
    {
      title: '平台集成名称',
      dataIndex: 'name',
    },
    {
      title: '创建者',
      dataIndex: 'update_by',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      hideInSearch: true,
      render: (_, record: any) =>
        record.last_import_start_datetime
          ? moment(record.last_import_start_datetime).format('YYYY-MM-DD HH:mm:ss')
          : '-',
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
            setDetailVisbile(true);
            setDetailData(record);
          }}
        >
          编辑
        </Button>,
        <Button
          key="ENABLE"
          type="link"
          onClick={() => {
            changeStatusFunc(record, 1 - record.status);
          }}
        >
          {record.status === 1 ? '禁用' : '启用'}
        </Button>,
        <Popconfirm
          key="deleteConf"
          title="确认要删除吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={() => {
            onDelete(record);
          }}
        >
          <Button key="delete" type="link">
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];
  const onCloseAddDlg = () => {
    setAddDlgVisible(false);
  };
  const onCloseDetailDlg = () => {
    reloadData();
    setDetailVisbile(false);
  };
  const onAdd = (type: string) => {
    setAddDlgVisible(false);
    setDetailVisbile(true);
    setCertType(type);
    setDetailData({});
  };
  const onShowSelectType = () => {
    setAddDlgVisible(true);
    setDetailVisbile(false);
  };
  const tableRefresh = () => {
    actionRef.current?.reload?.();
  };
  return (
    <PageContainer title={false}>
      <AddDialog visible={addDlgVisible} onClose={onCloseAddDlg} onSubmit={onAdd} />
      <Detail
        data={detailData}
        certType={detailData.type || certType}
        visible={detailVisbile}
        onBack={onShowSelectType}
        onClose={onCloseDetailDlg}
        refresh={tableRefresh}
      />
      <ProTable
        headerTitle="平台集成列表"
        actionRef={actionRef}
        rowKey="id"
        className="minHeight"
        search={false}
        options={false}
        request={() => getList()}
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
            <PlusOutlined /> 添加
          </Button>,
        ]}
      />
    </PageContainer>
  );
};
export default CertList;
