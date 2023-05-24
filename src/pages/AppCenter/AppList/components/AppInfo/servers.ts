import request from 'umi-request';

export async function previewSAML(body: any) {
  return request('/iam/api/apps/preview/assertion', {
    method: 'POST',
    data: { ...body },
  });
}
