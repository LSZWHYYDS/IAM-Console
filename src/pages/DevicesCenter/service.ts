import request from 'umi-request';

/**
 * 获取设备列表
 * @returns
 */
export async function getDevicesList(params: { page?: number; size?: number; q?: string }) {
  const result: any = await request('/mdm/admin/devices', {
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
  }
  return result;
}

// 获取设备详情
export async function getDeviceDetails(id: string) {
  return request(`/mdm/admin/devices/${id}`, {
    method: 'GET',
  });
}

// 清除应用数据
export async function wipeDingtalkData(body: { target: { devices: string[] } }) {
  return request(`/mdm/admin/command/cleanDingTalk`, {
    method: 'PUT',
    data: { ...body },
  });
}
