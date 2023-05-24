import React, { useRef } from 'react';
import DebounceSelect from '@/components/DebounceSelect';
import type { SelectProps } from 'antd/es/select';
import { Avatar, Button, Form, message, Popconfirm } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { UserType } from '@/pages/UserCenter/data';
import type { ParamsType } from '@ant-design/pro-provider';

export interface SearchUserProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  tableOptions: (params: ParamsType) => Promise<ValueType[]>;
  onSubmit?: (users: any) => Promise<boolean>;
  onDelete?: (User: UserType) => Promise<boolean>;
  onOpenForm?: (User: any) => void;
}

const FormItem = Form.Item;

const SearchUser: React.FC<SearchUserProps> = (props) => {
  const { value, defaultValue, fetchOptions, tableOptions, onSubmit, onDelete, ...rest } = props;
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    const { users } = fieldsValue;
    if (!users || users.length < 1) {
      message.error('至少选择一名用户进行添加');
      return;
    }
    if (onSubmit && users) {
      const result = await onSubmit(users);
      console.log('result: ', result);
      if (result) {
        message.success('添加用户成功');
        form.setFieldsValue({ users: [] });
        actionRef.current?.reloadAndRest?.();
      } else {
        message.error('添加用户失败，请重试');
      }
    }
  };

  const handleDeleteUser = async (user: UserType) => {
    if (onDelete) {
      const deleteResult = await onDelete(user);
      if (deleteResult) {
        message.success('删除用户成功');
        actionRef.current?.reloadAndRest?.();
      } else {
        message.error('删除用户失败，请重试');
      }
    }
  };
  const onOpenInfo = (row: any) => {
    const { onOpenForm } = props;
    if (typeof onOpenForm === 'function') {
      onOpenForm(row);
    }
  };

  // 列表
  const columns: ProColumns<UserType>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      render: (_, record: UserType) => (
        <a style={{ fontWeight: 500 }} onClick={() => onOpenInfo(record)}>
          {record.picture ? (
            <Avatar src={record.picture} shape="square" />
          ) : (
            <Avatar src={require('@/../public/images/default-avatar.png')} shape="square" />
          )}
          {record.username}
        </a>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: UserType) => [
        <Popconfirm
          key="DELETE"
          placement="topRight"
          title={() => (
            <>
              <h4>确定要删除该用户吗？</h4>
            </>
          )}
          onConfirm={() => handleDeleteUser(record)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link">删除</Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <Form
        layout="inline"
        form={form}
        style={{ display: 'flex', marginBottom: '24px', padding: '0 24px' }}
      >
        <FormItem name="users" style={{ flex: 1 }}>
          <DebounceSelect
            value={value}
            placeholder="输入用户名称并在搜索列表中选择"
            fetchOptions={fetchOptions}
            {...rest}
          />
        </FormItem>
        <FormItem style={{ marginRight: '0' }}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleNext}
            style={{ marginRight: '0', marginLeft: '30px' }}
          >
            <UserAddOutlined /> 添加
          </Button>
        </FormItem>
      </Form>
      <ProTable
        actionRef={actionRef}
        rowKey={'username'}
        search={false}
        options={false}
        columns={columns}
        tableAlertRender={false}
        request={(params: ParamsType) => tableOptions({ ...params })}
        rowSelection={false}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default SearchUser;
