import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import moment from 'moment';
import { showErrorMessage, showSuccessMessage } from '@/utils/common.utils';
import { deleteObj, getList } from './service';
import { history } from 'umi';
import AddDlg from './AddDlg';
import { useIntl, FormattedMessage } from 'umi';
// import { map, forEach } from 'ramda';
const LinkersList: React.FC = () => {
  const intl = useIntl();

  const actionRef = useRef<ActionType>();
  const [addDlgVisible, setAddDlgVisible] = useState(false);

  const onDelete = (id: string) => {
    deleteObj(id)
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
  const text = intl.formatMessage({
    id: 'EnterpriseAuthenticationSource.operation.confimTip',
  });
  const confirm = (id) => {
    onDelete(id);
  };
  // 列表
  const corpCertColumns: ProColumns<any>[] = [
    {
      title: '认证源名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '认证源类型',
      dataIndex: 'idp_type',
      hideInSearch: true,
      width: '15%',
      key: 'idp_type',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      hideInSearch: true,
      key: 'update_time',
      render: (_, record: any) =>
        record.update_time ? moment(record.update_time).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      key: 'option',
      render: (_, record: any) => [
        <Button
          key={record.idp_type}
          type="link"
          onClick={() => {
            history.push(`/apps/corpcertsource/detail?id=${record.id}&type=${record.idp_type}`);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          placement="topLeft"
          title={text}
          onConfirm={() => confirm(record.id)}
          okText="是"
          key={record.id}
          cancelText="否"
        >
          <Button key="del" type="link">
            <FormattedMessage id="EnterpriseAuthenticationSource.operation.delete"></FormattedMessage>
          </Button>
        </Popconfirm>,
      ],
    },
  ];
  const onCloseAddDlg = () => {
    setAddDlgVisible(false);
  };
  const onAdd = (linkerType: string) => {
    history.push('/apps/corpcertsource/add?type=' + linkerType);
  };
  return (
    <PageContainer title={!addDlgVisible}>
      {addDlgVisible && (
        <AddDlg visibles={addDlgVisible} onClose={onCloseAddDlg} onSubmit={(type) => onAdd(type)} />
      )}
      {!addDlgVisible && (
        <ProTable
          headerTitle="企业认证源列表"
          className="minHeight"
          actionRef={actionRef}
          rowKey={(item) => {
            return item.id;
          }}
          search={false}
          options={false}
          request={async (pagination) => {
            return getList({ size: pagination.pageSize, page: pagination.current });
          }}
          columns={corpCertColumns}
          pagination={false}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setAddDlgVisible(true);
              }}
            >
              <PlusOutlined /> 添加认证源
            </Button>,
          ]}
        />
      )}
    </PageContainer>
  );
};
export default LinkersList;
