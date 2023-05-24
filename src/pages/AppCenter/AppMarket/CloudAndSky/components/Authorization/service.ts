import { createQueryString } from '@/utils/common.utils';
import request from 'umi-request';
import type { GatewayConfigsType } from './data';

/**
 * 获取应用列表
 * @param params refresh 为 true 时刷新数据，默认为 false
 * @returns
 */
export async function getAppList(params: {
  /** 当前页 */
  page?: number;
  /** 每页数量 */
  size?: number;
}) {
  const result = await request('/iam/api/apps/v2', {
    method: 'GET',
    params: {
      ...params,
    },
  });

  const response = {
    data: result.data.items,
    current: result.data.page,
    pageSize: result.data.size,
    total: result.data.total,
  };

  return response;
}

// 获取应用信息
export async function getAppInfo(params: { client_id: string }) {
  return request(`/iam/api/apps/${params.client_id}`, {
    method: 'GET',
  });
}
export async function createOrUpdateAppBaseInfo(body: any) {
  return request('/iam/api/apps/createOrUpdateAppBaseInfo', {
    method: 'POST',
    data: { ...body },
  });
}

// ls_请求应用分类
export async function requestData() {
  return request('/iam/api/app/category', {
    method: 'GET',
  });
}

// ls_保存分类的接口
export async function saveClass(client_id: any, body: any) {
  return request(`/iam/api/app/category/apps/${client_id}`, {
    method: 'PUT',
    data: body,
  });
}

// ls_取消分类的接口
//
// export async function cancleClass(client_id: any, body: any) {
//   return request(`/iam/api/app/category/apps/${client_id}`, {
//     method: 'PUT',
//     data: body
//   })
// }

// 更新应用信息
export async function updateAppInfo(client_id: string, body: { usernames: string[] }) {
  return request(`/iam/api/apps/${client_id}`, {
    method: 'POST',
    data: { ...body },
  });
}

// 修改应用状态
export async function changeAppStatus(body: { status: string }, params: { client_id: string }) {
  return request(`/iam/api/apps/${params.client_id}/status`, {
    method: 'PUT',
    data: { ...body },
  });
}

// 删除应用
export async function deleteApp(params: { client_id: string }) {
  return request(`/iam/api/apps/${params.client_id}`, {
    method: 'DELETE',
  });
}

// 获取网关配置
export async function getGatewayConfigs(params: { client_id: string }) {
  return request('/iam/api/gateway', {
    method: 'GET',
    params: { ...params },
  });
}

// 更新网关配置
export async function updateGatewayConfigs(body: GatewayConfigsType) {
  return request('/iam/api/gateway', {
    method: 'POST',
    data: { ...body },
  });
}

// 获取授权范围  GET /iam/api/apps/{client_id}/tags
export async function getAllowTags(params: { client_id: string }) {
  return request(`/iam/api/apps/${params.client_id}/tags`, {
    method: 'GET',
  });
}

export async function updateAllowTags(params: { client_id: string }, body: { positions: any }) {
  return request(`/iam/api/apps/${params.client_id}/tags/add`, {
    method: 'POST',
    data: { ...body },
  });
}

// 获取所有 positions(职位？)  POST /iam/api/apps/{client_id}/tags/add
export async function getPositions() {
  return request(`/iam/api/positions`, {
    method: 'GET',
  });
}

// update public access
export async function updatePublicAccess(
  params: { client_id: string },
  body: { enabled: boolean },
) {
  return request(`/iam/api/apps/${params.client_id}/public_access`, {
    method: 'PUT',
    data: { ...body },
  });
}

// get orgs
export async function getOrgs(params: { client_id: string }) {
  return request(`/iam/api/apps/${params.client_id}/orgs`, {
    method: 'GET',
  });
}

export async function updateOrgs(method: string, client_id: string, key: string) {
  return request(`/iam/api/apps/${client_id}/orgs/${key}`, {
    method,
  });
}

export async function getAppUsers(
  client_id: string,
  params: { q?: string; attrs?: string; size?: number; page?: number },
) {
  const result: any = await request(`/iam/api/apps/${client_id}/users`, {
    method: 'GET',
    params: { ...params },
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

export async function addOrRemoveUser(
  client_id: string,
  action: string,
  body: { usernames: string[] },
) {
  return request(`/iam/api/apps/${client_id}/users/${action}`, {
    method: 'POST',
    data: { ...body },
  });
}

export async function generateSecret(id: string) {
  return request('/iam/api/apps/' + id + '/secret', {
    method: 'PATCH',
  });
}
export async function updateSSOInfo(id: string, body: any) {
  return request('/iam/api/apps/updateSSOInfo/' + id, {
    method: 'PATCH',
    data: { ...body },
  });
}
export async function authFactorList() {
  return request('/iam/api/auth_factors', {
    method: 'GET',
  });
}
export async function generateSignatureSecret(id: string) {
  return request('/iam/api/apps/' + id + '/signature_secret', {
    method: 'PATCH',
  });
}
export async function getDingAppList(params: any) {
  return request('/iam/api/thirdPartyApp/sync' + createQueryString(params), {
    method: 'GET',
  });
}
export async function addDingApp(body: any) {
  return request('/iam/api/thirdPartyApp', {
    method: 'POST',
    data: { ...body },
  });
}
// cas重构接口
export async function requestEnterpriseLogin() {
  return request('/iam/api/configs/providers/baseInfo', {
    method: 'get',
  });
}
