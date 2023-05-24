import request from 'umi-request';

export async function getBaseUserInfo() {
  return request('/iam/api/user_attrs', {
    method: 'GET',
    params: {
      basic: false,
    },
    headers: {
      authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
  });
}
