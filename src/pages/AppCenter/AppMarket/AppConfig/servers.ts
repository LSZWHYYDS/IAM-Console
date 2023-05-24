//

import request from 'umi-request';

export async function requestNetwork(data: any) {
  return request('/iam/api/apps/createOrUpdateAppBaseInfo', {
    method: 'POST',
    data,
  });
}
//

export async function generateSecret_ls(id: string, body: any, aa: any) {
  return request(`/iam/api/apps/updateSSOInfo/${id}`, {
    method: 'PATCH',
    data: {
      config: {
        ...body,
      },
      auth_protocol: 'APPSTORE',
      login_policy: aa,
    },
  });
}

// ls_请求应用分类
export async function requestData() {
  return request('/iam/api/app/category', {
    method: 'GET',
  });
}

// 企业认证登录
export async function requestEnterpriseLogin() {
  return request('/iam/api/configs/providers/baseInfo', {
    method: 'get',
  });
}

export async function saveClass(client_id: any, body: any) {
  return request(`/iam/api/app/category/apps/${client_id}`, {
    method: 'PUT',
    data: body,
  });
}
