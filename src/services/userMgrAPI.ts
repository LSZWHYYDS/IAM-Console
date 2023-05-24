import request from 'umi-request';
import { createQueryString } from '@/utils/common.utils';
// 查询用户数，包含下级组
export async function getUserCount(params = { page: 0, size: 10 }) {
  const newParams: any = { ...params };
  newParams.attrs = 'sub,name';
  const { org_id: orgId } = newParams;
  if (orgId) {
    newParams.return_users_in_sub_org = true;
  }
  return request<API.ResponseData>(`/iam/api/users${createQueryString(newParams)}`);
}
export async function getUserList(params = { page: 0, size: 10 }) {
  const newParams: any = { ...params };
  newParams.attrs =
    'sub,name,org_ids,email,username,status,phone_number,readonly,come_from,picture,created_mode';
  const { org_id: orgId } = newParams;
  if (orgId) {
    if (orgId === '_root') {
      newParams.return_users_in_sub_org = true; // return users in sub org
    } else {
      newParams.return_users_in_sub_org = false; // do not return users in sub org
    }
  }
  return request<API.ResponseData>(`/iam/api/users${createQueryString(newParams)}`, {
    noTip: true,
  });
}

export async function getUserListWithSub(params = { page: 0, size: 10 }) {
  const newParams: any = { ...params };
  newParams.attrs =
    'sub,name,org_ids,email,username,status,phone_number,readonly,come_from,picture,created_mode';
  const { org_id: orgId } = newParams;
  if (orgId) {
    newParams.return_users_in_sub_org = true;
  }
  return request<API.ResponseData>(`/iam/api/users${createQueryString(newParams)}`, {
    noTip: true,
  });
}

//incsearch user.
export async function incsearch(keyword: string) {
  const params = {
    q: keyword,
    limit: 20,
    attrs: 'sub,username,name,email,picture',
    // m: "inc",
  };
  return request<API.ResponseData>('/iam/api/users' + createQueryString(params), {
    noTip: true,
  });
}
export async function adminResetUserPwd(data: any) {
  return request<API.ResponseData>('/iam/api/users/password', {
    method: 'POST',
    data,
  });
}
export async function updatePwd(data: any) {
  request.interceptors.request.use((url, options) => {
    const authHeader = { tcode: sessionStorage.getItem('tcode') || '' };
    return {
      url: url,
      options: { ...options, interceptors: true, headers: authHeader },
    };
  });
  return request<API.ResponseData>('/iam/api/self/password', {
    method: 'PUT',
    data,
  });
}
export async function forgetPwd(username: string) {
  request.interceptors.request.use((url, options) => {
    const authHeader = { tcode: sessionStorage.getItem('tcode') || '' };
    return {
      url: url,
      options: { ...options, interceptors: true, headers: authHeader },
    };
  });
  return request<API.ResponseData>('/iam/api/self/forget_password', {
    method: 'POST',
    data: { username },
  });
}
export async function validateSmsCode(params: any) {
  return request<API.ResponseData>(
    '/iam/api/self/verify_forget_password_sms_code' + createQueryString(params),
  );
}
export async function updatePwdAfterForget(params: any) {
  request.interceptors.request.use((url, options) => {
    return {
      url: url,
      options: { ...options, interceptors: true, headers: null },
    } as any;
  });
  return request<API.ResponseData>('/iam/api/self/reset_password', {
    method: 'POST',
    data: params,
  });
}
