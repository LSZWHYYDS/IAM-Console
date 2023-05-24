// import { getXsrf_token } from '@/utils/common.utils';
import conf from '@/utils/conf';
import request from 'umi-request';
import type { loginHelloType } from './data';
/** 登录接口 POST /login/basic_auth */
export async function loginHello(params: { client_id: string }) {
  //   request.interceptors.request.use((url, options) => {
  //     let access_token = sessionStorage.getItem('access_token');
  //     if (null === access_token) {
  //       access_token = '';
  //     }
  //     const authHeader: any = { Authorization: `Bearer ${access_token}` };
  //     if (!options.method) {
  //       options.method = 'get';
  //     }
  //     if (options.headers && !options.headers['Content-Type']) {
  //       options.headers['Content-Type'] = 'application/json';
  //     }
  //     const token = getXsrf_token();
  //     if (token && !url.includes('login_hello')) {
  //       authHeader['x-xsrf-token'] = token;
  //     }
  //     if (url.includes('configs/auth')) {
  //       delete authHeader.Authorization;
  //     }
  //     if (url.includes('configs/policies') && options.method === 'get') {
  //       delete authHeader.Authorization;
  //     }
  //     return {
  //       url: url,
  //       options: { ...options, interceptors: true, headers: authHeader },
  //     };
  //   });
  return request<loginHelloType>('/iam/login/login_hello', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
  });
}
export function logout(redirect_uri: string) {
  location.href = conf.getBackendUrl() + '/logout' + '?redirect_uri=' + redirect_uri;
}

/** 登录接口 POST /iam/login/basic_auth/gen_nonce */
export async function generateNonce(params: { tcode: string; client_id: string }) {
  return request<API.LoginResult>('/iam/login/basic_auth/gen_nonce', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
  });
}

/** 登录接口 POST /iam/login/basic_auth */
export async function basicAuth(body: API.LoginParams) {
  return request<API.LoginResult>('/iam/login/basic_auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
export async function sendOtp(body: any) {
  return request<API.LoginResult>('/iam/login/otp/send_otp', {
    method: 'POST',
    data: body,
  });
}
export async function mfaOtpAuth(body: any) {
  return request<API.LoginResult>('/iam/login/mfa/otp/auth', {
    method: 'POST',
    data: body,
  });
}
export async function otpAuth(body: any) {
  return request<API.LoginResult>('/iam/login/otp/auth', {
    method: 'POST',
    data: body,
  });
}
export async function authFactors(method: string) {
  return request('/iam/api/auth_factors/' + method);
}
export async function dingAuth(
  tcode: string,
  clientId: string,
  dingAuthCode: string,
  auth_id: string,
) {
  return request<API.ResponseData>(conf.getBackendUrl() + '/login/sns/auth', {
    method: 'POST',
    data: {
      tcode: tcode,
      client_id: clientId,
      code: dingAuthCode,
      type: 'DINGDING',
      auth_id,
    },
  });
}
export async function getDingCorpId(tcode: string, clientId: string) {
  return request<API.LoginResult>(
    conf.getBackendUrl() +
      '/login/sns/corp_id?tcode=' +
      tcode +
      '&client_id=' +
      clientId +
      '&type=DINGDING',
    {
      method: 'GET',
    },
  );
}
export async function getLoginConfig(auth_id: string) {
  return request<API.LoginResult>(conf.getBackendUrl() + '/api/configs/auth/' + auth_id, {
    method: 'GET',
  });
}
