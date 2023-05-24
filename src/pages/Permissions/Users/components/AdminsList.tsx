import React from 'react';
import { Card, message } from 'antd';
import { history } from 'umi';
import { getUserList } from '@/pages/UserCenter/service';
import { getRoleUsers, addRoleUsers, removeRoleUsers } from '../../service';
import SearchUser from '@/components/SearchUser';
import { ParamsType } from '@ant-design/pro-provider';
import { UserType } from '@/pages/UserCenter/data';

interface AdminListProps {
  role: { type: string; name: string };
  style?: any;
}

// Usage of DebounceSelect
interface UserSelectValue {
  label: string;
  value: string;
}

const AdminsList: React.FC<AdminListProps> = (props) => {
  const { role, style } = props;

  // 获取用户列表
  async function handleSearchUsers(q: string): Promise<UserSelectValue[]> {
    const usersOptions: UserSelectValue[] = [];
    const usersResult = await getUserList({
      size: 100,
      q,
      attrs: 'sub,username,name,email,picture',
    });
    const users = usersResult.data;
    if (users && users.length > 0) {
      users.map(async (user: UserType) => {
        usersOptions.push({ label: user.name, value: user.username });
      });
    } else {
      message.error('没有找到符合条件的用户');
    }
    return usersOptions;
  }

  const handleUserSelect = async (users: UserSelectValue | UserSelectValue[]) => {
    const targets = [];
    if (Array.isArray(users)) {
      users.forEach((user) => {
        targets.push(user.value);
      });
    } else {
      targets.push(users.value);
    }
    try {
      const addResult = await addRoleUsers(role.type, {
        binding_scopes: [],
        targets,
      });
      if (addResult.error === '0') {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const onOpenForm = (row: any) => {
    history.push('/permissions/users/detail?username=' + row.username);
  };

  const handleUserDelete = async (user: any) => {
    try {
      const addResult = await removeRoleUsers(role.type, {
        username: user.username,
      });
      if (addResult.error === '0') {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  return (
    <Card title={role?.name} style={style} key={role.type}>
      <SearchUser
        mode="multiple"
        fetchOptions={handleSearchUsers}
        tableOptions={(params: ParamsType) =>
          getRoleUsers(role.type, {
            limit: params.pageSize,
            attrs: 'sub,username,name,email,picture',
          })
        }
        onSubmit={handleUserSelect}
        onDelete={handleUserDelete}
        onOpenForm={onOpenForm}
      />
    </Card>
  );
};
export default AdminsList;
