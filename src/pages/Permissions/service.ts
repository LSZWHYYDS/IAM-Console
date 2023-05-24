import request from 'umi-request';
import { createQueryString } from '@/utils/common.utils';
import _ from 'lodash';
import type { UserType } from '../UserCenter/data';
import type { AdminType } from './data';

export async function getRolesList(params: { page?: number; size?: number }, isSelf?: boolean) {
  const result: any = await request('/iam/api/apps/usercenter/roles', {
    method: 'GET',
    params: {
      ...params,
    },
  });

  if (result.error === '0') {
    return {
      data:
        (isSelf &&
          _.filter(result.data.items, {
            create_mode: 'BY_ADMIN',
          })) ||
        result.data.items,
      current: result.data.page,
      total: result.data.total,
      pageSize: result.data.size,
    };
  }
  return result;
}

export async function getPermSet() {
  const result: any = await request('/iam/api/apps/usercenter/permission_sets?page=1&size=10000', {
    method: 'GET',
  });

  if (result.error === '0') {
    return {
      data: result.data.items,
      current: result.data.page,
      total: result.data.total,
      pageSize: result.data.size,
    };
  }
  return result;
}

// 获取角色用户列表
export async function getRoleUsers(
  role: string,
  params: { page?: number; limit?: number; q?: string; attrs?: string },
) {
  const result = await request(`/iam/api/apps/usercenter/roles/${role}/users`, {
    method: 'GET',
    params: { ...params },
  });

  if (result.error === '0') {
    // You have no idea thy they will put a binding_scropes to each user's item.....
    const users = result.data.items;
    const newUsers: UserType[] = [];
    await users.map(async (user: AdminType) => {
      newUsers.push(user.user);
    });

    return {
      data: newUsers,
      current: result.data.page,
      total: result.data.total,
      pageSize: result.data.size,
    };
  }
  return result;
}

export async function addRoleUsers(
  role: string,
  body: { binding_scopes: any[]; targets: string[] },
) {
  return request(`/iam/api/apps/usercenter/roles/${role}/users/`, {
    method: 'POST',
    data: { ...body },
  });
}

export async function removeRoleUsers(role: string, body: { username: string }) {
  return request(`/iam/api/apps/usercenter/roles/${role}/users/`, {
    method: 'DELETE',
    params: { ...body },
  });
}
export async function removeRole(role: string) {
  return request(`/iam/api/apps/usercenter/roles/${role}`, {
    method: 'DELETE',
  });
}
export async function addRole(params: any) {
  const mods = {
    name: params.name,
    description: params.description,
    display_name: params.display_name,
    permissions: params.permissions || [],
    permission_sets: params.permission_sets || [],
  };
  return request(`/iam/api/apps/usercenter/roles`, {
    method: 'POST',
    data: mods,
  });
}

export async function editRole(params: any) {
  const mods = {
    name: params.name,
    description: params.description,
    display_name: params.display_name,
    permissions: params.permissions || [],
    permission_sets: params.permission_sets || [],
  };
  return request(`/iam/api/apps/usercenter/roles/` + params.name, {
    method: 'PATCH',
    data: mods,
  });
}
export async function bindUserWithRole(params: any, payload: any) {
  const { client_id, role } = params;
  return request('/iam/api/apps/' + client_id + '/roles/' + role + '/users/', {
    method: 'POST',
    data: payload,
  });
}
export async function unbindUserWithRole(params: any) {
  const { client_id, role, username } = params;
  return request(
    '/iam/api/apps/' + client_id + '/roles/' + role + '/users' + createQueryString({ username }),
    {
      method: 'DELETE',
    },
  );
}
export async function editBindingScopeForUser(params: any, mods: any) {
  const { client_id, role, username } = params;
  return request(
    '/iam/api/apps/' + client_id + '/roles/' + role + '/users' + createQueryString({ username }),
    {
      method: 'POST',
      mods: mods,
    },
  );
}
export async function getRoleBindingUsers(params: any) {
  const copy = _.cloneDeep(params);
  const { client_id, role_name } = copy;
  copy.attrs = 'sub,username,picture,email,phone_number,name';
  delete copy.client_id;
  delete copy.role_name;

  return request(
    '/iam/api/apps/' + client_id + '/roles/' + role_name + '/users' + createQueryString(params),
  );
}
