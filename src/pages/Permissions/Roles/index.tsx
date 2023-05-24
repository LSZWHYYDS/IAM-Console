import React, { useRef, useState, Fragment } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Popconfirm, Button, Space, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { getRolesList, removeRole } from '../service';
import type { RoleType } from '../data';
import AddOrEditRole from './Components/AddOrEdit';
import RoleBindingDialog from './Components/RoleBindingDialog';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

const RolesList: React.FC = (props: any) => {
  const { isSelf } = props;
  const actionRef = useRef<ActionType>();
  const [showDetails, setShowDetails] = useState(false);
  const [showBindDlg, setShowBindDlg] = useState(false);
  const [roleInfo, setRoleInfo] = useState<RoleType>({});
  const [canEditRole, setCanEditRole] = useState<boolean>(false);
  const [isAddCont, setAddCont] = useState<boolean>(false);
  const onOpenRoleInfo = (row: RoleType, canEdit: boolean) => {
    setShowDetails(true);
    setRoleInfo(row);
    setCanEditRole(canEdit);
  };
  const onOpenBindDlg = (row: RoleType) => {
    setShowBindDlg(true);
    setRoleInfo(row);
  };
  const onDelete = async (role: RoleType) => {
    try {
      const addResult = await removeRole(role.name || '');
      if (addResult.error === '0') {
        actionRef.current?.reload();
        message.success('删除成功。');
      } else {
        message.success('删除失败。');
      }
    } catch (error) {
      message.success('删除失败。');
    }
  };
  const onCopy = (row: RoleType) => {
    const clone = {
      permissions: Object.assign([], row.permissions) || [],
      permission_sets: Object.assign([], row.permission_sets) || [],
    };
    onOpenRoleInfo(clone, true);
  };
  // 列表
  const columns: ProColumns<RoleType>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '显示名称',
      dataIndex: 'display_name',
      hideInSearch: true,
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
      render: (_, record: RoleType) => {
        return (
          <Space>
            {record.name !== 'ROLE_APP' && record.name !== 'ROLE_USER' ? (
              <Button
                key="BINDING"
                type="primary"
                onClick={() => {
                  onOpenBindDlg(record);
                }}
              >
                <UserAddOutlined /> 分配
              </Button>
            ) : null}
            {!isSelf && record.create_mode === 'BY_SYSTEM' ? (
              <Button
                key="VIEW"
                type="primary"
                onClick={() => {
                  onOpenRoleInfo(record, false);
                }}
              >
                <EyeOutlined /> 查看
              </Button>
            ) : null}
            {!isSelf && (
              <Button
                key="COPY"
                type="primary"
                onClick={() => {
                  onCopy(record);
                }}
              >
                <CopyOutlined /> 拷贝
              </Button>
            )}
            {!isSelf && record.create_mode !== 'BY_SYSTEM' ? (
              <Button
                key="EDIT"
                type="primary"
                onClick={() => {
                  onOpenRoleInfo(record, true);
                }}
              >
                <EditOutlined /> 编辑
              </Button>
            ) : null}
            {!isSelf && record.create_mode !== 'BY_SYSTEM' ? (
              <Popconfirm
                key="DELETE"
                placement="topRight"
                title={'确定要角色吗？'}
                onConfirm={() => {
                  onDelete(record);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary" danger>
                  <DeleteOutlined /> 删除
                </Button>
              </Popconfirm>
            ) : null}
          </Space>
        );
      },
    },
  ];
  const tabRow = (
    <Fragment>
      <ProTable
        actionRef={actionRef}
        rowKey="name"
        className="minHeight"
        search={false}
        options={false}
        request={(pagination) =>
          getRolesList({ size: pagination.pageSize, page: pagination.current }, isSelf)
        }
        columns={columns}
        pagination={{ pageSize: 10 }}
        toolBarRender={() =>
          (!isSelf && [
            <Button
              key="ADD"
              type="primary"
              onClick={() => {
                onOpenRoleInfo({}, true);
              }}
            >
              <PlusOutlined /> 添加新角色
            </Button>,
          ]) ||
          []
        }
      />
      {showDetails ? (
        <AddOrEditRole
          drawerVisible={showDetails}
          canEdit={canEditRole}
          role={roleInfo}
          isAddCont={isAddCont}
          onAdd={(addCont: boolean) => {
            setAddCont(addCont);
            onOpenRoleInfo({}, true);
          }}
          onClose={() => {
            actionRef.current?.reload();
            setShowDetails(false);
          }}
        />
      ) : null}
      {showBindDlg ? (
        <RoleBindingDialog
          show={showBindDlg}
          role={roleInfo}
          onClose={() => {
            actionRef.current?.reload();
            setShowBindDlg(false);
          }}
        />
      ) : null}
    </Fragment>
  );
  if (isSelf) {
    return tabRow;
  }
  return <PageContainer title={false}>{tabRow}</PageContainer>;
};
export default RolesList;
