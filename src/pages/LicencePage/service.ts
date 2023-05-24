import request from 'umi-request';

export async function getClientIntegration() {
  const accessToken = sessionStorage.getItem('access_token');
  const tcode = sessionStorage.getItem('tcode') || '';

  request.interceptors.request.use((url, options) => {
    const authHeader: any = { Authorization: `Bearer ${accessToken}`, tcode };
    if (options.headers && !options.headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/json';
    }
    if (url.includes('/apps/preview/assertion') && options.method === 'post') {
      authHeader.accept = '*/*';
    }
    return {
      url: url,
      options: { ...options, interceptors: true, headers: authHeader },
    };
  });
  return request<API.ResponseData>('/mdm/basic/tenants/clientIntegration');
}
export async function clientIntegrationDel(clientId: string) {
  return request<any>(`/mdm/basic/tenants/clientIntegration/${clientId}`, {
    method: 'DELETE',
  });
}
export async function clientIntegrationUpdate(clientId: string, data: any) {
  return request<API.ResponseData>(`/mdm/basic/tenants/clientIntegration/${clientId}`, {
    method: 'PUT',
    data,
  });
}
export async function clientIntegrationAdd(data: any) {
  return request<API.ResponseData>(`/mdm/basic/tenants/clientIntegration`, {
    method: 'POST',
    data,
  });
}
// 重新生成新的对称签名秘钥。
export async function signatureSecret(clientId: string) {
  return request<API.ResponseData>(
    `/mdm/basic/tenants/clientIntegration/${clientId}/signature_secret`,
    {
      method: 'PATCH',
    },
  );
}
export async function tenantLicense() {
  return request<API.ResponseData>('/iam/api/tenantLicense');
}
