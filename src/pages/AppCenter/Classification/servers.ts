import request from 'umi-request';
/**
 * 获取应用列表
 * @param params refresh 为 true 时刷新数据，默认为 false
 * @returns
 */
export async function getAppList(params: {
  /** 当前页 */
  page?: number;
  /** 每页数量 */
  size?: number;
  category_id?: any;
  params_ls?: any;
}) {
  const result = await request('/iam/api/apps/v2', {
    method: 'GET',
    params: {
      ...params,
    },
  });

  const response = {
    data: result.data.items,
    current: result.data.page,
    pageSize: result.data.size,
    total: result.data.total,
  };

  return response;
}

/**
 * 获取 分类列表
 */
export async function getUserClassification() {
  return request('/iam/api/app/category', {
    method: 'GET',
  });
}

/**
 *  根据下拉框选择值 更新Table
 */
export async function addApplicationClassific(body: any) {
  return request(`/iam/api/app/category/apps`, {
    method: 'POST',
    data: body,
  });
}

// 删除用户的应用接口
export async function deleteApplication(body: any) {
  return request.delete(`/iam/api/app/category/apps`, {
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
