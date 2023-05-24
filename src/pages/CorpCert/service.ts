import request from 'umi-request';

export async function getList() {
  return request<API.ResponseData>(`/iam/api/configs/sns/get_all`);
}
export async function getDetail(id: string) {
  return request<API.ResponseData>(`/iam/api/connectors/` + id);
}
export async function add(params: any) {
  return request<API.ResponseData>(`/iam/api/configs/sns`, {
    method: 'POST',
    data: params,
  });
}
export async function edit(id: any, params: any) {
  return request<API.ResponseData>(`/iam/api/configs/sns/${id}`, {
    method: 'POST',
    data: params,
  });
}
export async function deleteObj(params: any) {
  return request<API.ResponseData>(`/iam/api/configs/sns/delete?id=` + params.id, {
    method: 'POST',
  });
}
export async function change_status(params: any) {
  return request<API.ResponseData>(
    `/iam/api/configs/sns/status/` + params.id + `/` + params.status,
    {
      method: 'PUT',
      data: params,
    },
  );
}
