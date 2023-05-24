import request from 'umi-request';

/**
 * 获取 分类列表
 */
export async function getUserClassification() {
  return request('/iam/api/app/category', {
    method: 'GET',
  });
}

/**
 *  创建一个分类
 */
export async function createMeClassification(body: any) {
  return request(`/iam/api/app/category`, {
    method: 'POST',
    data: body,
  });
}

/**
 * 删除应用
 */
export async function deleteClassification(id: any) {
  return request(`/iam/api/app/category/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 修改分类信息
 */
export async function modifyInfo(id: any, body: any) {
  return request(`/iam/api/app/category/${id}`, {
    method: 'PATCH',
    data: body,
  });
}

/**
 * 排序分类信息
 */
export async function sortFunc(body: any) {
  return request(`/iam/api/app/category`, {
    method: 'PUT',
    data: body,
  });
}
