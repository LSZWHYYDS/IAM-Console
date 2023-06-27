import OrgTree from '@/components/OrgTree';
import type { TableListPagination } from '@/pages/AppCenter/data';
import {
  DeleteOutlined,
  LockOutlined,
  MinusCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  UserAddOutlined,
  TeamOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Alert, Avatar, Button, Layout, message, Popconfirm, Space, Dropdown } from 'antd';
import type { Key } from 'antd/es/table/interface';
import React, { useEffect, useRef, useState } from 'react';
import { connect, history } from 'umi';
import type { OrgType, UserType } from '../data';
import {
  changeUsersStatus,
  deleteUsers,
  getOrgInfo,
  getOrgsList,
  getUserList,
  reInviteUser,
} from '../service';
import { createQueryString, exportToCsv } from '@/utils/common.utils';
import conf from '@/utils/conf';
import AdminResetPassword from './AdminResetPassword';
import ImportFile from './ImportFile';
const UserManagement: React.FC = (props: any) => {
  const actionRef = useRef<ActionType>();
  const [orgTree, setOrgTree] = useState<any>([]);
  const [orgKey, setOrgKey] = useState<string>();
  const [orgInfo, setOrgInfo] = useState<Partial<OrgType>>();
  const [userKeyword, setUserKeyword] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<UserType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [delEnabled, setDelEnabled] = useState<boolean>(false);
  const [activeEnabled, setActiveEnabled] = useState<boolean>(false);
  const [inactiveEnabled, setInactiveEnabled] = useState<boolean>(false);
  const [reinviteEnabled, setReinviteEnabled] = useState<boolean>(false);
  const [passwordDlgVisible, setPasswrodDlgVisible] = useState<boolean>(false);

  const [importVisible, setImportVisible] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const onPageSize = (_value, pageSizeValue) => {
    setPageSize(pageSizeValue);
  };

  const handleGetOrgInfo = async (id: string) => {
    const result = await getOrgInfo(id, {
      attrs: 'id,name,description,readonly,num_of_users,num_of_children',
    });
    if (result.error === '0') {
      setOrgInfo(result.data);
    }
  };

  const onSelect = (selectedKeys: any) => {
    setOrgKey(selectedKeys);
    handleGetOrgInfo(selectedKeys);
    actionRef.current?.reload?.();
  };

  const handleGetOrgsList = async () => {
    await getOrgsList({ depth: 0, attrs: 'id,name,description,readonly' }).then(async (res) => {
      if (res.error === '0' && res.data && res.data.length > 0) {
        setOrgTree(res.data);
      }
    });
  };

  useEffect(() => {
    props?.dispatch({
      type: 'OrgTree/modifySelectTreeValue',
      payload: '',
    });
    handleGetOrgsList();
  }, []);

  // 列表
  const columns: ProColumns<UserType>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: '20%',
      render: (_, record: UserType) =>
        record.picture ? (
          <Space
            key={record?.phone_number}
            onClick={() => history.push(`/users/usersDetail?username=${record.username}`)}
            style={{ color: '#1890ff', cursor: 'pointer', fontWeight: 500 }}
          >
            <Avatar src={record.picture} shape="square" />
            {record.username}
          </Space>
        ) : (
          <Space
            key={record?.phone_number}
            onClick={() => history.push(`/users/usersDetail?username=${record.username}`)}
            style={{ color: '#1890ff', cursor: 'pointer', fontWeight: 500 }}
          >
            <Avatar src={require('@/../public/images/default-avatar.png')} shape="square" />
            {record.username}
          </Space>
        ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机',
      dataIndex: 'phone_number',
    },
    {
      title: '组织架构',
      dataIndex: 'orgs',
      width: '10%',
      hideInSearch: true,
      render: (_, record: UserType) => {
        if (record.orgs && record.orgs.length > 0) {
          return record.orgs.join();
        }
        return '-';
      },
    },
    {
      title: '用户来源',
      dataIndex: 'come_from',
      width: '10%',
      render: (_, record: any) => {
        if (record.come_from == '0') {
          return '-';
        }
        if (['BY_IMPORT_CSV', 'BY_ADMIN'].includes(record.come_from)) {
          return '自建';
        }
        return record?.come_from;
      },
    },

    {
      title: '到期时间',
      dataIndex: 'end_date',
      width: '10%',
    },

    {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      valueEnum: {
        ACTIVE: {
          text: '正常',
        },
        INACTIVE: {
          text: '未生效',
        },
        SUSPENDED: {
          text: '已禁用',
        },
        OVERDUE: {
          text: '已过期',
        },
      },
    },
  ];
  // 选中用户时调整操作按钮状态
  const handleRowSelect = async (selectedKeys: Key[], selectedUsers: UserType[]) => {
    setSelectedRows(selectedUsers);
    setSelectedRowKeys(selectedKeys);
    const isDelEnabled =
      selectedUsers.length > 0 &&
      selectedUsers.every((item: UserType) => item?.created_mode !== 'BY_SYNC_DS');

    const isActiveEnabled =
      selectedUsers.length > 0 &&
      selectedUsers.every((item: UserType) => item.status === 'SUSPENDED');
    const isInactiveEnabled =
      selectedUsers.length > 0 && selectedUsers.every((item: UserType) => item.status === 'ACTIVE');
    const isReInviteEnabled = selectedUsers.length === 1;
    setDelEnabled(isDelEnabled);
    setActiveEnabled(isActiveEnabled);
    setInactiveEnabled(isInactiveEnabled);
    setReinviteEnabled(isReInviteEnabled);
  };
  // 更新用户状态
  const handelChangeUsersStatus = async (status: string) => {
    if (selectedRows?.length > 0) {
      const action = status === 'ACTIVE' ? '启用' : '禁用';
      // const action = status === 'SUSPENDED' ? '启用' : '禁用';
      const hide = message.info(`正在${action}`);
      const usernames: string[] = selectedRows.map((item) => item.username);
      await changeUsersStatus({ status, usernames })
        .then(
          () => {
            actionRef.current?.reload?.();
            message.success(`${action}成功`);
          },
          (error) => {
            message.error(`服务器或网络错误, ${action}失败。错误信息：${error}`);
          },
        )
        .finally(() => {
          handleRowSelect([], []);
          hide();
        });
    }
  };

  // 删除用户
  const handelDeleteUsers = async () => {
    if (selectedRows?.length > 0) {
      const hide = message.info(`正在删除`);
      const deleteUsernames: string[] = selectedRows.map((item) => item.username);
      await deleteUsers({ usernames: deleteUsernames })
        .then(
          () => {
            actionRef.current?.reload?.();
            message.success(`删除成功`);
          },
          (error) => {
            message.error(`服务器或网络错误, 删除失败。错误信息：${error}`);
          },
        )
        .finally(() => {
          handleRowSelect([], []);
          hide();
        });
    }
  };

  // 重新邀请用户
  const handleReinviteUser = async () => {
    if (selectedRows?.length === 1) {
      const reinviteUser: string = selectedRows[0].username;
      await reInviteUser({ username: reinviteUser })
        .then(
          () => {
            actionRef.current?.reload?.();
            message.success(`已重新邀请`);
          },
          (error) => {
            message.error(`服务器或网络错误, 重新邀请失败。错误信息：${error}`);
          },
        )
        .finally(() => {
          handleRowSelect([], []);
        });
    }
  };

  const handleExport = () => {
    const ids = selectedRows.map((item) => item.username);
    let obj = { userIds: '', q: '', org_id: '' };
    if (userKeyword) {
      obj = { ...obj, q: userKeyword };
    }
    if (orgKey) {
      obj = { ...obj, org_id: orgKey };
    }
    if (ids.length) {
      obj.userIds = ids.join(',');
    }
    const url = conf.getServiceUrl() + '/users/export' + createQueryString(obj),
      filename = 'users.csv';
    exportToCsv(url, filename);
  };
  const onResetPassword = () => {
    if (selectedRowKeys.length !== 1) {
      message.error('请选中一个用户。');
      return;
    }
    setPasswrodDlgVisible(true);
  };
  const onClosePasswordDlg = () => {
    setPasswrodDlgVisible(false);
  };
  const renderGroupTree = () => {
    return (
      <div
        style={{
          padding: '24px 10px 10px 0',
          background: '#fff',
          border: '1px solid #f1  f2f6',
        }}
      >
        <OrgTree
          checkable={false}
          selectable={true}
          orgs={orgTree}
          userTotal={total}
          handleOnSelect={(values) => onSelect(values)}
          afterEdit={handleGetOrgsList}
          isShow={true}
        />
      </div>
    );
  };
  const onMenuClick = (e) => {
    const { key } = e;
    if (key === 'add') {
      history.push(`/users/add`);
    } else {
      setImportVisible(true);
    }
  };
  const renderTable = () => {
    const itemss = [
      {
        key: 'add',
        label: (
          <>
            <TeamOutlined style={{ marginRight: '5px' }} /> 创建新用户
          </>
        ),
      },
      {
        key: 'import',
        label: (
          <>
            <ShareAltOutlined style={{ marginRight: '8px' }} />
            批量导入
          </>
        ),
      },
    ];

    return (
      <div style={{ minHeight: '70vh', width: '75vw' }} className="user_manger">
        <ProTable<UserType, TableListPagination>
          actionRef={actionRef}
          rowKey={'username'}
          search={false}
          className="minHeight"
          headerTitle={orgInfo ? orgInfo.name : '组织架构'}
          toolbar={{
            title: (
              <Space>
                <Dropdown menu={{ items: itemss, onClick: onMenuClick }} placement="bottom">
                  <Button type="primary">
                    <PlusOutlined />
                    添加用户
                  </Button>
                </Dropdown>
                <Button
                  type="link"
                  size="small"
                  style={{ height: 'auto' }}
                  disabled={!activeEnabled}
                  onClick={() => handelChangeUsersStatus('ACTIVE')}
                >
                  <PlayCircleOutlined />
                  <br />
                  启用
                </Button>
                <Button
                  type="link"
                  size="small"
                  style={{ height: 'auto' }}
                  disabled={!inactiveEnabled}
                  onClick={() => handelChangeUsersStatus('SUSPENDED')}
                >
                  <MinusCircleOutlined />
                  <br />
                  禁用
                </Button>
                <Popconfirm
                  key="DELETE"
                  placement="topRight"
                  title={'删除用户是不可逆操作，您确定删除吗？'}
                  onConfirm={() => handelDeleteUsers()}
                  okText="确定"
                  cancelText="取消"
                  disabled={!delEnabled}
                >
                  <Button
                    type="link"
                    size="small"
                    style={{ height: 'auto' }}
                    disabled={!delEnabled}
                  >
                    <DeleteOutlined />
                    <br />
                    删除
                  </Button>
                </Popconfirm>
                <Button type="link" size="small" style={{ height: 'auto' }} onClick={handleExport}>
                  <ShareAltOutlined />
                  <br />
                  导出
                  <a id="exportLink" target="_blank" className="hidden" />
                </Button>
                <Button
                  type="link"
                  size="small"
                  style={{ height: 'auto' }}
                  disabled={!reinviteEnabled}
                  onClick={() => handleReinviteUser()}
                >
                  <UserAddOutlined />
                  <br />
                  重新邀请
                </Button>
                <Button
                  type="link"
                  size="small"
                  style={{ height: 'auto' }}
                  disabled={!reinviteEnabled}
                  onClick={() => onResetPassword()}
                >
                  <LockOutlined />
                  <br />
                  密码重置
                </Button>
              </Space>
            ),
            multipleLine: true,
            settings: [],
            search: {
              onSearch: (value: string) => {
                setUserKeyword(value);
                actionRef.current?.reset?.();
                actionRef.current?.reload?.();
              },
              style: {
                width: '300px',
              },
              placeholder: '姓名/用户名/邮箱/手机',
              allowClear: true,
            },
            filter: (
              <>
                {orgInfo?.name ? (
                  <Alert
                    message={`当前为 ${orgInfo?.name} 部门用户`}
                    type="info"
                    style={{ width: '100%' }}
                  />
                ) : null}
              </>
            ),
          }}
          request={async (pagination) => {
            let params: any = {
              size: pagination?.pageSize,
              page: pagination?.current,
              attrs:
                'sub,name,org_ids,email,username,status,phone_number,readonly,come_from,picture,created_mode,end_date',
            };

            if (userKeyword) {
              params = { ...params, q: userKeyword };
            }

            if (orgKey) {
              params = { ...params, org_id: orgKey };
            }

            const result: any = await getUserList(params);
            setTotal(result?.total);
            return result;
          }}
          columns={columns}
          tableAlertRender={false}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys, rows) => {
              handleRowSelect(keys, rows);
            },
          }}
          pagination={{ pageSize, showSizeChanger: true, onChange: onPageSize }}
        />
      </div>
    );
  };
  const onCloseImportFile = () => {
    setImportVisible(false);
  };
  // const onCollapsed = (value: any) => {
  //   setCollapsed(value);
  //   sessionStorage.setItem('collapsedUserList', value);
  // };
  return (
    <PageContainer title={false}>
      <AdminResetPassword
        username={(selectedRowKeys[0] && selectedRowKeys[0].toString()) || ''}
        visible={passwordDlgVisible}
        onClose={onClosePasswordDlg}
      />
      <Layout style={{ minHeight: '100vh' }}>
        <ImportFile visible={importVisible} onClose={onCloseImportFile} />
        <div style={{ display: 'flex' }}>
          <div>{renderTable()}</div>
          <div style={{ marginLeft: 5, flex: 1, maxHeight: '100%' }}>{renderGroupTree()}</div>
        </div>
      </Layout>
    </PageContainer>
  );
};

export default connect()(UserManagement);
