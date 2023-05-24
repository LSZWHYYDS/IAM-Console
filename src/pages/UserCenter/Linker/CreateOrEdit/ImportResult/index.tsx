import type { TableListPagination } from '@/pages/AppCenter/data';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Modal } from 'antd';
import React, { useRef } from 'react';
import { getImportResult } from '@/pages/UserCenter/service';
import { parseQueryString } from '@/utils/common.utils';

const ImportResult: React.FC = (props: any) => {
  const path = window.location.pathname;
  const { batchNo, visible, onClose } = props;
  const actionRef = useRef<ActionType>();
  // 列表
  const columns: ProColumns<any>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: '手机',
      dataIndex: 'phone_number',
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
  ];

  const renderTable = () => {
    return (
      <ProTable<any, TableListPagination>
        actionRef={actionRef}
        rowKey="name"
        search={false}
        options={false}
        request={async () => {
          const query = parseQueryString(window.location.search);
          const params: any = {
            batchNo: batchNo || query.a || '',
            saveStatus: path === '/users/users' ? 0 : '', //导入失败 1：导入成功的
          };
          const result: any = await getImportResult(params);
          return {
            data: result.data,
          };
        }}
        columns={columns}
        tableAlertRender={false}
      />
    );
  };
  return (
    <Modal
      title="用户导入成功列表"
      destroyOnClose
      open={visible}
      width={1000}
      footer={null}
      onCancel={onClose}
    >
      {renderTable()}
    </Modal>
  );
};

export default ImportResult;
