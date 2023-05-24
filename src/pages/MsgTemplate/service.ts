import request from 'umi-request';

export async function getTemplates() {
  return request<API.ResponseData>('/iam/api/templates');
}
export async function updateTemplate(tmplName: any, params: any) {
  return request<API.ResponseData>(`/iam/api/templates/${tmplName}`, {
    method: 'PATCH',
    data: params,
  });
}
