import request from 'umi-request';

export async function getImportConfigTips() {
  return request<API.ResponseData>(`/iam/api/connectors/pre_import/config/tips`);
}
export async function getLink(id: string) {
  return request<API.ResponseData>(`/iam/api/connectors/` + id);
}
export async function add(params: any) {
  return request<API.ResponseData>(`/iam/api/connectors`, {
    method: 'POST',
    data: params,
  });
}
export async function edit(params: any) {
  return request<API.ResponseData>(`/iam/api/connectors/`, {
    method: 'patch',
    data: params,
  });
}
export async function test(params: any) {
  return request<API.ResponseData>(`/iam/api/connectors/sync_test`, {
    method: 'POST',
    data: params,
  });
}
export async function sync(name: string) {
  return request<API.ResponseData>(`/iam/api/connectors/` + name + `/sync_now`, {
    method: 'POST',
  });
}
export async function change_status(params: any) {
  return request<API.ResponseData>(`/iam/api/connectors/change_status`, {
    method: 'POST',
    data: params,
  });
}
export async function getToken(params: any) {
  return request(`/iam/token`, {
    method: 'GET',
    params: {
      ...params,
      grant_type: 'client_credentials',
    },
  });
}

export async function isExist(clientId: any, client_secret: any) {
  return request(`/iam/api/apps/isExist/${clientId}`, {
    method: 'POST',
    data: {
      grant_type: 'client_credentials',
      client_secret,
    },
    requestType: 'form',
  });
}

export async function getSelectList() {
  return request(`/iam/api/appProfile/user/linking`, { method: 'GET' });
}

// 集成的左侧下拉列表的数据接口
export async function getIntegrationList(app_flag) {
  return request(`/iam/api/appProfile/connector/${app_flag}`, { method: 'GET' });
}
// 编辑时候调用详情
export async function getHaveIdIntegrationList(refId, type) {
  return request(`/iam/api/appProfile/${refId}/${type}`);
}
