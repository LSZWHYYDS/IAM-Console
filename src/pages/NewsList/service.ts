import request from 'umi-request';

export async function getMessages(params = { page: 0, size: 50 }) {
  return request<API.ResponseData>(`/iam/api/redirect/ncm/messages`, {
    params: {
      ...params,
      targetType: 'DINGDING',
    },
  });
}
export async function getMessagesSendings(params = { page: 0, size: 50 }) {
  return request<API.ResponseData>(`/iam/api/redirect/ncm/messages/sendings`, {
    params: {
      ...params,
      targetType: 'DINGDING',
    },
  });
}
export async function getMessagesInfo(id: string) {
  return request<API.ResponseData>(`/iam/api/redirect/ncm/messages/` + id);
}
export async function getMessagesSendingInfo(id: string) {
  return request<API.ResponseData>(`/iam/api/redirect/ncm/messages/sendings/` + id);
}
export async function getMessagesUsers(id: string, result = 'ALL') {
  return request<API.ResponseData>(
    `/iam/api/redirect/ncm/messages/` + id + `/users?userType=USER&result=` + result,
  );
}

export async function getMessagesSendingUsers(id: string, result = 'ALL') {
  return request<API.ResponseData>(
    `/iam/api/redirect/ncm/messages/sendings/` + id + `/users?userType=USER&result=` + result,
  );
}
