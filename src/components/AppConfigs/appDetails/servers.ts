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
