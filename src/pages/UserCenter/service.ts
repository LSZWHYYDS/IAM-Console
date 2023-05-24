import request from 'umi-request';
import { UserType } from './data';

/**
 * 获取用户列表
 * @returns
 */
export async function getUserList(params: {
  org_id?: string;
  page?: number;
  size?: number;
  attrs?: string;
  return_users_in_sub_org?: boolean;
  q?: string;
  m?: string;
}) {
  const result: any = await request('/iam/api/users', {
    method: 'GET',
    params: {
      ...params,
    },
  });

  if (result.error === '0') {
    return {
      data: result.data.items,
      current: result.data.page,
      total: result.data.total,
      pageSize: result.data.size,
      success: true,
    };
  }
  return result;
}

// 获取组织架构列表
export async function getOrgsList(params: { depth?: number; attrs?: string }) {
  return request('/iam/api/orgs/_root/subs', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// 获取组织信息
export async function getOrgInfo(id: string, params: { attrs: string }) {
  return request(`/iam/api/orgs/${id}`, {
    method: 'GET',
    params: { ...params },
  });
}
/**
 * 获取同步连接器列表
 * @returns
 */
export async function getSyncGeneList(params: { page?: number; size?: number }) {
  const result: any = await request('/iam/api/push/connectors', {
    method: 'GET',
    params: {
      ...params,
    },
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

/**
 * 获取通讯录集成列表
 * @returns
 */
export async function getLinkersList(params: { page?: number; size?: number }) {
  return request('/iam/api/connectors', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getUserInfo(params: { username: string }) {
  return request('/iam/api/user', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/**
 * 启用禁用用户
 */
export async function changeUsersStatus(body: { status: string; usernames: string[] }) {
  return request('/iam/api/users/status', {
    method: 'PUT',
    data: { ...body },
  });
}

/**
 * 删除用户
 */
export async function deleteUsers(body: { usernames: string[] }) {
  return request('/iam/api/users/delete', {
    method: 'POST',
    data: { ...body },
  });
}

// 新增或编辑用户
export async function addOrEditUser(
  method: string,
  params: { welcome?: boolean; username?: string },
  body: UserType,
) {
  const password_status =
    ((method === 'POST' || method === 'PATCH') && (body.password_status ? 'TEMP' : 'NORMAL')) ||
    undefined;
  const api = (method === 'PATCH' && '/iam/api/user') || '/iam/api/users';
  return request(api, {
    method,
    data: { ...body, password_status },
    params: { ...params },
  });
}

export async function editSelfInfo(data: any) {
  return request<API.ResponseData>('/iam/api/self/user_info   ', {
    method: 'PATCH',
    data,
  });
}

// 重新邀请用户
export async function reInviteUser(params: { username: string }) {
  return request('/iam/api/user/push', {
    method: 'PATCH',
    params: { ...params },
  });
}
export async function getAttrList(params: any) {
  return request('/iam/api/user_attrs', {
    params: params,
  });
}
export async function addOrg(params: any) {
  return request('/iam/api/orgs', {
    method: 'POST',
    data: params,
  });
}
export async function editOrg(id: string, params: any) {
  return request('/iam/api/orgs/' + id, {
    method: 'PATCH',
    data: params,
  });
}
export async function deleteOrg(id: string) {
  return request('/iam/api/orgs/' + id, {
    method: 'DELETE',
  });
}
export async function getImportResult(params: any) {
  return request('/iam/api/users/import/user', {
    params: params,
  });
}
export async function importUser(explain: any, file: any) {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  formData.append('explain', explain);
  return request('/iam/api/users/importUser', {
    method: 'POST',
    data: formData,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}
export async function getExpire(params: any) {
  const result: any = await request('/iam/api/users/expire/user', {
    params: params,
    method: 'GET',
  });

  if (result.error === '0') {
    return {
      data: result.data,
      current: 1,
      total: result.data.length,
      pageSize: 10,
    };
  }
  return result;
}
export async function getExpireUserInfo(params: any) {
  return request('/iam/api/users/apply/user', {
    params: params,
  });
}
