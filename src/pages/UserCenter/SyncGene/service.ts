import request from 'umi-request';

export async function pushAdd(params: any) {
  return request<API.ResponseData>(`/iam/api/push/connectors`, {
    method: 'POST',
    data: params,
  });
}
export async function pushEdit(id: string, params: any) {
  return request<API.ResponseData>(`/iam/api/push/connectors/` + id, {
    method: 'POST',
    data: params,
  });
}
export async function pushSync(id: string, isForce: string | boolean) {
  return request<API.ResponseData>(
    `/iam/api/push/connectors/sync?id=` + id + `&isForce=` + isForce,
    {
      method: 'POST',
    },
  );
}
export async function getPushLink(id: string) {
  return request<API.ResponseData>(`/iam/api/push/connectors/` + id);
}
export async function getSnsAllApi() {
  return request<API.ResponseData>(`/iam/api/configs/sns/get_all`);
}
export async function getSnsByType(type: string) {
  return request<API.ResponseData>('/iam/api/configs/sns/type/' + type);
}
export async function getDsProfiles() {
  return request<API.ResponseData>(`/iam/api/push/connectors/ds_profiles`);
}
export async function getAttrList(params: any) {
  return request<API.ResponseData>(`/iam/api/user_attrs`, {
    params: params,
  });
}
export async function getOrgAttrList(params: any) {
  return request<API.ResponseData>(`/iam/api/org_attrs`, {
    params: params,
  });
}
export async function pushTest(params: any) {
  return request<API.ResponseData>(`/iam/api/push/connectors/test`, {
    method: 'POST',
    data: params,
  });
}
export async function pushActive(id: string) {
  return request<API.ResponseData>(`/iam/api/push/connectors/active?id=` + id, {
    method: 'POST',
  });
}
export async function pushInactive(id: string) {
  return request<API.ResponseData>(`/iam/api/push/connectors/inactive?id=` + id, {
    method: 'POST',
  });
}
export async function deleteConnect(id: string) {
  return request<API.ResponseData>(`/iam/api/push/connectors/` + id, {
    method: 'DELETE',
  });
}
export async function getToken(params: any) {
  return request(`/iam/token`, {
    method: 'GET',
    params,
  });
}
