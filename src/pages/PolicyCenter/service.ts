import request from 'umi-request';

export async function getPoliciesList(type: any, params: any = { page: 0, size: 10 }) {
  return request<API.ResponseData>(`/mdm/admin/policies`, {
    params: {
      ...params,
      policySubCategory: type,
    },
  });
}
export async function deletePolicy(id: string) {
  return request<API.ResponseData>(`/mdm/admin/policies/${id}`, { method: 'DELETE' });
}
export async function changeStatus(params: { policyIds: any[]; status: any }) {
  return request<API.ResponseData>(`/mdm/admin/policies/status`, {
    method: 'POST',
    data: params,
  });
}
export async function getPolicy(id: any) {
  return request<API.ResponseData>(`/mdm/admin/policies/${id}`);
}
export async function createPolicy(params: any) {
  return request<API.ResponseData>(`/mdm/admin/policies`, { method: 'POST', data: params });
}
export async function savePolicy(id: any, params: any) {
  return request<API.ResponseData>(`/mdm/admin/policies/${id}`, {
    method: 'PUT',
    data: params,
  });
}
export async function pushPolicy(id: any, params: any) {
  return request<API.ResponseData>(`/mdm/admin/policies/${id}/push`, {
    method: 'POST',
    data: params,
  });
}
export async function repushPolicy(id: any) {
  return request<API.ResponseData>(`/mdm/admin/policies/${id}/repush`, { method: 'POST' });
}
export async function getUsers() {
  return request<API.ResponseData>(`/mdm/admin/users?size=500`);
}
export async function policyPushedDevices(id: any, policyId: any) {
  return request<API.ResponseData>(
    `/mdm/admin/policies/policyPushedDevices?userId=${id}&policyId=${policyId}`,
  );
}
export async function deleteRelationships(policyId: any, params: any) {
  return request<API.ResponseData>(`/mdm/admin/policies/${policyId}/relationships`, {
    method: 'DELETE',
    data: params,
  });
}
export async function userPolicy(subCategory: any, loginId: any) {
  return request<API.ResponseData>(
    `/mdm/admin/policies/userPolicy?subCategory=${subCategory}&loginId=${loginId}`,
  );
}
export async function getDevicesList(userId: any) {
  let str = '';
  if (userId) {
    str = `/mdm/admin/devices?userId=${userId}`;
  } else {
    str = `/mdm/admin/devices`;
  }
  return request<API.ResponseData>(str);
}
export async function getDeviceDetails(deviceId: any) {
  return request<API.ResponseData>(`/mdm/admin/devices/${deviceId}`);
}
export async function wipeDevice(params: any) {
  return request<API.ResponseData>(`/mdm/admin/command/wipeDevice`, { method: 'POST', params });
}
export async function deviceViolation(startTime: any, endTime: any) {
  let str = '';
  if (startTime && endTime) {
    str = '?startTime=`+ startTime + `&endTime=` + endTime';
  }
  return request<API.ResponseData>(`/mdm/admin/logs/device_violation/${str}`);
}
export async function policyPushedUsers(policyId: any, params: any) {
  const payload = (params && { ...params }) || {};
  payload.policyId = policyId;
  return request<API.ResponseData>(`/mdm/admin/policies/policyPushedUsers`, {
    params: payload,
  });
}
