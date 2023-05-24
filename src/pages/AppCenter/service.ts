// @ts-ignore
/* eslint-disable */
import request from 'umi-request';
import type { AppVersionType } from './data';
/**
 * 获取默认应用
 * @returns
 */
export async function getDefaultApp() {
  return request('/adm/admin/vpps/iosClientInfo', {
    method: 'GET',
  });
}

/**
 * 设置默认应用
 * @returns
 */
export async function setDefaultApp(params: { adamId: number }) {
  return request('/adm/admin/vpps/iosClient/' + params.adamId, {
    method: 'PUT',
  });
}

/**
 * 获取权限列表
 * @returns
 */
export async function getPermissionSets() {
  return request('/adm/getPermissionSets', {
    method: 'GET',
  });
}

/**
 * 获取 cdKey Summary
 * @param options
 * @returns
 */
export async function getCdKeySummary() {
  return request('/adm/admin/vpps/cdKeySummary', {
    method: 'GET',
  });
}

/**
 * 导出 cdKey
 * @param options
 * @returns
 */
export async function exportCdKeySummary(params: {
  /** 导出数量 */
  num?: number;
}) {
  console.log('params: ', params);
  return request('/adm/admin/vpps/cdKeyByNum', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/**
 * 上传 cd key
 * @param params
 * @returns
 */
export async function uploadCdKey() {
  return request('/adm/admin/vpps/uploadCdKey/file', {
    method: 'POST',
  });
}

/**
 * 获取 cdKey Summary
 * @param options
 * @returns
 */
export async function getCdKeyList(params: {
  /** 当前页 */
  page?: number;
  /** 每页数量 */
  size?: number;
}) {
  const result: any = await request('/adm/admin/vpps/cdkeyList', {
    method: 'GET',
    params: {
      ...params,
    },
  });

  if (result.code === '0') {
    return {
      data: result.data.items,
      current: result.data.page,
      total: result.data.total,
      pageSize: result.data.size,
    };
  } else {
    return result;
  }
}

/**
 * 获取应用列表
 * @param params refresh 为 true 时刷新数据，默认为 false
 * @returns
 */
export async function getAppList(params: { refresh: boolean }) {
  return request('/adm/admin/vpps/appList', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

/**
 * 获取 VPP 证书信息
 */
export async function getVppTokenInfo() {
  return request('/adm/admin/vpps/vppToken', {
    method: 'GET',
  });
}

/**
 * 上传 VPP Token
 * @param body
 * @returns
 */
export async function uploadVppToken(body: { sToken: string }) {
  const formData = new FormData();
  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];
    if (item !== undefined && item !== null) {
      formData.append(ele, typeof item === 'object' ? JSON.stringify(item) : item);
    }
  });
  return request('/adm/admin/vpps/vppToken', {
    method: 'POST',
    data: formData,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
}

/**
 * 获取 iOS 应用列表
 *
 */
export async function getiOSAppList() {
  return request('/adm/admin/clientapps/listAppInfo/IOS', {
    method: 'GET',
  });
}

/**
 * 获取 Android 应用列表
 *
 */
export async function getAndroidAppList() {
  return request('/adm/admin/clientapps/listAppInfo/ANDROID', {
    method: 'GET',
  });
}
/**
 * 获取 WINDOWS 应用列表
 *
 */
export async function getWINDOWSAppList() {
  return request('/adm/admin/clientapps/listAppInfo/WINDOWS', {
    method: 'GET',
  });
}
/**
 * 获取 MACOS 应用列表
 *
 */
export async function getMACOSAppList() {
  return request('/adm/admin/clientapps/listAppInfo/MACOS', {
    method: 'GET',
  });
}
/**
 * 获取应用版本信息
 * @param params ID 应用 ID
 * @returns
 */
export async function getAppVersionsListById(params: { id?: string }) {
  return request('/adm/admin/clientapps/listAppVersion/' + params.id, {
    method: 'GET',
  });
}

/**
 * 获取版本信息
 * @param params ID 应用 ID
 * @returns
 */
export async function getAppVersionInfoById(params: { id?: string }) {
  return request('/adm/admin/clientapps/' + params.id, {
    method: 'GET',
  });
}

/**
 * 删除应用版本
 * @param params ID 应用 ID
 * @returns
 */
export async function deleteAppVersion(params: { id?: string }) {
  return request('/adm/admin/clientapps/deleteAppVersion/' + params.id, {
    method: 'GET',
  });
}

/**
 * 上下架应用版本
 * @param params ID 应用 ID, status: 上架 1 下架 0
 * @returns
 */
export async function pushAppVersion(params: { id?: string; status?: number }) {
  return request('/adm/admin/clientapps/selectAppVersion/' + params.id + '/' + params.status, {
    method: 'GET',
  });
}

/**
 * 上传 App
 * @returns
 */
export async function uploadApp() {
  return request('/adm/admin/clientapps/upload', {
    method: 'POST',
  });
}

/**
 * 获取 App Parse 信息
 * @param options
 * @returns
 */
export async function getAppParseInfo(params: { id?: string }) {
  return request('/adm/admin/clientapps/parse_result/' + params.id, {
    method: 'GET',
  });
}

/**
 * 编辑应用信息
 *
 */
export async function editAppInfo(fields: Partial<AppVersionType>) {
  return request('/adm/admin/clientapps/save', {
    method: 'POST',
    data: fields,
  });
}

/**
 * 发送邮件邀请
 * @param options
 * @returns
 */
export async function sendEmailInvitations(options?: { [key: string]: any }) {
  return request('/adm/admin/invitation/sendEmail', {
    method: 'POST',
    ...(options || {}),
  });
}

/**
 * 获取邮件模板
 * @returns
 */
export async function getEmailTemplate() {
  return request('/adm/admin/config/emailTemplate', {
    method: 'GET',
  });
}

/**
 * 发送短信邀请
 * @param options
 * @returns
 */
export async function sendSmsInvitations(
  body: {
    name: string;
    content: string;
    targets: string;
  },
  options?: { [key: string]: any },
) {
  return request('/adm/admin/invitation/sendSMS', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/**
 * 获取短信模板
 * @returns
 */
export async function getSmsTemplate() {
  return request('/adm/admin/config/smsTemplate', {
    method: 'GET',
  });
}

/**
 * 获取 发送日志列表
 * @param options
 * @returns
 */
export async function getSendLogsList(params: {
  /** 当前页 */
  page?: number;
  /** 每页数量 */
  size?: number;
  /** 搜索关键词 */
  q?: string;
}) {
  const result = await request('/adm/admin/invitation/invitationRecord', {
    method: 'GET',
    params: {
      ...params,
    },
  });

  const response = {
    data: result.data.items,
    current: result.data.page,
    pageSize: result.data.size,
  };

  return response;
}

/**
 * 获取下载页设置
 * @param params
 * @returns
 */
export async function getByConfigKey(params: { on?: string; configKey?: string }) {
  return request('/adm/admin/config/getByConfigKey', {
    method: 'GET',
    params: { ...params },
  });
}

/**
 * 保存下载页设置
 * @param params
 * @returns
 */
export async function saveConfigKey(body: { configKey?: string; configValue?: string }) {
  return request('/adm/admin/config/saveOrUpdate', {
    method: 'POST',
    data: { ...body },
  });
}
