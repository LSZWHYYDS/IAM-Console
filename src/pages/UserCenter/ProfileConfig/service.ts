import request from 'umi-request';

export async function getImportConfigTips() {
  return request<API.ResponseData>(`/iam/api/connectors/pre_import/config/tips`);
}
export async function getList(params: { page?: number; size?: number }) {
  return request(`/iam/api/appProfile`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getData(id: string, type: string) {
  return request<API.ResponseData>(`/iam/api/appProfile/` + id + `/` + type);
}
export async function getDataConnector(appFlag: string) {
  return request<API.ResponseData>(`/iam/api/appProfile/connector/` + appFlag);
}
export async function getDataIdp(appFlag: string) {
  return request<API.ResponseData>(`/iam/api/appProfile/idp/` + appFlag);
}

export async function edit(id: string, type: string, params: any) {
  return request<API.ResponseData>(`/iam/api/appProfile/` + id + `/` + type, {
    method: 'POST',
    data: params,
  });
}
export async function deleteObj(id: string) {
  return request<API.ResponseData>(`/iam/api/appProfile/` + id, {
    method: 'DELETE',
  });
}
export async function getUserAttr() {
  return request(`/iam/api/user_attrs?as_profile=true`);
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
export async function getIdpType(type) {
  return request(`/iam/api/idpProfile/${type}`);
}
