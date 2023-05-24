import request from 'umi-request';

export async function getImportConfigTips() {
  return request<API.ResponseData>(`/iam/api/connectors/pre_import/config/tips`);
}
export async function getList(params: { page?: number; size?: number }) {
  return request(`/iam/api/thirdIdp`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getData(id: string) {
  return request<API.ResponseData>(`/iam/api/thirdIdp/` + id);
}
export async function add(params: any) {
  return request<API.ResponseData>(`/iam/api/thirdIdp`, {
    method: 'POST',
    data: params,
  });
}
export async function edit(id: string, params: any) {
  return request<API.ResponseData>(`/iam/api/thirdIdp/` + id, {
    method: 'PUT',
    data: params,
  });
}
export async function deleteObj(id: string) {
  return request<API.ResponseData>(`/iam/api/thirdIdp/` + id, {
    method: 'DELETE',
  });
}
export async function getUserAttr() {
  // return request(`/iam/api/user_attrs?as_profile=true`);
  return request(`/iam/api/appProfile/user/linking`);
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

export async function getIdpType(refId, type) {
  return request(`/iam/api/appProfile/${refId}/${type}`);
}

// 获取认证源的模板
export async function getAuthSourceTemplate(app_flag) {
  return request(`/iam/api/appProfile/idp/${app_flag}`);
}
