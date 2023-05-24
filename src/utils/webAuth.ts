import staticMethod from '@/utils/staticMethod';
import { history } from 'umi';
import request from 'umi-request';
import RLSafeBase64 from 'urlsafe-base64';
import conf from '@/utils/conf';
import _ from 'lodash';
// import { handleHaveToken } from './Hooks/UserInfo';
const queryObj: any = staticMethod.parseQueryString(window.location.href);
let scope: string;

export const loginSuccess = function (accessToken: string, tcode: string, callback: any) {
  sessionStorage.setItem(
    'reduxPersist:login',
    JSON.stringify({
      loggedIn: true,
    }),
  );
  request.interceptors.request.use((url, options) => {
    const authHeader: any = { Authorization: `Bearer ${accessToken}`, tcode };
    if (options.headers && !options.headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/json';
    }
    if (url.includes('configs/policies') && options.method === 'get') {
      delete authHeader.Authorization;
    }
    if (url.includes('/apps/preview/assertion') && options.method === 'post') {
      authHeader.accept = '*/*';
    }
    return {
      url: url,
      options: { ...options, interceptors: true, headers: authHeader },
    };
  });
  if (typeof callback === 'function') {
    callback();
  }
};

export const ThereAreAccessTokenHandle = (successCb: any, failureCb: any) => {
  // parseQueryString作用构建符合后台的一个URL
  const query: any = staticMethod.parseQueryString(window.location.href);
  const localState = sessionStorage.getItem('state');

  if (!localState || (localState && localState === query.state)) {
    const accessTokenReceivedAt = new Date().getTime();
    const expiresIn = parseInt(query.expires_in, 10) * 1000;
    sessionStorage.setItem('access_token', query.access_token);
    sessionStorage.setItem('id_token', query.id_token);
    sessionStorage.setItem('expires_in', expiresIn.toString());
    sessionStorage.setItem('access_token_received_at', accessTokenReceivedAt.toString());
    if (typeof successCb === 'function') {
      successCb(query.access_token, query.id_token, accessTokenReceivedAt, expiresIn);
    }
    return true;
  } else {
    if (typeof failureCb === 'function') {
      failureCb('invalid_state', 'invalid_state');
    }
    return false;
  }
};

// 存在access_token
export const ThereAreAccessToken = (callback?: any) => {
  return ThereAreAccessTokenHandle(
    (accessToken: any) => {
      const tmpAccessToken = sessionStorage.getItem('id_token'),
        tokenInfo = JSON.parse(
          RLSafeBase64.decode(
            tmpAccessToken && tmpAccessToken.split('.').length && tmpAccessToken.split('.')[1],
          ),
        );
      loginSuccess(accessToken, tokenInfo.tid, callback);
    },
    (errorType: any, errorDescription: any) => {
      if (errorType === 'invalid_state') {
        history.replace('/authorizationError/' + errorType + '/' + errorDescription);
      }
      sessionStorage.clear();
    },
  );
};

// 未授权走的逻辑(最终拼接一个地址进行GET访问)
export const authorize = () => {
  window.sessionStorage.clear();
  const state = new Date().getTime();
  //  如果没有access——toke构建URl地址
  const params = {
    response_type: 'token',
    client_id: 'usercenter',
    scope: scope,
    state: state,
  };
  if (queryObj.tcode) {
    params['tcode'] = queryObj.tcode;
  }
  sessionStorage.setItem('state', state.toString());
  params['redirect_uri'] = location.href;

  location.href = conf.getBackendUrl() + '/authorize' + staticMethod.createQueryString(params);
};

export const isAuthed = () => {
  return (
    //下列页面不需要授权就可以访问
    window.location.href.indexOf('register') !== -1 ||
    window.location.href.indexOf('mailSent') !== -1 ||
    window.location.href.indexOf('smsSent') !== -1 ||
    window.location.href.indexOf('forget_password') !== -1 ||
    window.location.href.indexOf('resetPassword') !== -1 ||
    window.location.href.indexOf('verify_email_address') !== -1 ||
    window.location.href.indexOf('#/cert') !== -1 ||
    window.location.href.indexOf('#/email') !== -1 ||
    window.location.href.indexOf('#/sms') !== -1 ||
    window.location.pathname === '/user/login' ||
    window.location.pathname === '/user/login/' ||
    window.location.pathname === '/login/guide' ||
    window.location.pathname === '/login/guide/' ||
    window.location.pathname === '/Digitalsee.html' ||
    window.location.pathname === '/Digitalsee.html/' ||
    (window.location.href.indexOf('/dingding') !== -1 &&
      window.location.href.indexOf('continue') !== -1) || //请求dingding登录页面，并且已经包含了continue页面，则不发起授权请求
    (window.location.href.indexOf('#login') !== -1 &&
      window.location.href.indexOf('continue') !== -1) //请求login登录页面，并且已经包含了continue页面，则不发起授权请求
  );
};

// 不存在access_token情况   目的为了构建URL
export const startInitAuth = () => authorize();

export function getUrlAllParams(): any {
  // 解决乱码问题
  const url = decodeURI(window.location.href);
  const res = {};
  const url_data = _.split(url, '?').length > 1 ? _.split(url, '?')[1] : null;
  if (!url_data) return null;
  const params_arr = _.split(url_data, '&');
  _.forEach(params_arr, function (item) {
    const key = _.split(item, '=')[0];
    const value = _.split(item, '=')[1];
    res[key] = value;
  });
  return res;
}
export function handleBreadcrumb(router: any, params, routers) {
  const mappingObjcet = {
    DINGDING: '钉钉',
    ETL: 'ETL',
    AD: 'AD',
    EXCEL: 'EXCEL',
    LDAP: 'LDAP',
    SCIM: 'SCIM',
    ADAZURE: 'ADAZURE',
    FEISHU: '飞书',
    OAUTH2: 'OAUTH2',
    OIDC: 'OIDC',
    AZUREAD: 'AZUREAD',
    CAS: 'CAS',
  };
  if (routers.length == 3 && router.path == '/users/linker/add') {
    return router.breadcrumbName + `(${mappingObjcet[getUrlAllParams()?.type]})`;
  }
  if (routers.length == 3 && router.path == '/users/linker/linkerDetail') {
    return router.breadcrumbName + `(${mappingObjcet[getUrlAllParams()?.type]})`;
  }
  if (routers.length == 3 && router.path == '/apps/corpcertsource/add') {
    return router.breadcrumbName + `(${mappingObjcet[getUrlAllParams()?.type]})`;
  }
  if (routers.length == 3 && router.path == '/apps/corpcertsource/detail') {
    return router.breadcrumbName + `(${mappingObjcet[getUrlAllParams()?.type]})`;
  }
  if (routers.length == 3 && router.path == '/users/profileConfig/detail') {
    return router.breadcrumbName + ` ( ${getUrlAllParams()?.name} )`;
  }
  if (routers.length == 2 && router.path == '/users/userExtendAttr') {
    return router.breadcrumbName + ` ( Digitalsee )`;
  }
  return;
}
