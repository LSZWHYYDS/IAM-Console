import request from 'umi-request';
/**
 * App市场应用
 * @param params
 * @returns
 */
// export async function requestApplicationMarket() {
//   return request('/api/applicationMarket', {
//     method: 'POST',
//   });
// }
export async function requestApplicationMarket(params = {}) {
  return request('/iam/api/apps/appstore', {
    method: 'GET',
    params: { ...params },
  });
}

export async function requestApplicationDetails(id: any) {
  return request(`/iam/api/apps/${id}`, {
    method: 'GET',
  });
}
// 获取应用信息
export async function getAppInfo(params: { client_id: string }) {
  return request(`/iam/api/apps/${params.client_id}`, {
    method: 'GET',
  });
}
// ls_请求应用分类
export async function requestData() {
  return request('/iam/api/app/category', {
    method: 'GET',
  });
}
// 更新应用的login配置信息
export async function saveLoginConfig(
  id: string,
  body: any,
  login_policy: any,
  auth_protocol: any,
) {
  if (body?.config) {
    delete body?.config;
  }
  return request(`/iam/api/apps/updateSSOInfo/${id}`, {
    method: 'PATCH',
    data: {
      config: {
        ...body,
      },
      auth_protocol: auth_protocol == 'APPSTORE' ? 'APPSTORE' : auth_protocol, // todo
      login_policy,
      client_id: id,
    },
  });
}
export async function saveBaseInfo(data: any) {
  return request('/iam/api/apps/createOrUpdateAppBaseInfo', {
    method: 'POST',
    data,
  });
}
export async function saveClass(client_id: any, body: any) {
  return request(`/iam/api/app/category/apps/${client_id}`, {
    method: 'PUT',
    data: body,
  });
}
