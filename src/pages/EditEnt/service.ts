import request from 'umi-request';

export async function snsList() {
  return request<API.ResponseData>('/iam/api/configs/sns');
}
export async function getSns(id: any) {
  return request<API.ResponseData>(`/iam/api/configs/sns/${id}`);
}
export async function updateSns(id: any, params: any) {
  return request<API.ResponseData>(`/iam/api/configs/sns/${id}`, {
    method: 'POST',
    data: params,
  });
}
export async function createSns(params: any) {
  return request<API.ResponseData>(`/iam/api/configs/sns/`, {
    method: 'POST',
    data: params,
  });
}
