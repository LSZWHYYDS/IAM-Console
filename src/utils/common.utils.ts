import { LicenseConfigPath } from '@/utils/configs.utils';
import { message, Modal } from 'antd';
import _ from 'lodash';
import { getIntl } from 'umi';
import request from 'umi-request';
import { nanoid } from 'nanoid';
import staticMethod from './staticMethod';
import { SetStateAction, useCallback, useState, useEffect, useRef } from 'react';

export interface treeNodeType {
  title: string;
  key: string;
  value: string;
  parent?: string;
  children?: treeNodeType[];
  entitled?: boolean;
  disableCheckbox?: boolean;
  readonly?: boolean;
}

let licData = {},
  xsrf_token: string;

export const errorCode = {
  '3018003': '下发对象无效',
  '1011133': '不能更新此应用',
  '1010310': '不能删除用户部门,因为该用户部门存在子部门或者用户',
  '1010014': '租户未创建',
  '8001': '连接错误',
  '1010946': '不能改变import_orgs标志后同步一次',
  '1111110': '参数不能为空',
  '1011105': '应用没找到',
  '10006': '列数不匹配',
  '1010005': '组内用户过多，请缩小查询范围',
  '1010007': '平台未初始化成功，请联系管理员',
  '1010103': '验证码不存在',
  '1010104': '验证码过期',
  '1010105': '验证码无效，请重新获取',
  '1010200': '用户名或密码错误',
  '1010249': '管理员已开启账号锁定功能，您输入密码错误次数已达到上线该账号已被锁定，请稍后再试',
  '1010201': '系统无此用户',
  '1010202': '该用户已失效，返回到登录页面',
  '1010203': '用户名重复，请重新创建',
  // '1010206': '坎坎坷坷扩',
  '1010209': '用户邮箱未验证',
  '1010210': '用户邮箱为空',
  '1010211': '此邮箱已被验证',
  '1010212': '您需要修改密码',
  '1010213': '用户不能修改密码，旧密码状态无效',
  '1010214': '用户被禁用，请联系管理员',
  '1010215': '旧密码输入错误',
  '1010217': '管理员重置密码后，需要修改密码',
  '1010218': '密码已过期。请尝试忘记密码或者联系管理员重置密码',
  '1010219': '新密码和历史密码重复，请重新设置',
  '1010224': '用户手机号未验证',
  '1010225': '用户手机号为空',
  '1010227': '缺少邮箱和手机信息，无法找回密码',
  '1010228': '无权限操作只读用户',
  '1010236': '无效的验证码',
  '1010237': '请勿频繁发送验证码，请稍后再试',
  '1010241': '用户未注册',
  '1010242': '用户未注册',
  '1010244': '用户被禁用，请联系管理员。',
  '1010247': '当前登录非钉钉用户',
  '14000003': '用户未注册',
  '1010302': '创建失败！所属上级组织内已有重名组织，请重新操作',
  '1010304': '包含下级组，不能删除，请先删除子组。',
  '1010402': '扩展属性名称已经存在，请重新填写',
  '1010407': '扩展属性数量已经达到上限',
  '1010602': '存在相同名称的链接器',
  '1010603': '存在相同目标服务的链接器',
  '1010607': '同步到系统中的组与现有组重名',
  '1010901': '导入文件类型错误',
  '1010902': '导入文件内容不能为空',
  '1010903': '导入文件大小不能超过 5 MB',
  '1010904': '不能识别导入文件的字符集',
  '1010905': '另一个用户导入文件正在上传中，请等待',
  '1010906': '另一个用户导入任务正在处理中，请继续处理或取消该任务',
  '1010909': '导入用户任务正在取消',
  '1010910': '导入文件读取错误',
  '1010911': '导入文件第一行缺少必要用户属性信息',
  '1010912': '导入文件中包含系统内置用户，请在文件中删除此用户后重新导入',
  '1010913': '导入文件中存在重复的用户扩展属性列',
  '1010914': '导入文件中存在不支持的用户扩展属性列',
  '1010915': '用户名与已同步用户冲突',
  '1010920': '连接请求被拒绝',
  '1010921': '服务器连接超时',
  '1010922': '与目标服务器握手失败',
  '1010923': '用户名或密码错误',
  '1010924': '目标baseDN未找到',
  '1010925': '未找到用户数据',
  '1010927': '管理员帐号权限不足',
  '1010928': '未找到相关组',
  '1010931': '文件导入用户不能超过 5000 条',
  '1010940': '一个任务正在同步中，请稍后操作',
  '1010941': '不能修改该配置文件的BaseDN',
  '1010942': '此链接器正在同步中，请耐心等待',
  '1011304': '证书不存在',
  '1011122': '该应用已被禁用',
  '1011129': '应用设置为不允许使用手机号发送一次性密码，请使用其他方式登录',
  '1011130': '应用设置为不允许使用邮箱发送一次性密码，请使用其他方式登录',
  '1011132': '单点登录的协议未选择',
  '1111102': '无权限访问',
  '1111104': '无权限访问',
  '1011207': '权限组未找到',
  '1011210': '标签已存在，请重新创建',
  '1011211': '未找到指定标签',
  '1011212': '无法删除自身的管理员权限',
  '1010002': '输入参数有误',
  client_already_exists: '应用已存在',
  '1011505': '用户画像已存在，请重新创建',
  '1011500': '未找到指定用户画像',
  '40086': '不合法的第三方应用appid',
  '40013': '不合法的corpid',
  '40089': '不合法的corpid或corpsecret或者不合法的appkey或appsecret',
  '41002': '缺少corpid参数',
  '41027': '需要授权企业的corpid参数',
  '52010': '无效的corpid',
  '90004': '您当前使用的CorpId及CorpSecret被暂时禁用了，仅对企业自己的Accesstoken有效',
  '90006':
    '您当前使用的CorpId及CorpSecret调用当前接口次数过多，请求被暂时禁用了，仅对企业自己的Accesstoken有效',
  '900010': '计算解密文字corpid不匹配',
  '90017': '此IP使用CorpId及CorpSecret调用接口的CorpId个数超过限制',
  '90001': '您的服务器调用钉钉开放平台所有接口的请求都被暂时禁用了',
  '90002': '您的服务器调用钉钉开放平台当前接口的所有请求都被暂时禁用了',
  '40056': '不合法的agentid',
  '41011': '缺少agentid',
  '52019': '无效的agentid',
  '70003': 'agentid对应微应用不存在',
  '70004': '企业下没有对应该agentid的微应用',
  '52023': '无效的服务窗agentid',
  '71006': '回调地址已经存在',
  '71007': '回调地址已不存在',
  '71012': 'url地址访问异常',
  '400040': '回调不存在',
  '400041': '回调已经存在',
  '400050': '回调地址无效',
  '400051': '回调地址访问异常',
  '400052': '回调地址访返回数据错误',
  '400053': '回调地址在黑名单中无法注册',
  '400054': '回调URL访问超时',
  '60020': '访问ip不在白名单之中',
  '60121': '找不到该用户',
  '1010012': '租户不存在',
  '1011602': '已存在同名应用认证策略',
  '1011609': '应用认证策略具有CERT方法，无法选择！',
  '13000300': 'corpid重复！',
  '13000301': '企业名称重复！',
  '13000200': '链接器名称重复！',
  '13000305': '认证源被通讯录集成、通讯录同步、企业认证 关联后无法被删除。',
  '1010015': '您的请求过于频繁，请您稍后再试！',
  '1010221': '管理员不能修改用户密码',
  '1010238': '重复的电话号码！',
  '1010239': '重复的邮件地址！',
  '1010246': '用户在群聊中存在',
  '1010248': '账号已经被禁用，不能登录，请联系管理员',
  '17': '访问域名或应用标识重复！',
  '1011515': '用户画像数量已达上限！',
  '1011516': '不允许添加重名用户画像！',
  '13000304': 'sns类型不合法！',
  '13000306': 'sns配置重复！',
  '13000307': 'sns名称重复！',
  '1010314': '不能修改同步的部门组',
};
export const setLicData = (value: any) => {
  licData = value;
};
export const getXsrf_token = () => {
  return xsrf_token;
};
export const setXsrf_token = (value: string) => {
  xsrf_token = value;
};
export const getLicData = () => {
  return licData;
};
export const getLicKeyByPath = (path: never) => {
  return _.findKey(LicenseConfigPath, (lic) => {
    return lic.includes(path);
  });
};

export const hasFunc = (path: string) => {
  //不需要验证权限的路由
  const nonFunc = ['/nofunc', '/dingding'];
  if (nonFunc.includes(path)) {
    return true;
  }
  // 找到说明当前菜单在前端定义的lic接口对象中(说明为lic管控菜单)
  const licKey = _.findKey(LicenseConfigPath, (lic) => {
    return lic.includes(path);
  });

  // 代表当前路由path没有在后台返回接口lic中 要去掉不进行展示
  if (!licKey) {
    return true;
  }
  const funcLic = licData[licKey];
  if (!funcLic) {
    return true;
  }
  // 并进一步再次验证can_use是否为true（true代表显示为购买页面）
  if (!funcLic.can_use) {
    return false;
  }
  return true;
};

export const formatOSType = (value: string) => {
  if (value) {
    const map = {
      '1': 'Android',
      '2': 'iOS',
      '5': 'Windows',
      '7': 'macOS',
    };
    return map[value] || '--';
  }
  return '--';
};

export const formatDeviceType = (value: any) => {
  if (value) {
    const arr = Array.isArray(value) ? value : value.split(',');
    const map = {
      10: 'Android 手机',
      11: 'Android 平板',
      20: 'iPhone',
      '(20)': 'iPhone',
      21: 'iPad',
      '(21)': 'iPad',
      22: 'iPad mini',
      '(22)': 'iPad mini',
      23: 'iPod Touch',
      '(23)': 'iPod Touch',
      50: 'Windows 10 Desktop',
      '(50)': 'Windows 10 Desktop',
    };
    const results = arr.map((item: any) => map[item]);
    return results.join(', ') || '--';
  }
  return '--';
};
export const showErrorMessage = (error: any, optName?: string) => {
  let msg;
  if (error && error.response && error.response.data && error.response.data.error) {
    if (
      error.response.data.error === '1010202' &&
      error.response.config.url.indexOf('self/forget_password') === -1
    ) {
      // 此处由于在app.js的拦截器里有设置，就不再重复弹出信息
      return;
    }
    msg = (optName && optName + '：操作失败') || '操作失败';
    if (
      error.response.data.error === '1010202' &&
      error.response.config.url.indexOf('self/forget_password') !== -1
    ) {
      msg = '用户被禁用，请联系管理员。';
    }
  } else if (typeof error === 'string') {
    msg = error;
  } else {
    msg = (optName && optName + '：操作失败') || '操作失败';
  }
  message.error(msg, 2.5);
};

export const createQueryString = (params: any) => {
  let str = '?';
  let param;
  // eslint-disable-next-line no-restricted-syntax
  for (param in params) {
    if (params.hasOwnProperty(param) && params[param] !== undefined) {
      str = `${str + param}=${encodeURIComponent(params[param])}&`;
    }
  }
  return str.slice(0, -1);
};
export const requestMsg = (data: { code?: string; error?: string; error_description?: string }) => {
  if (data.code === '0' || data.error === '0') {
    message.success('操作成功。');
  } else if (data.error_description) {
    Modal.error({
      title: '提示',
      content: `${data.error_description}`,
    });
  }
};
export const formatDateTime = (value: any, placeholder = '--') => {
  let intValue = value;
  if (_.isString(value)) {
    if (value.length === 10) {
      intValue = intValue + '000';
    }
    intValue = parseInt(intValue, 10);
  }

  if (Number.isInteger(intValue)) {
    const time = new Date(intValue),
      year = time.getFullYear(),
      month = time.getMonth() + 1,
      day = time.getDate(),
      hour = time.getHours(),
      min = time.getMinutes(),
      sec = time.getSeconds();
    return (
      `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)} ` +
      `${('0' + hour).slice(-2)}:${('0' + min).slice(-2)}:${('0' + sec).slice(-2)}`
    );
  }
  return placeholder;
};
export const formatUnixTimestamp = (value: any, placeholder = '--') => {
  if (!value) {
    return placeholder;
  } else if (Number.isInteger(value)) {
    return formatDateTime(value * 1000, placeholder);
  } else {
    return placeholder;
  }
};

/**format CST time*/
export const formatCSTTime = (value: any, placeholder = '--') => {
  if (value) {
    return value.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
  } else {
    return placeholder;
  }
};

export const t = (key: string | undefined, params?: any) => {
  let newStr = '';
  try {
    newStr = getIntl().formatMessage({ id: key });
  } catch {}

  if (!params) {
    return newStr;
  } else {
    for (const i in params) {
      if (params.hasOwnProperty(i)) {
        newStr = newStr.replace('__' + i + '__', params[i]);
      }
    }
    return newStr;
  }
};

export const exportToCsv = (url: string, filename: any) => {
  if (navigator.userAgent.indexOf('Trident') > 0 || navigator.userAgent.indexOf('Edge') > 0) {
    window.open(url + '&tcode=' + sessionStorage.getItem('tcode'));
  } else {
    document.body.style.cursor = 'progress';
    request(url, {
      method: 'GET',
      responseType: 'blob',
    }).then(
      (result) => {
        const alink = document.createElement('a');
        document.body.appendChild(alink);
        alink.style.display = 'none';
        alink.href = window.URL.createObjectURL(result);
        alink.setAttribute('download', filename);
        alink.click();
        document.body.removeChild(alink);
      },
      (error) => {
        showErrorMessage(error);
        document.body.style.cursor = 'default';
      },
    );
  }
};

export const parseQueryString = (url?: string) => {
  let i, len, pair;
  const queryObj = {};
  const result = (url || location.search).match(/[\?\&][^\?\&]+=[^\?\&]+/g);
  if (result !== null) {
    for (i = 0, len = result.length; i < len; i += 1) {
      pair = result[i].slice(1).split('=');
      queryObj[pair[0]] = decodeURIComponent(pair[1]);
    }
  }
  return queryObj;
};
export const getTwoDates = (start: moment.Moment, end: moment.Moment) => {
  return [start, end] as [moment.Moment, moment.Moment];
};
export const showSuccessMessage = (msg?: string, duration: number = 2) => {
  message.success(msg || '操作成功', duration);
};
export const CookieUtil = {
  hasCookie(key: string) {
    const cookieName = ';' + key + '=';
    const str = ';' + document.cookie.replace(/\s/g, '');
    return str.indexOf(cookieName) !== -1;
  },
  get: function (name: string) {
    const cookieName = encodeURIComponent(name) + '=',
      cookieStart = document.cookie.indexOf(cookieName);
    let cookieValue = null;
    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(';', cookieStart);
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(
        document.cookie.substring(cookieStart + cookieName.length, cookieEnd),
      );
    }
    return cookieValue;
  },
  set: function (name: string, value: string, expires, path, domain, secure) {
    let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires instanceof Date) {
      cookieText += '; expires=' + expires.toUTCString();
    }
    if (path) {
      cookieText += '; path=' + path;
    }
    if (domain) {
      cookieText += '; domain=' + domain;
    }
    if (secure) {
      cookieText += '; secure';
    }
    document.cookie = cookieText;
  },
};
export const handleInput = (e: any) => {
  const text = e.data;
  if (e.target.className.indexOf('js-freeInput') !== -1) {
    return;
  }
  if (text.search(/[&<>"']/) !== -1) {
    if (e.type === 'textInput') {
      e.preventDefault();
    } else {
      e.target.value = e.target.value.replace(/[&<>"']/g, '');
    }
  }
};
export const filterDangerousChars = (inputCntr?: any) => {
  const cntr = inputCntr || document.getElementById('root');
  const inputs = cntr.querySelectorAll("input[type='text'], input[type='password'], textarea");
  const len = inputs.length;
  for (let i = 0; i < len; i += 1) {
    if (navigator.userAgent.indexOf('Trident') === -1) {
      inputs[i].addEventListener('textInput', handleInput, false);
    } else {
      inputs[i].addEventListener('textinput', handleInput, false);
    }
  }
};

export const clearLoginStorage = () => {
  staticMethod.clearWebAuth(() => {
    sessionStorage.clear();
    if (navigator.userAgent.indexOf('Trident') > 0) {
      try {
        //用try-catch来解决ie10不支持这个函数导致的js出错，防止阻塞js线程
        document.execCommand('ClearAuthenticationCache'); //ie清除cookie
      } catch (e) {
        //Nothing
      }
    }
    request.interceptors.request.use((url, options) => {
      const authHeader = {};
      return {
        url: url,
        options: { ...options, interceptors: true, headers: authHeader },
      };
    });
  });
};
export const generateList = (data: any, dataList: any[]) => {
  for (let i = 0; i < data.length; i += 1) {
    const node = data[i];
    const { value, title, children, parent, entitled, key, readonly } = node;
    let newNode: treeNodeType = { value, title, entitled, key, readonly, children };
    if (parent) {
      newNode = { ...newNode, parent };
    }
    dataList.push(newNode);
    if (children) {
      generateList(children, dataList);
    }
  }
  return dataList;
};

export const useStateCallback = (defaultVal?: any) => {
  const [state, setState] = useState(defaultVal);
  const listenRef = useRef<any>(); //监听新状态的回调器
  const _setState = useCallback((newVal: SetStateAction<any>, callback: Function) => {
    //更新业务
    listenRef.current = callback;
    setState(newVal);
  }, []);
  useEffect(() => {
    if (listenRef.current) listenRef.current(state);
  }, [state]);

  return [state, _setState];
};
export const onCopy = (value: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = value;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showSuccessMessage('复制成功');
  } catch (err) {
    throw new Error('Oops, unable to copy');
  }
  document.body.removeChild(textArea);
};

export const genFieldListFromParams = (params: any) => {
  const fields = [];
  function findLeaf(subList, parentDesc, parentCode) {
    subList.forEach((item: any) => {
      fields.push({
        label: ((parentDesc && parentDesc + '.') || '') + item.description,
        value: item.fullName || item.name,
        type: item.type,
        ui_id: item.ui_id,
      });
      if (item.type === 'OBJECT') {
        if (item.sub_params && item.sub_params.length) {
          findLeaf(
            item.sub_params,
            ((parentDesc && parentDesc + '.') || '') + item.description,
            ((parentCode && parentCode + '.') || '') + (item.fullName || item.name),
          );
        }
      }
    });
  }
  findLeaf(params, '', '');
  return fields;
};
//将树列表转为平铺列表
export const genPlatFieldListFullName = (params: any) => {
  const fields = [];
  function findLeaf(subList, parentDesc, parentCode) {
    subList.forEach((item: any) => {
      fields.push({
        label: ((parentDesc && parentDesc + '.') || '') + item.description,
        value: ((parentCode && parentCode + '.') || '') + item.name,
        type: item.type,
        ui_id: item.ui_id,
      });
      if (item.type === 'OBJECT') {
        if (item.sub_params && item.sub_params.length) {
          findLeaf(
            item.sub_params,
            ((parentDesc && parentDesc + '.') || '') + item.description,
            ((parentCode && parentCode + '.') || '') + item.name,
          );
        }
      }
    });
  }
  findLeaf(params, '', '');
  return fields;
};
export const updateNameInParams = (params: any) => {
  function updateNameSub(subList: any, parentDesc: any, parentCode: any) {
    subList.forEach((item: any) => {
      item.name = ((parentCode && parentCode + '.') || '') + item.name;
      if (item.type === 'OBJECT') {
        if (item.sub_params && item.sub_params.length) {
          updateNameSub(item.sub_params, item.description, item.name);
        }
      } else {
        delete item.sub_params;
      }
    });
  }
  updateNameSub(params, '', '');
};
//更新下级 fieldName的为全路径
export const updateFieldInParams = (params: any, fieldName: string) => {
  const fieldNameV = fieldName || 'name';
  function updateNameSub(subList: any, parentCode: any) {
    subList.forEach((item: any) => {
      item[fieldNameV] = ((parentCode && parentCode + '.') || '') + item[fieldNameV];
      if (item.type === 'OBJECT') {
        if (item.sub_params && item.sub_params.length) {
          updateNameSub(item.sub_params, item[fieldNameV]);
        }
      } else {
        delete item.sub_params;
      }
    });
  }
  updateNameSub(params, '');
};
export const findInPara = (paramList: any, currentId: any): any => {
  let currentRow = {};
  function findInSubPara(subList: any) {
    const obj = _.find(subList, {
      ui_id: currentId,
    });
    if (obj) {
      currentRow = obj;
      return currentRow;
    }
    subList.forEach((item: any) => {
      if (item.type === 'OBJECT') {
        if (item.sub_params && item.sub_params.length) {
          const result = findInSubPara(item.sub_params);
          if (result) {
            return result;
          }
        }
      }
    });
    return false;
  }
  findInSubPara(paramList);
  return currentRow;
};
export const convertToFlat = (treeData, parentId = null) => {
  let flatData = [];
  for (const node of treeData) {
    flatData.push({ ...node, parentId });
    if (node.children) {
      flatData = flatData.concat(convertToFlat(node.children, node.key));
    }
  }
  return flatData;
};
export const flatMapDeep = (list, fieldName = 'children') => {
  return _.flatMapDeep(list, (item) => {
    return item[fieldName];
  });
};

export const flatMapDepth = (list, fieldName = 'children', level = 1) => {
  const ids =
    _.flatMapDepth(
      list,
      (item) => {
        return item[fieldName];
      },
      level,
    ) || [];
  return ids;
};

export const getUIID = () => {
  return nanoid();
};
// 对后端返回的数据格式进行处理过滤掉null的情况（因前端null格式比较特殊统一转换undefined）
export const replaceNull = (obj) => {
  for (const key in obj) {
    switch (Object.prototype.toString.call(obj[key]).slice(8, -1)) {
      case 'Object':
        replaceNull(obj[key]);
        break;
      case 'Array':
        for (let i = 0; i < obj[key].length; i++) {
          replaceNull(obj[key][i]);
        }
        break;
      default:
        if (obj[key] === null) obj[key] = undefined;
    }
  }
};
