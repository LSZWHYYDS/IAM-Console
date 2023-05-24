import { errorCode, getXsrf_token } from '@/utils/common.utils';
import * as WebAuth from '@/utils/webAuth';
import { Modal } from 'antd';
import { history } from 'umi';
import request from 'umi-request';

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  let access_token = sessionStorage.getItem('access_token');
  if (null === access_token) {
    access_token = '';
  }
  const authHeader: any = { Authorization: `Bearer ${access_token}` };
  //  todo
  if (url.includes('/apps/preview/assertion') && options.method === 'post') {
    authHeader.accept = '*/*';
  }
  if (!options.method) {
    options.method = 'get';
  }
  if (options.headers && !options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json';
  }
  const token = getXsrf_token();
  if (token && !url.includes('login_hello')) {
    authHeader['x-xsrf-token'] = token;
  }

  if (url.includes('configs/policies') && options.method === 'get') {
    authHeader['tcode'] = sessionStorage.getItem('tcode');
    delete authHeader.Authorization;
  }
  return {
    url: url,
    options: { ...options, interceptors: true, headers: authHeader },
  };
});

request.interceptors.response.use(async (response, options) => {
  if (response.status === 401) {
    sessionStorage.clear();
    localStorage.clear();
    WebAuth.authorize();
    return response;
  }
  if (response.status === 200) {
    if (options.responseType === 'blob') {
      return response;
    }
  }
  let data: any = {};

  if (options.url === '/iam/api/apps/preview/assertion') {
    data = response.clone();
    data.code = '0';
    data.error = '';
  } else {
    data = ((await response) && response.clone().json()) || {};
  }
  // const data = await response.clone().json();
  if (options.noTip) {
    return response;
  }

  // 不同操作情况不同，由各个地方发出请求时进行判断需不需要显示，以及如何显示提示信息
  if (data.code === '0' || data.error === '0') {
  } else if (
    data.error !== 'invalid_token' &&
    ((data.error && errorCode[data.error]) || data.error_description)
  ) {
    if (data.error === '1010212') {
      //需要修改密码
      Modal.error({
        title: '提示',
        content: (data.error && errorCode[data.error]) || data.error_description,
        onOk: () => {
          history.push('/user/resetPassword');
        },
      });
      return;
    }
    if (data.error == 'access_denied') {
      Modal.error({
        title: '提示',
        content: '' + '该账号暂无权限',
      });
      return;
    }
    Modal.error({
      title: '提示',
      content: '' + ((data.error && errorCode[data.error]) || data.error_description),
    });
  }
  return response as any;
});

/**
 * 获取当前的用户
 */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/iam/api/self/user_info', {
    method: 'GET',
    noTip: true,
    ...(options || {}),
  });
}

/** 退出登录接口 POST /iam/api/login/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/iam/api/login/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function getConfigsPolicies() {
  return request('/iam/api/configs/policies', {
    method: 'GET',
  });
}
