import request from 'umi-request';

// 获取链接流列表
export async function getLog(params: { page: number | string; size: number | string }) {
  return request(`/iam/api/flows`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// 创建链接流
export async function createFlow(body: any) {
  return request(`/iam/api/flows`, {
    method: 'POST',
    data: {
      ...body,
    },
  });
}

// 删除连接流
export async function deleteFlow(id: any) {
  return request(`/iam/api/flows/${id}`, {
    method: 'DELETE',
  });
}

// 获取链接流详情
export async function getFlowDefails(paramsId: any) {
  return request(`/iam/api/flows/${paramsId}`, {
    method: 'GET',
  });
}

// 修改链接流
export async function saveFlow(paramsId: any, body: any) {
  return request(`/iam/api/flows/${paramsId}`, {
    method: 'PUT',
    data: body,
  });
}

// 获取链接器列表
export async function getConnecct() {
  return request(`/iam/api/links`, {
    method: 'GET',
  });
}
export async function getConnecctById(id: string) {
  return request(`/iam/api/links/` + id, {
    method: 'GET',
  });
}
// 获取触发事件列表
export async function getTriggerEvent() {
  return request(`/iam/api/triggers`, {
    method: 'GET',
  });
}

// 获取触发事件详情
export async function getTriggerEventDetails(id: any) {
  return request(`/iam/api/triggers/${id}`, {
    method: 'GET',
  });
}
export async function parserSql(data) {
  return request(`/iam/api/parserSql`, {
    method: 'POST',
    data,
  });
}
