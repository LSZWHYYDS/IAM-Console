import request from 'umi-request';

/**
 * 获取 分类列表
 */
export async function getUserClassification() {
  return request('/iam/api/app/category', {
    method: 'GET',
  });
}
