import request from 'umi-request';
export async function addLink(params: any) {
  return request<API.ResponseData>(`/iam/api/links`, {
    method: 'POST',
    data: params,
  });
}
export async function editLink(id: string, params: any) {
  return request<API.ResponseData>(`/iam/api/links/` + id, {
    method: 'PUT',
    data: params,
  });
}

export async function getLinkersList(params: { page?: number; size?: number }) {
  return request('/iam/api/links', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
export async function deleteLink(id: string) {
  return request('/iam/api/links/' + id, {
    method: 'DELETE',
  });
}
export async function getLink(id: string) {
  return request('/iam/api/links/' + id, {
    method: 'GET',
  });
}
export async function getTriggerList(params: { linkId: string; page?: number; size?: number }) {
  return request('/iam/api/triggers', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
export async function addTrigger(params: any) {
  return request<API.ResponseData>(`/iam/api/triggers`, {
    method: 'POST',
    data: params,
  });
}
export async function editTrigger(id: string, params: any) {
  return request<API.ResponseData>(`/iam/api/triggers/` + id, {
    method: 'PUT',
    data: params,
  });
}
export async function getTrigger(id: string) {
  return request<API.ResponseData>(`/iam/api/triggers/` + id, {
    method: 'GET',
  });
}
export async function deleteTrigger(id: string) {
  return request<API.ResponseData>(`/iam/api/triggers/` + id, {
    method: 'DELETE',
  });
}
export async function getActionList(params: { linkId: string; page?: number; size?: number }) {
  return request('/iam/api/actions', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
export async function getEnableActionList(linkId: string) {
  return request('/iam/api/links/' + linkId + '/actions', {
    method: 'GET',
  });
}
export async function getActionsByIds(ids: string) {
  return request('/iam/api/actions/list', {
    method: 'GET',
    params: {
      ids,
    },
  });
}

export async function addAction(params: any) {
  return request<API.ResponseData>(`/iam/api/actions`, {
    method: 'POST',
    data: params,
  });
}
export async function editAction(id: string, params: any) {
  return request<API.ResponseData>(`/iam/api/actions/` + id, {
    method: 'PUT',
    data: params,
  });
}
export async function getAction(id: string) {
  return request<API.ResponseData>(`/iam/api/actions/` + id, {
    method: 'GET',
  });
}
export async function deleteAction(id: string) {
  return request<API.ResponseData>(`/iam/api/actions/` + id, {
    method: 'DELETE',
  });
}
export async function testDb(dataBaseInfo) {
  return request<API.ResponseData>(`/iam/api/database/test`, {
    method: 'POST',
    data: dataBaseInfo,
  });
}
