import request from 'umi-request';

export async function getLog(params = { page: 0, size: 50 }, payload: any) {
  for (const key in params) {
    if (params[key] === '') {
      delete params[key];
    }
  }
  return request<API.ResponseData>(`/iam/api/dingaudit`, {
    method: 'POST',
    data: {
      ...params,
      ...payload,
    },
  });
}
