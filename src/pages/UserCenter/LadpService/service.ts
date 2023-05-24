import request from 'umi-request';

export async function getLadpService() {
  return request<API.ResponseData>(`/iam/api/ldapserver/v1/config`);
}
